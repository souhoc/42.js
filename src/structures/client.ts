import querystring from "node:querystring";
import axios, { AxiosError, AxiosResponse } from "axios";
import Bottleneck from "bottleneck";
import { UsersManager } from "../managers/UsersManager";
import { CampusManager } from "../managers/CampusManager";
import { EventsManager } from "../managers/EventsManager";
import { Loader } from "../utils/loader";
import { EventsUsersManager } from "../managers/EventsUsersManager";
import { CursusManager } from "../managers/CursusManager";
import { ProjectManager } from "../managers/ProjectManager";
import { ScaleTeamsManager } from "../managers/ScaleTeamsManager";
import { AuthProcess } from "../auth/auth_manager";

const limiter = new Bottleneck({
	maxConcurrent: 2,
	minTime: 500,
});

export class Client {
	private _id: string;
	private _secret: string;
	private _token: null | string = null;
	private _auth_processes: AuthProcess[] = [];
	static uri: string = "https://api.intra.42.fr/v2/";

	users = new UsersManager(this);
	campus = new CampusManager(this);
	events = new EventsManager(this);
	events_users = new EventsUsersManager(this);
	cursus = new CursusManager(this);
	projects = new ProjectManager(this);
	scale_teams = new ScaleTeamsManager(this);

	constructor(id: string, secret: string) {
		this._id = id;
		this._secret = secret;
	}

	private async _getToken(): Promise<string | null> {
		const headers = {
			Accept: "*/*",
			"Content-Type": "application/x-www-form-urlencoded",
		};
		const body = querystring.stringify({
			grant_type: "client_credentials",
			client_id: this._id,
			client_secret: this._secret,
		});
		const reqOptions = {
			url: "https://api.intra.42.fr/oauth/token",
			method: "POST",
			headers: headers,
			data: body,
		};

		try {
			const res = await axios.request(reqOptions);
			console.log("New token!");
			return <string>res.data.access_token;
		} catch (err: any) {
			console.error(
				err.response.status,
				err.response.statusText,
				err.response.data
			);
		}
		return null;
	}

	async get(path: string): Promise<AxiosResponse<any, any> | null> {
		if (this._token === null) this._token = await this._getToken();
		for (let stop = 2; stop !== 0; stop--) {
			const config = {
				headers: {
					Authorization: "Bearer " + this._token,
				},
			};
			try {
				const res = await limiter.schedule(() =>
					axios.get(Client.uri + path, config)
				);
				return res;
			} catch (err: any) {
				console.error(
					err.response.status,
					err.response.statusText,
					err.response.data
				);
				this._token = await this._getToken();
			}
		}
		return null;
	}

	async fetch(path: string, limit: number = 0): Promise<Object[]> {
		const pages: Object[] | null = [];
		let page: Object[] = [];
		let res: AxiosResponse<any, any> | null;
		const bar: Loader = new Loader(24);
		const size: number = limit < 100 && limit > 0 ? limit : 100;
		bar.start();
		try {
			for (let i = 1; page?.length || i === 1; i++) {
				pages.push(...page);
				res = await this.get(path + `&page[size]=${size}&page[number]=` + i);
				if (res === null) throw "Error in Client.fetch";
				page = res.data;
				const total: number = limit || Number(res.headers["x-total"]);
				bar.step(`Fetching pages`, pages.length, total);
				if (limit && pages.length >= limit) {
					bar.end();
					return pages.slice(0, limit);
				}
			}
		} catch (err) {
			console.error(err);
		}
		bar.end();
		return pages;
	}

	/**
	 * Start an auth process to let user connect via 42 account
	 * @param  {string} callback_url URL where the callback will be sent
	 * @param  {number} port If set, the server will be started on this port
	 * @returns The AuthProcess object associated
	 */
	init_auth_process(callback_url: string, port?: number): AuthProcess {
		const params = {
			client_id: this._id,
			redirect_uri: callback_url,
			response_type: "code",
		};
		const url =  Client.uri + "oauth/authorize?" + querystring.stringify(params);
		const auth_process = new AuthProcess(callback_url, url, port);
		this._auth_processes.push(auth_process);
		return auth_process;
	}

	async response_auth_process(process_id: number, code: string) {
		const process = this._auth_processes.find((p) => p.id === process_id);
		if (process === undefined) throw "Invalid process id";
	}
}

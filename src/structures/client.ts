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
import { AuthManager } from "../auth/auth_manager";

const limiter = new Bottleneck({
	maxConcurrent: 2,
	minTime: 500,
});

export class Client {
	private _id: string;
	private _secret: string;
	private _token: null | string = null;
	private _auth_manager: AuthManager;
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
		this._auth_manager = new AuthManager(this, this._id, this._secret);
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
			console.log("New token generated for the client!");
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

	async get(path: string, token?: string): Promise<AxiosResponse<any, any> | null> {
		if (!token && this._token === null) this._token = await this._getToken();
		const choosed = token == undefined ? this._token : token;
		for (let stop = 2; stop !== 0; stop--) {
			const config = {
				headers: {
					Authorization: "Bearer " + choosed || "",
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
				if(token)
					return null;
				this._token = await this._getToken();
			}
		}
		return null;
	}

	async fetch(path: string, limit: number = 0, token?: string): Promise<Object[]> {
		const pages: Object[] | null = [];
		let page: Object[] = [];
		let res: AxiosResponse<any, any> | null;
		const bar: Loader = new Loader(24);
		const size: number = limit < 100 && limit > 0 ? limit : 100;
		bar.start();
		try {
			for (let i = 1; page?.length || i === 1; i++) {
				pages.push(...page);
				res = await this.get(path + `&page[size]=${size}&page[number]=` + i, token);
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

	async post(path: string, body: any, token?: string): Promise<AxiosResponse<any, any> | null> {
		if (!token && this._token === null) this._token = await this._getToken();
		const choosed = token == undefined ? this._token : token;
		for (let stop = 2; stop !== 0; stop--) {
			const headers = {
				Authorization: "Bearer " + choosed || "",
			};
			const data = querystring.stringify(body);
			const reqOptions = {
				url: Client.uri + path,
				method: "POST",
				headers: headers,
				data: data,
			};
	
			try {
				const ret = await axios.request(reqOptions);
				return ret.data;
			} catch (err: any) {
				console.error(
					err.response.status,
					err.response.statusText,
					err.response.data
				);
				if(token)
					return null;
			}
		}
		return null;
	}

	async delete(path: string, token?: string): Promise<AxiosResponse<any, any> | null> {
		if (!token && this._token === null) this._token = await this._getToken();
		const choosed = token == undefined ? this._token : token;
		for (let stop = 2; stop !== 0; stop--) {
			const config = {
				headers: {
					Authorization: "Bearer " + choosed || "",
				},
			};
			try {
				const res = await limiter.schedule(() =>
					axios.delete(Client.uri + path, config)
				);
				return res;
			} catch (err: any) {
				console.error(
					err.response.status,
					err.response.statusText,
					err.response.data
				);
				if(token)
					return null;
				this._token = await this._getToken();
			}
		}
		return null;
	}


	get auth_manager(): AuthManager {
		return this._auth_manager;
	}
}

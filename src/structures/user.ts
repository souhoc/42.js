import { BaseManager } from "../managers/BaseManager";
import { Client } from "./client";
import { ICursusUsers } from "./cursus_users";
import { IScaleTeam, ScaleTeam } from "./scale_teams";

export interface IUser {
	id: number;
	email: string;
	login: string;
	first_name: string;
	last_name: string;
	usual_full_name: string;
	usual_first_name?: string;
	url: string;
	displayname: string;
	image_url: string;
	new_image_url: string;
	"staff?": boolean;
	correction_point: number;
	pool_month: string;
	pool_year: string;
	location: string | null;
	wallet: number;
	anonymize_date: Date;
	data_erasure_date: Date;
	created_at: Date;
	updated_at: Date;
	alumnized_at: Date | null;
	"alumni?": boolean;
	groups: object[];
	cursus_users: ICursusUsers[];
	projects_users: object[];
	languages_users: object[];
	achievements: object[];
	titles: object[];
	titles_users: object[];
	partnerships: object[];
	patroned: object[];
	patroning: object[];
	expertises_users: object[];
	roles: object[];
	campus: object[];
	campus_users: object[];
}

export class User extends BaseManager {
	id: number;
	email: string;
	login: string;
	first_name: string;
	last_name: string;
	usual_full_name: string;
	usual_first_name?: string;
	url: string;
	displayname: string;
	image_url: string;
	new_image_url: string;
	"staff?": boolean;
	correction_point: number;
	pool_month: string;
	pool_year: string;
	location: string | null;
	wallet: number;
	anonymize_date: Date;
	data_erasure_date: Date;
	created_at: Date;
	updated_at: Date;
	alumnized_at: Date | null;
	"alumni?": boolean;
	groups: object[];
	cursus_users: ICursusUsers[];
	projects_users: object[];
	languages_users: object[];
	achievements: object[];
	titles: object[];
	titles_users: object[];
	partnerships: object[];
	patroned: object[];
	patroning: object[];
	expertises_users: object[];
	roles: object[];
	campus: object[];
	campus_users: object[];

	constructor(client: Client, data: IUser) {
		super(client);
		this.id = data.id;
		this.email = data.email;
		this.login = data.login;
		this.first_name = data.first_name;
		this.last_name = data.last_name;
		this.usual_full_name = data.usual_full_name;
		this.url = data.url;
		this.displayname = data.displayname;
		this.image_url = data.image_url;
		this.new_image_url = data.new_image_url;
		this["staff?"] = data["staff?"];
		this.correction_point = data.correction_point;
		this.pool_month = data.pool_month;
		this.pool_year = data.pool_year;
		this.location = data.location;
		this.wallet = data.wallet;
		this.anonymize_date = data.anonymize_date;
		this.data_erasure_date = data.data_erasure_date;
		this.created_at = data.created_at;
		this.updated_at = data.updated_at;
		this.alumnized_at = data.alumnized_at;
		this["alumni?"] = data["alumni?"];
		this.groups = data.groups;
		this.cursus_users = data.cursus_users;
		this.projects_users = data.projects_users;
		this.languages_users = data.languages_users;
		this.achievements = data.achievements;
		this.titles = data.titles;
		this.titles_users = data.titles_users;
		this.partnerships = data.partnerships;
		this.patroned = data.patroned;
		this.patroning = data.patroning;
		this.roles = data.roles;
		this.expertises_users = data.expertises_users;
		this.campus = data.campus;
		this.campus_users = data.campus_users;
	}

	async fetchEvents(): Promise<void | object[]> {
		const ret = this.client
			.fetch("users/" + this.id + "/events?")
			.catch(console.error);
		return ret;
	}

	async fetchProjects(): Promise<void | object[]> {
		const ret = this.client
			.fetch("users/" + this.id + "/projects_users?")
			.catch(console.error);
		return ret;
	}

	/**
	 * Look for an array of scale teams that the user is in
	 * @param  {{limit?:number;params:string[]}} options basic fetch options
	 * @param  {number} type 0 for all, 1 for "as corrector", 2 for "as corrected"
	 * @returns Promise
	 */
	async fetchScale_teams(
		options?: {
			limit?: number;
			params?: string[];
		},
		type: number = 0
	): Promise<ScaleTeam[]> {
		let url = "/users/" + this.id + "/scale_teams";
		if (type === 1) url += "/as_corrector";
		if (type === 2) url += "/as_corrected";
		url += "?" + options?.params?.join("&");
		const res = await this.client.fetch(url, options?.limit);
		return res.map((o) => new ScaleTeam(<IScaleTeam>o));
	}
}

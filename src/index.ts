import "dotenv/config";
import axios, { AxiosError, AxiosResponse } from "axios";
import querystring from "node:querystring";
import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
	maxConcurrent: 2,
	minTime: 500,
});

class Loader {
	private _bar: string[];
	private _size: number;

	constructor(size: number) {
		this._bar = new Array(size);
		this._size = size;
	}
	start() {
		process.stdout.write("\r\x1B[?25l");
	}
	step(msg: string, index: number, limit: number) {
		this._bar.fill("▓", 0, (index * this._size) / limit);
		this._bar.fill("░", index, this._size);
		if (index === limit) this._bar.fill("▓");
		process.stdout.write(
			`\r${msg} ${this._bar.join("")} ${Math.floor(
				(index * 100) / limit
			)}% | ${index}/${limit}`
		);
	}
	end() {
		process.stdout.write("\r\x1B[?25h\n");
	}
}

class BaseManager {
	client: Client;
	constructor(client: Client) {
		this.client = client;
	}
}

class UserManager extends BaseManager {
	constructor(client: Client) {
		super(client);
	}

	/**
	 * Look for an array of users
	 * @param  {{limit?:number;filters:string[]}} options?
	 * @returns Promise
	 */
	async fetch(options?: {
		limit?: number;
		filters: string[];
	}): Promise<User[] | undefined> {
		const res = await this.client.fetch_pages(
			"users/?" + options?.filters.join("&"),
			options?.limit
		);
		if (res === undefined) return undefined;
		return res.map((u) => new User(u));
	}

	/**
	 * Look for one user
	 * @param  {string} login
	 * @returns Promise
	 */
	async get(login: string): Promise<User | undefined> {
		const res = await this.client.fetch("users/" + login);
		if (res === undefined) return undefined;
		return new User(res.data);
	}
}

class CampusManager extends BaseManager {
	constructor(client: Client) {
		super(client);
	}

	async get(campus_id: number): Promise<Campus | undefined> {
		const res = await this.client.fetch("campus/ " + campus_id);
		if (res === undefined) return undefined;
		return new Campus(res.data);
	}
}

class Client {
	private _id: string;
	private _secret: string;
	private _token: null | string = null;
	static uri: string = "https://api.intra.42.fr/v2/";

	users: UserManager = new UserManager(this);

	constructor(id: string, secret: string) {
		this._id = id;
		this._secret = secret;
	}

	private async _getToken() {
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
			return res.data.access_token;
		} catch (err) {
			console.error(err);
		}
	}

	async fetch(path: string): Promise<AxiosResponse<any, any> | undefined> {
		if (this._token === null) this._token = await this._getToken();
		while (1) {
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
				console.error(err.response.statusText);
				if (err.response.statusText !== "Too Many Requests") return undefined;
				this._token = await this._getToken();
				console.log("New token generated!");
			}
		}
	}

	async fetch_pages(path: string, limit: number = 0): Promise<object[]> {
		const pages: object[] | undefined = [];
		let page: object[] = [];
		let res: AxiosResponse<any, any> | undefined;
		const bar: Loader = new Loader(24);
		const size: number = limit < 100 && limit > 0 ? limit : 100;
		bar.start();
		try {
			for (let i = 1; page?.length || i === 1; i++) {
				pages.push(...page);
				res = await this.fetch(path + `&page[size]=${size}&page[number]=` + i);
				if (res === undefined) throw "Error in Client.fech_pages";
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
}

class User {
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
	staff: boolean;
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
	alumni: boolean;
	groups: object[];
	cursus_users: Object[];
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

	constructor(data: any) {
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
		this.staff = data["staff?"];
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
		this.alumni = data["alumni?"];
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
}

interface ICampus {
	id: number;
	name: string;
	time_zone: string;
	language: object;
	users_count: number;
	vogsphere_id: number;
	country: string;
	address: string;
	zip: string;
	city: string;
	website: string;
	facebook: string;
	twitter: string;
	active: boolean;
	isPublic: boolean;
	email_extension: string;
	default_hidden_phone: boolean;
	endpoint: object;
}

class Campus implements ICampus {
	id: number;
	name: string;
	time_zone: string;
	language: object;
	users_count: number;
	vogsphere_id: number;
	country: string;
	address: string;
	zip: string;
	city: string;
	website: string;
	facebook: string;
	twitter: string;
	active: boolean;
	isPublic: boolean;
	email_extension: string;
	default_hidden_phone: boolean;
	endpoint: object;

	constructor(data: ICampus) {
		this.id = data.id;
		this.name = data.name;
		this.time_zone = data.time_zone;
		this.language = data.language;
		this.users_count = data.users_count;
		this.vogsphere_id = data.vogsphere_id;
		this.country = data.country;
		this.address = data.address;
		this.zip = data.zip;
		this.city = data.city;
		this.website = data.website;
		this.facebook = data.facebook;
		this.twitter = data.twitter;
		this.active = data.active;
		this.isPublic = data.isPublic;
		this.email_extension = data.email_extension;
		this.default_hidden_phone = data.default_hidden_phone;
		this.endpoint = data.endpoint;
	}
}

export { Client, User, Campus };

// * Library tester
/* const client = new Client(
	<string>process.env.CLIENT_ID,
	<string>process.env.CLIENT_SECRET
);

(async () => {
	// const data: User[] | undefined = await client.users.fetch({
	// 	limit: 500,
	// 	filters: [
	// 		"filter[pool_month]=august",
	// 		"filter[pool_year]=2022",
	// 		"campus_id=1",
	// 	],
	// });

	const data = await client.fetch("campus/1");
	// const data = await client.users.get("zekao");
	// console.log(data?.data);
	const campus = new Campus(<ICampus>data?.data);
	console.log(campus);
})(); */

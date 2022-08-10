import { BaseManager } from "./BaseManager";
import { Client } from "../structures/client";
import { User, IUser } from "../structures/user";

export class UsersManager extends BaseManager {
	constructor(client: Client) {
		super(client);
	}

	/**
	 * Look for an array of users
	 * @param  {{limit?:number;params:string[]}} options?
	 * @returns Promise
	 */
	async fetch(options?: { limit?: number; params: string[] }): Promise<User[]> {
		const res = await this.client.fetch(
			"users/?" + options?.params.join("&"),
			options?.limit
		);
		return res.map((u) => new User(this.client, <IUser>u));
	}

	/**
	 * Look for one user
	 * @param  {string} login
	 * @returns Promise
	 */
	async get(login: string): Promise<User | null> {
		const res = await this.client.get("users/" + login);
		if (res === null) return null;
		return new User(this.client, res?.data);
	}
}

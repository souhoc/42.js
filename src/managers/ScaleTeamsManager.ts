import { BaseManager } from "./BaseManager";
import { Client } from "../structures/client";
import { ScaleTeam, IScaleTeam } from "../structures/scale_teams";

export class ScaleTeamsManager extends BaseManager {
	constructor(client: Client) {
		super(client);
	}

	/**
	 * Look for an array of scale teams
	 * @param  {{limit?:number;params:string[]}} options?
	 * @returns Promise
	 */
	async fetch(options?: { limit?: number; params: string[] }): Promise<ScaleTeam[]> {
		const res = await this.client.fetch(
			"scale_teams/?" + options?.params.join("&"),
			options?.limit
		);
		return res.map((o) => new ScaleTeam(<IScaleTeam>o));
	}

	/**
	 * Look for one scal team
	 * @param  {string} login
	 * @returns Promise
	 */
	async get(login: string): Promise<ScaleTeam | null> {
		const res = await this.client.get("scale_teams/" + login);
		if (res === null) return null;
		return new ScaleTeam(res?.data);
	}
}

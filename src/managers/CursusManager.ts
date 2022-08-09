import { BaseManager } from "./BaseManager";
import { Cursus, ICursus } from "../structures/cursus";
import { Client } from "../structures/client";

export class CursusManager extends BaseManager {
	constructor(client: Client) {
		super(client);
	}

	/**
	 * Look for an array of cursus
	 * @param  {{limit?:number;params:string[]}} options?
	 * @returns Promise
	 */
	async fetch(options?: {
		limit?: number;
		params: string[];
	}): Promise<ICursus[]> {
		const res = await this.client.fetch(
			"cursus/?" + options?.params.join("&"),
			options?.limit
		);
		return res.map((u) => new Cursus(this.client, <ICursus>u));
	}

	/**
	 * Look for one cursus
	 * @param  {string} slug
	 * @returns Promise
	 */
	async get(slug: string): Promise<Cursus | null> {
		const res = await this.client.get("cursus/?filter[slug]=" + slug);
		if (res === null) return null;
		return new Cursus(this.client, res?.data[0]);
	}
}

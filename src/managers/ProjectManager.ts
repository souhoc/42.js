import { BaseManager } from "./BaseManager";
import { Project, IProject } from "../structures/project";
import { Client } from "../structures/client";

export class ProjectManager extends BaseManager {
	constructor(client: Client) {
		super(client);
	}

	/**
	 * Look for an array of projects
	 * @param  {{limit?:number;params:string[]}} options?
	 * @returns Promise
	 */
	async fetch(options?: {
		limit?: number;
		params: string[];
	}): Promise<IProject[]> {
		const res = await this.client.fetch(
			"projects/?" + options?.params.join("&"),
			options?.limit
		);
		return res.map((p) => new Project(<IProject>p));
	}

	/**
	 * @param  {number|string} target id | slug
	 * @returns Promise
	 */
	async get(target: number | string): Promise<Project | null> {
		const res = await this.client.get("projects/" + target);
		return new Project(res?.data);
	}
}

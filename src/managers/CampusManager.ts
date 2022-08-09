import { BaseManager } from "./BaseManager";
import { Client } from "../structures/client";
import { ICampus, Campus } from "../structures/campus";

export class CampusManager extends BaseManager {
	constructor(client: Client) {
		super(client);
	}

	async get(campus_id: number): Promise<Campus | null> {
		const res = await this.client.get("campus/ " + campus_id);
		return new Campus(res?.data);
	}
}

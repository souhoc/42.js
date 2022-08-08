import { BaseManager } from "./BaseManager";
import { Client } from "../structures/client";
import { ICampus, Campus } from "../structures/campus";

export class CampusManager extends BaseManager {
	constructor(client: Client) {
		super(client);
	}

	async get(campus_id: number): Promise<ICampus | null> {
		const res = await this.client.get("campus/ " + campus_id);
		if (res === null) return null;
		return new Campus(res?.data);
	}
}

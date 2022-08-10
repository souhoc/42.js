import { BaseManager } from "./BaseManager";
import { Client } from "../structures/client";
import { Event } from "../structures/event";

export class EventManager extends BaseManager {
	constructor(client: Client) {
		super(client);
	}

	async get(event_id: number): Promise<Event | null> {
		const res = await this.client.get("events/" + event_id);
		return new Event(res?.data);
	}
}

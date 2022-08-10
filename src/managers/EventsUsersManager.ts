import { BaseManager } from "./BaseManager";
import { Client } from "../structures/client";
import { EventUser } from "../structures/events_users";

export class EventsUsersManager extends BaseManager {
	constructor(client: Client) {
		super(client);
	}

	async fetch(event_id: number): Promise<EventUser[] | null> {
		const res = await this.client.get("events/" + event_id + "/events_users");
		const ret: EventUser[] = [];
		(<EventUser[]>res?.data).forEach((e) => ret.push(new EventUser(e)));
		return ret;
	}
}

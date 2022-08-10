import { BaseManager } from "./BaseManager";
import { Client } from "../structures/client";
import { EventsUsers } from "../structures/events_users";

export class EventsUsersManager extends BaseManager {
	constructor(client: Client) {
		super(client);
	}

	async fetch(event_id: number): Promise<EventsUsers[] | null> {
		const res = await this.client.get("events/" + event_id + "/events_users");
		const ret: EventsUsers[] = [];
		(<EventsUsers[]>res?.data).forEach((e) => ret.push(new EventsUsers(e)));
		return ret;
	}
}

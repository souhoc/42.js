import { User } from "./user";
import { Event } from "./events";

export interface IEventUser {
	id: number;
	user: User;
	event: Event;
}

export class EventsUsers implements IEventUser {
	id: number;
	user: User;
	event: Event;

	constructor(data: IEventUser) {
		this.id = data.id;
		this.user = data.user;
		this.event = data.event;
	}
}

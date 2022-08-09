import { User } from "./user";
import { Event } from "./event";

export interface IEventUser {
	id: number;
	user: User;
	event: Event;
}

export class EventUser implements IEventUser {
	id: number;
	user: User;
	event: Event;

	constructor(data: IEventUser) {
		this.id = data.id;
		this.user = data.user;
		this.event = data.event;
	}
}

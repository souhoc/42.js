export interface IEvent {
	id: number;
	name: string;
	description: string;
	location: string;
	kind: string;
	max_people: number;
	nbr_subscribers: number;
	begin_at: string;
	end_at: string;
	campus_ids: number[];
	cursus_ids: number[];
	created_at: Date;
	updated_at: Date;
	prohibition_of_cancellation: any;
	waitlist: any;
	themes: any[];
}

export class Event implements IEvent {
	id: number;
	name: string;
	description: string;
	location: string;
	kind: string;
	max_people: number;
	nbr_subscribers: number;
	begin_at: string;
	end_at: string;
	campus_ids: number[];
	cursus_ids: number[];
	created_at: Date;
	updated_at: Date;
	prohibition_of_cancellation: any;
	waitlist: any;
	themes: any[];

	constructor(data: IEvent) {
		this.id = data.id;
		this.name = data.name;
		this.description = data.description;
		this.location = data.location;
		this.kind = data.kind;
		this.max_people = data.max_people;
		this.nbr_subscribers = data.nbr_subscribers;
		this.begin_at = data.begin_at;
		this.end_at = data.end_at;
		this.campus_ids = data.campus_ids;
		this.cursus_ids = data.cursus_ids;
		this.created_at = data.created_at;
		this.updated_at = data.updated_at;
		this.themes = data.themes;
	}
}

export interface ICampus {
	id: number;
	name: string;
	time_zone: string;
	language: object;
	users_count: number;
	vogsphere_id: number;
	country: string;
	address: string;
	zip: string;
	city: string;
	website: string;
	facebook: string;
	twitter: string;
	active: boolean;
	isPublic: boolean;
	email_extension: string;
	default_hidden_phone: boolean;
	endpoint: object;
}

export class Campus implements ICampus {
	id: number;
	name: string;
	time_zone: string;
	language: object;
	users_count: number;
	vogsphere_id: number;
	country: string;
	address: string;
	zip: string;
	city: string;
	website: string;
	facebook: string;
	twitter: string;
	active: boolean;
	isPublic: boolean;
	email_extension: string;
	default_hidden_phone: boolean;
	endpoint: object;

	constructor(data: ICampus) {
		this.id = data.id;
		this.name = data.name;
		this.time_zone = data.time_zone;
		this.language = data.language;
		this.users_count = data.users_count;
		this.vogsphere_id = data.vogsphere_id;
		this.country = data.country;
		this.address = data.address;
		this.zip = data.zip;
		this.city = data.city;
		this.website = data.website;
		this.facebook = data.facebook;
		this.twitter = data.twitter;
		this.active = data.active;
		this.isPublic = data.isPublic;
		this.email_extension = data.email_extension;
		this.default_hidden_phone = data.default_hidden_phone;
		this.endpoint = data.endpoint;
	}
}

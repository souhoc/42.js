import { BaseManager } from "../managers/BaseManager";
import { Client } from "./client";

export interface ICursus {
    id: number,
    created_at: Date,
    name: string,
    slug: string,
    kind: string
}

export class Cursus extends BaseManager {
	id: number;
    created_at: Date;
    name: string;
    slug: string;
    kind: string;

	constructor(client: Client, data: ICursus) {
		super(client);
		this.id = data.id;
        this.created_at = data.created_at;
        this.name = data.name;
        this.slug = data.slug;
        this.kind = data.kind;
	}
}
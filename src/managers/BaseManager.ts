import { Client } from "../structures/client";

export class BaseManager {
	protected client: Client;
	constructor(client: Client) {
		this.client = client;
	}
}

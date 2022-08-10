import "dotenv/config";
import { Client } from "./index";

(async () => {
	const client = new Client(<string>process.env.ID, <string>process.env.SECRET);

	const name = encodeURIComponent("Crêpes BDE LLD");
	const events = await client.events.fetch({
		params: ["filter[name]=" + name],
	});
	console.log(events);
})();

import "dotenv/config";
import { Client } from "./index";

(async () => {
	const client = new Client(<string>process.env.ID, <string>process.env.SECRET);

	// const res = await client.get("events/11464/events_users");
	const res = await client.events_users.fetch(11469);
	console.log(res);
})();

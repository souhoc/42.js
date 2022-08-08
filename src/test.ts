import "dotenv/config";
import { Client } from "./index";

(async () => {
	const client = new Client(
		<string>process.env.CLIENT_ID,
		<string>process.env.CLIENT_SECRET
	);

	const user = await client.users.get("shocquen");
	const events = await user?.events;
	if (events) {
		console.log(events[1]);
	}
})();

import "dotenv/config";
import { Client, User } from "./index";

(async () => {
	const client = new Client(
		<string>process.env.CLIENT_ID,
		<string>process.env.CLIENT_SECRET
	);

	const user = await client.users.get("shocquen");
	console.log(user?.displayname);
})();

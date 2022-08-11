import "dotenv/config";
import { Client } from "./index";

(async () => {
	const client = new Client(<string>process.env.ID, <string>process.env.SECRET);

	const user = await client.users.get("shocquen");
	console.log(user);
})();

import "dotenv/config";
import { Client } from "./index";

(async () => {
	const client = new Client(<string>process.env.ID, <string>process.env.SECRET);

	const res = await client.get("cursus/42");

	console.log(res?.data.name);
})();

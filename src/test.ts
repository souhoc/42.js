import "dotenv/config";
import { Client } from "./index";

(async () => {
	const client = new Client(<string>process.env.ID, <string>process.env.SECRET);

	const auth_process = client.init_auth_process("http://localhost:3333/callback", 3333);
	console.log(auth_process.url);
})();

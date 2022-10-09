import "dotenv/config";
import { Client } from "./index";

(async () => {
	const client = new Client(<string>process.env.ID, <string>process.env.SECRET);

	const auth_process = await client.auth_manager.init_auth_process("http://localhost:3333/callback", ["public", "projects", "profile"], {port: 3333});
	if(auth_process)
		console.log(auth_process.url);
})();

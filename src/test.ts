import "dotenv/config";
import { Client } from "./index";

(async () => {
	const client = new Client(<string>process.env.ID, <string>process.env.SECRET);

	const auth_process = await client.auth_manager.init_auth_process("http://localhost:3000/callback", ["public", "projects", "profile"], {port: 3000, callback_function: async (user) => {
		console.log(`Welcome ${user.login}!`);
		if(auth_process)
			client.auth_manager.stop_auth_process(auth_process.id);
	}});
	if(auth_process)
		console.log(auth_process.url);
})();

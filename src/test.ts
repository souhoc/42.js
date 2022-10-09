import "dotenv/config";
import { Client } from "./index";

(async () => {
	const client = new Client(<string>process.env.ID, <string>process.env.SECRET);

	const auth_process = await client.auth_manager.init_auth_process("http://localhost:3333/callback", ["public", "projects", "profile"], {port: 3333, callback_function: async (user) => {
		if(auth_process)
			client.auth_manager.stop_auth_process(auth_process.id);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		const posed = await user.post_slot(new Date(Date.now() + 60 * 60 * 1000), new Date(Date.now() + 120 * 60 * 1000));
		console.log(posed);
		console.log("========");
		const slots = await user.get_corrector_slots();
		console.log(slots);
	}});
	if(auth_process)
		console.log(auth_process.url);
})();

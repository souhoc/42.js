import "dotenv/config";
import { Client } from "./index";

(async () => {
	const client = new Client(<string>process.env.ID, <string>process.env.SECRET);

	const user = await client.users.get("shocquen");
	const events = await user?.fetchEvents();
	console.log(user?.displayname);
	const scale_teams = await user?.fetchScale_teams({ limit: 5 });
	console.log(scale_teams);
	const projects_users = await user?.fetchProjects();
	console.log(projects_users);
})();

import "dotenv/config";
import { Client, User } from "./index";

const isPisciner = (user: User) =>
  user.pool_month === "august" && user.pool_year === "2023";
(async () => {
<<<<<<< HEAD
	const client = new Client(
		<string>process.env.ID,
		<string>process.env.SECRET
	);

	const auth_process = await client.auth_manager.init_auth_process(
		"http://localhost:3333/callback",
		["public", "projects", "profile"],
		{
			port: 3333,
			callback_function: async (user) => {
				console.log(`Welcome ${user.login}!`);
				if (auth_process)
					client.auth_manager.stop_auth_process(auth_process.id);
			},
		}
	);
	if (auth_process) console.log(auth_process.url);
=======
  const client = new Client(
    <string> process.env.ID,
    <string> process.env.SECRET,
  );

  const eventUsers = await client.events_users.fetch(18260);
  const pisciners = eventUsers.filter((eu) => isPisciner(eu.user));
  console.log(`
    total: ${eventUsers.length}
    Pisciners: ${pisciners.length}
    Studs: ${eventUsers.length - pisciners.length}
    `);
  const studs = eventUsers.filter((eu) => !isPisciner(eu.user));
  console.log(studs.map((s) => s.user.login).join("\n"));
>>>>>>> b7672a5 (get studs and pisciners from an event)
})();

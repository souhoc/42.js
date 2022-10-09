# `42.js`

Library for 42 school API. In progress...

_Author: [shocquen](https://github.com/shocquen)_

![npm](https://img.shields.io/badge/npm-v8.15.0-blue)
![npm](https://img.shields.io/badge/node-v18.7.0-blue)
![npm](https://img.shields.io/badge/tsc-v4.7.4-blue)

## Installation

```bash
npm install 42.js
```

## Quick start

```ts
import "dotenv/config";
import { Client } from "42.js";

(async () => {
	const client = new Client(
		<string>process.env.CLIENT_ID,
		<string>process.env.CLIENT_SECRET
	);

	try {
		if (process.argv.length != 3) throw "Bad arguments! Give me a login !";
		const login = process.argv[2];

		const user = await client.users.get(login);
		console.log(user?.displayname);
		const auth_process = await client.auth_manager.init_auth_process(
			"http://localhost:3333/callback",
			["public", "projects", "profile"],
			{
				port: 3333,
				callback_function: async (user) => {
					if (auth_process)
						client.auth_manager.stop_auth_process(auth_process.id);
					//const teams = await user.get("/me/teams");
					//console.log(teams?.data[0]);
				},
			}
		);
		if (auth_process) console.log(auth_process.url);
	} catch (err) {
		console.error(err);
	}
})();
```

# Contributing

Pull requests are welcome. Don't hesitate to contact me by discord **Saky#0001** or directly at school if we met

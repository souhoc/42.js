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
	} catch (err) {
		console.error(err);
	}
})();
```

# Contributing

Pull requests are welcome. Don't hesitate to contact me by discord **Saky#0001** or directly at school if we met

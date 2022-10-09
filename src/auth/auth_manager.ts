import { Client } from "../structures/client";
import querystring from "node:querystring";
import { create_app } from "./auth_server";

export class AuthProcess {
    id: number;
    callback_url: string;
    url: string;
    server: any | null = null;

    constructor(callback_url: string, url: string,) {
        this.id = Math.floor(Math.random() * 1000000);
        this.callback_url = callback_url;
        this.url = url;
    }
}

export class AuthManager {
    private _auth_processes: AuthProcess[] = [];
    private _client: Client;
    private _id: string;
	private _secret: string;

    constructor(client: Client, id: string, secret: string) {
        this._client = client;
        this._id = id;
        this._secret = secret;
    }

    /**
	 * Start an auth process to let user connect via 42 account
	 * @param  {string} callback_url URL where the callback will be sent
     * @param  {string[]} scopes Requested scopes for the user
	 * @param  {{port: number, redirect_url?: string}} server If set, an automatic auth server will be created
	 * @returns The promise to the AuthProcess object associated or null if an error occured
	 */
	async init_auth_process(callback_url: string, scopes?: string[], server?: {port: number, redirect_url?: string}): Promise<AuthProcess | null> {
		if(scopes && !scopes?.includes("public"))
            scopes.push("public");
        const params = {
			client_id: this._id,
			redirect_uri: callback_url,
			response_type: "code",
            scope: scopes?.join(" ") || "public",
		};
		const url =  Client.uri + "oauth/authorize?" + querystring.stringify(params);
		const auth_process = new AuthProcess(callback_url, url);
        if(server)
        {
            const app = create_app(server, this, auth_process.id);
            try {
               auth_process.server = await app.listen(server.port, () => {
                    console.log("Auth server started on port " + server.port);
                });
            } catch (error) {
                console.error("Unable to start auth server", error);
                return null;
            }
        }
        this._auth_processes.push(auth_process);
		return auth_process;
	}

    /**
	 * Treat response of an auth request (call only if you don't use an automatic server)
	 * @param  {number} process_id The id of the AuthProcess object
     * @param  {string} code The returned code by 42
	 */
	async response_auth_process(process_id: number, code: string) {
		const process = this._auth_processes.find((p) => p.id === process_id);
		if (process === undefined) throw "Invalid process id";
        const params = {
            grant_type: "authorization_code",
            client_id: this._id,
            client_secret: this._secret,
            code: code,
            redirect_uri: process.callback_url,
        }
        const response = await this._client.post("oauth/token", params);
        console.log(response);
	}

    /**
	 * Stop an auth process and close the server if it was created
	 * @param  {number} process_id The id of the AuthProcess object
	 */
    async stop_auth_process(process_id: number) {
        const process = this._auth_processes.find((p) => p.id === process_id);
        if (process === undefined) throw "Invalid process id";
        if(process.server)
            await process.server.close();
        this._auth_processes = this._auth_processes.filter((p) => p.id !== process_id);
        console.log("Auth process stopped");
    }
}
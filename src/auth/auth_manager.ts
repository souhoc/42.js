import { Client } from '../structures/client';
import { create_app } from './auth_server';
import { LoggedUser } from '../structures/logged_user';

export class AuthProcess {
    id: number;
    callback_url: string;
    url: string;
    server: any | null = null;

    constructor(callback_url: string, url: string) {
        this.id = Math.floor(Math.random() * 1000000);
        this.callback_url = callback_url;
        this.url = url;
    }
}

export class AuthManager {
    private _auth_processes: AuthProcess[] = [];
    private _logged_users: LoggedUser[] = [];
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
     * @param  {{port: number, redirect_url?: string, callback_function?: (arg0: LoggedUser) => void}} server If set, an automatic auth server will be created
     * @returns The promise to the AuthProcess object associated or null if an error occured
     */
    async init_auth_process(
        callback_url: string,
        scopes?: string[],
        server?: {
            port: number;
            redirect_url?: string;
            callback_function?: (arg0: LoggedUser) => void;
        },
    ): Promise<AuthProcess | null> {
        if (scopes && !scopes?.includes('public')) scopes.push('public');
        const params = {
            client_id: this._id,
            redirect_uri: callback_url,
            response_type: 'code',
            scope: scopes?.join(' ') || 'public',
        };
        const url = `${Client.uri}oauth/authorize?${new URLSearchParams(
            params,
        )}`;
        const auth_process = new AuthProcess(callback_url, url);
        if (server) {
            const app = create_app(server, this, auth_process.id);
            try {
                auth_process.server = await app.listen(server.port, () => {
                    console.log('Auth server started on port ' + server.port);
                });
            } catch (error) {
                console.error('Unable to start auth server', error);
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
    async response_auth_process(
        process_id: number,
        code: string,
    ): Promise<LoggedUser | null> {
        const process = this._auth_processes.find((p) => p.id === process_id);
        if (process === undefined) throw 'Invalid process id';
        const params = {
            grant_type: 'authorization_code',
            client_id: this._id,
            client_secret: this._secret,
            code: code,
            redirect_uri: process.callback_url,
        };
        const response: any = await this._client.post('oauth/token', params);
        try {
            const ret = await this._client.get('/me', response?.access_token);
            const logged_user = new LoggedUser(
                this._client,
                ret?.data,
                response?.refresh_token,
                response?.access_token,
                this._id,
                this._secret,
            );
            this._logged_users.push(logged_user);
            console.log(`User ${logged_user.login} finished auth process`);
            return logged_user;
        } catch (err: any) {
            console.log('Unable to log user', err);
            console.error(
                err.response.status,
                err.response.statusText,
                err.response.data,
            );
            return null;
        }
    }

    /**
     * Stop an auth process and close the server if it was created
     * @param  {number} process_id The id of the AuthProcess object
     */
    async stop_auth_process(process_id: number) {
        const process = this._auth_processes.find((p) => p.id === process_id);
        if (process === undefined) throw 'Invalid process id';
        if (process.server) await process.server.close();
        this._auth_processes = this._auth_processes.filter(
            (p) => p.id !== process_id,
        );
        console.log('Auth process stopped');
    }
}

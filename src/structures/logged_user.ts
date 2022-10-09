import axios, { AxiosResponse } from "axios";
import Bottleneck from "bottleneck";
import { Loader } from "../utils/loader";
import { Client } from "./client";
import { IUser, User } from "./user";

const limiter = new Bottleneck({
	maxConcurrent: 2,
	minTime: 500,
});

export class LoggedUser extends User{
    private _refresh_token: string;
    private _token: string;
    private _id: string;
    private _secret: string;

    constructor(client: Client, data: IUser, refresh_token: string, token: string, id: string, secret: string) {
        super(client, data);
        this._refresh_token = refresh_token;
        this._token = token;
        this._id = id;
        this._secret = secret;
    }

    private async _getToken() {
        const config = {
            headers: {
                Authorization: "Bearer " + this._token,
            },
        };
        try {
            const ret = await axios.get(Client.uri + "/oauth/token/info", config)
            if(ret.data.expires_in_seconds < 10)
            {
                const params = {
                    grant_type: "refresh_token",
                    client_id: this._id,
                    client_secret: this._secret,
                    refresh_token: this._refresh_token
                }
                const response: any = await this.client.post("oauth/token", params);
                console.log(`User ${this.login} token refreshed`);
                this._token = response?.access_token;
            }
        } catch (err: any) {
            console.error(
                err.response.status,
                err.response.statusText,
                err.response.data
            );
            return null;
        }
        return this._token;
    }

    async get(path: string): Promise<AxiosResponse<any, any> | null> {
		return this.client.get(path, await this._getToken() || "");
	}
    
    async fetch(path: string, limit: number = 0): Promise<Object[]> {
        return this.client.fetch(path, limit, await this._getToken() || "");
    }
}
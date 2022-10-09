import axios, { AxiosResponse } from "axios";
import { Client } from "./client";
import { CorrectionSlot } from "./correction_slot";
import { IUser, User } from "./user";

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
        try {
            const ret = await this.client.get("/oauth/token/info", this._token);
            if(ret?.data.expires_in_seconds < 10)
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

    async get_corrector_slots(): Promise<CorrectionSlot[]> {
        const res = await this.fetch("/me/slots?filter[future]=true");
        const objs: CorrectionSlot[] = res.map((slot: any) => new CorrectionSlot(slot));
        return objs.filter((slot) => slot.user && slot.user.id == this.id);
    }
    async get_corrected_slots(): Promise<CorrectionSlot[]> {
        const res = await this.fetch("/me/slots?filter[future]=true");
        const objs: CorrectionSlot[] = res.map((slot: any) => new CorrectionSlot(slot));
        return objs.filter((slot) => !slot.user || slot.user.id != this.id);
    }
}
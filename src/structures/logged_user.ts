import { Client } from "./client";
import { IUser, User } from "./user";

export class LoggedUser extends User{
    private _refresh_token: string;
    private _token: string;

    constructor(client: Client, data: IUser, refresh_token: string, token: string) {
        super(client, data);
        this._refresh_token = refresh_token;
        this._token = token;
    }
}
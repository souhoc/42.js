export class AuthProcess {
    id: number;
    callback_url: string;
    url: string;
    port: number | null;
    server: any | null;

    constructor(callback_url: string, url: string, port?: number | null) {
        this.id = Math.floor(Math.random() * 1000000);
        this.callback_url = callback_url;
        this.port = port || null;
        this.server = null;
        this.url = url;
    }
}
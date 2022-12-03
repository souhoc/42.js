import { ScaleTeam } from "./scale_teams";
import { User } from "./user";

export class CorrectionSlot {
    id: number;
    begin_at: Date;
    end_at: Date;
    scale_team: ScaleTeam | null;
    user: User | null;

    constructor(data: any) {
        this.id = data.id;
        this.begin_at = new Date(data.begin_at);
        this.end_at = new Date(data.end_at);
        this.scale_team = data.scale_team ? new ScaleTeam(data.scale_team) : null;
        this.user = !data.user || data.user === "invisible" ? null : data.user;
    }
}
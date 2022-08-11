import { IFeedback } from "./feedbacks";
import { ITeam } from "./teams";
import { IUser } from "./user";

export interface IScaleTeam {
    id: number,
    scale_id: number,
    comment: string,
    created_at: string,
    updated_at: string,
    feedback: string,
    finale_mark: number,
    flag: Object,
    begin_at: Date,
    correcteds: IUser[],
    corrector: IUser,
    truant: Object,
    filled_at: Date,
    questions_with_answers: Object[],
    scale: Object,
    team: ITeam,
    feedbacks: IFeedback[]
}
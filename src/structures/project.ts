import { ICampus } from "./campus";
import { ICursus } from "./cursus";

export interface IProject {
    id: number,
    name: string,
    slug: string,
    parent_id: number,
    parent: IProject | null,
    children: IProject[],
    description: string,
    objectives: string[],
    tier: number,
    attachments: Object[],
    created_at: Date,
    updated_at: Date,
    exam: boolean,
    cusus: ICursus,
    campus: ICampus,
    skills: Object[],
    project_sessions: Object[]
}
import { User } from "./user";

export interface ITeam {
    id: number,
    name: string,
    url: string,
    final_mark: number | null,
    project_id: number,
    created_at: Date,
    updated_at: Date,
    status: string,
    terminating_at: Date | null,
    users: User[],
    "locked?": boolean,
    "validated?": boolean | null,
    "closed?": boolean,
    repo_url: string,
    repo_uuid: string,
    locked_at: Date | null,
    closed_at: Date | null,
    project_session_id: number,
    project_gitlab_path: string,
}
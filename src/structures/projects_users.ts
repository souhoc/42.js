import { BaseManager } from "../managers/BaseManager";
import { Client } from "./client";
import { IProject } from "./project";

export interface IProjectsUsers {
    id: number,
    occurence: number,
    final_mark: number | null,
    status: string,
    project: IProject,
    cursus_ids: number[],
    teams: Object[]
}

export class ProjectsUsers extends BaseManager {
	id: number;
    occurence: number;
    final_mark: number | null;
    status: string;
    project: Object;
    cursus_ids: number[];
    teams: Object[];

	constructor(client: Client, data: IProjectsUsers) {
		super(client);
		this.id = data.id;
        this.occurence = data.occurence;
        this.final_mark = data.final_mark;
        this.status = data.status;
        this.project = data.project;
        this.cursus_ids = data.cursus_ids;
        this.teams = data.teams;
	}
}
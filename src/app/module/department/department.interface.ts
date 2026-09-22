export interface ICreateDepartment {
	name: string;
	code: string;
	description?: string;
	isActive?: boolean;
}

export interface IUpdateDepartment {
	name?: string;
	code?: string;
	description?: string | null;
	isActive?: boolean;
}

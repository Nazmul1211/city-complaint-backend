export interface ICreateWard {
	name: string;
	code: string;
	city: string;
	isActive?: boolean;
}

export interface IUpdateWard {
	name?: string;
	code?: string;
	city?: string;
	isActive?: boolean;
}

export interface IWardFilterParams {
	city?: string;
	isActive?: boolean;
}

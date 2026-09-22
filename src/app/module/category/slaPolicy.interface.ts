
export interface ICreateSlaPolicy {
	responseWithinHours: number;
	resolutionWithinHours: number;
	reopenWindowHours: number;
	isActive?: boolean;
}

export interface IUpdateSlaPolicy extends Partial<ICreateSlaPolicy> {}

export interface ISlaResponse {
	id: string;
	categoryId: string;
	responseWithinHours: number;
	resolutionWithinHours: number;
	reopenWindowHours: number;
	isActive: boolean;
}

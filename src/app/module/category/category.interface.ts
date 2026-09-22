export interface ICreateCategory {
	departmentId: string;
	name: string;
	description?: string;
	paymentRequired?: boolean;
	defaultFeeAmount?: number;
	currency?: string;
	isActive?: boolean;
}

export interface IUpdateCategory {
	name?: string;
	description?: string | null;
	paymentRequired?: boolean;
	defaultFeeAmount?: number | null;
	currency?: string;
	isActive?: boolean;
}

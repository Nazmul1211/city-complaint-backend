export interface IUpdateMyProfile {
	name?: string;
	phone?: string;
	avatarUrl?: string;
	citizen?: {
		contactNumber?: string;
		address?: string;
	};
}

export interface IUserFilterParams {
	searchTerm?: string;
	role?: string;
	status?: string;
	departmentId?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

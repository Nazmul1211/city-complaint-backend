export interface ICreateWorkUpdate {
	note: string;
	visibleToCitizen?: boolean;
}

export interface IWorkUpdateResponse {
	id: string;
	requestId: string;
	authorId: string;
	note: string;
	visibleToCitizen: boolean;
	createdAt: Date;
	author: {
		id: string;
		name: string;
		email: string;
	};
}

export interface IWorkUpdateFilters {
	page?: number;
	limit?: number;
}

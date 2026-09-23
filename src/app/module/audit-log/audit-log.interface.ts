export interface IAuditLogFilters {
	action?: string;
	entityType?: string;
	entityId?: string;
	actorId?: string;
	page?: number | string;
	limit?: number | string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface IAuditLogResponse {
	id: string;
	actorId: string | null;
	actor: { id: string; name: string; email: string; role: string } | null;
	action: string;
	entityType: string;
	entityId: string;
	oldValues: unknown;
	newValues: unknown;
	ipAddress: string | null;
	userAgent: string | null;
	createdAt: Date;
}

export interface IAuditLogList {
	data: IAuditLogResponse[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

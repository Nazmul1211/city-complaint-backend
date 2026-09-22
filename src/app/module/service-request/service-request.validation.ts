import { z } from "zod";
import { RequestType, RequestPriority, RequestStatus } from "../../../../generated/prisma/enums";

const createServiceRequestSchema = z.object({
	body: z.object({
		categoryId: z.string().uuid("Invalid category ID"),
		title: z.string().min(1, "Title is required").max(200, "Title cannot exceed 200 characters"),
		description: z.string().min(1, "Description is required"),
		type: z.nativeEnum(RequestType),
		priority: z.nativeEnum(RequestPriority).optional(),
		wardId: z.string().uuid("Invalid ward ID"),
		addressLine: z.string().min(1, "Address is required").max(500, "Address cannot exceed 500 characters"),
		landmark: z.string().max(200, "Landmark cannot exceed 200 characters").optional(),
		latitude: z.number().min(-90).max(90).optional(),
		longitude: z.number().min(-180).max(180).optional(),
	}),
});

const updateServiceRequestSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid request ID"),
	}),
	body: z.object({
		title: z.string().min(1).max(200).optional(),
		description: z.string().min(1).optional(),
		type: z.nativeEnum(RequestType).optional(),
		priority: z.nativeEnum(RequestPriority).optional(),
		wardId: z.string().uuid().optional(),
		addressLine: z.string().min(1).max(500).optional(),
		landmark: z.string().max(200).optional(),
		latitude: z.number().min(-90).max(90).optional(),
		longitude: z.number().min(-180).max(180).optional(),
	}),
});

const listServiceRequestsSchema = z.object({
	query: z.object({
		searchTerm: z.string().optional(),
		status: z.nativeEnum(RequestStatus).optional(),
		priority: z.nativeEnum(RequestPriority).optional(),
		categoryId: z.string().uuid().optional(),
		departmentId: z.string().uuid().optional(),
		wardId: z.string().uuid().optional(),
		page: z.coerce.number().int().positive().default(1),
		limit: z.coerce.number().int().positive().max(100).default(20),
		sortBy: z.string().default("createdAt"),
		sortOrder: z.enum(["asc", "desc"]).default("desc"),
	}),
});

const getServiceRequestByIdSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid request ID"),
	}),
});

export const serviceRequestValidation = {
	createServiceRequestSchema,
	updateServiceRequestSchema,
	listServiceRequestsSchema,
	getServiceRequestByIdSchema,
};
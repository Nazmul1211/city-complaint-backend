import { z } from "zod";

const routeRequestSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid request ID"),
	}),
	body: z.object({
		departmentId: z.string().uuid("Invalid department ID"),
		reason: z.string().min(1).max(500).optional(),
	}),
});

const endRouteSchema = z.object({
	params: z.object({
		id: z.string().uuid("Invalid request ID"),
		routeId: z.string().uuid("Invalid route ID"),
	}),
});

export const requestRoutingValidation = {
	routeRequestSchema,
	endRouteSchema,
};

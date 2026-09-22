import { z } from "zod";

// POST /api/v1/wards
const createWardSchema = z.object({
	name: z.string().min(1, "Ward name is required"),
	code: z.string().min(1, "Ward code is required"),
	city: z.string().min(1, "City is required"),
	isActive: z.boolean().optional(),
});

// PATCH /api/v1/wards/:id — same fields, but every one is optional
const updateWardSchema = createWardSchema.partial();

export const wardValidation = {
	createWardSchema,
	updateWardSchema,
};

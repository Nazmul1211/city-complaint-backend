import { Router } from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { auditLogController } from "./audit-log.controller";
import { auditLogValidation } from "./audit-log.validation";

const router = Router();

router.get(
	"/actions",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	auditLogController.getAuditLogActions,
);

router.get(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	validateRequest(auditLogValidation.getAuditLogsSchema),
	auditLogController.getAuditLogs,
);

export const auditLogRoutes = router;

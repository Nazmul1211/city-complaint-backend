import { Router } from "express";
import { mediaAttachmentController } from "./media-attachment.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { mediaAttachmentValidation } from "./media-attachment.validation";
import { UserRole } from "../../../../generated/prisma/enums";
import { upload } from "../../lib/multer";

const router = Router({ mergeParams: true });

router.post(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
	upload.single("file"),
	validateRequest(mediaAttachmentValidation.uploadAttachmentSchema),
	mediaAttachmentController.uploadAttachment,
);

router.get(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
	validateRequest(mediaAttachmentValidation.listAttachmentsSchema),
	mediaAttachmentController.getAttachments,
);

router.delete(
	"/:attachmentId",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
	validateRequest(mediaAttachmentValidation.deleteAttachmentSchema),
	mediaAttachmentController.deleteAttachment,
);

export const mediaAttachmentRoutes = router;

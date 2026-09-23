-- CreateEnum
CREATE TYPE "AttachmentPurpose" AS ENUM ('EVIDENCE', 'DOCUMENT', 'PHOTO', 'RECEIPT', 'OTHER');

-- CreateTable
CREATE TABLE "MediaAttachment" (
    "id" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "uploadedById" UUID NOT NULL,
    "purpose" "AttachmentPurpose" NOT NULL,
    "publicId" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkUpdate" (
    "id" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "authorId" UUID NOT NULL,
    "note" TEXT NOT NULL,
    "visibleToCitizen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaAttachment_publicId_key" ON "MediaAttachment"("publicId");

-- CreateIndex
CREATE INDEX "MediaAttachment_requestId_idx" ON "MediaAttachment"("requestId");

-- CreateIndex
CREATE INDEX "MediaAttachment_uploadedById_idx" ON "MediaAttachment"("uploadedById");

-- CreateIndex
CREATE INDEX "MediaAttachment_requestId_createdAt_idx" ON "MediaAttachment"("requestId", "createdAt");

-- CreateIndex
CREATE INDEX "WorkUpdate_requestId_idx" ON "WorkUpdate"("requestId");

-- CreateIndex
CREATE INDEX "WorkUpdate_authorId_idx" ON "WorkUpdate"("authorId");

-- CreateIndex
CREATE INDEX "WorkUpdate_requestId_createdAt_idx" ON "WorkUpdate"("requestId", "createdAt");

-- AddForeignKey
ALTER TABLE "MediaAttachment" ADD CONSTRAINT "MediaAttachment_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ServiceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAttachment" ADD CONSTRAINT "MediaAttachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkUpdate" ADD CONSTRAINT "WorkUpdate_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ServiceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkUpdate" ADD CONSTRAINT "WorkUpdate_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

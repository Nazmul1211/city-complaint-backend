-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('COMPLAINT', 'SERVICE', 'INFORMATION');

-- CreateEnum
CREATE TYPE "RequestPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED', 'REOPENED', 'REJECTED');

-- CreateTable
CREATE TABLE "ReportedLocation" (
    "id" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "wardId" UUID NOT NULL,
    "addressLine" TEXT NOT NULL,
    "landmark" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),

    CONSTRAINT "ReportedLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestDepartmentRoute" (
    "id" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "departmentId" UUID NOT NULL,
    "routedById" UUID NOT NULL,
    "reason" TEXT,
    "routedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "RequestDepartmentRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "id" UUID NOT NULL,
    "requestNo" TEXT NOT NULL,
    "citizenId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "currentDepartmentId" UUID NOT NULL,
    "type" "RequestType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "RequestPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "RequestStatus" NOT NULL DEFAULT 'SUBMITTED',
    "responseDueAt" TIMESTAMP(3),
    "resolutionDueAt" TIMESTAMP(3),
    "firstRespondedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReportedLocation_requestId_key" ON "ReportedLocation"("requestId");

-- CreateIndex
CREATE INDEX "ReportedLocation_wardId_idx" ON "ReportedLocation"("wardId");

-- CreateIndex
CREATE INDEX "RequestDepartmentRoute_requestId_idx" ON "RequestDepartmentRoute"("requestId");

-- CreateIndex
CREATE INDEX "RequestDepartmentRoute_departmentId_idx" ON "RequestDepartmentRoute"("departmentId");

-- CreateIndex
CREATE INDEX "RequestDepartmentRoute_routedById_idx" ON "RequestDepartmentRoute"("routedById");

-- CreateIndex
CREATE INDEX "RequestDepartmentRoute_requestId_routedAt_idx" ON "RequestDepartmentRoute"("requestId", "routedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceRequest_requestNo_key" ON "ServiceRequest"("requestNo");

-- CreateIndex
CREATE INDEX "ServiceRequest_citizenId_idx" ON "ServiceRequest"("citizenId");

-- CreateIndex
CREATE INDEX "ServiceRequest_categoryId_idx" ON "ServiceRequest"("categoryId");

-- CreateIndex
CREATE INDEX "ServiceRequest_currentDepartmentId_idx" ON "ServiceRequest"("currentDepartmentId");

-- CreateIndex
CREATE INDEX "ServiceRequest_status_idx" ON "ServiceRequest"("status");

-- CreateIndex
CREATE INDEX "ServiceRequest_priority_idx" ON "ServiceRequest"("priority");

-- CreateIndex
CREATE INDEX "ServiceRequest_createdAt_idx" ON "ServiceRequest"("createdAt");

-- CreateIndex
CREATE INDEX "ServiceRequest_status_priority_idx" ON "ServiceRequest"("status", "priority");

-- AddForeignKey
ALTER TABLE "ReportedLocation" ADD CONSTRAINT "ReportedLocation_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ServiceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportedLocation" ADD CONSTRAINT "ReportedLocation_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestDepartmentRoute" ADD CONSTRAINT "RequestDepartmentRoute_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ServiceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestDepartmentRoute" ADD CONSTRAINT "RequestDepartmentRoute_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestDepartmentRoute" ADD CONSTRAINT "RequestDepartmentRoute_routedById_fkey" FOREIGN KEY ("routedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "citizens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_currentDepartmentId_fkey" FOREIGN KEY ("currentDepartmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

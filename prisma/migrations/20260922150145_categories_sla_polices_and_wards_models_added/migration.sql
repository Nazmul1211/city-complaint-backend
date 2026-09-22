-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "departmentId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "paymentRequired" BOOLEAN NOT NULL DEFAULT false,
    "defaultFeeAmount" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlaPolicy" (
    "id" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "responseWithinHours" INTEGER NOT NULL,
    "resolutionWithinHours" INTEGER NOT NULL,
    "reopenWindowHours" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SlaPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ward" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Ward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Category_departmentId_idx" ON "Category"("departmentId");

-- CreateIndex
CREATE INDEX "Category_isActive_idx" ON "Category"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Category_departmentId_name_key" ON "Category"("departmentId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "SlaPolicy_categoryId_key" ON "SlaPolicy"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Ward_code_key" ON "Ward"("code");

-- CreateIndex
CREATE INDEX "Ward_city_idx" ON "Ward"("city");

-- CreateIndex
CREATE INDEX "Ward_isActive_idx" ON "Ward"("isActive");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlaPolicy" ADD CONSTRAINT "SlaPolicy_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

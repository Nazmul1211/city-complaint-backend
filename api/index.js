var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";

// src/app/module/auth/auth.route.ts
import { Router } from "express";

// src/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta
  });
};

// src/app/module/auth/auth.controller.ts
import httpStatus from "http-status";

// src/app/module/auth/auth.service.ts
import bcrypt from "bcryptjs";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": 'enum AttachmentPurpose {\n  EVIDENCE\n  DOCUMENT\n  PHOTO\n  RECEIPT\n  OTHER\n}\n\nmodel AuditLog {\n  id String @id @default(uuid()) @db.Uuid\n\n  actorId String? @db.Uuid\n  actor   User?   @relation(fields: [actorId], references: [id], onDelete: SetNull)\n\n  action String\n\n  entityType String\n  entityId   String @db.Uuid\n\n  oldValues Json?\n  newValues Json?\n  ipAddress String?\n  userAgent String?\n\n  createdAt DateTime @default(now())\n\n  @@index([actorId])\n  @@index([entityType, entityId])\n  @@index([createdAt])\n  @@index([action])\n  @@map("audit_logs")\n}\n\nmodel Category {\n  id           String @id @default(uuid()) @db.Uuid\n  departmentId String @db.Uuid\n\n  name        String\n  description String?\n\n  paymentRequired  Boolean  @default(false)\n  defaultFeeAmount Decimal? @db.Decimal(12, 2)\n  currency         String   @default("BDT")\n\n  isActive  Boolean   @default(true)\n  deletedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Relations\n\n  department Department @relation(fields: [departmentId], references: [id])\n\n  serviceRequests ServiceRequest[]\n\n  slaPolicy SlaPolicy?\n\n  // Constraints / Indexes\n\n  @@unique([departmentId, name])\n  @@index([departmentId])\n  @@index([isActive])\n}\n\nmodel Citizen {\n  id String @id @default(uuid()) @db.Uuid\n\n  name          String\n  email         String  @unique\n  contactNumber String?\n  address       String?\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Relations\n\n  userId String @unique @db.Uuid\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  serviceRequests ServiceRequest[]\n\n  feedbacks Feedback[]\n\n  @@index([email], name: "idx_citizen_email")\n  @@index([isDeleted], name: "idx_citizen_isDeleted")\n  @@map("citizens")\n}\n\nmodel Department {\n  id          String  @id @default(uuid()) @db.Uuid\n  name        String  @unique\n  code        String  @unique\n  description String?\n\n  isActive  Boolean   @default(true)\n  deletedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Relations\n\n  members DepartmentMember[]\n\n  categories Category[]\n\n  serviceRequests ServiceRequest[]\n\n  routeHistory RequestDepartmentRoute[]\n\n  @@index([isActive])\n}\n\nmodel DepartmentMember {\n  id           String @id @default(uuid()) @db.Uuid\n  departmentId String @db.Uuid\n  userId       String @db.Uuid\n\n  position StaffPosition\n  isActive Boolean       @default(true)\n  joinedAt DateTime      @default(now())\n\n  // Relations\n\n  department Department @relation(fields: [departmentId], references: [id])\n\n  user User @relation(fields: [userId], references: [id])\n\n  // Constraints / Indexes\n\n  @@unique([departmentId, userId])\n  @@index([userId])\n  @@index([departmentId, isActive])\n}\n\nenum UserRole {\n  CITIZEN\n  STAFF\n  ADMIN\n  SUPER_ADMIN\n}\n\nenum Gender {\n  MALE\n  FEMALE\n  OTHER\n}\n\nenum UserStatus {\n  PENDING_VERIFICATION\n  ACTIVE\n  BLOCKED\n  SUSPENDED\n  DELETED\n}\n\nenum AuthProvider {\n  GOOGLE\n  GITHUB\n  CREDENTIAL\n}\n\nenum StaffPosition {\n  MANAGER\n  CASE_OFFICER\n  TECHNICIAN\n}\n\nenum RequestType {\n  COMPLAINT\n  SERVICE\n  INFORMATION\n}\n\nenum RequestPriority {\n  LOW\n  MEDIUM\n  HIGH\n  URGENT\n}\n\nenum RequestStatus {\n  SUBMITTED\n  UNDER_REVIEW\n  ASSIGNED\n  IN_PROGRESS\n  PENDING\n  RESOLVED\n  CLOSED\n  REOPENED\n  REJECTED\n}\n\nenum NotificationType {\n  REQUEST_CREATED\n  REQUEST_ASSIGNED\n  STATUS_CHANGED\n  WORK_UPDATE_ADDED\n  FEEDBACK_REQUESTED\n  PAYMENT_REQUIRED\n  PAYMENT_SUCCESSFUL\n}\n\nenum PaymentPurpose {\n  SERVICE_FEE\n  INSPECTION_FEE\n  PENALTY\n  PERMIT_FEE\n  APPLICATION_FEE\n  OTHER\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  EXPIRED\n  CANCELLED\n  REFUNDED\n}\n\nenum PaymentGateway {\n  BKASH\n  SSLCOMMERZ\n  CASH\n}\n\nenum PaymentMethod {\n  BKASH\n  CARD\n  NET_BANKING\n  CASH\n}\n\nenum PaymentTransactionStatus {\n  INITIATED\n  PENDING\n  SUCCESS\n  FAILED\n  CANCELLED\n}\n\nmodel Feedback {\n  id String @id @default(uuid()) @db.Uuid\n\n  requestId String @unique @db.Uuid\n  citizenId String @db.Uuid\n\n  rating  Int\n  comment String?\n\n  createdAt DateTime @default(now())\n\n  request ServiceRequest @relation(fields: [requestId], references: [id])\n  citizen Citizen        @relation(fields: [citizenId], references: [id])\n\n  @@index([citizenId])\n  @@index([createdAt])\n}\n\nmodel MediaAttachment {\n  id String @id @default(uuid()) @db.Uuid\n\n  requestId    String @db.Uuid\n  uploadedById String @db.Uuid\n\n  purpose AttachmentPurpose\n\n  publicId  String @unique\n  secureUrl String\n\n  mimeType  String\n  sizeBytes Int\n\n  createdAt DateTime @default(now())\n\n  request ServiceRequest @relation(fields: [requestId], references: [id])\n\n  uploadedBy User @relation("AttachmentByUser", fields: [uploadedById], references: [id])\n\n  @@index([requestId])\n  @@index([uploadedById])\n  @@index([requestId, createdAt])\n}\n\nmodel Notification {\n  id String @id @default(uuid()) @db.Uuid\n\n  userId    String @db.Uuid\n  requestId String @db.Uuid\n\n  type NotificationType\n\n  payload Json\n\n  readAt    DateTime?\n  createdAt DateTime  @default(now())\n\n  user    User           @relation("NotificationsForUser", fields: [userId], references: [id])\n  request ServiceRequest @relation(fields: [requestId], references: [id])\n\n  @@index([userId])\n  @@index([requestId])\n  @@index([userId, readAt])\n  @@index([userId, createdAt])\n}\n\nmodel Payment {\n  id String @id @default(uuid()) @db.Uuid\n\n  requestId  String @db.Uuid\n  issuedById String @db.Uuid\n\n  purpose PaymentPurpose\n\n  amount   Decimal @db.Decimal(12, 2)\n  currency String  @default("BDT")\n\n  status PaymentStatus @default(PENDING)\n\n  expiresAt DateTime?\n  paidAt    DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  request  ServiceRequest @relation(fields: [requestId], references: [id], onDelete: Cascade)\n  issuedBy User           @relation("PaymentIssuedByUser", fields: [issuedById], references: [id])\n\n  transactions PaymentTransaction[]\n\n  @@index([requestId])\n  @@index([issuedById])\n  @@index([status])\n  @@index([requestId, status])\n  @@map("payments")\n}\n\nmodel PaymentEvent {\n  id String @id @default(uuid()) @db.Uuid\n\n  transactionId String @db.Uuid\n\n  gateway        PaymentGateway\n  gatewayEventId String\n\n  payload Json\n\n  signatureVerified Boolean   @default(false)\n  processedAt       DateTime?\n  createdAt         DateTime  @default(now())\n\n  transaction PaymentTransaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)\n\n  @@index([transactionId])\n  @@index([gateway])\n  @@index([gatewayEventId])\n  @@map("payment_events")\n}\n\nmodel PaymentTransaction {\n  id String @id @default(uuid()) @db.Uuid\n\n  paymentId String @db.Uuid\n\n  gateway PaymentGateway\n  method  PaymentMethod\n\n  amount   Decimal @db.Decimal(12, 2)\n  currency String  @default("BDT")\n\n  idempotencyKey       String  @unique\n  gatewaySessionId     String? @unique\n  gatewayTransactionId String?\n\n  checkoutUrl String?\n\n  status PaymentTransactionStatus @default(INITIATED)\n\n  gatewayMetadata Json?\n\n  verifiedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  payment Payment @relation(fields: [paymentId], references: [id], onDelete: Cascade)\n\n  events PaymentEvent[]\n\n  @@index([paymentId])\n  @@index([gateway])\n  @@index([status])\n  @@index([paymentId, createdAt])\n  @@map("payment_transactions")\n}\n\nmodel ReportedLocation {\n  id String @id @default(uuid()) @db.Uuid\n\n  requestId String @unique @db.Uuid\n  wardId    String @db.Uuid\n\n  addressLine String\n  landmark    String?\n\n  latitude  Decimal? @db.Decimal(10, 7)\n  longitude Decimal? @db.Decimal(10, 7)\n\n  // Relations\n\n  request ServiceRequest @relation(fields: [requestId], references: [id])\n\n  ward Ward @relation(fields: [wardId], references: [id])\n\n  @@index([wardId])\n}\n\nmodel RequestAssignment {\n  id String @id @default(uuid()) @db.Uuid\n\n  requestId    String @db.Uuid\n  assigneeId   String @db.Uuid\n  assignedById String @db.Uuid\n\n  note String?\n\n  assignedAt DateTime  @default(now())\n  releasedAt DateTime?\n\n  // Relations\n\n  request ServiceRequest @relation(fields: [requestId], references: [id])\n\n  assignee User @relation("AssignmentToUser", fields: [assigneeId], references: [id])\n\n  assignedBy User @relation("AssignmentByUser", fields: [assignedById], references: [id])\n\n  // Indexes\n\n  @@index([requestId])\n  @@index([assigneeId])\n  @@index([assignedById])\n  @@index([requestId, assignedAt])\n}\n\nmodel RequestDepartmentRoute {\n  id String @id @default(uuid()) @db.Uuid\n\n  requestId    String @db.Uuid\n  departmentId String @db.Uuid\n  routedById   String @db.Uuid\n\n  reason   String?\n  routedAt DateTime  @default(now())\n  endedAt  DateTime?\n\n  // Relations\n\n  request ServiceRequest @relation(fields: [requestId], references: [id])\n\n  department Department @relation(fields: [departmentId], references: [id])\n\n  routedBy User @relation("RouteByUser", fields: [routedById], references: [id])\n\n  @@index([requestId])\n  @@index([departmentId])\n  @@index([routedById])\n  @@index([requestId, routedAt])\n}\n\nmodel RequestStatusHistory {\n  id String @id @default(uuid()) @db.Uuid\n\n  requestId   String @db.Uuid\n  changedById String @db.Uuid\n\n  fromStatus RequestStatus?\n  toStatus   RequestStatus\n\n  note String?\n\n  createdAt DateTime @default(now())\n\n  // Relations\n\n  request ServiceRequest @relation(fields: [requestId], references: [id])\n\n  changedBy User @relation("StatusChangedByUser", fields: [changedById], references: [id])\n\n  // Indexes\n\n  @@index([requestId])\n  @@index([changedById])\n  @@index([requestId, createdAt])\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel ServiceRequest {\n  id String @id @default(uuid()) @db.Uuid\n\n  requestNo String @unique\n\n  citizenId           String @db.Uuid\n  categoryId          String @db.Uuid\n  currentDepartmentId String @db.Uuid\n\n  type        RequestType\n  title       String\n  description String\n\n  priority RequestPriority @default(MEDIUM)\n  status   RequestStatus   @default(SUBMITTED)\n\n  responseDueAt   DateTime?\n  resolutionDueAt DateTime?\n\n  firstRespondedAt DateTime?\n  resolvedAt       DateTime?\n  closedAt         DateTime?\n\n  deletedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Relations\n\n  assignments RequestAssignment[]\n\n  citizen Citizen @relation(fields: [citizenId], references: [id])\n\n  category Category @relation(fields: [categoryId], references: [id])\n\n  currentDepartment Department @relation(fields: [currentDepartmentId], references: [id])\n\n  reportedLocation ReportedLocation?\n\n  departmentRoutes RequestDepartmentRoute[]\n\n  statusHistory RequestStatusHistory[]\n\n  workUpdates WorkUpdate[]\n\n  attachments MediaAttachment[]\n\n  notifications Notification[]\n\n  feedback Feedback?\n\n  payments Payment[]\n\n  // Indexes\n\n  @@index([citizenId])\n  @@index([categoryId])\n  @@index([currentDepartmentId])\n  @@index([status])\n  @@index([priority])\n  @@index([createdAt])\n  @@index([status, priority])\n}\n\nmodel SlaPolicy {\n  id         String @id @default(uuid()) @db.Uuid\n  categoryId String @unique @db.Uuid\n\n  responseWithinHours   Int\n  resolutionWithinHours Int\n  reopenWindowHours     Int\n\n  isActive Boolean @default(true)\n\n  // Relations\n\n  category Category @relation(fields: [categoryId], references: [id])\n}\n\nmodel User {\n  id String @id @default(uuid()) @db.Uuid\n\n  name     String\n  email    String  @unique\n  password String?\n  phone    String? @unique\n\n  googleId String? @unique\n  githubId String? @unique\n\n  authProvider AuthProvider @default(CREDENTIAL)\n  role         UserRole     @default(CITIZEN)\n  status       UserStatus   @default(PENDING_VERIFICATION)\n\n  emailVerified Boolean @default(false)\n\n  avatarUrl      String?\n  avatarPublicId String?\n\n  needPasswordChange Boolean @default(false)\n\n  citizen Citizen?\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Relations\n  departmentMemberships DepartmentMember[]\n\n  routedRequests RequestDepartmentRoute[] @relation("RouteByUser")\n\n  assignmentsMade     RequestAssignment[] @relation("AssignmentByUser")\n  assignmentsReceived RequestAssignment[] @relation("AssignmentToUser")\n\n  statusChanges RequestStatusHistory[] @relation("StatusChangedByUser")\n\n  workUpdates WorkUpdate[] @relation("WorkUpdateByUser")\n\n  uploadedAttachments MediaAttachment[] @relation("AttachmentByUser")\n\n  notifications Notification[] @relation("NotificationsForUser")\n\n  auditLogs AuditLog[]\n\n  paymentsIssued Payment[] @relation("PaymentIssuedByUser")\n\n  @@map("users")\n}\n\nmodel Ward {\n  id       String  @id @default(uuid()) @db.Uuid\n  name     String\n  code     String  @unique\n  city     String\n  isActive Boolean @default(true)\n\n  reportedLocations ReportedLocation[]\n\n  @@index([city])\n  @@index([isActive])\n}\n\nmodel WorkUpdate {\n  id String @id @default(uuid()) @db.Uuid\n\n  requestId String @db.Uuid\n  authorId  String @db.Uuid\n\n  note             String\n  visibleToCitizen Boolean @default(false)\n\n  createdAt DateTime @default(now())\n\n  request ServiceRequest @relation(fields: [requestId], references: [id])\n\n  author User @relation("WorkUpdateByUser", fields: [authorId], references: [id])\n\n  @@index([requestId])\n  @@index([authorId])\n  @@index([requestId, createdAt])\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"actorId","kind":"scalar","type":"String"},{"name":"actor","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"action","kind":"scalar","type":"String"},{"name":"entityType","kind":"scalar","type":"String"},{"name":"entityId","kind":"scalar","type":"String"},{"name":"oldValues","kind":"scalar","type":"Json"},{"name":"newValues","kind":"scalar","type":"Json"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"audit_logs","schema":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"paymentRequired","kind":"scalar","type":"Boolean"},{"name":"defaultFeeAmount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"department","kind":"object","type":"Department","relationName":"CategoryToDepartment"},{"name":"serviceRequests","kind":"object","type":"ServiceRequest","relationName":"CategoryToServiceRequest"},{"name":"slaPolicy","kind":"object","type":"SlaPolicy","relationName":"CategoryToSlaPolicy"}],"dbName":null,"schema":null},"Citizen":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CitizenToUser"},{"name":"serviceRequests","kind":"object","type":"ServiceRequest","relationName":"CitizenToServiceRequest"},{"name":"feedbacks","kind":"object","type":"Feedback","relationName":"CitizenToFeedback"}],"dbName":"citizens","schema":null},"Department":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"members","kind":"object","type":"DepartmentMember","relationName":"DepartmentToDepartmentMember"},{"name":"categories","kind":"object","type":"Category","relationName":"CategoryToDepartment"},{"name":"serviceRequests","kind":"object","type":"ServiceRequest","relationName":"DepartmentToServiceRequest"},{"name":"routeHistory","kind":"object","type":"RequestDepartmentRoute","relationName":"DepartmentToRequestDepartmentRoute"}],"dbName":null,"schema":null},"DepartmentMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"position","kind":"enum","type":"StaffPosition"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToDepartmentMember"},{"name":"user","kind":"object","type":"User","relationName":"DepartmentMemberToUser"}],"dbName":null,"schema":null},"Feedback":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"requestId","kind":"scalar","type":"String"},{"name":"citizenId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"request","kind":"object","type":"ServiceRequest","relationName":"FeedbackToServiceRequest"},{"name":"citizen","kind":"object","type":"Citizen","relationName":"CitizenToFeedback"}],"dbName":null,"schema":null},"MediaAttachment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"requestId","kind":"scalar","type":"String"},{"name":"uploadedById","kind":"scalar","type":"String"},{"name":"purpose","kind":"enum","type":"AttachmentPurpose"},{"name":"publicId","kind":"scalar","type":"String"},{"name":"secureUrl","kind":"scalar","type":"String"},{"name":"mimeType","kind":"scalar","type":"String"},{"name":"sizeBytes","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"request","kind":"object","type":"ServiceRequest","relationName":"MediaAttachmentToServiceRequest"},{"name":"uploadedBy","kind":"object","type":"User","relationName":"AttachmentByUser"}],"dbName":null,"schema":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"requestId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"NotificationType"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"readAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"NotificationsForUser"},{"name":"request","kind":"object","type":"ServiceRequest","relationName":"NotificationToServiceRequest"}],"dbName":null,"schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"requestId","kind":"scalar","type":"String"},{"name":"issuedById","kind":"scalar","type":"String"},{"name":"purpose","kind":"enum","type":"PaymentPurpose"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"request","kind":"object","type":"ServiceRequest","relationName":"PaymentToServiceRequest"},{"name":"issuedBy","kind":"object","type":"User","relationName":"PaymentIssuedByUser"},{"name":"transactions","kind":"object","type":"PaymentTransaction","relationName":"PaymentToPaymentTransaction"}],"dbName":"payments","schema":null},"PaymentEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"gateway","kind":"enum","type":"PaymentGateway"},{"name":"gatewayEventId","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"signatureVerified","kind":"scalar","type":"Boolean"},{"name":"processedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"transaction","kind":"object","type":"PaymentTransaction","relationName":"PaymentEventToPaymentTransaction"}],"dbName":"payment_events","schema":null},"PaymentTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"gateway","kind":"enum","type":"PaymentGateway"},{"name":"method","kind":"enum","type":"PaymentMethod"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"idempotencyKey","kind":"scalar","type":"String"},{"name":"gatewaySessionId","kind":"scalar","type":"String"},{"name":"gatewayTransactionId","kind":"scalar","type":"String"},{"name":"checkoutUrl","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentTransactionStatus"},{"name":"gatewayMetadata","kind":"scalar","type":"Json"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payment","kind":"object","type":"Payment","relationName":"PaymentToPaymentTransaction"},{"name":"events","kind":"object","type":"PaymentEvent","relationName":"PaymentEventToPaymentTransaction"}],"dbName":"payment_transactions","schema":null},"ReportedLocation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"requestId","kind":"scalar","type":"String"},{"name":"wardId","kind":"scalar","type":"String"},{"name":"addressLine","kind":"scalar","type":"String"},{"name":"landmark","kind":"scalar","type":"String"},{"name":"latitude","kind":"scalar","type":"Decimal"},{"name":"longitude","kind":"scalar","type":"Decimal"},{"name":"request","kind":"object","type":"ServiceRequest","relationName":"ReportedLocationToServiceRequest"},{"name":"ward","kind":"object","type":"Ward","relationName":"ReportedLocationToWard"}],"dbName":null,"schema":null},"RequestAssignment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"requestId","kind":"scalar","type":"String"},{"name":"assigneeId","kind":"scalar","type":"String"},{"name":"assignedById","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"assignedAt","kind":"scalar","type":"DateTime"},{"name":"releasedAt","kind":"scalar","type":"DateTime"},{"name":"request","kind":"object","type":"ServiceRequest","relationName":"RequestAssignmentToServiceRequest"},{"name":"assignee","kind":"object","type":"User","relationName":"AssignmentToUser"},{"name":"assignedBy","kind":"object","type":"User","relationName":"AssignmentByUser"}],"dbName":null,"schema":null},"RequestDepartmentRoute":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"requestId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"routedById","kind":"scalar","type":"String"},{"name":"reason","kind":"scalar","type":"String"},{"name":"routedAt","kind":"scalar","type":"DateTime"},{"name":"endedAt","kind":"scalar","type":"DateTime"},{"name":"request","kind":"object","type":"ServiceRequest","relationName":"RequestDepartmentRouteToServiceRequest"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToRequestDepartmentRoute"},{"name":"routedBy","kind":"object","type":"User","relationName":"RouteByUser"}],"dbName":null,"schema":null},"RequestStatusHistory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"requestId","kind":"scalar","type":"String"},{"name":"changedById","kind":"scalar","type":"String"},{"name":"fromStatus","kind":"enum","type":"RequestStatus"},{"name":"toStatus","kind":"enum","type":"RequestStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"request","kind":"object","type":"ServiceRequest","relationName":"RequestStatusHistoryToServiceRequest"},{"name":"changedBy","kind":"object","type":"User","relationName":"StatusChangedByUser"}],"dbName":null,"schema":null},"ServiceRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"requestNo","kind":"scalar","type":"String"},{"name":"citizenId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"currentDepartmentId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"RequestType"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"priority","kind":"enum","type":"RequestPriority"},{"name":"status","kind":"enum","type":"RequestStatus"},{"name":"responseDueAt","kind":"scalar","type":"DateTime"},{"name":"resolutionDueAt","kind":"scalar","type":"DateTime"},{"name":"firstRespondedAt","kind":"scalar","type":"DateTime"},{"name":"resolvedAt","kind":"scalar","type":"DateTime"},{"name":"closedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"assignments","kind":"object","type":"RequestAssignment","relationName":"RequestAssignmentToServiceRequest"},{"name":"citizen","kind":"object","type":"Citizen","relationName":"CitizenToServiceRequest"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToServiceRequest"},{"name":"currentDepartment","kind":"object","type":"Department","relationName":"DepartmentToServiceRequest"},{"name":"reportedLocation","kind":"object","type":"ReportedLocation","relationName":"ReportedLocationToServiceRequest"},{"name":"departmentRoutes","kind":"object","type":"RequestDepartmentRoute","relationName":"RequestDepartmentRouteToServiceRequest"},{"name":"statusHistory","kind":"object","type":"RequestStatusHistory","relationName":"RequestStatusHistoryToServiceRequest"},{"name":"workUpdates","kind":"object","type":"WorkUpdate","relationName":"ServiceRequestToWorkUpdate"},{"name":"attachments","kind":"object","type":"MediaAttachment","relationName":"MediaAttachmentToServiceRequest"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToServiceRequest"},{"name":"feedback","kind":"object","type":"Feedback","relationName":"FeedbackToServiceRequest"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToServiceRequest"}],"dbName":null,"schema":null},"SlaPolicy":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"responseWithinHours","kind":"scalar","type":"Int"},{"name":"resolutionWithinHours","kind":"scalar","type":"Int"},{"name":"reopenWindowHours","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToSlaPolicy"}],"dbName":null,"schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"googleId","kind":"scalar","type":"String"},{"name":"githubId","kind":"scalar","type":"String"},{"name":"authProvider","kind":"enum","type":"AuthProvider"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"avatarUrl","kind":"scalar","type":"String"},{"name":"avatarPublicId","kind":"scalar","type":"String"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"citizen","kind":"object","type":"Citizen","relationName":"CitizenToUser"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"departmentMemberships","kind":"object","type":"DepartmentMember","relationName":"DepartmentMemberToUser"},{"name":"routedRequests","kind":"object","type":"RequestDepartmentRoute","relationName":"RouteByUser"},{"name":"assignmentsMade","kind":"object","type":"RequestAssignment","relationName":"AssignmentByUser"},{"name":"assignmentsReceived","kind":"object","type":"RequestAssignment","relationName":"AssignmentToUser"},{"name":"statusChanges","kind":"object","type":"RequestStatusHistory","relationName":"StatusChangedByUser"},{"name":"workUpdates","kind":"object","type":"WorkUpdate","relationName":"WorkUpdateByUser"},{"name":"uploadedAttachments","kind":"object","type":"MediaAttachment","relationName":"AttachmentByUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationsForUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"paymentsIssued","kind":"object","type":"Payment","relationName":"PaymentIssuedByUser"}],"dbName":"users","schema":null},"Ward":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"reportedLocations","kind":"object","type":"ReportedLocation","relationName":"ReportedLocationToWard"}],"dbName":null,"schema":null},"WorkUpdate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"requestId","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"visibleToCitizen","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"request","kind":"object","type":"ServiceRequest","relationName":"ServiceRequestToWorkUpdate"},{"name":"author","kind":"object","type":"User","relationName":"WorkUpdateByUser"}],"dbName":null,"schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","user","orderBy","cursor","request","assignee","assignedBy","assignments","citizen","department","members","categories","serviceRequests","routedBy","routeHistory","_count","category","slaPolicy","currentDepartment","reportedLocations","ward","reportedLocation","departmentRoutes","changedBy","statusHistory","author","workUpdates","uploadedBy","attachments","notifications","feedback","issuedBy","payment","transaction","events","transactions","payments","feedbacks","departmentMemberships","routedRequests","assignmentsMade","assignmentsReceived","statusChanges","uploadedAttachments","auditLogs","paymentsIssued","actor","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","data","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","create","update","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","having","_min","_max","AuditLog.groupBy","AuditLog.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","_avg","_sum","Category.groupBy","Category.aggregate","Citizen.findUnique","Citizen.findUniqueOrThrow","Citizen.findFirst","Citizen.findFirstOrThrow","Citizen.findMany","Citizen.createOne","Citizen.createMany","Citizen.createManyAndReturn","Citizen.updateOne","Citizen.updateMany","Citizen.updateManyAndReturn","Citizen.upsertOne","Citizen.deleteOne","Citizen.deleteMany","Citizen.groupBy","Citizen.aggregate","Department.findUnique","Department.findUniqueOrThrow","Department.findFirst","Department.findFirstOrThrow","Department.findMany","Department.createOne","Department.createMany","Department.createManyAndReturn","Department.updateOne","Department.updateMany","Department.updateManyAndReturn","Department.upsertOne","Department.deleteOne","Department.deleteMany","Department.groupBy","Department.aggregate","DepartmentMember.findUnique","DepartmentMember.findUniqueOrThrow","DepartmentMember.findFirst","DepartmentMember.findFirstOrThrow","DepartmentMember.findMany","DepartmentMember.createOne","DepartmentMember.createMany","DepartmentMember.createManyAndReturn","DepartmentMember.updateOne","DepartmentMember.updateMany","DepartmentMember.updateManyAndReturn","DepartmentMember.upsertOne","DepartmentMember.deleteOne","DepartmentMember.deleteMany","DepartmentMember.groupBy","DepartmentMember.aggregate","Feedback.findUnique","Feedback.findUniqueOrThrow","Feedback.findFirst","Feedback.findFirstOrThrow","Feedback.findMany","Feedback.createOne","Feedback.createMany","Feedback.createManyAndReturn","Feedback.updateOne","Feedback.updateMany","Feedback.updateManyAndReturn","Feedback.upsertOne","Feedback.deleteOne","Feedback.deleteMany","Feedback.groupBy","Feedback.aggregate","MediaAttachment.findUnique","MediaAttachment.findUniqueOrThrow","MediaAttachment.findFirst","MediaAttachment.findFirstOrThrow","MediaAttachment.findMany","MediaAttachment.createOne","MediaAttachment.createMany","MediaAttachment.createManyAndReturn","MediaAttachment.updateOne","MediaAttachment.updateMany","MediaAttachment.updateManyAndReturn","MediaAttachment.upsertOne","MediaAttachment.deleteOne","MediaAttachment.deleteMany","MediaAttachment.groupBy","MediaAttachment.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PaymentEvent.findUnique","PaymentEvent.findUniqueOrThrow","PaymentEvent.findFirst","PaymentEvent.findFirstOrThrow","PaymentEvent.findMany","PaymentEvent.createOne","PaymentEvent.createMany","PaymentEvent.createManyAndReturn","PaymentEvent.updateOne","PaymentEvent.updateMany","PaymentEvent.updateManyAndReturn","PaymentEvent.upsertOne","PaymentEvent.deleteOne","PaymentEvent.deleteMany","PaymentEvent.groupBy","PaymentEvent.aggregate","PaymentTransaction.findUnique","PaymentTransaction.findUniqueOrThrow","PaymentTransaction.findFirst","PaymentTransaction.findFirstOrThrow","PaymentTransaction.findMany","PaymentTransaction.createOne","PaymentTransaction.createMany","PaymentTransaction.createManyAndReturn","PaymentTransaction.updateOne","PaymentTransaction.updateMany","PaymentTransaction.updateManyAndReturn","PaymentTransaction.upsertOne","PaymentTransaction.deleteOne","PaymentTransaction.deleteMany","PaymentTransaction.groupBy","PaymentTransaction.aggregate","ReportedLocation.findUnique","ReportedLocation.findUniqueOrThrow","ReportedLocation.findFirst","ReportedLocation.findFirstOrThrow","ReportedLocation.findMany","ReportedLocation.createOne","ReportedLocation.createMany","ReportedLocation.createManyAndReturn","ReportedLocation.updateOne","ReportedLocation.updateMany","ReportedLocation.updateManyAndReturn","ReportedLocation.upsertOne","ReportedLocation.deleteOne","ReportedLocation.deleteMany","ReportedLocation.groupBy","ReportedLocation.aggregate","RequestAssignment.findUnique","RequestAssignment.findUniqueOrThrow","RequestAssignment.findFirst","RequestAssignment.findFirstOrThrow","RequestAssignment.findMany","RequestAssignment.createOne","RequestAssignment.createMany","RequestAssignment.createManyAndReturn","RequestAssignment.updateOne","RequestAssignment.updateMany","RequestAssignment.updateManyAndReturn","RequestAssignment.upsertOne","RequestAssignment.deleteOne","RequestAssignment.deleteMany","RequestAssignment.groupBy","RequestAssignment.aggregate","RequestDepartmentRoute.findUnique","RequestDepartmentRoute.findUniqueOrThrow","RequestDepartmentRoute.findFirst","RequestDepartmentRoute.findFirstOrThrow","RequestDepartmentRoute.findMany","RequestDepartmentRoute.createOne","RequestDepartmentRoute.createMany","RequestDepartmentRoute.createManyAndReturn","RequestDepartmentRoute.updateOne","RequestDepartmentRoute.updateMany","RequestDepartmentRoute.updateManyAndReturn","RequestDepartmentRoute.upsertOne","RequestDepartmentRoute.deleteOne","RequestDepartmentRoute.deleteMany","RequestDepartmentRoute.groupBy","RequestDepartmentRoute.aggregate","RequestStatusHistory.findUnique","RequestStatusHistory.findUniqueOrThrow","RequestStatusHistory.findFirst","RequestStatusHistory.findFirstOrThrow","RequestStatusHistory.findMany","RequestStatusHistory.createOne","RequestStatusHistory.createMany","RequestStatusHistory.createManyAndReturn","RequestStatusHistory.updateOne","RequestStatusHistory.updateMany","RequestStatusHistory.updateManyAndReturn","RequestStatusHistory.upsertOne","RequestStatusHistory.deleteOne","RequestStatusHistory.deleteMany","RequestStatusHistory.groupBy","RequestStatusHistory.aggregate","ServiceRequest.findUnique","ServiceRequest.findUniqueOrThrow","ServiceRequest.findFirst","ServiceRequest.findFirstOrThrow","ServiceRequest.findMany","ServiceRequest.createOne","ServiceRequest.createMany","ServiceRequest.createManyAndReturn","ServiceRequest.updateOne","ServiceRequest.updateMany","ServiceRequest.updateManyAndReturn","ServiceRequest.upsertOne","ServiceRequest.deleteOne","ServiceRequest.deleteMany","ServiceRequest.groupBy","ServiceRequest.aggregate","SlaPolicy.findUnique","SlaPolicy.findUniqueOrThrow","SlaPolicy.findFirst","SlaPolicy.findFirstOrThrow","SlaPolicy.findMany","SlaPolicy.createOne","SlaPolicy.createMany","SlaPolicy.createManyAndReturn","SlaPolicy.updateOne","SlaPolicy.updateMany","SlaPolicy.updateManyAndReturn","SlaPolicy.upsertOne","SlaPolicy.deleteOne","SlaPolicy.deleteMany","SlaPolicy.groupBy","SlaPolicy.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Ward.findUnique","Ward.findUniqueOrThrow","Ward.findFirst","Ward.findFirstOrThrow","Ward.findMany","Ward.createOne","Ward.createMany","Ward.createManyAndReturn","Ward.updateOne","Ward.updateMany","Ward.updateManyAndReturn","Ward.upsertOne","Ward.deleteOne","Ward.deleteMany","Ward.groupBy","Ward.aggregate","WorkUpdate.findUnique","WorkUpdate.findUniqueOrThrow","WorkUpdate.findFirst","WorkUpdate.findFirstOrThrow","WorkUpdate.findMany","WorkUpdate.createOne","WorkUpdate.createMany","WorkUpdate.createManyAndReturn","WorkUpdate.updateOne","WorkUpdate.updateMany","WorkUpdate.updateManyAndReturn","WorkUpdate.upsertOne","WorkUpdate.deleteOne","WorkUpdate.deleteMany","WorkUpdate.groupBy","WorkUpdate.aggregate","AND","OR","NOT","id","requestId","authorId","note","visibleToCitizen","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","name","code","city","isActive","every","some","none","email","password","phone","googleId","githubId","AuthProvider","authProvider","UserRole","role","UserStatus","status","emailVerified","avatarUrl","avatarPublicId","needPasswordChange","isDeleted","deletedAt","updatedAt","categoryId","responseWithinHours","resolutionWithinHours","reopenWindowHours","requestNo","citizenId","currentDepartmentId","RequestType","type","title","description","RequestPriority","priority","RequestStatus","responseDueAt","resolutionDueAt","firstRespondedAt","resolvedAt","closedAt","changedById","fromStatus","toStatus","departmentId","routedById","reason","routedAt","endedAt","assigneeId","assignedById","assignedAt","releasedAt","wardId","addressLine","landmark","latitude","longitude","paymentId","PaymentGateway","gateway","PaymentMethod","method","amount","currency","idempotencyKey","gatewaySessionId","gatewayTransactionId","checkoutUrl","PaymentTransactionStatus","gatewayMetadata","verifiedAt","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","transactionId","gatewayEventId","payload","signatureVerified","processedAt","issuedById","PaymentPurpose","purpose","PaymentStatus","expiresAt","paidAt","userId","NotificationType","readAt","uploadedById","AttachmentPurpose","publicId","secureUrl","mimeType","sizeBytes","rating","comment","StaffPosition","position","joinedAt","contactNumber","address","paymentRequired","defaultFeeAmount","actorId","action","entityType","entityId","oldValues","newValues","ipAddress","userAgent","departmentId_name","departmentId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "xQu3AcACDi4AALgFACD3AgAAtQUAMPgCAABfABD5AgAAtQUAMPoCAQAAAAH_AkAA3QQAIfkDAQC2BQAh-gMBAMIEACH7AwEAwgQAIfwDAQDBBAAh_QMAALcFACD-AwAAtwUAIP8DAQDYBAAhgAQBANgEACEBAAAAAQAgIAgAAN4EACAaAADjBAAgHQAA5QQAICYAAN8EACAnAADgBAAgKAAA4QQAICkAAOEEACAqAADiBAAgKwAA5AQAICwAAOYEACAtAADnBAAg9wIAANcEADD4AgAAAwAQ-QIAANcEADD6AgEAwQQAIf8CQADdBAAhiwMBAMIEACGSAwEAwgQAIZMDAQDYBAAhlAMBANgEACGVAwEA2AQAIZYDAQDYBAAhmAMAANkEmAMimgMAANoEmgMinAMAANsEnAMinQMgAMMEACGeAwEA2AQAIZ8DAQDYBAAhoAMgAMMEACGhAyAAwwQAIaIDQADcBAAhowNAAN0EACEBAAAAAwAgEAEAAK8FACAMAACsBQAgJQAAsAUAIPcCAACuBQAw-AIAAAUAEPkCAACuBQAw-gIBAMEEACH_AkAA3QQAIYsDAQDCBAAhkgMBAMIEACGhAyAAwwQAIaIDQADcBAAhowNAAN0EACHnAwEAwQQAIfUDAQDYBAAh9gMBANgEACEBAAAABQAgIQcAAOEEACAIAAC8BQAgEAAA7gQAIBIAANcFACAVAADiBQAgFgAA4AQAIBgAAOIEACAaAADjBAAgHAAA5AQAIB0AAOUEACAeAADjBQAgJAAA5wQAIPcCAADfBQAw-AIAAAcAEPkCAADfBQAw-gIBAMEEACH_AkAA3QQAIZwDAADSBbIDIqIDQADcBAAhowNAAN0EACGkAwEAwQQAIagDAQDCBAAhqQMBAMEEACGqAwEAwQQAIawDAADgBawDIq0DAQDCBAAhrgMBAMIEACGwAwAA4QWwAyKyA0AA3AQAIbMDQADcBAAhtANAANwEACG1A0AA3AQAIbYDQADcBAAhEgcAAOgIACAIAADlCAAgEAAA9ggAIBIAAIwKACAVAACOCgAgFgAA5wgAIBgAAOkIACAaAADqCAAgHAAA6wgAIB0AAOwIACAeAACPCgAgJAAA7ggAIKIDAACEBgAgsgMAAIQGACCzAwAAhAYAILQDAACEBgAgtQMAAIQGACC2AwAAhAYAICEHAADhBAAgCAAAvAUAIBAAAO4EACASAADXBQAgFQAA4gUAIBYAAOAEACAYAADiBAAgGgAA4wQAIBwAAOQEACAdAADlBAAgHgAA4wUAICQAAOcEACD3AgAA3wUAMPgCAAAHABD5AgAA3wUAMPoCAQAAAAH_AkAA3QQAIZwDAADSBbIDIqIDQADcBAAhowNAAN0EACGkAwEAwQQAIagDAQAAAAGpAwEAwQQAIaoDAQDBBAAhrAMAAOAFrAMirQMBAMIEACGuAwEAwgQAIbADAADhBbADIrIDQADcBAAhswNAANwEACG0A0AA3AQAIbUDQADcBAAhtgNAANwEACEDAAAABwAgAgAACAAwAwAACQAgDQQAALsFACAFAACvBQAgBgAArwUAIPcCAADeBQAw-AIAAAsAEPkCAADeBQAw-gIBAMEEACH7AgEAwQQAIf0CAQDYBAAhvwMBAMEEACHAAwEAwQQAIcEDQADdBAAhwgNAANwEACEFBAAAhgoAIAUAAPgJACAGAAD4CQAg_QIAAIQGACDCAwAAhAYAIA0EAAC7BQAgBQAArwUAIAYAAK8FACD3AgAA3gUAMPgCAAALABD5AgAA3gUAMPoCAQAAAAH7AgEAwQQAIf0CAQDYBAAhvwMBAMEEACHAAwEAwQQAIcEDQADdBAAhwgNAANwEACEDAAAACwAgAgAADAAwAwAADQAgCwEAAK8FACAJAADXBQAg9wIAANwFADD4AgAADwAQ-QIAANwFADD6AgEAwQQAIY4DIADDBAAhugMBAMEEACHnAwEAwQQAIfMDAADdBfMDIvQDQADdBAAhAgEAAPgJACAJAACMCgAgDAEAAK8FACAJAADXBQAg9wIAANwFADD4AgAADwAQ-QIAANwFADD6AgEAAAABjgMgAMMEACG6AwEAwQQAIecDAQDBBAAh8wMAAN0F8wMi9ANAAN0EACGCBAAA2wUAIAMAAAAPACACAAAQADADAAARACARCQAA1wUAIAwAAKwFACARAADaBQAg9wIAANkFADD4AgAAEwAQ-QIAANkFADD6AgEAwQQAIf8CQADdBAAhiwMBAMIEACGOAyAAwwQAIaIDQADcBAAhowNAAN0EACGuAwEA2AQAIboDAQDBBAAhzgMBAMIEACH3AyAAwwQAIfgDEADUBQAhBgkAAIwKACAMAADyCQAgEQAAjQoAIKIDAACEBgAgrgMAAIQGACD4AwAAhAYAIBIJAADXBQAgDAAArAUAIBEAANoFACD3AgAA2QUAMPgCAAATABD5AgAA2QUAMPoCAQAAAAH_AkAA3QQAIYsDAQDCBAAhjgMgAMMEACGiA0AA3AQAIaMDQADdBAAhrgMBANgEACG6AwEAwQQAIc4DAQDCBAAh9wMgAMMEACH4AxAA1AUAIYEEAADYBQAgAwAAABMAIAIAABQAMAMAABUAIAMAAAAHACACAAAIADADAAAJACANBAAAuwUAIAkAANcFACANAACvBQAg9wIAANYFADD4AgAAGAAQ-QIAANYFADD6AgEAwQQAIfsCAQDBBAAhugMBAMEEACG7AwEAwQQAIbwDAQDYBAAhvQNAAN0EACG-A0AA3AQAIQUEAACGCgAgCQAAjAoAIA0AAPgJACC8AwAAhAYAIL4DAACEBgAgDQQAALsFACAJAADXBQAgDQAArwUAIPcCAADWBQAw-AIAABgAEPkCAADWBQAw-gIBAAAAAfsCAQDBBAAhugMBAMEEACG7AwEAwQQAIbwDAQDYBAAhvQNAAN0EACG-A0AA3AQAIQMAAAAYACACAAAZADADAAAaACABAAAADwAgAQAAABMAIAEAAAAHACABAAAAGAAgAwAAAAcAIAIAAAgAMAMAAAkAIAoQAADuBAAg9wIAAOwEADD4AgAAIQAQ-QIAAOwEADD6AgEAwQQAIY4DIADDBAAhpAMBAMEEACGlAwIA7QQAIaYDAgDtBAAhpwMCAO0EACEBAAAAIQAgAQAAAAcAIAwEAAC7BQAgFAAA1QUAIPcCAADTBQAw-AIAACQAEPkCAADTBQAw-gIBAMEEACH7AgEAwQQAIcMDAQDBBAAhxAMBAMIEACHFAwEA2AQAIcYDEADUBQAhxwMQANQFACEBAAAAJAAgBQQAAIYKACAUAACLCgAgxQMAAIQGACDGAwAAhAYAIMcDAACEBgAgDAQAALsFACAUAADVBQAg9wIAANMFADD4AgAAJAAQ-QIAANMFADD6AgEAAAAB-wIBAAAAAcMDAQDBBAAhxAMBAMIEACHFAwEA2AQAIcYDEADUBQAhxwMQANQFACEDAAAAJAAgAgAAJgAwAwAAJwAgAQAAACQAIAMAAAAYACACAAAZADADAAAaACAMBAAAuwUAIBcAAK8FACD3AgAA0AUAMPgCAAArABD5AgAA0AUAMPoCAQDBBAAh-wIBAMEEACH9AgEA2AQAIf8CQADdBAAhtwMBAMEEACG4AwAA0QWyAyO5AwAA0gWyAyIEBAAAhgoAIBcAAPgJACD9AgAAhAYAILgDAACEBgAgDAQAALsFACAXAACvBQAg9wIAANAFADD4AgAAKwAQ-QIAANAFADD6AgEAAAAB-wIBAMEEACH9AgEA2AQAIf8CQADdBAAhtwMBAMEEACG4AwAA0QWyAyO5AwAA0gWyAyIDAAAAKwAgAgAALAAwAwAALQAgCwQAALsFACAZAACvBQAg9wIAAM8FADD4AgAALwAQ-QIAAM8FADD6AgEAwQQAIfsCAQDBBAAh_AIBAMEEACH9AgEAwgQAIf4CIADDBAAh_wJAAN0EACECBAAAhgoAIBkAAPgJACALBAAAuwUAIBkAAK8FACD3AgAAzwUAMPgCAAAvABD5AgAAzwUAMPoCAQAAAAH7AgEAwQQAIfwCAQDBBAAh_QIBAMIEACH-AiAAwwQAIf8CQADdBAAhAwAAAC8AIAIAADAAMAMAADEAIA4EAAC7BQAgGwAArwUAIPcCAADNBQAw-AIAADMAEPkCAADNBQAw-gIBAMEEACH7AgEAwQQAIf8CQADdBAAh4wMAAM4F7AMi6gMBAMEEACHsAwEAwgQAIe0DAQDCBAAh7gMBAMIEACHvAwIA7QQAIQIEAACGCgAgGwAA-AkAIA4EAAC7BQAgGwAArwUAIPcCAADNBQAw-AIAADMAEPkCAADNBQAw-gIBAAAAAfsCAQDBBAAh_wJAAN0EACHjAwAAzgXsAyLqAwEAwQQAIewDAQAAAAHtAwEAwgQAIe4DAQDCBAAh7wMCAO0EACEDAAAAMwAgAgAANAAwAwAANQAgDAEAAK8FACAEAAC7BQAg9wIAAMsFADD4AgAANwAQ-QIAAMsFADD6AgEAwQQAIfsCAQDBBAAh_wJAAN0EACGsAwAAzAXpAyLeAwAAvwUAIOcDAQDBBAAh6QNAANwEACEDAQAA-AkAIAQAAIYKACDpAwAAhAYAIAwBAACvBQAgBAAAuwUAIPcCAADLBQAw-AIAADcAEPkCAADLBQAw-gIBAAAAAfsCAQDBBAAh_wJAAN0EACGsAwAAzAXpAyLeAwAAvwUAIOcDAQDBBAAh6QNAANwEACEDAAAANwAgAgAAOAAwAwAAOQAgCwQAALsFACAIAAC8BQAg9wIAALoFADD4AgAAOwAQ-QIAALoFADD6AgEAwQQAIfsCAQDBBAAh_wJAAN0EACGpAwEAwQQAIfADAgDtBAAh8QMBANgEACEBAAAAOwAgEQQAALsFACAfAACvBQAgIwAAygUAIPcCAADHBQAw-AIAAD0AEPkCAADHBQAw-gIBAMEEACH7AgEAwQQAIf8CQADdBAAhnAMAAMkF5QMiowNAAN0EACHNAxAAwwUAIc4DAQDCBAAh4QMBAMEEACHjAwAAyAXjAyLlA0AA3AQAIeYDQADcBAAhBQQAAIYKACAfAAD4CQAgIwAAigoAIOUDAACEBgAg5gMAAIQGACARBAAAuwUAIB8AAK8FACAjAADKBQAg9wIAAMcFADD4AgAAPQAQ-QIAAMcFADD6AgEAAAAB-wIBAMEEACH_AkAA3QQAIZwDAADJBeUDIqMDQADdBAAhzQMQAMMFACHOAwEAwgQAIeEDAQDBBAAh4wMAAMgF4wMi5QNAANwEACHmA0AA3AQAIQMAAAA9ACACAAA-ADADAAA_ACAUIAAAxQUAICIAAMYFACD3AgAAwQUAMPgCAABBABD5AgAAwQUAMPoCAQDBBAAh_wJAAN0EACGcAwAAxAXUAyKjA0AA3QQAIcgDAQDBBAAhygMAAL4FygMizAMAAMIFzAMizQMQAMMFACHOAwEAwgQAIc8DAQDCBAAh0AMBANgEACHRAwEA2AQAIdIDAQDYBAAh1AMAALcFACDVA0AA3AQAIQcgAACICgAgIgAAiQoAINADAACEBgAg0QMAAIQGACDSAwAAhAYAINQDAACEBgAg1QMAAIQGACAUIAAAxQUAICIAAMYFACD3AgAAwQUAMPgCAABBABD5AgAAwQUAMPoCAQAAAAH_AkAA3QQAIZwDAADEBdQDIqMDQADdBAAhyAMBAMEEACHKAwAAvgXKAyLMAwAAwgXMAyLNAxAAwwUAIc4DAQDCBAAhzwMBAAAAAdADAQAAAAHRAwEA2AQAIdIDAQDYBAAh1AMAALcFACDVA0AA3AQAIQMAAABBACACAABCADADAABDACAMIQAAwAUAIPcCAAC9BQAw-AIAAEUAEPkCAAC9BQAw-gIBAMEEACH_AkAA3QQAIcoDAAC-BcoDItwDAQDBBAAh3QMBAMIEACHeAwAAvwUAIN8DIADDBAAh4ANAANwEACECIQAAhwoAIOADAACEBgAgDCEAAMAFACD3AgAAvQUAMPgCAABFABD5AgAAvQUAMPoCAQAAAAH_AkAA3QQAIcoDAAC-BcoDItwDAQDBBAAh3QMBAMIEACHeAwAAvwUAIN8DIADDBAAh4ANAANwEACEDAAAARQAgAgAARgAwAwAARwAgAQAAAEUAIAEAAABBACABAAAACwAgAQAAABgAIAEAAAArACABAAAALwAgAQAAADMAIAEAAAA3ACABAAAAPQAgAwQAAIYKACAIAADlCAAg8QMAAIQGACALBAAAuwUAIAgAALwFACD3AgAAugUAMPgCAAA7ABD5AgAAugUAMPoCAQAAAAH7AgEAAAAB_wJAAN0EACGpAwEAwQQAIfADAgDtBAAh8QMBANgEACEDAAAAOwAgAgAAUgAwAwAAUwAgAQAAAAcAIAEAAAA7ACADAAAADwAgAgAAEAAwAwAAEQAgAwAAABgAIAIAABkAMAMAABoAIAMAAAALACACAAAMADADAAANACADAAAACwAgAgAADAAwAwAADQAgAwAAACsAIAIAACwAMAMAAC0AIAMAAAAvACACAAAwADADAAAxACADAAAAMwAgAgAANAAwAwAANQAgAwAAADcAIAIAADgAMAMAADkAIA4uAAC4BQAg9wIAALUFADD4AgAAXwAQ-QIAALUFADD6AgEAwQQAIf8CQADdBAAh-QMBALYFACH6AwEAwgQAIfsDAQDCBAAh_AMBAMEEACH9AwAAtwUAIP4DAAC3BQAg_wMBANgEACGABAEA2AQAIQYuAAD4CQAg-QMAAIQGACD9AwAAhAYAIP4DAACEBgAg_wMAAIQGACCABAAAhAYAIAMAAABfACACAABgADADAAABACADAAAAPQAgAgAAPgAwAwAAPwAgAQAAAA8AIAEAAAAYACABAAAACwAgAQAAAAsAIAEAAAArACABAAAALwAgAQAAADMAIAEAAAA3ACABAAAAXwAgAQAAAD0AIAEAAAABACADAAAAXwAgAgAAYAAwAwAAAQAgAwAAAF8AIAIAAGAAMAMAAAEAIAMAAABfACACAABgADADAAABACALLgAAhQoAIPoCAQAAAAH_AkAAAAAB-QMBAAAAAfoDAQAAAAH7AwEAAAAB_AMBAAAAAf0DgAAAAAH-A4AAAAAB_wMBAAAAAYAEAQAAAAEBNAAAcQAgCvoCAQAAAAH_AkAAAAAB-QMBAAAAAfoDAQAAAAH7AwEAAAAB_AMBAAAAAf0DgAAAAAH-A4AAAAAB_wMBAAAAAYAEAQAAAAEBNAAAcwAwATQAAHMAMAEAAAADACALLgAAhAoAIPoCAQDnBQAh_wJAAOkFACH5AwEA_AUAIfoDAQDnBQAh-wMBAOcFACH8AwEA5wUAIf0DgAAAAAH-A4AAAAAB_wMBAPwFACGABAEA_AUAIQIAAAABACA0AAB3ACAK-gIBAOcFACH_AkAA6QUAIfkDAQD8BQAh-gMBAOcFACH7AwEA5wUAIfwDAQDnBQAh_QOAAAAAAf4DgAAAAAH_AwEA_AUAIYAEAQD8BQAhAgAAAF8AIDQAAHkAIAIAAABfACA0AAB5ACABAAAAAwAgAwAAAAEAIDsAAHEAIDwAAHcAIAEAAAABACABAAAAXwAgCA8AAIEKACBBAACDCgAgQgAAggoAIPkDAACEBgAg_QMAAIQGACD-AwAAhAYAIP8DAACEBgAggAQAAIQGACAN9wIAALIFADD4AgAAgQEAEPkCAACyBQAw-gIBALMEACH_AkAAtgQAIfkDAQCzBQAh-gMBALQEACH7AwEAtAQAIfwDAQCzBAAh_QMAAIgFACD-AwAAiAUAIP8DAQDHBAAhgAQBAMcEACEDAAAAXwAgAgAAgAEAMEAAAIEBACADAAAAXwAgAgAAYAAwAwAAAQAgAQAAABUAIAEAAAAVACADAAAAEwAgAgAAFAAwAwAAFQAgAwAAABMAIAIAABQAMAMAABUAIAMAAAATACACAAAUADADAAAVACAOCQAAgAoAIAwAAOIJACARAADjCQAg-gIBAAAAAf8CQAAAAAGLAwEAAAABjgMgAAAAAaIDQAAAAAGjA0AAAAABrgMBAAAAAboDAQAAAAHOAwEAAAAB9wMgAAAAAfgDEAAAAAEBNAAAiQEAIAv6AgEAAAAB_wJAAAAAAYsDAQAAAAGOAyAAAAABogNAAAAAAaMDQAAAAAGuAwEAAAABugMBAAAAAc4DAQAAAAH3AyAAAAAB-AMQAAAAAQE0AACLAQAwATQAAIsBADAOCQAA_wkAIAwAANEJACARAADSCQAg-gIBAOcFACH_AkAA6QUAIYsDAQDnBQAhjgMgAOgFACGiA0AAiwYAIaMDQADpBQAhrgMBAPwFACG6AwEA5wUAIc4DAQDnBQAh9wMgAOgFACH4AxAA_QUAIQIAAAAVACA0AACOAQAgC_oCAQDnBQAh_wJAAOkFACGLAwEA5wUAIY4DIADoBQAhogNAAIsGACGjA0AA6QUAIa4DAQD8BQAhugMBAOcFACHOAwEA5wUAIfcDIADoBQAh-AMQAP0FACECAAAAEwAgNAAAkAEAIAIAAAATACA0AACQAQAgAwAAABUAIDsAAIkBACA8AACOAQAgAQAAABUAIAEAAAATACAIDwAA-gkAIEEAAP0JACBCAAD8CQAgUwAA-wkAIFQAAP4JACCiAwAAhAYAIK4DAACEBgAg-AMAAIQGACAO9wIAALEFADD4AgAAlwEAEPkCAACxBQAw-gIBALMEACH_AkAAtgQAIYsDAQC0BAAhjgMgALUEACGiA0AAywQAIaMDQAC2BAAhrgMBAMcEACG6AwEAswQAIc4DAQC0BAAh9wMgALUEACH4AxAAgAUAIQMAAAATACACAACWAQAwQAAAlwEAIAMAAAATACACAAAUADADAAAVACAQAQAArwUAIAwAAKwFACAlAACwBQAg9wIAAK4FADD4AgAABQAQ-QIAAK4FADD6AgEAAAAB_wJAAN0EACGLAwEAwgQAIZIDAQAAAAGhAyAAwwQAIaIDQADcBAAhowNAAN0EACHnAwEAAAAB9QMBANgEACH2AwEA2AQAIQEAAACaAQAgAQAAAJoBACAGAQAA-AkAIAwAAPIJACAlAAD5CQAgogMAAIQGACD1AwAAhAYAIPYDAACEBgAgAwAAAAUAIAIAAJ0BADADAACaAQAgAwAAAAUAIAIAAJ0BADADAACaAQAgAwAAAAUAIAIAAJ0BADADAACaAQAgDQEAAPcJACAMAADYCAAgJQAA2QgAIPoCAQAAAAH_AkAAAAABiwMBAAAAAZIDAQAAAAGhAyAAAAABogNAAAAAAaMDQAAAAAHnAwEAAAAB9QMBAAAAAfYDAQAAAAEBNAAAoQEAIAr6AgEAAAAB_wJAAAAAAYsDAQAAAAGSAwEAAAABoQMgAAAAAaIDQAAAAAGjA0AAAAAB5wMBAAAAAfUDAQAAAAH2AwEAAAABATQAAKMBADABNAAAowEAMA0BAAD2CQAgDAAAzQcAICUAAM4HACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGSAwEA5wUAIaEDIADoBQAhogNAAIsGACGjA0AA6QUAIecDAQDnBQAh9QMBAPwFACH2AwEA_AUAIQIAAACaAQAgNAAApgEAIAr6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGSAwEA5wUAIaEDIADoBQAhogNAAIsGACGjA0AA6QUAIecDAQDnBQAh9QMBAPwFACH2AwEA_AUAIQIAAAAFACA0AACoAQAgAgAAAAUAIDQAAKgBACADAAAAmgEAIDsAAKEBACA8AACmAQAgAQAAAJoBACABAAAABQAgBg8AAPMJACBBAAD1CQAgQgAA9AkAIKIDAACEBgAg9QMAAIQGACD2AwAAhAYAIA33AgAArQUAMPgCAACvAQAQ-QIAAK0FADD6AgEAswQAIf8CQAC2BAAhiwMBALQEACGSAwEAtAQAIaEDIAC1BAAhogNAAMsEACGjA0AAtgQAIecDAQCzBAAh9QMBAMcEACH2AwEAxwQAIQMAAAAFACACAACuAQAwQAAArwEAIAMAAAAFACACAACdAQAwAwAAmgEAIA8KAADfBAAgCwAAqwUAIAwAAKwFACAOAADgBAAg9wIAAKoFADD4AgAAtQEAEPkCAACqBQAw-gIBAAAAAf8CQADdBAAhiwMBAAAAAYwDAQAAAAGOAyAAwwQAIaIDQADcBAAhowNAAN0EACGuAwEA2AQAIQEAAACyAQAgAQAAALIBACAPCgAA3wQAIAsAAKsFACAMAACsBQAgDgAA4AQAIPcCAACqBQAw-AIAALUBABD5AgAAqgUAMPoCAQDBBAAh_wJAAN0EACGLAwEAwgQAIYwDAQDCBAAhjgMgAMMEACGiA0AA3AQAIaMDQADdBAAhrgMBANgEACEGCgAA5ggAIAsAAPEJACAMAADyCQAgDgAA5wgAIKIDAACEBgAgrgMAAIQGACADAAAAtQEAIAIAALYBADADAACyAQAgAwAAALUBACACAAC2AQAwAwAAsgEAIAMAAAC1AQAgAgAAtgEAMAMAALIBACAMCgAA7QkAIAsAAO4JACAMAADvCQAgDgAA8AkAIPoCAQAAAAH_AkAAAAABiwMBAAAAAYwDAQAAAAGOAyAAAAABogNAAAAAAaMDQAAAAAGuAwEAAAABATQAALoBACAI-gIBAAAAAf8CQAAAAAGLAwEAAAABjAMBAAAAAY4DIAAAAAGiA0AAAAABowNAAAAAAa4DAQAAAAEBNAAAvAEAMAE0AAC8AQAwDAoAALAJACALAACxCQAgDAAAsgkAIA4AALMJACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGMAwEA5wUAIY4DIADoBQAhogNAAIsGACGjA0AA6QUAIa4DAQD8BQAhAgAAALIBACA0AAC_AQAgCPoCAQDnBQAh_wJAAOkFACGLAwEA5wUAIYwDAQDnBQAhjgMgAOgFACGiA0AAiwYAIaMDQADpBQAhrgMBAPwFACECAAAAtQEAIDQAAMEBACACAAAAtQEAIDQAAMEBACADAAAAsgEAIDsAALoBACA8AAC_AQAgAQAAALIBACABAAAAtQEAIAUPAACtCQAgQQAArwkAIEIAAK4JACCiAwAAhAYAIK4DAACEBgAgC_cCAACpBQAw-AIAAMgBABD5AgAAqQUAMPoCAQCzBAAh_wJAALYEACGLAwEAtAQAIYwDAQC0BAAhjgMgALUEACGiA0AAywQAIaMDQAC2BAAhrgMBAMcEACEDAAAAtQEAIAIAAMcBADBAAADIAQAgAwAAALUBACACAAC2AQAwAwAAsgEAIAEAAAARACABAAAAEQAgAwAAAA8AIAIAABAAMAMAABEAIAMAAAAPACACAAAQADADAAARACADAAAADwAgAgAAEAAwAwAAEQAgCAEAAKwJACAJAADHBwAg-gIBAAAAAY4DIAAAAAG6AwEAAAAB5wMBAAAAAfMDAAAA8wMC9ANAAAAAAQE0AADQAQAgBvoCAQAAAAGOAyAAAAABugMBAAAAAecDAQAAAAHzAwAAAPMDAvQDQAAAAAEBNAAA0gEAMAE0AADSAQAwCAEAAKsJACAJAADFBwAg-gIBAOcFACGOAyAA6AUAIboDAQDnBQAh5wMBAOcFACHzAwAAwwfzAyL0A0AA6QUAIQIAAAARACA0AADVAQAgBvoCAQDnBQAhjgMgAOgFACG6AwEA5wUAIecDAQDnBQAh8wMAAMMH8wMi9ANAAOkFACECAAAADwAgNAAA1wEAIAIAAAAPACA0AADXAQAgAwAAABEAIDsAANABACA8AADVAQAgAQAAABEAIAEAAAAPACADDwAAqAkAIEEAAKoJACBCAACpCQAgCfcCAAClBQAw-AIAAN4BABD5AgAApQUAMPoCAQCzBAAhjgMgALUEACG6AwEAswQAIecDAQCzBAAh8wMAAKYF8wMi9ANAALYEACEDAAAADwAgAgAA3QEAMEAAAN4BACADAAAADwAgAgAAEAAwAwAAEQAgAQAAAFMAIAEAAABTACADAAAAOwAgAgAAUgAwAwAAUwAgAwAAADsAIAIAAFIAMAMAAFMAIAMAAAA7ACACAABSADADAABTACAIBAAA3AcAIAgAAIYIACD6AgEAAAAB-wIBAAAAAf8CQAAAAAGpAwEAAAAB8AMCAAAAAfEDAQAAAAEBNAAA5gEAIAb6AgEAAAAB-wIBAAAAAf8CQAAAAAGpAwEAAAAB8AMCAAAAAfEDAQAAAAEBNAAA6AEAMAE0AADoAQAwCAQAANoHACAIAACFCAAg-gIBAOcFACH7AgEA5wUAIf8CQADpBQAhqQMBAOcFACHwAwIA7QYAIfEDAQD8BQAhAgAAAFMAIDQAAOsBACAG-gIBAOcFACH7AgEA5wUAIf8CQADpBQAhqQMBAOcFACHwAwIA7QYAIfEDAQD8BQAhAgAAADsAIDQAAO0BACACAAAAOwAgNAAA7QEAIAMAAABTACA7AADmAQAgPAAA6wEAIAEAAABTACABAAAAOwAgBg8AAKMJACBBAACmCQAgQgAApQkAIFMAAKQJACBUAACnCQAg8QMAAIQGACAJ9wIAAKQFADD4AgAA9AEAEPkCAACkBQAw-gIBALMEACH7AgEAswQAIf8CQAC2BAAhqQMBALMEACHwAwIA6QQAIfEDAQDHBAAhAwAAADsAIAIAAPMBADBAAAD0AQAgAwAAADsAIAIAAFIAMAMAAFMAIAEAAAA1ACABAAAANQAgAwAAADMAIAIAADQAMAMAADUAIAMAAAAzACACAAA0ADADAAA1ACADAAAAMwAgAgAANAAwAwAANQAgCwQAAPEGACAbAACcCAAg-gIBAAAAAfsCAQAAAAH_AkAAAAAB4wMAAADsAwLqAwEAAAAB7AMBAAAAAe0DAQAAAAHuAwEAAAAB7wMCAAAAAQE0AAD8AQAgCfoCAQAAAAH7AgEAAAAB_wJAAAAAAeMDAAAA7AMC6gMBAAAAAewDAQAAAAHtAwEAAAAB7gMBAAAAAe8DAgAAAAEBNAAA_gEAMAE0AAD-AQAwCwQAAO8GACAbAACaCAAg-gIBAOcFACH7AgEA5wUAIf8CQADpBQAh4wMAAOwG7AMi6gMBAOcFACHsAwEA5wUAIe0DAQDnBQAh7gMBAOcFACHvAwIA7QYAIQIAAAA1ACA0AACBAgAgCfoCAQDnBQAh-wIBAOcFACH_AkAA6QUAIeMDAADsBuwDIuoDAQDnBQAh7AMBAOcFACHtAwEA5wUAIe4DAQDnBQAh7wMCAO0GACECAAAAMwAgNAAAgwIAIAIAAAAzACA0AACDAgAgAwAAADUAIDsAAPwBACA8AACBAgAgAQAAADUAIAEAAAAzACAFDwAAngkAIEEAAKEJACBCAACgCQAgUwAAnwkAIFQAAKIJACAM9wIAAKAFADD4AgAAigIAEPkCAACgBQAw-gIBALMEACH7AgEAswQAIf8CQAC2BAAh4wMAAKEF7AMi6gMBALMEACHsAwEAtAQAIe0DAQC0BAAh7gMBALQEACHvAwIA6QQAIQMAAAAzACACAACJAgAwQAAAigIAIAMAAAAzACACAAA0ADADAAA1ACABAAAAOQAgAQAAADkAIAMAAAA3ACACAAA4ADADAAA5ACADAAAANwAgAgAAOAAwAwAAOQAgAwAAADcAIAIAADgAMAMAADkAIAkBAACRCAAgBAAA4QYAIPoCAQAAAAH7AgEAAAAB_wJAAAAAAawDAAAA6QMC3gOAAAAAAecDAQAAAAHpA0AAAAABATQAAJICACAH-gIBAAAAAfsCAQAAAAH_AkAAAAABrAMAAADpAwLeA4AAAAAB5wMBAAAAAekDQAAAAAEBNAAAlAIAMAE0AACUAgAwCQEAAI8IACAEAADfBgAg-gIBAOcFACH7AgEA5wUAIf8CQADpBQAhrAMAAN0G6QMi3gOAAAAAAecDAQDnBQAh6QNAAIsGACECAAAAOQAgNAAAlwIAIAf6AgEA5wUAIfsCAQDnBQAh_wJAAOkFACGsAwAA3QbpAyLeA4AAAAAB5wMBAOcFACHpA0AAiwYAIQIAAAA3ACA0AACZAgAgAgAAADcAIDQAAJkCACADAAAAOQAgOwAAkgIAIDwAAJcCACABAAAAOQAgAQAAADcAIAQPAACbCQAgQQAAnQkAIEIAAJwJACDpAwAAhAYAIAr3AgAAnAUAMPgCAACgAgAQ-QIAAJwFADD6AgEAswQAIfsCAQCzBAAh_wJAALYEACGsAwAAnQXpAyLeAwAAkwUAIOcDAQCzBAAh6QNAAMsEACEDAAAANwAgAgAAnwIAMEAAAKACACADAAAANwAgAgAAOAAwAwAAOQAgAQAAAD8AIAEAAAA_ACADAAAAPQAgAgAAPgAwAwAAPwAgAwAAAD0AIAIAAD4AMAMAAD8AIAMAAAA9ACACAAA-ADADAAA_ACAOBAAAxQYAIB8AAP8HACAjAADGBgAg-gIBAAAAAfsCAQAAAAH_AkAAAAABnAMAAADlAwKjA0AAAAABzQMQAAAAAc4DAQAAAAHhAwEAAAAB4wMAAADjAwLlA0AAAAAB5gNAAAAAAQE0AACoAgAgC_oCAQAAAAH7AgEAAAAB_wJAAAAAAZwDAAAA5QMCowNAAAAAAc0DEAAAAAHOAwEAAAAB4QMBAAAAAeMDAAAA4wMC5QNAAAAAAeYDQAAAAAEBNAAAqgIAMAE0AACqAgAwDgQAAKUGACAfAAD9BwAgIwAApgYAIPoCAQDnBQAh-wIBAOcFACH_AkAA6QUAIZwDAACjBuUDIqMDQADpBQAhzQMQAKIGACHOAwEA5wUAIeEDAQDnBQAh4wMAAKEG4wMi5QNAAIsGACHmA0AAiwYAIQIAAAA_ACA0AACtAgAgC_oCAQDnBQAh-wIBAOcFACH_AkAA6QUAIZwDAACjBuUDIqMDQADpBQAhzQMQAKIGACHOAwEA5wUAIeEDAQDnBQAh4wMAAKEG4wMi5QNAAIsGACHmA0AAiwYAIQIAAAA9ACA0AACvAgAgAgAAAD0AIDQAAK8CACADAAAAPwAgOwAAqAIAIDwAAK0CACABAAAAPwAgAQAAAD0AIAcPAACWCQAgQQAAmQkAIEIAAJgJACBTAACXCQAgVAAAmgkAIOUDAACEBgAg5gMAAIQGACAO9wIAAJUFADD4AgAAtgIAEPkCAACVBQAw-gIBALMEACH7AgEAswQAIf8CQAC2BAAhnAMAAJcF5QMiowNAALYEACHNAxAAhgUAIc4DAQC0BAAh4QMBALMEACHjAwAAlgXjAyLlA0AAywQAIeYDQADLBAAhAwAAAD0AIAIAALUCADBAAAC2AgAgAwAAAD0AIAIAAD4AMAMAAD8AIAEAAABHACABAAAARwAgAwAAAEUAIAIAAEYAMAMAAEcAIAMAAABFACACAABGADADAABHACADAAAARQAgAgAARgAwAwAARwAgCSEAAJUJACD6AgEAAAAB_wJAAAAAAcoDAAAAygMC3AMBAAAAAd0DAQAAAAHeA4AAAAAB3wMgAAAAAeADQAAAAAEBNAAAvgIAIAj6AgEAAAAB_wJAAAAAAcoDAAAAygMC3AMBAAAAAd0DAQAAAAHeA4AAAAAB3wMgAAAAAeADQAAAAAEBNAAAwAIAMAE0AADAAgAwCSEAAJQJACD6AgEA5wUAIf8CQADpBQAhygMAALEGygMi3AMBAOcFACHdAwEA5wUAId4DgAAAAAHfAyAA6AUAIeADQACLBgAhAgAAAEcAIDQAAMMCACAI-gIBAOcFACH_AkAA6QUAIcoDAACxBsoDItwDAQDnBQAh3QMBAOcFACHeA4AAAAAB3wMgAOgFACHgA0AAiwYAIQIAAABFACA0AADFAgAgAgAAAEUAIDQAAMUCACADAAAARwAgOwAAvgIAIDwAAMMCACABAAAARwAgAQAAAEUAIAQPAACRCQAgQQAAkwkAIEIAAJIJACDgAwAAhAYAIAv3AgAAkgUAMPgCAADMAgAQ-QIAAJIFADD6AgEAswQAIf8CQAC2BAAhygMAAIQFygMi3AMBALMEACHdAwEAtAQAId4DAACTBQAg3wMgALUEACHgA0AAywQAIQMAAABFACACAADLAgAwQAAAzAIAIAMAAABFACACAABGADADAABHACABAAAAQwAgAQAAAEMAIAMAAABBACACAABCADADAABDACADAAAAQQAgAgAAQgAwAwAAQwAgAwAAAEEAIAIAAEIAMAMAAEMAIBEgAACQCQAgIgAAwwYAIPoCAQAAAAH_AkAAAAABnAMAAADUAwKjA0AAAAAByAMBAAAAAcoDAAAAygMCzAMAAADMAwLNAxAAAAABzgMBAAAAAc8DAQAAAAHQAwEAAAAB0QMBAAAAAdIDAQAAAAHUA4AAAAAB1QNAAAAAAQE0AADUAgAgD_oCAQAAAAH_AkAAAAABnAMAAADUAwKjA0AAAAAByAMBAAAAAcoDAAAAygMCzAMAAADMAwLNAxAAAAABzgMBAAAAAc8DAQAAAAHQAwEAAAAB0QMBAAAAAdIDAQAAAAHUA4AAAAAB1QNAAAAAAQE0AADWAgAwATQAANYCADARIAAAjwkAICIAALUGACD6AgEA5wUAIf8CQADpBQAhnAMAALMG1AMiowNAAOkFACHIAwEA5wUAIcoDAACxBsoDIswDAACyBswDIs0DEACiBgAhzgMBAOcFACHPAwEA5wUAIdADAQD8BQAh0QMBAPwFACHSAwEA_AUAIdQDgAAAAAHVA0AAiwYAIQIAAABDACA0AADZAgAgD_oCAQDnBQAh_wJAAOkFACGcAwAAswbUAyKjA0AA6QUAIcgDAQDnBQAhygMAALEGygMizAMAALIGzAMizQMQAKIGACHOAwEA5wUAIc8DAQDnBQAh0AMBAPwFACHRAwEA_AUAIdIDAQD8BQAh1AOAAAAAAdUDQACLBgAhAgAAAEEAIDQAANsCACACAAAAQQAgNAAA2wIAIAMAAABDACA7AADUAgAgPAAA2QIAIAEAAABDACABAAAAQQAgCg8AAIoJACBBAACNCQAgQgAAjAkAIFMAAIsJACBUAACOCQAg0AMAAIQGACDRAwAAhAYAINIDAACEBgAg1AMAAIQGACDVAwAAhAYAIBL3AgAAgwUAMPgCAADiAgAQ-QIAAIMFADD6AgEAswQAIf8CQAC2BAAhnAMAAIcF1AMiowNAALYEACHIAwEAswQAIcoDAACEBcoDIswDAACFBcwDIs0DEACGBQAhzgMBALQEACHPAwEAtAQAIdADAQDHBAAh0QMBAMcEACHSAwEAxwQAIdQDAACIBQAg1QNAAMsEACEDAAAAQQAgAgAA4QIAMEAAAOICACADAAAAQQAgAgAAQgAwAwAAQwAgAQAAACcAIAEAAAAnACADAAAAJAAgAgAAJgAwAwAAJwAgAwAAACQAIAIAACYAMAMAACcAIAMAAAAkACACAAAmADADAAAnACAJBAAAgQYAIBQAAMIIACD6AgEAAAAB-wIBAAAAAcMDAQAAAAHEAwEAAAABxQMBAAAAAcYDEAAAAAHHAxAAAAABATQAAOoCACAH-gIBAAAAAfsCAQAAAAHDAwEAAAABxAMBAAAAAcUDAQAAAAHGAxAAAAABxwMQAAAAAQE0AADsAgAwATQAAOwCADAJBAAA_wUAIBQAAMEIACD6AgEA5wUAIfsCAQDnBQAhwwMBAOcFACHEAwEA5wUAIcUDAQD8BQAhxgMQAP0FACHHAxAA_QUAIQIAAAAnACA0AADvAgAgB_oCAQDnBQAh-wIBAOcFACHDAwEA5wUAIcQDAQDnBQAhxQMBAPwFACHGAxAA_QUAIccDEAD9BQAhAgAAACQAIDQAAPECACACAAAAJAAgNAAA8QIAIAMAAAAnACA7AADqAgAgPAAA7wIAIAEAAAAnACABAAAAJAAgCA8AAIUJACBBAACICQAgQgAAhwkAIFMAAIYJACBUAACJCQAgxQMAAIQGACDGAwAAhAYAIMcDAACEBgAgCvcCAAD_BAAw-AIAAPgCABD5AgAA_wQAMPoCAQCzBAAh-wIBALMEACHDAwEAswQAIcQDAQC0BAAhxQMBAMcEACHGAxAAgAUAIccDEACABQAhAwAAACQAIAIAAPcCADBAAAD4AgAgAwAAACQAIAIAACYAMAMAACcAIAEAAAANACABAAAADQAgAwAAAAsAIAIAAAwAMAMAAA0AIAMAAAALACACAAAMADADAAANACADAAAACwAgAgAADAAwAwAADQAgCgQAAJwHACAFAACoBwAgBgAAnQcAIPoCAQAAAAH7AgEAAAAB_QIBAAAAAb8DAQAAAAHAAwEAAAABwQNAAAAAAcIDQAAAAAEBNAAAgAMAIAf6AgEAAAAB-wIBAAAAAf0CAQAAAAG_AwEAAAABwAMBAAAAAcEDQAAAAAHCA0AAAAABATQAAIIDADABNAAAggMAMAoEAACZBwAgBQAApgcAIAYAAJoHACD6AgEA5wUAIfsCAQDnBQAh_QIBAPwFACG_AwEA5wUAIcADAQDnBQAhwQNAAOkFACHCA0AAiwYAIQIAAAANACA0AACFAwAgB_oCAQDnBQAh-wIBAOcFACH9AgEA_AUAIb8DAQDnBQAhwAMBAOcFACHBA0AA6QUAIcIDQACLBgAhAgAAAAsAIDQAAIcDACACAAAACwAgNAAAhwMAIAMAAAANACA7AACAAwAgPAAAhQMAIAEAAAANACABAAAACwAgBQ8AAIIJACBBAACECQAgQgAAgwkAIP0CAACEBgAgwgMAAIQGACAK9wIAAP4EADD4AgAAjgMAEPkCAAD-BAAw-gIBALMEACH7AgEAswQAIf0CAQDHBAAhvwMBALMEACHAAwEAswQAIcEDQAC2BAAhwgNAAMsEACEDAAAACwAgAgAAjQMAMEAAAI4DACADAAAACwAgAgAADAAwAwAADQAgAQAAABoAIAEAAAAaACADAAAAGAAgAgAAGQAwAwAAGgAgAwAAABgAIAIAABkAMAMAABoAIAMAAAAYACACAAAZADADAAAaACAKBAAAtwcAIAkAALgHACANAAC7CAAg-gIBAAAAAfsCAQAAAAG6AwEAAAABuwMBAAAAAbwDAQAAAAG9A0AAAAABvgNAAAAAAQE0AACWAwAgB_oCAQAAAAH7AgEAAAABugMBAAAAAbsDAQAAAAG8AwEAAAABvQNAAAAAAb4DQAAAAAEBNAAAmAMAMAE0AACYAwAwCgQAALQHACAJAAC1BwAgDQAAuQgAIPoCAQDnBQAh-wIBAOcFACG6AwEA5wUAIbsDAQDnBQAhvAMBAPwFACG9A0AA6QUAIb4DQACLBgAhAgAAABoAIDQAAJsDACAH-gIBAOcFACH7AgEA5wUAIboDAQDnBQAhuwMBAOcFACG8AwEA_AUAIb0DQADpBQAhvgNAAIsGACECAAAAGAAgNAAAnQMAIAIAAAAYACA0AACdAwAgAwAAABoAIDsAAJYDACA8AACbAwAgAQAAABoAIAEAAAAYACAFDwAA_wgAIEEAAIEJACBCAACACQAgvAMAAIQGACC-AwAAhAYAIAr3AgAA_QQAMPgCAACkAwAQ-QIAAP0EADD6AgEAswQAIfsCAQCzBAAhugMBALMEACG7AwEAswQAIbwDAQDHBAAhvQNAALYEACG-A0AAywQAIQMAAAAYACACAACjAwAwQAAApAMAIAMAAAAYACACAAAZADADAAAaACABAAAALQAgAQAAAC0AIAMAAAArACACAAAsADADAAAtACADAAAAKwAgAgAALAAwAwAALQAgAwAAACsAIAIAACwAMAMAAC0AIAkEAACNBwAgFwAAsAgAIPoCAQAAAAH7AgEAAAAB_QIBAAAAAf8CQAAAAAG3AwEAAAABuAMAAACyAwO5AwAAALIDAgE0AACsAwAgB_oCAQAAAAH7AgEAAAAB_QIBAAAAAf8CQAAAAAG3AwEAAAABuAMAAACyAwO5AwAAALIDAgE0AACuAwAwATQAAK4DADAJBAAAiwcAIBcAAK4IACD6AgEA5wUAIfsCAQDnBQAh_QIBAPwFACH_AkAA6QUAIbcDAQDnBQAhuAMAAIgHsgMjuQMAAIkHsgMiAgAAAC0AIDQAALEDACAH-gIBAOcFACH7AgEA5wUAIf0CAQD8BQAh_wJAAOkFACG3AwEA5wUAIbgDAACIB7IDI7kDAACJB7IDIgIAAAArACA0AACzAwAgAgAAACsAIDQAALMDACADAAAALQAgOwAArAMAIDwAALEDACABAAAALQAgAQAAACsAIAUPAAD8CAAgQQAA_ggAIEIAAP0IACD9AgAAhAYAILgDAACEBgAgCvcCAAD5BAAw-AIAALoDABD5AgAA-QQAMPoCAQCzBAAh-wIBALMEACH9AgEAxwQAIf8CQAC2BAAhtwMBALMEACG4AwAA-gSyAyO5AwAA8gSyAyIDAAAAKwAgAgAAuQMAMEAAALoDACADAAAAKwAgAgAALAAwAwAALQAgAQAAAAkAIAEAAAAJACADAAAABwAgAgAACAAwAwAACQAgAwAAAAcAIAIAAAgAMAMAAAkAIAMAAAAHACACAAAIADADAAAJACAeBwAAzQgAIAgAAPsIACAQAADOCAAgEgAAzwgAIBUAANAIACAWAADRCAAgGAAA0ggAIBoAANMIACAcAADUCAAgHQAA1QgAIB4AANYIACAkAADXCAAg-gIBAAAAAf8CQAAAAAGcAwAAALIDAqIDQAAAAAGjA0AAAAABpAMBAAAAAagDAQAAAAGpAwEAAAABqgMBAAAAAawDAAAArAMCrQMBAAAAAa4DAQAAAAGwAwAAALADArIDQAAAAAGzA0AAAAABtANAAAAAAbUDQAAAAAG2A0AAAAABATQAAMIDACAS-gIBAAAAAf8CQAAAAAGcAwAAALIDAqIDQAAAAAGjA0AAAAABpAMBAAAAAagDAQAAAAGpAwEAAAABqgMBAAAAAawDAAAArAMCrQMBAAAAAa4DAQAAAAGwAwAAALADArIDQAAAAAGzA0AAAAABtANAAAAAAbUDQAAAAAG2A0AAAAABATQAAMQDADABNAAAxAMAMB4HAADqBwAgCAAA-ggAIBAAAOsHACASAADsBwAgFQAA7QcAIBYAAO4HACAYAADvBwAgGgAA8AcAIBwAAPEHACAdAADyBwAgHgAA8wcAICQAAPQHACD6AgEA5wUAIf8CQADpBQAhnAMAAIkHsgMiogNAAIsGACGjA0AA6QUAIaQDAQDnBQAhqAMBAOcFACGpAwEA5wUAIaoDAQDnBQAhrAMAAOcHrAMirQMBAOcFACGuAwEA5wUAIbADAADoB7ADIrIDQACLBgAhswNAAIsGACG0A0AAiwYAIbUDQACLBgAhtgNAAIsGACECAAAACQAgNAAAxwMAIBL6AgEA5wUAIf8CQADpBQAhnAMAAIkHsgMiogNAAIsGACGjA0AA6QUAIaQDAQDnBQAhqAMBAOcFACGpAwEA5wUAIaoDAQDnBQAhrAMAAOcHrAMirQMBAOcFACGuAwEA5wUAIbADAADoB7ADIrIDQACLBgAhswNAAIsGACG0A0AAiwYAIbUDQACLBgAhtgNAAIsGACECAAAABwAgNAAAyQMAIAIAAAAHACA0AADJAwAgAwAAAAkAIDsAAMIDACA8AADHAwAgAQAAAAkAIAEAAAAHACAJDwAA9wgAIEEAAPkIACBCAAD4CAAgogMAAIQGACCyAwAAhAYAILMDAACEBgAgtAMAAIQGACC1AwAAhAYAILYDAACEBgAgFfcCAADvBAAw-AIAANADABD5AgAA7wQAMPoCAQCzBAAh_wJAALYEACGcAwAA8gSyAyKiA0AAywQAIaMDQAC2BAAhpAMBALMEACGoAwEAtAQAIakDAQCzBAAhqgMBALMEACGsAwAA8ASsAyKtAwEAtAQAIa4DAQC0BAAhsAMAAPEEsAMisgNAAMsEACGzA0AAywQAIbQDQADLBAAhtQNAAMsEACG2A0AAywQAIQMAAAAHACACAADPAwAwQAAA0AMAIAMAAAAHACACAAAIADADAAAJACAKEAAA7gQAIPcCAADsBAAw-AIAACEAEPkCAADsBAAw-gIBAAAAAY4DIADDBAAhpAMBAAAAAaUDAgDtBAAhpgMCAO0EACGnAwIA7QQAIQEAAADTAwAgAQAAANMDACABEAAA9ggAIAMAAAAhACACAADWAwAwAwAA0wMAIAMAAAAhACACAADWAwAwAwAA0wMAIAMAAAAhACACAADWAwAwAwAA0wMAIAcQAAD1CAAg-gIBAAAAAY4DIAAAAAGkAwEAAAABpQMCAAAAAaYDAgAAAAGnAwIAAAABATQAANoDACAG-gIBAAAAAY4DIAAAAAGkAwEAAAABpQMCAAAAAaYDAgAAAAGnAwIAAAABATQAANwDADABNAAA3AMAMAcQAAD0CAAg-gIBAOcFACGOAyAA6AUAIaQDAQDnBQAhpQMCAO0GACGmAwIA7QYAIacDAgDtBgAhAgAAANMDACA0AADfAwAgBvoCAQDnBQAhjgMgAOgFACGkAwEA5wUAIaUDAgDtBgAhpgMCAO0GACGnAwIA7QYAIQIAAAAhACA0AADhAwAgAgAAACEAIDQAAOEDACADAAAA0wMAIDsAANoDACA8AADfAwAgAQAAANMDACABAAAAIQAgBQ8AAO8IACBBAADyCAAgQgAA8QgAIFMAAPAIACBUAADzCAAgCfcCAADoBAAw-AIAAOgDABD5AgAA6AQAMPoCAQCzBAAhjgMgALUEACGkAwEAswQAIaUDAgDpBAAhpgMCAOkEACGnAwIA6QQAIQMAAAAhACACAADnAwAwQAAA6AMAIAMAAAAhACACAADWAwAwAwAA0wMAICAIAADeBAAgGgAA4wQAIB0AAOUEACAmAADfBAAgJwAA4AQAICgAAOEEACApAADhBAAgKgAA4gQAICsAAOQEACAsAADmBAAgLQAA5wQAIPcCAADXBAAw-AIAAAMAEPkCAADXBAAw-gIBAAAAAf8CQADdBAAhiwMBAMIEACGSAwEAAAABkwMBANgEACGUAwEAAAABlQMBAAAAAZYDAQAAAAGYAwAA2QSYAyKaAwAA2gSaAyKcAwAA2wScAyKdAyAAwwQAIZ4DAQDYBAAhnwMBANgEACGgAyAAwwQAIaEDIADDBAAhogNAANwEACGjA0AA3QQAIQEAAADrAwAgAQAAAOsDACASCAAA5QgAIBoAAOoIACAdAADsCAAgJgAA5ggAICcAAOcIACAoAADoCAAgKQAA6AgAICoAAOkIACArAADrCAAgLAAA7QgAIC0AAO4IACCTAwAAhAYAIJQDAACEBgAglQMAAIQGACCWAwAAhAYAIJ4DAACEBgAgnwMAAIQGACCiAwAAhAYAIAMAAAADACACAADuAwAwAwAA6wMAIAMAAAADACACAADuAwAwAwAA6wMAIAMAAAADACACAADuAwAwAwAA6wMAIB0IAADaCAAgGgAA4AgAIB0AAOIIACAmAADbCAAgJwAA3AgAICgAAN0IACApAADeCAAgKgAA3wgAICsAAOEIACAsAADjCAAgLQAA5AgAIPoCAQAAAAH_AkAAAAABiwMBAAAAAZIDAQAAAAGTAwEAAAABlAMBAAAAAZUDAQAAAAGWAwEAAAABmAMAAACYAwKaAwAAAJoDApwDAAAAnAMCnQMgAAAAAZ4DAQAAAAGfAwEAAAABoAMgAAAAAaEDIAAAAAGiA0AAAAABowNAAAAAAQE0AADyAwAgEvoCAQAAAAH_AkAAAAABiwMBAAAAAZIDAQAAAAGTAwEAAAABlAMBAAAAAZUDAQAAAAGWAwEAAAABmAMAAACYAwKaAwAAAJoDApwDAAAAnAMCnQMgAAAAAZ4DAQAAAAGfAwEAAAABoAMgAAAAAaEDIAAAAAGiA0AAAAABowNAAAAAAQE0AAD0AwAwATQAAPQDADAdCAAAjAYAIBoAAJIGACAdAACUBgAgJgAAjQYAICcAAI4GACAoAACPBgAgKQAAkAYAICoAAJEGACArAACTBgAgLAAAlQYAIC0AAJYGACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGSAwEA5wUAIZMDAQD8BQAhlAMBAPwFACGVAwEA_AUAIZYDAQD8BQAhmAMAAIgGmAMimgMAAIkGmgMinAMAAIoGnAMinQMgAOgFACGeAwEA_AUAIZ8DAQD8BQAhoAMgAOgFACGhAyAA6AUAIaIDQACLBgAhowNAAOkFACECAAAA6wMAIDQAAPcDACAS-gIBAOcFACH_AkAA6QUAIYsDAQDnBQAhkgMBAOcFACGTAwEA_AUAIZQDAQD8BQAhlQMBAPwFACGWAwEA_AUAIZgDAACIBpgDIpoDAACJBpoDIpwDAACKBpwDIp0DIADoBQAhngMBAPwFACGfAwEA_AUAIaADIADoBQAhoQMgAOgFACGiA0AAiwYAIaMDQADpBQAhAgAAAAMAIDQAAPkDACACAAAAAwAgNAAA-QMAIAMAAADrAwAgOwAA8gMAIDwAAPcDACABAAAA6wMAIAEAAAADACAKDwAAhQYAIEEAAIcGACBCAACGBgAgkwMAAIQGACCUAwAAhAYAIJUDAACEBgAglgMAAIQGACCeAwAAhAYAIJ8DAACEBgAgogMAAIQGACAV9wIAAMYEADD4AgAAgAQAEPkCAADGBAAw-gIBALMEACH_AkAAtgQAIYsDAQC0BAAhkgMBALQEACGTAwEAxwQAIZQDAQDHBAAhlQMBAMcEACGWAwEAxwQAIZgDAADIBJgDIpoDAADJBJoDIpwDAADKBJwDIp0DIAC1BAAhngMBAMcEACGfAwEAxwQAIaADIAC1BAAhoQMgALUEACGiA0AAywQAIaMDQAC2BAAhAwAAAAMAIAIAAP8DADBAAACABAAgAwAAAAMAIAIAAO4DADADAADrAwAgCRMAAMQEACD3AgAAwAQAMPgCAACGBAAQ-QIAAMAEADD6AgEAAAABiwMBAMIEACGMAwEAAAABjQMBAMIEACGOAyAAwwQAIQEAAACDBAAgAQAAAIMEACAJEwAAxAQAIPcCAADABAAw-AIAAIYEABD5AgAAwAQAMPoCAQDBBAAhiwMBAMIEACGMAwEAwgQAIY0DAQDCBAAhjgMgAMMEACEBEwAAgwYAIAMAAACGBAAgAgAAhwQAMAMAAIMEACADAAAAhgQAIAIAAIcEADADAACDBAAgAwAAAIYEACACAACHBAAwAwAAgwQAIAYTAACCBgAg-gIBAAAAAYsDAQAAAAGMAwEAAAABjQMBAAAAAY4DIAAAAAEBNAAAiwQAIAX6AgEAAAABiwMBAAAAAYwDAQAAAAGNAwEAAAABjgMgAAAAAQE0AACNBAAwATQAAI0EADAGEwAA8QUAIPoCAQDnBQAhiwMBAOcFACGMAwEA5wUAIY0DAQDnBQAhjgMgAOgFACECAAAAgwQAIDQAAJAEACAF-gIBAOcFACGLAwEA5wUAIYwDAQDnBQAhjQMBAOcFACGOAyAA6AUAIQIAAACGBAAgNAAAkgQAIAIAAACGBAAgNAAAkgQAIAMAAACDBAAgOwAAiwQAIDwAAJAEACABAAAAgwQAIAEAAACGBAAgAw8AAO4FACBBAADwBQAgQgAA7wUAIAj3AgAAvwQAMPgCAACZBAAQ-QIAAL8EADD6AgEAswQAIYsDAQC0BAAhjAMBALQEACGNAwEAtAQAIY4DIAC1BAAhAwAAAIYEACACAACYBAAwQAAAmQQAIAMAAACGBAAgAgAAhwQAMAMAAIMEACABAAAAMQAgAQAAADEAIAMAAAAvACACAAAwADADAAAxACADAAAALwAgAgAAMAAwAwAAMQAgAwAAAC8AIAIAADAAMAMAADEAIAgEAADsBQAgGQAA7QUAIPoCAQAAAAH7AgEAAAAB_AIBAAAAAf0CAQAAAAH-AiAAAAAB_wJAAAAAAQE0AAChBAAgBvoCAQAAAAH7AgEAAAAB_AIBAAAAAf0CAQAAAAH-AiAAAAAB_wJAAAAAAQE0AACjBAAwATQAAKMEADAIBAAA6gUAIBkAAOsFACD6AgEA5wUAIfsCAQDnBQAh_AIBAOcFACH9AgEA5wUAIf4CIADoBQAh_wJAAOkFACECAAAAMQAgNAAApgQAIAb6AgEA5wUAIfsCAQDnBQAh_AIBAOcFACH9AgEA5wUAIf4CIADoBQAh_wJAAOkFACECAAAALwAgNAAAqAQAIAIAAAAvACA0AACoBAAgAwAAADEAIDsAAKEEACA8AACmBAAgAQAAADEAIAEAAAAvACADDwAA5AUAIEEAAOYFACBCAADlBQAgCfcCAACyBAAw-AIAAK8EABD5AgAAsgQAMPoCAQCzBAAh-wIBALMEACH8AgEAswQAIf0CAQC0BAAh_gIgALUEACH_AkAAtgQAIQMAAAAvACACAACuBAAwQAAArwQAIAMAAAAvACACAAAwADADAAAxACAJ9wIAALIEADD4AgAArwQAEPkCAACyBAAw-gIBALMEACH7AgEAswQAIfwCAQCzBAAh_QIBALQEACH-AiAAtQQAIf8CQAC2BAAhCw8AALgEACBBAAC9BAAgQgAAvQQAIIADAQAAAAGBAwEAAAAEggMBAAAABIMDAQAAAAGEAwEAAAABhQMBAAAAAYYDAQAAAAGHAwEAvgQAIQ4PAAC4BAAgQQAAvQQAIEIAAL0EACCAAwEAAAABgQMBAAAABIIDAQAAAASDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwEAAAABhwMBALwEACGIAwEAAAABiQMBAAAAAYoDAQAAAAEFDwAAuAQAIEEAALsEACBCAAC7BAAggAMgAAAAAYcDIAC6BAAhCw8AALgEACBBAAC5BAAgQgAAuQQAIIADQAAAAAGBA0AAAAAEggNAAAAABIMDQAAAAAGEA0AAAAABhQNAAAAAAYYDQAAAAAGHA0AAtwQAIQsPAAC4BAAgQQAAuQQAIEIAALkEACCAA0AAAAABgQNAAAAABIIDQAAAAASDA0AAAAABhANAAAAAAYUDQAAAAAGGA0AAAAABhwNAALcEACEIgAMCAAAAAYEDAgAAAASCAwIAAAAEgwMCAAAAAYQDAgAAAAGFAwIAAAABhgMCAAAAAYcDAgC4BAAhCIADQAAAAAGBA0AAAAAEggNAAAAABIMDQAAAAAGEA0AAAAABhQNAAAAAAYYDQAAAAAGHA0AAuQQAIQUPAAC4BAAgQQAAuwQAIEIAALsEACCAAyAAAAABhwMgALoEACECgAMgAAAAAYcDIAC7BAAhDg8AALgEACBBAAC9BAAgQgAAvQQAIIADAQAAAAGBAwEAAAAEggMBAAAABIMDAQAAAAGEAwEAAAABhQMBAAAAAYYDAQAAAAGHAwEAvAQAIYgDAQAAAAGJAwEAAAABigMBAAAAAQuAAwEAAAABgQMBAAAABIIDAQAAAASDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwEAAAABhwMBAL0EACGIAwEAAAABiQMBAAAAAYoDAQAAAAELDwAAuAQAIEEAAL0EACBCAAC9BAAggAMBAAAAAYEDAQAAAASCAwEAAAAEgwMBAAAAAYQDAQAAAAGFAwEAAAABhgMBAAAAAYcDAQC-BAAhCPcCAAC_BAAw-AIAAJkEABD5AgAAvwQAMPoCAQCzBAAhiwMBALQEACGMAwEAtAQAIY0DAQC0BAAhjgMgALUEACEJEwAAxAQAIPcCAADABAAw-AIAAIYEABD5AgAAwAQAMPoCAQDBBAAhiwMBAMIEACGMAwEAwgQAIY0DAQDCBAAhjgMgAMMEACEIgAMBAAAAAYEDAQAAAASCAwEAAAAEgwMBAAAAAYQDAQAAAAGFAwEAAAABhgMBAAAAAYcDAQDFBAAhC4ADAQAAAAGBAwEAAAAEggMBAAAABIMDAQAAAAGEAwEAAAABhQMBAAAAAYYDAQAAAAGHAwEAvQQAIYgDAQAAAAGJAwEAAAABigMBAAAAAQKAAyAAAAABhwMgALsEACEDjwMAACQAIJADAAAkACCRAwAAJAAgCIADAQAAAAGBAwEAAAAEggMBAAAABIMDAQAAAAGEAwEAAAABhQMBAAAAAYYDAQAAAAGHAwEAxQQAIRX3AgAAxgQAMPgCAACABAAQ-QIAAMYEADD6AgEAswQAIf8CQAC2BAAhiwMBALQEACGSAwEAtAQAIZMDAQDHBAAhlAMBAMcEACGVAwEAxwQAIZYDAQDHBAAhmAMAAMgEmAMimgMAAMkEmgMinAMAAMoEnAMinQMgALUEACGeAwEAxwQAIZ8DAQDHBAAhoAMgALUEACGhAyAAtQQAIaIDQADLBAAhowNAALYEACEODwAAzQQAIEEAANYEACBCAADWBAAggAMBAAAAAYEDAQAAAAWCAwEAAAAFgwMBAAAAAYQDAQAAAAGFAwEAAAABhgMBAAAAAYcDAQDVBAAhiAMBAAAAAYkDAQAAAAGKAwEAAAABBw8AALgEACBBAADUBAAgQgAA1AQAIIADAAAAmAMCgQMAAACYAwiCAwAAAJgDCIcDAADTBJgDIgcPAAC4BAAgQQAA0gQAIEIAANIEACCAAwAAAJoDAoEDAAAAmgMIggMAAACaAwiHAwAA0QSaAyIHDwAAuAQAIEEAANAEACBCAADQBAAggAMAAACcAwKBAwAAAJwDCIIDAAAAnAMIhwMAAM8EnAMiCw8AAM0EACBBAADOBAAgQgAAzgQAIIADQAAAAAGBA0AAAAAFggNAAAAABYMDQAAAAAGEA0AAAAABhQNAAAAAAYYDQAAAAAGHA0AAzAQAIQsPAADNBAAgQQAAzgQAIEIAAM4EACCAA0AAAAABgQNAAAAABYIDQAAAAAWDA0AAAAABhANAAAAAAYUDQAAAAAGGA0AAAAABhwNAAMwEACEIgAMCAAAAAYEDAgAAAAWCAwIAAAAFgwMCAAAAAYQDAgAAAAGFAwIAAAABhgMCAAAAAYcDAgDNBAAhCIADQAAAAAGBA0AAAAAFggNAAAAABYMDQAAAAAGEA0AAAAABhQNAAAAAAYYDQAAAAAGHA0AAzgQAIQcPAAC4BAAgQQAA0AQAIEIAANAEACCAAwAAAJwDAoEDAAAAnAMIggMAAACcAwiHAwAAzwScAyIEgAMAAACcAwKBAwAAAJwDCIIDAAAAnAMIhwMAANAEnAMiBw8AALgEACBBAADSBAAgQgAA0gQAIIADAAAAmgMCgQMAAACaAwiCAwAAAJoDCIcDAADRBJoDIgSAAwAAAJoDAoEDAAAAmgMIggMAAACaAwiHAwAA0gSaAyIHDwAAuAQAIEEAANQEACBCAADUBAAggAMAAACYAwKBAwAAAJgDCIIDAAAAmAMIhwMAANMEmAMiBIADAAAAmAMCgQMAAACYAwiCAwAAAJgDCIcDAADUBJgDIg4PAADNBAAgQQAA1gQAIEIAANYEACCAAwEAAAABgQMBAAAABYIDAQAAAAWDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwEAAAABhwMBANUEACGIAwEAAAABiQMBAAAAAYoDAQAAAAELgAMBAAAAAYEDAQAAAAWCAwEAAAAFgwMBAAAAAYQDAQAAAAGFAwEAAAABhgMBAAAAAYcDAQDWBAAhiAMBAAAAAYkDAQAAAAGKAwEAAAABIAgAAN4EACAaAADjBAAgHQAA5QQAICYAAN8EACAnAADgBAAgKAAA4QQAICkAAOEEACAqAADiBAAgKwAA5AQAICwAAOYEACAtAADnBAAg9wIAANcEADD4AgAAAwAQ-QIAANcEADD6AgEAwQQAIf8CQADdBAAhiwMBAMIEACGSAwEAwgQAIZMDAQDYBAAhlAMBANgEACGVAwEA2AQAIZYDAQDYBAAhmAMAANkEmAMimgMAANoEmgMinAMAANsEnAMinQMgAMMEACGeAwEA2AQAIZ8DAQDYBAAhoAMgAMMEACGhAyAAwwQAIaIDQADcBAAhowNAAN0EACELgAMBAAAAAYEDAQAAAAWCAwEAAAAFgwMBAAAAAYQDAQAAAAGFAwEAAAABhgMBAAAAAYcDAQDWBAAhiAMBAAAAAYkDAQAAAAGKAwEAAAABBIADAAAAmAMCgQMAAACYAwiCAwAAAJgDCIcDAADUBJgDIgSAAwAAAJoDAoEDAAAAmgMIggMAAACaAwiHAwAA0gSaAyIEgAMAAACcAwKBAwAAAJwDCIIDAAAAnAMIhwMAANAEnAMiCIADQAAAAAGBA0AAAAAFggNAAAAABYMDQAAAAAGEA0AAAAABhQNAAAAAAYYDQAAAAAGHA0AAzgQAIQiAA0AAAAABgQNAAAAABIIDQAAAAASDA0AAAAABhANAAAAAAYUDQAAAAAGGA0AAAAABhwNAALkEACESAQAArwUAIAwAAKwFACAlAACwBQAg9wIAAK4FADD4AgAABQAQ-QIAAK4FADD6AgEAwQQAIf8CQADdBAAhiwMBAMIEACGSAwEAwgQAIaEDIADDBAAhogNAANwEACGjA0AA3QQAIecDAQDBBAAh9QMBANgEACH2AwEA2AQAIYMEAAAFACCEBAAABQAgA48DAAAPACCQAwAADwAgkQMAAA8AIAOPAwAAGAAgkAMAABgAIJEDAAAYACADjwMAAAsAIJADAAALACCRAwAACwAgA48DAAArACCQAwAAKwAgkQMAACsAIAOPAwAALwAgkAMAAC8AIJEDAAAvACADjwMAADMAIJADAAAzACCRAwAAMwAgA48DAAA3ACCQAwAANwAgkQMAADcAIAOPAwAAXwAgkAMAAF8AIJEDAABfACADjwMAAD0AIJADAAA9ACCRAwAAPQAgCfcCAADoBAAw-AIAAOgDABD5AgAA6AQAMPoCAQCzBAAhjgMgALUEACGkAwEAswQAIaUDAgDpBAAhpgMCAOkEACGnAwIA6QQAIQ0PAAC4BAAgQQAAuAQAIEIAALgEACBTAADrBAAgVAAAuAQAIIADAgAAAAGBAwIAAAAEggMCAAAABIMDAgAAAAGEAwIAAAABhQMCAAAAAYYDAgAAAAGHAwIA6gQAIQ0PAAC4BAAgQQAAuAQAIEIAALgEACBTAADrBAAgVAAAuAQAIIADAgAAAAGBAwIAAAAEggMCAAAABIMDAgAAAAGEAwIAAAABhQMCAAAAAYYDAgAAAAGHAwIA6gQAIQiAAwgAAAABgQMIAAAABIIDCAAAAASDAwgAAAABhAMIAAAAAYUDCAAAAAGGAwgAAAABhwMIAOsEACEKEAAA7gQAIPcCAADsBAAw-AIAACEAEPkCAADsBAAw-gIBAMEEACGOAyAAwwQAIaQDAQDBBAAhpQMCAO0EACGmAwIA7QQAIacDAgDtBAAhCIADAgAAAAGBAwIAAAAEggMCAAAABIMDAgAAAAGEAwIAAAABhQMCAAAAAYYDAgAAAAGHAwIAuAQAIRMJAADXBQAgDAAArAUAIBEAANoFACD3AgAA2QUAMPgCAAATABD5AgAA2QUAMPoCAQDBBAAh_wJAAN0EACGLAwEAwgQAIY4DIADDBAAhogNAANwEACGjA0AA3QQAIa4DAQDYBAAhugMBAMEEACHOAwEAwgQAIfcDIADDBAAh-AMQANQFACGDBAAAEwAghAQAABMAIBX3AgAA7wQAMPgCAADQAwAQ-QIAAO8EADD6AgEAswQAIf8CQAC2BAAhnAMAAPIEsgMiogNAAMsEACGjA0AAtgQAIaQDAQCzBAAhqAMBALQEACGpAwEAswQAIaoDAQCzBAAhrAMAAPAErAMirQMBALQEACGuAwEAtAQAIbADAADxBLADIrIDQADLBAAhswNAAMsEACG0A0AAywQAIbUDQADLBAAhtgNAAMsEACEHDwAAuAQAIEEAAPgEACBCAAD4BAAggAMAAACsAwKBAwAAAKwDCIIDAAAArAMIhwMAAPcErAMiBw8AALgEACBBAAD2BAAgQgAA9gQAIIADAAAAsAMCgQMAAACwAwiCAwAAALADCIcDAAD1BLADIgcPAAC4BAAgQQAA9AQAIEIAAPQEACCAAwAAALIDAoEDAAAAsgMIggMAAACyAwiHAwAA8wSyAyIHDwAAuAQAIEEAAPQEACBCAAD0BAAggAMAAACyAwKBAwAAALIDCIIDAAAAsgMIhwMAAPMEsgMiBIADAAAAsgMCgQMAAACyAwiCAwAAALIDCIcDAAD0BLIDIgcPAAC4BAAgQQAA9gQAIEIAAPYEACCAAwAAALADAoEDAAAAsAMIggMAAACwAwiHAwAA9QSwAyIEgAMAAACwAwKBAwAAALADCIIDAAAAsAMIhwMAAPYEsAMiBw8AALgEACBBAAD4BAAgQgAA-AQAIIADAAAArAMCgQMAAACsAwiCAwAAAKwDCIcDAAD3BKwDIgSAAwAAAKwDAoEDAAAArAMIggMAAACsAwiHAwAA-ASsAyIK9wIAAPkEADD4AgAAugMAEPkCAAD5BAAw-gIBALMEACH7AgEAswQAIf0CAQDHBAAh_wJAALYEACG3AwEAswQAIbgDAAD6BLIDI7kDAADyBLIDIgcPAADNBAAgQQAA_AQAIEIAAPwEACCAAwAAALIDA4EDAAAAsgMJggMAAACyAwmHAwAA-wSyAyMHDwAAzQQAIEEAAPwEACBCAAD8BAAggAMAAACyAwOBAwAAALIDCYIDAAAAsgMJhwMAAPsEsgMjBIADAAAAsgMDgQMAAACyAwmCAwAAALIDCYcDAAD8BLIDIwr3AgAA_QQAMPgCAACkAwAQ-QIAAP0EADD6AgEAswQAIfsCAQCzBAAhugMBALMEACG7AwEAswQAIbwDAQDHBAAhvQNAALYEACG-A0AAywQAIQr3AgAA_gQAMPgCAACOAwAQ-QIAAP4EADD6AgEAswQAIfsCAQCzBAAh_QIBAMcEACG_AwEAswQAIcADAQCzBAAhwQNAALYEACHCA0AAywQAIQr3AgAA_wQAMPgCAAD4AgAQ-QIAAP8EADD6AgEAswQAIfsCAQCzBAAhwwMBALMEACHEAwEAtAQAIcUDAQDHBAAhxgMQAIAFACHHAxAAgAUAIQ0PAADNBAAgQQAAggUAIEIAAIIFACBTAACCBQAgVAAAggUAIIADEAAAAAGBAxAAAAAFggMQAAAABYMDEAAAAAGEAxAAAAABhQMQAAAAAYYDEAAAAAGHAxAAgQUAIQ0PAADNBAAgQQAAggUAIEIAAIIFACBTAACCBQAgVAAAggUAIIADEAAAAAGBAxAAAAAFggMQAAAABYMDEAAAAAGEAxAAAAABhQMQAAAAAYYDEAAAAAGHAxAAgQUAIQiAAxAAAAABgQMQAAAABYIDEAAAAAWDAxAAAAABhAMQAAAAAYUDEAAAAAGGAxAAAAABhwMQAIIFACES9wIAAIMFADD4AgAA4gIAEPkCAACDBQAw-gIBALMEACH_AkAAtgQAIZwDAACHBdQDIqMDQAC2BAAhyAMBALMEACHKAwAAhAXKAyLMAwAAhQXMAyLNAxAAhgUAIc4DAQC0BAAhzwMBALQEACHQAwEAxwQAIdEDAQDHBAAh0gMBAMcEACHUAwAAiAUAINUDQADLBAAhBw8AALgEACBBAACRBQAgQgAAkQUAIIADAAAAygMCgQMAAADKAwiCAwAAAMoDCIcDAACQBcoDIgcPAAC4BAAgQQAAjwUAIEIAAI8FACCAAwAAAMwDAoEDAAAAzAMIggMAAADMAwiHAwAAjgXMAyINDwAAuAQAIEEAAI0FACBCAACNBQAgUwAAjQUAIFQAAI0FACCAAxAAAAABgQMQAAAABIIDEAAAAASDAxAAAAABhAMQAAAAAYUDEAAAAAGGAxAAAAABhwMQAIwFACEHDwAAuAQAIEEAAIsFACBCAACLBQAggAMAAADUAwKBAwAAANQDCIIDAAAA1AMIhwMAAIoF1AMiDw8AAM0EACBBAACJBQAgQgAAiQUAIIADgAAAAAGDA4AAAAABhAOAAAAAAYUDgAAAAAGGA4AAAAABhwOAAAAAAdYDAQAAAAHXAwEAAAAB2AMBAAAAAdkDgAAAAAHaA4AAAAAB2wOAAAAAAQyAA4AAAAABgwOAAAAAAYQDgAAAAAGFA4AAAAABhgOAAAAAAYcDgAAAAAHWAwEAAAAB1wMBAAAAAdgDAQAAAAHZA4AAAAAB2gOAAAAAAdsDgAAAAAEHDwAAuAQAIEEAAIsFACBCAACLBQAggAMAAADUAwKBAwAAANQDCIIDAAAA1AMIhwMAAIoF1AMiBIADAAAA1AMCgQMAAADUAwiCAwAAANQDCIcDAACLBdQDIg0PAAC4BAAgQQAAjQUAIEIAAI0FACBTAACNBQAgVAAAjQUAIIADEAAAAAGBAxAAAAAEggMQAAAABIMDEAAAAAGEAxAAAAABhQMQAAAAAYYDEAAAAAGHAxAAjAUAIQiAAxAAAAABgQMQAAAABIIDEAAAAASDAxAAAAABhAMQAAAAAYUDEAAAAAGGAxAAAAABhwMQAI0FACEHDwAAuAQAIEEAAI8FACBCAACPBQAggAMAAADMAwKBAwAAAMwDCIIDAAAAzAMIhwMAAI4FzAMiBIADAAAAzAMCgQMAAADMAwiCAwAAAMwDCIcDAACPBcwDIgcPAAC4BAAgQQAAkQUAIEIAAJEFACCAAwAAAMoDAoEDAAAAygMIggMAAADKAwiHAwAAkAXKAyIEgAMAAADKAwKBAwAAAMoDCIIDAAAAygMIhwMAAJEFygMiC_cCAACSBQAw-AIAAMwCABD5AgAAkgUAMPoCAQCzBAAh_wJAALYEACHKAwAAhAXKAyLcAwEAswQAId0DAQC0BAAh3gMAAJMFACDfAyAAtQQAIeADQADLBAAhDw8AALgEACBBAACUBQAgQgAAlAUAIIADgAAAAAGDA4AAAAABhAOAAAAAAYUDgAAAAAGGA4AAAAABhwOAAAAAAdYDAQAAAAHXAwEAAAAB2AMBAAAAAdkDgAAAAAHaA4AAAAAB2wOAAAAAAQyAA4AAAAABgwOAAAAAAYQDgAAAAAGFA4AAAAABhgOAAAAAAYcDgAAAAAHWAwEAAAAB1wMBAAAAAdgDAQAAAAHZA4AAAAAB2gOAAAAAAdsDgAAAAAEO9wIAAJUFADD4AgAAtgIAEPkCAACVBQAw-gIBALMEACH7AgEAswQAIf8CQAC2BAAhnAMAAJcF5QMiowNAALYEACHNAxAAhgUAIc4DAQC0BAAh4QMBALMEACHjAwAAlgXjAyLlA0AAywQAIeYDQADLBAAhBw8AALgEACBBAACbBQAgQgAAmwUAIIADAAAA4wMCgQMAAADjAwiCAwAAAOMDCIcDAACaBeMDIgcPAAC4BAAgQQAAmQUAIEIAAJkFACCAAwAAAOUDAoEDAAAA5QMIggMAAADlAwiHAwAAmAXlAyIHDwAAuAQAIEEAAJkFACBCAACZBQAggAMAAADlAwKBAwAAAOUDCIIDAAAA5QMIhwMAAJgF5QMiBIADAAAA5QMCgQMAAADlAwiCAwAAAOUDCIcDAACZBeUDIgcPAAC4BAAgQQAAmwUAIEIAAJsFACCAAwAAAOMDAoEDAAAA4wMIggMAAADjAwiHAwAAmgXjAyIEgAMAAADjAwKBAwAAAOMDCIIDAAAA4wMIhwMAAJsF4wMiCvcCAACcBQAw-AIAAKACABD5AgAAnAUAMPoCAQCzBAAh-wIBALMEACH_AkAAtgQAIawDAACdBekDIt4DAACTBQAg5wMBALMEACHpA0AAywQAIQcPAAC4BAAgQQAAnwUAIEIAAJ8FACCAAwAAAOkDAoEDAAAA6QMIggMAAADpAwiHAwAAngXpAyIHDwAAuAQAIEEAAJ8FACBCAACfBQAggAMAAADpAwKBAwAAAOkDCIIDAAAA6QMIhwMAAJ4F6QMiBIADAAAA6QMCgQMAAADpAwiCAwAAAOkDCIcDAACfBekDIgz3AgAAoAUAMPgCAACKAgAQ-QIAAKAFADD6AgEAswQAIfsCAQCzBAAh_wJAALYEACHjAwAAoQXsAyLqAwEAswQAIewDAQC0BAAh7QMBALQEACHuAwEAtAQAIe8DAgDpBAAhBw8AALgEACBBAACjBQAgQgAAowUAIIADAAAA7AMCgQMAAADsAwiCAwAAAOwDCIcDAACiBewDIgcPAAC4BAAgQQAAowUAIEIAAKMFACCAAwAAAOwDAoEDAAAA7AMIggMAAADsAwiHAwAAogXsAyIEgAMAAADsAwKBAwAAAOwDCIIDAAAA7AMIhwMAAKMF7AMiCfcCAACkBQAw-AIAAPQBABD5AgAApAUAMPoCAQCzBAAh-wIBALMEACH_AkAAtgQAIakDAQCzBAAh8AMCAOkEACHxAwEAxwQAIQn3AgAApQUAMPgCAADeAQAQ-QIAAKUFADD6AgEAswQAIY4DIAC1BAAhugMBALMEACHnAwEAswQAIfMDAACmBfMDIvQDQAC2BAAhBw8AALgEACBBAACoBQAgQgAAqAUAIIADAAAA8wMCgQMAAADzAwiCAwAAAPMDCIcDAACnBfMDIgcPAAC4BAAgQQAAqAUAIEIAAKgFACCAAwAAAPMDAoEDAAAA8wMIggMAAADzAwiHAwAApwXzAyIEgAMAAADzAwKBAwAAAPMDCIIDAAAA8wMIhwMAAKgF8wMiC_cCAACpBQAw-AIAAMgBABD5AgAAqQUAMPoCAQCzBAAh_wJAALYEACGLAwEAtAQAIYwDAQC0BAAhjgMgALUEACGiA0AAywQAIaMDQAC2BAAhrgMBAMcEACEPCgAA3wQAIAsAAKsFACAMAACsBQAgDgAA4AQAIPcCAACqBQAw-AIAALUBABD5AgAAqgUAMPoCAQDBBAAh_wJAAN0EACGLAwEAwgQAIYwDAQDCBAAhjgMgAMMEACGiA0AA3AQAIaMDQADdBAAhrgMBANgEACEDjwMAABMAIJADAAATACCRAwAAEwAgA48DAAAHACCQAwAABwAgkQMAAAcAIA33AgAArQUAMPgCAACvAQAQ-QIAAK0FADD6AgEAswQAIf8CQAC2BAAhiwMBALQEACGSAwEAtAQAIaEDIAC1BAAhogNAAMsEACGjA0AAtgQAIecDAQCzBAAh9QMBAMcEACH2AwEAxwQAIRABAACvBQAgDAAArAUAICUAALAFACD3AgAArgUAMPgCAAAFABD5AgAArgUAMPoCAQDBBAAh_wJAAN0EACGLAwEAwgQAIZIDAQDCBAAhoQMgAMMEACGiA0AA3AQAIaMDQADdBAAh5wMBAMEEACH1AwEA2AQAIfYDAQDYBAAhIggAAN4EACAaAADjBAAgHQAA5QQAICYAAN8EACAnAADgBAAgKAAA4QQAICkAAOEEACAqAADiBAAgKwAA5AQAICwAAOYEACAtAADnBAAg9wIAANcEADD4AgAAAwAQ-QIAANcEADD6AgEAwQQAIf8CQADdBAAhiwMBAMIEACGSAwEAwgQAIZMDAQDYBAAhlAMBANgEACGVAwEA2AQAIZYDAQDYBAAhmAMAANkEmAMimgMAANoEmgMinAMAANsEnAMinQMgAMMEACGeAwEA2AQAIZ8DAQDYBAAhoAMgAMMEACGhAyAAwwQAIaIDQADcBAAhowNAAN0EACGDBAAAAwAghAQAAAMAIAOPAwAAOwAgkAMAADsAIJEDAAA7ACAO9wIAALEFADD4AgAAlwEAEPkCAACxBQAw-gIBALMEACH_AkAAtgQAIYsDAQC0BAAhjgMgALUEACGiA0AAywQAIaMDQAC2BAAhrgMBAMcEACG6AwEAswQAIc4DAQC0BAAh9wMgALUEACH4AxAAgAUAIQ33AgAAsgUAMPgCAACBAQAQ-QIAALIFADD6AgEAswQAIf8CQAC2BAAh-QMBALMFACH6AwEAtAQAIfsDAQC0BAAh_AMBALMEACH9AwAAiAUAIP4DAACIBQAg_wMBAMcEACGABAEAxwQAIQsPAADNBAAgQQAA1gQAIEIAANYEACCAAwEAAAABgQMBAAAABYIDAQAAAAWDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwEAAAABhwMBALQFACELDwAAzQQAIEEAANYEACBCAADWBAAggAMBAAAAAYEDAQAAAAWCAwEAAAAFgwMBAAAAAYQDAQAAAAGFAwEAAAABhgMBAAAAAYcDAQC0BQAhDi4AALgFACD3AgAAtQUAMPgCAABfABD5AgAAtQUAMPoCAQDBBAAh_wJAAN0EACH5AwEAtgUAIfoDAQDCBAAh-wMBAMIEACH8AwEAwQQAIf0DAAC3BQAg_gMAALcFACD_AwEA2AQAIYAEAQDYBAAhCIADAQAAAAGBAwEAAAAFggMBAAAABYMDAQAAAAGEAwEAAAABhQMBAAAAAYYDAQAAAAGHAwEAuQUAIQyAA4AAAAABgwOAAAAAAYQDgAAAAAGFA4AAAAABhgOAAAAAAYcDgAAAAAHWAwEAAAAB1wMBAAAAAdgDAQAAAAHZA4AAAAAB2gOAAAAAAdsDgAAAAAEiCAAA3gQAIBoAAOMEACAdAADlBAAgJgAA3wQAICcAAOAEACAoAADhBAAgKQAA4QQAICoAAOIEACArAADkBAAgLAAA5gQAIC0AAOcEACD3AgAA1wQAMPgCAAADABD5AgAA1wQAMPoCAQDBBAAh_wJAAN0EACGLAwEAwgQAIZIDAQDCBAAhkwMBANgEACGUAwEA2AQAIZUDAQDYBAAhlgMBANgEACGYAwAA2QSYAyKaAwAA2gSaAyKcAwAA2wScAyKdAyAAwwQAIZ4DAQDYBAAhnwMBANgEACGgAyAAwwQAIaEDIADDBAAhogNAANwEACGjA0AA3QQAIYMEAAADACCEBAAAAwAgCIADAQAAAAGBAwEAAAAFggMBAAAABYMDAQAAAAGEAwEAAAABhQMBAAAAAYYDAQAAAAGHAwEAuQUAIQsEAAC7BQAgCAAAvAUAIPcCAAC6BQAw-AIAADsAEPkCAAC6BQAw-gIBAMEEACH7AgEAwQQAIf8CQADdBAAhqQMBAMEEACHwAwIA7QQAIfEDAQDYBAAhIwcAAOEEACAIAAC8BQAgEAAA7gQAIBIAANcFACAVAADiBQAgFgAA4AQAIBgAAOIEACAaAADjBAAgHAAA5AQAIB0AAOUEACAeAADjBQAgJAAA5wQAIPcCAADfBQAw-AIAAAcAEPkCAADfBQAw-gIBAMEEACH_AkAA3QQAIZwDAADSBbIDIqIDQADcBAAhowNAAN0EACGkAwEAwQQAIagDAQDCBAAhqQMBAMEEACGqAwEAwQQAIawDAADgBawDIq0DAQDCBAAhrgMBAMIEACGwAwAA4QWwAyKyA0AA3AQAIbMDQADcBAAhtANAANwEACG1A0AA3AQAIbYDQADcBAAhgwQAAAcAIIQEAAAHACASAQAArwUAIAwAAKwFACAlAACwBQAg9wIAAK4FADD4AgAABQAQ-QIAAK4FADD6AgEAwQQAIf8CQADdBAAhiwMBAMIEACGSAwEAwgQAIaEDIADDBAAhogNAANwEACGjA0AA3QQAIecDAQDBBAAh9QMBANgEACH2AwEA2AQAIYMEAAAFACCEBAAABQAgDCEAAMAFACD3AgAAvQUAMPgCAABFABD5AgAAvQUAMPoCAQDBBAAh_wJAAN0EACHKAwAAvgXKAyLcAwEAwQQAId0DAQDCBAAh3gMAAL8FACDfAyAAwwQAIeADQADcBAAhBIADAAAAygMCgQMAAADKAwiCAwAAAMoDCIcDAACRBcoDIgyAA4AAAAABgwOAAAAAAYQDgAAAAAGFA4AAAAABhgOAAAAAAYcDgAAAAAHWAwEAAAAB1wMBAAAAAdgDAQAAAAHZA4AAAAAB2gOAAAAAAdsDgAAAAAEWIAAAxQUAICIAAMYFACD3AgAAwQUAMPgCAABBABD5AgAAwQUAMPoCAQDBBAAh_wJAAN0EACGcAwAAxAXUAyKjA0AA3QQAIcgDAQDBBAAhygMAAL4FygMizAMAAMIFzAMizQMQAMMFACHOAwEAwgQAIc8DAQDCBAAh0AMBANgEACHRAwEA2AQAIdIDAQDYBAAh1AMAALcFACDVA0AA3AQAIYMEAABBACCEBAAAQQAgFCAAAMUFACAiAADGBQAg9wIAAMEFADD4AgAAQQAQ-QIAAMEFADD6AgEAwQQAIf8CQADdBAAhnAMAAMQF1AMiowNAAN0EACHIAwEAwQQAIcoDAAC-BcoDIswDAADCBcwDIs0DEADDBQAhzgMBAMIEACHPAwEAwgQAIdADAQDYBAAh0QMBANgEACHSAwEA2AQAIdQDAAC3BQAg1QNAANwEACEEgAMAAADMAwKBAwAAAMwDCIIDAAAAzAMIhwMAAI8FzAMiCIADEAAAAAGBAxAAAAAEggMQAAAABIMDEAAAAAGEAxAAAAABhQMQAAAAAYYDEAAAAAGHAxAAjQUAIQSAAwAAANQDAoEDAAAA1AMIggMAAADUAwiHAwAAiwXUAyITBAAAuwUAIB8AAK8FACAjAADKBQAg9wIAAMcFADD4AgAAPQAQ-QIAAMcFADD6AgEAwQQAIfsCAQDBBAAh_wJAAN0EACGcAwAAyQXlAyKjA0AA3QQAIc0DEADDBQAhzgMBAMIEACHhAwEAwQQAIeMDAADIBeMDIuUDQADcBAAh5gNAANwEACGDBAAAPQAghAQAAD0AIAOPAwAARQAgkAMAAEUAIJEDAABFACARBAAAuwUAIB8AAK8FACAjAADKBQAg9wIAAMcFADD4AgAAPQAQ-QIAAMcFADD6AgEAwQQAIfsCAQDBBAAh_wJAAN0EACGcAwAAyQXlAyKjA0AA3QQAIc0DEADDBQAhzgMBAMIEACHhAwEAwQQAIeMDAADIBeMDIuUDQADcBAAh5gNAANwEACEEgAMAAADjAwKBAwAAAOMDCIIDAAAA4wMIhwMAAJsF4wMiBIADAAAA5QMCgQMAAADlAwiCAwAAAOUDCIcDAACZBeUDIgOPAwAAQQAgkAMAAEEAIJEDAABBACAMAQAArwUAIAQAALsFACD3AgAAywUAMPgCAAA3ABD5AgAAywUAMPoCAQDBBAAh-wIBAMEEACH_AkAA3QQAIawDAADMBekDIt4DAAC_BQAg5wMBAMEEACHpA0AA3AQAIQSAAwAAAOkDAoEDAAAA6QMIggMAAADpAwiHAwAAnwXpAyIOBAAAuwUAIBsAAK8FACD3AgAAzQUAMPgCAAAzABD5AgAAzQUAMPoCAQDBBAAh-wIBAMEEACH_AkAA3QQAIeMDAADOBewDIuoDAQDBBAAh7AMBAMIEACHtAwEAwgQAIe4DAQDCBAAh7wMCAO0EACEEgAMAAADsAwKBAwAAAOwDCIIDAAAA7AMIhwMAAKMF7AMiCwQAALsFACAZAACvBQAg9wIAAM8FADD4AgAALwAQ-QIAAM8FADD6AgEAwQQAIfsCAQDBBAAh_AIBAMEEACH9AgEAwgQAIf4CIADDBAAh_wJAAN0EACEMBAAAuwUAIBcAAK8FACD3AgAA0AUAMPgCAAArABD5AgAA0AUAMPoCAQDBBAAh-wIBAMEEACH9AgEA2AQAIf8CQADdBAAhtwMBAMEEACG4AwAA0QWyAyO5AwAA0gWyAyIEgAMAAACyAwOBAwAAALIDCYIDAAAAsgMJhwMAAPwEsgMjBIADAAAAsgMCgQMAAACyAwiCAwAAALIDCIcDAAD0BLIDIgwEAAC7BQAgFAAA1QUAIPcCAADTBQAw-AIAACQAEPkCAADTBQAw-gIBAMEEACH7AgEAwQQAIcMDAQDBBAAhxAMBAMIEACHFAwEA2AQAIcYDEADUBQAhxwMQANQFACEIgAMQAAAAAYEDEAAAAAWCAxAAAAAFgwMQAAAAAYQDEAAAAAGFAxAAAAABhgMQAAAAAYcDEACCBQAhCxMAAMQEACD3AgAAwAQAMPgCAACGBAAQ-QIAAMAEADD6AgEAwQQAIYsDAQDCBAAhjAMBAMIEACGNAwEAwgQAIY4DIADDBAAhgwQAAIYEACCEBAAAhgQAIA0EAAC7BQAgCQAA1wUAIA0AAK8FACD3AgAA1gUAMPgCAAAYABD5AgAA1gUAMPoCAQDBBAAh-wIBAMEEACG6AwEAwQQAIbsDAQDBBAAhvAMBANgEACG9A0AA3QQAIb4DQADcBAAhEQoAAN8EACALAACrBQAgDAAArAUAIA4AAOAEACD3AgAAqgUAMPgCAAC1AQAQ-QIAAKoFADD6AgEAwQQAIf8CQADdBAAhiwMBAMIEACGMAwEAwgQAIY4DIADDBAAhogNAANwEACGjA0AA3QQAIa4DAQDYBAAhgwQAALUBACCEBAAAtQEAIAKLAwEAAAABugMBAAAAAREJAADXBQAgDAAArAUAIBEAANoFACD3AgAA2QUAMPgCAAATABD5AgAA2QUAMPoCAQDBBAAh_wJAAN0EACGLAwEAwgQAIY4DIADDBAAhogNAANwEACGjA0AA3QQAIa4DAQDYBAAhugMBAMEEACHOAwEAwgQAIfcDIADDBAAh-AMQANQFACEMEAAA7gQAIPcCAADsBAAw-AIAACEAEPkCAADsBAAw-gIBAMEEACGOAyAAwwQAIaQDAQDBBAAhpQMCAO0EACGmAwIA7QQAIacDAgDtBAAhgwQAACEAIIQEAAAhACACugMBAAAAAecDAQAAAAELAQAArwUAIAkAANcFACD3AgAA3AUAMPgCAAAPABD5AgAA3AUAMPoCAQDBBAAhjgMgAMMEACG6AwEAwQQAIecDAQDBBAAh8wMAAN0F8wMi9ANAAN0EACEEgAMAAADzAwKBAwAAAPMDCIIDAAAA8wMIhwMAAKgF8wMiDQQAALsFACAFAACvBQAgBgAArwUAIPcCAADeBQAw-AIAAAsAEPkCAADeBQAw-gIBAMEEACH7AgEAwQQAIf0CAQDYBAAhvwMBAMEEACHAAwEAwQQAIcEDQADdBAAhwgNAANwEACEhBwAA4QQAIAgAALwFACAQAADuBAAgEgAA1wUAIBUAAOIFACAWAADgBAAgGAAA4gQAIBoAAOMEACAcAADkBAAgHQAA5QQAIB4AAOMFACAkAADnBAAg9wIAAN8FADD4AgAABwAQ-QIAAN8FADD6AgEAwQQAIf8CQADdBAAhnAMAANIFsgMiogNAANwEACGjA0AA3QQAIaQDAQDBBAAhqAMBAMIEACGpAwEAwQQAIaoDAQDBBAAhrAMAAOAFrAMirQMBAMIEACGuAwEAwgQAIbADAADhBbADIrIDQADcBAAhswNAANwEACG0A0AA3AQAIbUDQADcBAAhtgNAANwEACEEgAMAAACsAwKBAwAAAKwDCIIDAAAArAMIhwMAAPgErAMiBIADAAAAsAMCgQMAAACwAwiCAwAAALADCIcDAAD2BLADIg4EAAC7BQAgFAAA1QUAIPcCAADTBQAw-AIAACQAEPkCAADTBQAw-gIBAMEEACH7AgEAwQQAIcMDAQDBBAAhxAMBAMIEACHFAwEA2AQAIcYDEADUBQAhxwMQANQFACGDBAAAJAAghAQAACQAIA0EAAC7BQAgCAAAvAUAIPcCAAC6BQAw-AIAADsAEPkCAAC6BQAw-gIBAMEEACH7AgEAwQQAIf8CQADdBAAhqQMBAMEEACHwAwIA7QQAIfEDAQDYBAAhgwQAADsAIIQEAAA7ACAAAAABiAQBAAAAAQGIBCAAAAABAYgEQAAAAAEFOwAAvgsAIDwAAMQLACCFBAAAvwsAIIYEAADDCwAgiwQAAAkAIAU7AAC8CwAgPAAAwQsAIIUEAAC9CwAghgQAAMALACCLBAAA6wMAIAM7AAC-CwAghQQAAL8LACCLBAAACQAgAzsAALwLACCFBAAAvQsAIIsEAADrAwAgAAAACzsAAPIFADA8AAD3BQAwhQQAAPMFADCGBAAA9AUAMIcEAAD1BQAgiAQAAPYFADCJBAAA9gUAMIoEAAD2BQAwiwQAAPYFADCMBAAA-AUAMI0EAAD5BQAwBwQAAIEGACD6AgEAAAAB-wIBAAAAAcQDAQAAAAHFAwEAAAABxgMQAAAAAccDEAAAAAECAAAAJwAgOwAAgAYAIAMAAAAnACA7AACABgAgPAAA_gUAIAE0AAC7CwAwDAQAALsFACAUAADVBQAg9wIAANMFADD4AgAAJAAQ-QIAANMFADD6AgEAAAAB-wIBAAAAAcMDAQDBBAAhxAMBAMIEACHFAwEA2AQAIcYDEADUBQAhxwMQANQFACECAAAAJwAgNAAA_gUAIAIAAAD6BQAgNAAA-wUAIAr3AgAA-QUAMPgCAAD6BQAQ-QIAAPkFADD6AgEAwQQAIfsCAQDBBAAhwwMBAMEEACHEAwEAwgQAIcUDAQDYBAAhxgMQANQFACHHAxAA1AUAIQr3AgAA-QUAMPgCAAD6BQAQ-QIAAPkFADD6AgEAwQQAIfsCAQDBBAAhwwMBAMEEACHEAwEAwgQAIcUDAQDYBAAhxgMQANQFACHHAxAA1AUAIQb6AgEA5wUAIfsCAQDnBQAhxAMBAOcFACHFAwEA_AUAIcYDEAD9BQAhxwMQAP0FACEBiAQBAAAAAQWIBBAAAAABjgQQAAAAAY8EEAAAAAGQBBAAAAABkQQQAAAAAQcEAAD_BQAg-gIBAOcFACH7AgEA5wUAIcQDAQDnBQAhxQMBAPwFACHGAxAA_QUAIccDEAD9BQAhBTsAALYLACA8AAC5CwAghQQAALcLACCGBAAAuAsAIIsEAAAJACAHBAAAgQYAIPoCAQAAAAH7AgEAAAABxAMBAAAAAcUDAQAAAAHGAxAAAAABxwMQAAAAAQM7AAC2CwAghQQAALcLACCLBAAACQAgBDsAAPIFADCFBAAA8wUAMIcEAAD1BQAgiwQAAPYFADAAAAAAAAGIBAAAAJgDAgGIBAAAAJoDAgGIBAAAAJwDAgGIBEAAAAABBzsAAMgHACA8AADLBwAghQQAAMkHACCGBAAAygcAIIkEAAAFACCKBAAABQAgiwQAAJoBACALOwAAuQcAMDwAAL4HADCFBAAAugcAMIYEAAC7BwAwhwQAALwHACCIBAAAvQcAMIkEAAC9BwAwigQAAL0HADCLBAAAvQcAMIwEAAC_BwAwjQQAAMAHADALOwAAqQcAMDwAAK4HADCFBAAAqgcAMIYEAACrBwAwhwQAAKwHACCIBAAArQcAMIkEAACtBwAwigQAAK0HADCLBAAArQcAMIwEAACvBwAwjQQAALAHADALOwAAngcAMDwAAKIHADCFBAAAnwcAMIYEAACgBwAwhwQAAKEHACCIBAAAkgcAMIkEAACSBwAwigQAAJIHADCLBAAAkgcAMIwEAACjBwAwjQQAAJUHADALOwAAjgcAMDwAAJMHADCFBAAAjwcAMIYEAACQBwAwhwQAAJEHACCIBAAAkgcAMIkEAACSBwAwigQAAJIHADCLBAAAkgcAMIwEAACUBwAwjQQAAJUHADALOwAA_gYAMDwAAIMHADCFBAAA_wYAMIYEAACABwAwhwQAAIEHACCIBAAAggcAMIkEAACCBwAwigQAAIIHADCLBAAAggcAMIwEAACEBwAwjQQAAIUHADALOwAA8gYAMDwAAPcGADCFBAAA8wYAMIYEAAD0BgAwhwQAAPUGACCIBAAA9gYAMIkEAAD2BgAwigQAAPYGADCLBAAA9gYAMIwEAAD4BgAwjQQAAPkGADALOwAA4gYAMDwAAOcGADCFBAAA4wYAMIYEAADkBgAwhwQAAOUGACCIBAAA5gYAMIkEAADmBgAwigQAAOYGADCLBAAA5gYAMIwEAADoBgAwjQQAAOkGADALOwAA0wYAMDwAANgGADCFBAAA1AYAMIYEAADVBgAwhwQAANYGACCIBAAA1wYAMIkEAADXBgAwigQAANcGADCLBAAA1wYAMIwEAADZBgAwjQQAANoGADALOwAAxwYAMDwAAMwGADCFBAAAyAYAMIYEAADJBgAwhwQAAMoGACCIBAAAywYAMIkEAADLBgAwigQAAMsGADCLBAAAywYAMIwEAADNBgAwjQQAAM4GADALOwAAlwYAMDwAAJwGADCFBAAAmAYAMIYEAACZBgAwhwQAAJoGACCIBAAAmwYAMIkEAACbBgAwigQAAJsGADCLBAAAmwYAMIwEAACdBgAwjQQAAJ4GADAMBAAAxQYAICMAAMYGACD6AgEAAAAB-wIBAAAAAf8CQAAAAAGcAwAAAOUDAqMDQAAAAAHNAxAAAAABzgMBAAAAAeMDAAAA4wMC5QNAAAAAAeYDQAAAAAECAAAAPwAgOwAAxAYAIAMAAAA_ACA7AADEBgAgPAAApAYAIAE0AAC1CwAwEQQAALsFACAfAACvBQAgIwAAygUAIPcCAADHBQAw-AIAAD0AEPkCAADHBQAw-gIBAAAAAfsCAQDBBAAh_wJAAN0EACGcAwAAyQXlAyKjA0AA3QQAIc0DEADDBQAhzgMBAMIEACHhAwEAwQQAIeMDAADIBeMDIuUDQADcBAAh5gNAANwEACECAAAAPwAgNAAApAYAIAIAAACfBgAgNAAAoAYAIA73AgAAngYAMPgCAACfBgAQ-QIAAJ4GADD6AgEAwQQAIfsCAQDBBAAh_wJAAN0EACGcAwAAyQXlAyKjA0AA3QQAIc0DEADDBQAhzgMBAMIEACHhAwEAwQQAIeMDAADIBeMDIuUDQADcBAAh5gNAANwEACEO9wIAAJ4GADD4AgAAnwYAEPkCAACeBgAw-gIBAMEEACH7AgEAwQQAIf8CQADdBAAhnAMAAMkF5QMiowNAAN0EACHNAxAAwwUAIc4DAQDCBAAh4QMBAMEEACHjAwAAyAXjAyLlA0AA3AQAIeYDQADcBAAhCvoCAQDnBQAh-wIBAOcFACH_AkAA6QUAIZwDAACjBuUDIqMDQADpBQAhzQMQAKIGACHOAwEA5wUAIeMDAAChBuMDIuUDQACLBgAh5gNAAIsGACEBiAQAAADjAwIFiAQQAAAAAY4EEAAAAAGPBBAAAAABkAQQAAAAAZEEEAAAAAEBiAQAAADlAwIMBAAApQYAICMAAKYGACD6AgEA5wUAIfsCAQDnBQAh_wJAAOkFACGcAwAAowblAyKjA0AA6QUAIc0DEACiBgAhzgMBAOcFACHjAwAAoQbjAyLlA0AAiwYAIeYDQACLBgAhBTsAAK4LACA8AACzCwAghQQAAK8LACCGBAAAsgsAIIsEAAAJACALOwAApwYAMDwAAKwGADCFBAAAqAYAMIYEAACpBgAwhwQAAKoGACCIBAAAqwYAMIkEAACrBgAwigQAAKsGADCLBAAAqwYAMIwEAACtBgAwjQQAAK4GADAPIgAAwwYAIPoCAQAAAAH_AkAAAAABnAMAAADUAwKjA0AAAAABygMAAADKAwLMAwAAAMwDAs0DEAAAAAHOAwEAAAABzwMBAAAAAdADAQAAAAHRAwEAAAAB0gMBAAAAAdQDgAAAAAHVA0AAAAABAgAAAEMAIDsAAMIGACADAAAAQwAgOwAAwgYAIDwAALQGACABNAAAsQsAMBQgAADFBQAgIgAAxgUAIPcCAADBBQAw-AIAAEEAEPkCAADBBQAw-gIBAAAAAf8CQADdBAAhnAMAAMQF1AMiowNAAN0EACHIAwEAwQQAIcoDAAC-BcoDIswDAADCBcwDIs0DEADDBQAhzgMBAMIEACHPAwEAAAAB0AMBAAAAAdEDAQDYBAAh0gMBANgEACHUAwAAtwUAINUDQADcBAAhAgAAAEMAIDQAALQGACACAAAArwYAIDQAALAGACAS9wIAAK4GADD4AgAArwYAEPkCAACuBgAw-gIBAMEEACH_AkAA3QQAIZwDAADEBdQDIqMDQADdBAAhyAMBAMEEACHKAwAAvgXKAyLMAwAAwgXMAyLNAxAAwwUAIc4DAQDCBAAhzwMBAMIEACHQAwEA2AQAIdEDAQDYBAAh0gMBANgEACHUAwAAtwUAINUDQADcBAAhEvcCAACuBgAw-AIAAK8GABD5AgAArgYAMPoCAQDBBAAh_wJAAN0EACGcAwAAxAXUAyKjA0AA3QQAIcgDAQDBBAAhygMAAL4FygMizAMAAMIFzAMizQMQAMMFACHOAwEAwgQAIc8DAQDCBAAh0AMBANgEACHRAwEA2AQAIdIDAQDYBAAh1AMAALcFACDVA0AA3AQAIQ76AgEA5wUAIf8CQADpBQAhnAMAALMG1AMiowNAAOkFACHKAwAAsQbKAyLMAwAAsgbMAyLNAxAAogYAIc4DAQDnBQAhzwMBAOcFACHQAwEA_AUAIdEDAQD8BQAh0gMBAPwFACHUA4AAAAAB1QNAAIsGACEBiAQAAADKAwIBiAQAAADMAwIBiAQAAADUAwIPIgAAtQYAIPoCAQDnBQAh_wJAAOkFACGcAwAAswbUAyKjA0AA6QUAIcoDAACxBsoDIswDAACyBswDIs0DEACiBgAhzgMBAOcFACHPAwEA5wUAIdADAQD8BQAh0QMBAPwFACHSAwEA_AUAIdQDgAAAAAHVA0AAiwYAIQs7AAC2BgAwPAAAuwYAMIUEAAC3BgAwhgQAALgGADCHBAAAuQYAIIgEAAC6BgAwiQQAALoGADCKBAAAugYAMIsEAAC6BgAwjAQAALwGADCNBAAAvQYAMAf6AgEAAAAB_wJAAAAAAcoDAAAAygMC3QMBAAAAAd4DgAAAAAHfAyAAAAAB4ANAAAAAAQIAAABHACA7AADBBgAgAwAAAEcAIDsAAMEGACA8AADABgAgATQAALALADAMIQAAwAUAIPcCAAC9BQAw-AIAAEUAEPkCAAC9BQAw-gIBAAAAAf8CQADdBAAhygMAAL4FygMi3AMBAMEEACHdAwEAwgQAId4DAAC_BQAg3wMgAMMEACHgA0AA3AQAIQIAAABHACA0AADABgAgAgAAAL4GACA0AAC_BgAgC_cCAAC9BgAw-AIAAL4GABD5AgAAvQYAMPoCAQDBBAAh_wJAAN0EACHKAwAAvgXKAyLcAwEAwQQAId0DAQDCBAAh3gMAAL8FACDfAyAAwwQAIeADQADcBAAhC_cCAAC9BgAw-AIAAL4GABD5AgAAvQYAMPoCAQDBBAAh_wJAAN0EACHKAwAAvgXKAyLcAwEAwQQAId0DAQDCBAAh3gMAAL8FACDfAyAAwwQAIeADQADcBAAhB_oCAQDnBQAh_wJAAOkFACHKAwAAsQbKAyLdAwEA5wUAId4DgAAAAAHfAyAA6AUAIeADQACLBgAhB_oCAQDnBQAh_wJAAOkFACHKAwAAsQbKAyLdAwEA5wUAId4DgAAAAAHfAyAA6AUAIeADQACLBgAhB_oCAQAAAAH_AkAAAAABygMAAADKAwLdAwEAAAAB3gOAAAAAAd8DIAAAAAHgA0AAAAABDyIAAMMGACD6AgEAAAAB_wJAAAAAAZwDAAAA1AMCowNAAAAAAcoDAAAAygMCzAMAAADMAwLNAxAAAAABzgMBAAAAAc8DAQAAAAHQAwEAAAAB0QMBAAAAAdIDAQAAAAHUA4AAAAAB1QNAAAAAAQQ7AAC2BgAwhQQAALcGADCHBAAAuQYAIIsEAAC6BgAwDAQAAMUGACAjAADGBgAg-gIBAAAAAfsCAQAAAAH_AkAAAAABnAMAAADlAwKjA0AAAAABzQMQAAAAAc4DAQAAAAHjAwAAAOMDAuUDQAAAAAHmA0AAAAABAzsAAK4LACCFBAAArwsAIIsEAAAJACAEOwAApwYAMIUEAACoBgAwhwQAAKoGACCLBAAAqwYAMAn6AgEAAAAB_wJAAAAAAfoDAQAAAAH7AwEAAAAB_AMBAAAAAf0DgAAAAAH-A4AAAAAB_wMBAAAAAYAEAQAAAAECAAAAAQAgOwAA0gYAIAMAAAABACA7AADSBgAgPAAA0QYAIAE0AACtCwAwDi4AALgFACD3AgAAtQUAMPgCAABfABD5AgAAtQUAMPoCAQAAAAH_AkAA3QQAIfkDAQC2BQAh-gMBAMIEACH7AwEAwgQAIfwDAQDBBAAh_QMAALcFACD-AwAAtwUAIP8DAQDYBAAhgAQBANgEACECAAAAAQAgNAAA0QYAIAIAAADPBgAgNAAA0AYAIA33AgAAzgYAMPgCAADPBgAQ-QIAAM4GADD6AgEAwQQAIf8CQADdBAAh-QMBALYFACH6AwEAwgQAIfsDAQDCBAAh_AMBAMEEACH9AwAAtwUAIP4DAAC3BQAg_wMBANgEACGABAEA2AQAIQ33AgAAzgYAMPgCAADPBgAQ-QIAAM4GADD6AgEAwQQAIf8CQADdBAAh-QMBALYFACH6AwEAwgQAIfsDAQDCBAAh_AMBAMEEACH9AwAAtwUAIP4DAAC3BQAg_wMBANgEACGABAEA2AQAIQn6AgEA5wUAIf8CQADpBQAh-gMBAOcFACH7AwEA5wUAIfwDAQDnBQAh_QOAAAAAAf4DgAAAAAH_AwEA_AUAIYAEAQD8BQAhCfoCAQDnBQAh_wJAAOkFACH6AwEA5wUAIfsDAQDnBQAh_AMBAOcFACH9A4AAAAAB_gOAAAAAAf8DAQD8BQAhgAQBAPwFACEJ-gIBAAAAAf8CQAAAAAH6AwEAAAAB-wMBAAAAAfwDAQAAAAH9A4AAAAAB_gOAAAAAAf8DAQAAAAGABAEAAAABBwQAAOEGACD6AgEAAAAB-wIBAAAAAf8CQAAAAAGsAwAAAOkDAt4DgAAAAAHpA0AAAAABAgAAADkAIDsAAOAGACADAAAAOQAgOwAA4AYAIDwAAN4GACABNAAArAsAMAwBAACvBQAgBAAAuwUAIPcCAADLBQAw-AIAADcAEPkCAADLBQAw-gIBAAAAAfsCAQDBBAAh_wJAAN0EACGsAwAAzAXpAyLeAwAAvwUAIOcDAQDBBAAh6QNAANwEACECAAAAOQAgNAAA3gYAIAIAAADbBgAgNAAA3AYAIAr3AgAA2gYAMPgCAADbBgAQ-QIAANoGADD6AgEAwQQAIfsCAQDBBAAh_wJAAN0EACGsAwAAzAXpAyLeAwAAvwUAIOcDAQDBBAAh6QNAANwEACEK9wIAANoGADD4AgAA2wYAEPkCAADaBgAw-gIBAMEEACH7AgEAwQQAIf8CQADdBAAhrAMAAMwF6QMi3gMAAL8FACDnAwEAwQQAIekDQADcBAAhBvoCAQDnBQAh-wIBAOcFACH_AkAA6QUAIawDAADdBukDIt4DgAAAAAHpA0AAiwYAIQGIBAAAAOkDAgcEAADfBgAg-gIBAOcFACH7AgEA5wUAIf8CQADpBQAhrAMAAN0G6QMi3gOAAAAAAekDQACLBgAhBTsAAKcLACA8AACqCwAghQQAAKgLACCGBAAAqQsAIIsEAAAJACAHBAAA4QYAIPoCAQAAAAH7AgEAAAAB_wJAAAAAAawDAAAA6QMC3gOAAAAAAekDQAAAAAEDOwAApwsAIIUEAACoCwAgiwQAAAkAIAkEAADxBgAg-gIBAAAAAfsCAQAAAAH_AkAAAAAB4wMAAADsAwLsAwEAAAAB7QMBAAAAAe4DAQAAAAHvAwIAAAABAgAAADUAIDsAAPAGACADAAAANQAgOwAA8AYAIDwAAO4GACABNAAApgsAMA4EAAC7BQAgGwAArwUAIPcCAADNBQAw-AIAADMAEPkCAADNBQAw-gIBAAAAAfsCAQDBBAAh_wJAAN0EACHjAwAAzgXsAyLqAwEAwQQAIewDAQAAAAHtAwEAwgQAIe4DAQDCBAAh7wMCAO0EACECAAAANQAgNAAA7gYAIAIAAADqBgAgNAAA6wYAIAz3AgAA6QYAMPgCAADqBgAQ-QIAAOkGADD6AgEAwQQAIfsCAQDBBAAh_wJAAN0EACHjAwAAzgXsAyLqAwEAwQQAIewDAQDCBAAh7QMBAMIEACHuAwEAwgQAIe8DAgDtBAAhDPcCAADpBgAw-AIAAOoGABD5AgAA6QYAMPoCAQDBBAAh-wIBAMEEACH_AkAA3QQAIeMDAADOBewDIuoDAQDBBAAh7AMBAMIEACHtAwEAwgQAIe4DAQDCBAAh7wMCAO0EACEI-gIBAOcFACH7AgEA5wUAIf8CQADpBQAh4wMAAOwG7AMi7AMBAOcFACHtAwEA5wUAIe4DAQDnBQAh7wMCAO0GACEBiAQAAADsAwIFiAQCAAAAAY4EAgAAAAGPBAIAAAABkAQCAAAAAZEEAgAAAAEJBAAA7wYAIPoCAQDnBQAh-wIBAOcFACH_AkAA6QUAIeMDAADsBuwDIuwDAQDnBQAh7QMBAOcFACHuAwEA5wUAIe8DAgDtBgAhBTsAAKELACA8AACkCwAghQQAAKILACCGBAAAowsAIIsEAAAJACAJBAAA8QYAIPoCAQAAAAH7AgEAAAAB_wJAAAAAAeMDAAAA7AMC7AMBAAAAAe0DAQAAAAHuAwEAAAAB7wMCAAAAAQM7AAChCwAghQQAAKILACCLBAAACQAgBgQAAOwFACD6AgEAAAAB-wIBAAAAAf0CAQAAAAH-AiAAAAAB_wJAAAAAAQIAAAAxACA7AAD9BgAgAwAAADEAIDsAAP0GACA8AAD8BgAgATQAAKALADALBAAAuwUAIBkAAK8FACD3AgAAzwUAMPgCAAAvABD5AgAAzwUAMPoCAQAAAAH7AgEAwQQAIfwCAQDBBAAh_QIBAMIEACH-AiAAwwQAIf8CQADdBAAhAgAAADEAIDQAAPwGACACAAAA-gYAIDQAAPsGACAJ9wIAAPkGADD4AgAA-gYAEPkCAAD5BgAw-gIBAMEEACH7AgEAwQQAIfwCAQDBBAAh_QIBAMIEACH-AiAAwwQAIf8CQADdBAAhCfcCAAD5BgAw-AIAAPoGABD5AgAA-QYAMPoCAQDBBAAh-wIBAMEEACH8AgEAwQQAIf0CAQDCBAAh_gIgAMMEACH_AkAA3QQAIQX6AgEA5wUAIfsCAQDnBQAh_QIBAOcFACH-AiAA6AUAIf8CQADpBQAhBgQAAOoFACD6AgEA5wUAIfsCAQDnBQAh_QIBAOcFACH-AiAA6AUAIf8CQADpBQAhBgQAAOwFACD6AgEAAAAB-wIBAAAAAf0CAQAAAAH-AiAAAAAB_wJAAAAAAQcEAACNBwAg-gIBAAAAAfsCAQAAAAH9AgEAAAAB_wJAAAAAAbgDAAAAsgMDuQMAAACyAwICAAAALQAgOwAAjAcAIAMAAAAtACA7AACMBwAgPAAAigcAIAE0AACfCwAwDAQAALsFACAXAACvBQAg9wIAANAFADD4AgAAKwAQ-QIAANAFADD6AgEAAAAB-wIBAMEEACH9AgEA2AQAIf8CQADdBAAhtwMBAMEEACG4AwAA0QWyAyO5AwAA0gWyAyICAAAALQAgNAAAigcAIAIAAACGBwAgNAAAhwcAIAr3AgAAhQcAMPgCAACGBwAQ-QIAAIUHADD6AgEAwQQAIfsCAQDBBAAh_QIBANgEACH_AkAA3QQAIbcDAQDBBAAhuAMAANEFsgMjuQMAANIFsgMiCvcCAACFBwAw-AIAAIYHABD5AgAAhQcAMPoCAQDBBAAh-wIBAMEEACH9AgEA2AQAIf8CQADdBAAhtwMBAMEEACG4AwAA0QWyAyO5AwAA0gWyAyIG-gIBAOcFACH7AgEA5wUAIf0CAQD8BQAh_wJAAOkFACG4AwAAiAeyAyO5AwAAiQeyAyIBiAQAAACyAwMBiAQAAACyAwIHBAAAiwcAIPoCAQDnBQAh-wIBAOcFACH9AgEA_AUAIf8CQADpBQAhuAMAAIgHsgMjuQMAAIkHsgMiBTsAAJoLACA8AACdCwAghQQAAJsLACCGBAAAnAsAIIsEAAAJACAHBAAAjQcAIPoCAQAAAAH7AgEAAAAB_QIBAAAAAf8CQAAAAAG4AwAAALIDA7kDAAAAsgMCAzsAAJoLACCFBAAAmwsAIIsEAAAJACAIBAAAnAcAIAYAAJ0HACD6AgEAAAAB-wIBAAAAAf0CAQAAAAHAAwEAAAABwQNAAAAAAcIDQAAAAAECAAAADQAgOwAAmwcAIAMAAAANACA7AACbBwAgPAAAmAcAIAE0AACZCwAwDQQAALsFACAFAACvBQAgBgAArwUAIPcCAADeBQAw-AIAAAsAEPkCAADeBQAw-gIBAAAAAfsCAQDBBAAh_QIBANgEACG_AwEAwQQAIcADAQDBBAAhwQNAAN0EACHCA0AA3AQAIQIAAAANACA0AACYBwAgAgAAAJYHACA0AACXBwAgCvcCAACVBwAw-AIAAJYHABD5AgAAlQcAMPoCAQDBBAAh-wIBAMEEACH9AgEA2AQAIb8DAQDBBAAhwAMBAMEEACHBA0AA3QQAIcIDQADcBAAhCvcCAACVBwAw-AIAAJYHABD5AgAAlQcAMPoCAQDBBAAh-wIBAMEEACH9AgEA2AQAIb8DAQDBBAAhwAMBAMEEACHBA0AA3QQAIcIDQADcBAAhBvoCAQDnBQAh-wIBAOcFACH9AgEA_AUAIcADAQDnBQAhwQNAAOkFACHCA0AAiwYAIQgEAACZBwAgBgAAmgcAIPoCAQDnBQAh-wIBAOcFACH9AgEA_AUAIcADAQDnBQAhwQNAAOkFACHCA0AAiwYAIQU7AACRCwAgPAAAlwsAIIUEAACSCwAghgQAAJYLACCLBAAACQAgBTsAAI8LACA8AACUCwAghQQAAJALACCGBAAAkwsAIIsEAADrAwAgCAQAAJwHACAGAACdBwAg-gIBAAAAAfsCAQAAAAH9AgEAAAABwAMBAAAAAcEDQAAAAAHCA0AAAAABAzsAAJELACCFBAAAkgsAIIsEAAAJACADOwAAjwsAIIUEAACQCwAgiwQAAOsDACAIBAAAnAcAIAUAAKgHACD6AgEAAAAB-wIBAAAAAf0CAQAAAAG_AwEAAAABwQNAAAAAAcIDQAAAAAECAAAADQAgOwAApwcAIAMAAAANACA7AACnBwAgPAAApQcAIAE0AACOCwAwAgAAAA0AIDQAAKUHACACAAAAlgcAIDQAAKQHACAG-gIBAOcFACH7AgEA5wUAIf0CAQD8BQAhvwMBAOcFACHBA0AA6QUAIcIDQACLBgAhCAQAAJkHACAFAACmBwAg-gIBAOcFACH7AgEA5wUAIf0CAQD8BQAhvwMBAOcFACHBA0AA6QUAIcIDQACLBgAhBTsAAIkLACA8AACMCwAghQQAAIoLACCGBAAAiwsAIIsEAADrAwAgCAQAAJwHACAFAACoBwAg-gIBAAAAAfsCAQAAAAH9AgEAAAABvwMBAAAAAcEDQAAAAAHCA0AAAAABAzsAAIkLACCFBAAAigsAIIsEAADrAwAgCAQAALcHACAJAAC4BwAg-gIBAAAAAfsCAQAAAAG6AwEAAAABvAMBAAAAAb0DQAAAAAG-A0AAAAABAgAAABoAIDsAALYHACADAAAAGgAgOwAAtgcAIDwAALMHACABNAAAiAsAMA0EAAC7BQAgCQAA1wUAIA0AAK8FACD3AgAA1gUAMPgCAAAYABD5AgAA1gUAMPoCAQAAAAH7AgEAwQQAIboDAQDBBAAhuwMBAMEEACG8AwEA2AQAIb0DQADdBAAhvgNAANwEACECAAAAGgAgNAAAswcAIAIAAACxBwAgNAAAsgcAIAr3AgAAsAcAMPgCAACxBwAQ-QIAALAHADD6AgEAwQQAIfsCAQDBBAAhugMBAMEEACG7AwEAwQQAIbwDAQDYBAAhvQNAAN0EACG-A0AA3AQAIQr3AgAAsAcAMPgCAACxBwAQ-QIAALAHADD6AgEAwQQAIfsCAQDBBAAhugMBAMEEACG7AwEAwQQAIbwDAQDYBAAhvQNAAN0EACG-A0AA3AQAIQb6AgEA5wUAIfsCAQDnBQAhugMBAOcFACG8AwEA_AUAIb0DQADpBQAhvgNAAIsGACEIBAAAtAcAIAkAALUHACD6AgEA5wUAIfsCAQDnBQAhugMBAOcFACG8AwEA_AUAIb0DQADpBQAhvgNAAIsGACEFOwAAgAsAIDwAAIYLACCFBAAAgQsAIIYEAACFCwAgiwQAAAkAIAU7AAD-CgAgPAAAgwsAIIUEAAD_CgAghgQAAIILACCLBAAAsgEAIAgEAAC3BwAgCQAAuAcAIPoCAQAAAAH7AgEAAAABugMBAAAAAbwDAQAAAAG9A0AAAAABvgNAAAAAAQM7AACACwAghQQAAIELACCLBAAACQAgAzsAAP4KACCFBAAA_woAIIsEAACyAQAgBgkAAMcHACD6AgEAAAABjgMgAAAAAboDAQAAAAHzAwAAAPMDAvQDQAAAAAECAAAAEQAgOwAAxgcAIAMAAAARACA7AADGBwAgPAAAxAcAIAE0AAD9CgAwDAEAAK8FACAJAADXBQAg9wIAANwFADD4AgAADwAQ-QIAANwFADD6AgEAAAABjgMgAMMEACG6AwEAwQQAIecDAQDBBAAh8wMAAN0F8wMi9ANAAN0EACGCBAAA2wUAIAIAAAARACA0AADEBwAgAgAAAMEHACA0AADCBwAgCfcCAADABwAw-AIAAMEHABD5AgAAwAcAMPoCAQDBBAAhjgMgAMMEACG6AwEAwQQAIecDAQDBBAAh8wMAAN0F8wMi9ANAAN0EACEJ9wIAAMAHADD4AgAAwQcAEPkCAADABwAw-gIBAMEEACGOAyAAwwQAIboDAQDBBAAh5wMBAMEEACHzAwAA3QXzAyL0A0AA3QQAIQX6AgEA5wUAIY4DIADoBQAhugMBAOcFACHzAwAAwwfzAyL0A0AA6QUAIQGIBAAAAPMDAgYJAADFBwAg-gIBAOcFACGOAyAA6AUAIboDAQDnBQAh8wMAAMMH8wMi9ANAAOkFACEFOwAA-AoAIDwAAPsKACCFBAAA-QoAIIYEAAD6CgAgiwQAALIBACAGCQAAxwcAIPoCAQAAAAGOAyAAAAABugMBAAAAAfMDAAAA8wMC9ANAAAAAAQM7AAD4CgAghQQAAPkKACCLBAAAsgEAIAsMAADYCAAgJQAA2QgAIPoCAQAAAAH_AkAAAAABiwMBAAAAAZIDAQAAAAGhAyAAAAABogNAAAAAAaMDQAAAAAH1AwEAAAAB9gMBAAAAAQIAAACaAQAgOwAAyAcAIAMAAAAFACA7AADIBwAgPAAAzAcAIA0AAAAFACAMAADNBwAgJQAAzgcAIDQAAMwHACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGSAwEA5wUAIaEDIADoBQAhogNAAIsGACGjA0AA6QUAIfUDAQD8BQAh9gMBAPwFACELDAAAzQcAICUAAM4HACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGSAwEA5wUAIaEDIADoBQAhogNAAIsGACGjA0AA6QUAIfUDAQD8BQAh9gMBAPwFACELOwAA3QcAMDwAAOIHADCFBAAA3gcAMIYEAADfBwAwhwQAAOAHACCIBAAA4QcAMIkEAADhBwAwigQAAOEHADCLBAAA4QcAMIwEAADjBwAwjQQAAOQHADALOwAAzwcAMDwAANQHADCFBAAA0AcAMIYEAADRBwAwhwQAANIHACCIBAAA0wcAMIkEAADTBwAwigQAANMHADCLBAAA0wcAMIwEAADVBwAwjQQAANYHADAGBAAA3AcAIPoCAQAAAAH7AgEAAAAB_wJAAAAAAfADAgAAAAHxAwEAAAABAgAAAFMAIDsAANsHACADAAAAUwAgOwAA2wcAIDwAANkHACABNAAA9woAMAsEAAC7BQAgCAAAvAUAIPcCAAC6BQAw-AIAADsAEPkCAAC6BQAw-gIBAAAAAfsCAQAAAAH_AkAA3QQAIakDAQDBBAAh8AMCAO0EACHxAwEA2AQAIQIAAABTACA0AADZBwAgAgAAANcHACA0AADYBwAgCfcCAADWBwAw-AIAANcHABD5AgAA1gcAMPoCAQDBBAAh-wIBAMEEACH_AkAA3QQAIakDAQDBBAAh8AMCAO0EACHxAwEA2AQAIQn3AgAA1gcAMPgCAADXBwAQ-QIAANYHADD6AgEAwQQAIfsCAQDBBAAh_wJAAN0EACGpAwEAwQQAIfADAgDtBAAh8QMBANgEACEF-gIBAOcFACH7AgEA5wUAIf8CQADpBQAh8AMCAO0GACHxAwEA_AUAIQYEAADaBwAg-gIBAOcFACH7AgEA5wUAIf8CQADpBQAh8AMCAO0GACHxAwEA_AUAIQU7AADyCgAgPAAA9QoAIIUEAADzCgAghgQAAPQKACCLBAAACQAgBgQAANwHACD6AgEAAAAB-wIBAAAAAf8CQAAAAAHwAwIAAAAB8QMBAAAAAQM7AADyCgAghQQAAPMKACCLBAAACQAgHAcAAM0IACAQAADOCAAgEgAAzwgAIBUAANAIACAWAADRCAAgGAAA0ggAIBoAANMIACAcAADUCAAgHQAA1QgAIB4AANYIACAkAADXCAAg-gIBAAAAAf8CQAAAAAGcAwAAALIDAqIDQAAAAAGjA0AAAAABpAMBAAAAAagDAQAAAAGqAwEAAAABrAMAAACsAwKtAwEAAAABrgMBAAAAAbADAAAAsAMCsgNAAAAAAbMDQAAAAAG0A0AAAAABtQNAAAAAAbYDQAAAAAECAAAACQAgOwAAzAgAIAMAAAAJACA7AADMCAAgPAAA6QcAIAE0AADxCgAwIQcAAOEEACAIAAC8BQAgEAAA7gQAIBIAANcFACAVAADiBQAgFgAA4AQAIBgAAOIEACAaAADjBAAgHAAA5AQAIB0AAOUEACAeAADjBQAgJAAA5wQAIPcCAADfBQAw-AIAAAcAEPkCAADfBQAw-gIBAAAAAf8CQADdBAAhnAMAANIFsgMiogNAANwEACGjA0AA3QQAIaQDAQDBBAAhqAMBAAAAAakDAQDBBAAhqgMBAMEEACGsAwAA4AWsAyKtAwEAwgQAIa4DAQDCBAAhsAMAAOEFsAMisgNAANwEACGzA0AA3AQAIbQDQADcBAAhtQNAANwEACG2A0AA3AQAIQIAAAAJACA0AADpBwAgAgAAAOUHACA0AADmBwAgFfcCAADkBwAw-AIAAOUHABD5AgAA5AcAMPoCAQDBBAAh_wJAAN0EACGcAwAA0gWyAyKiA0AA3AQAIaMDQADdBAAhpAMBAMEEACGoAwEAwgQAIakDAQDBBAAhqgMBAMEEACGsAwAA4AWsAyKtAwEAwgQAIa4DAQDCBAAhsAMAAOEFsAMisgNAANwEACGzA0AA3AQAIbQDQADcBAAhtQNAANwEACG2A0AA3AQAIRX3AgAA5AcAMPgCAADlBwAQ-QIAAOQHADD6AgEAwQQAIf8CQADdBAAhnAMAANIFsgMiogNAANwEACGjA0AA3QQAIaQDAQDBBAAhqAMBAMIEACGpAwEAwQQAIaoDAQDBBAAhrAMAAOAFrAMirQMBAMIEACGuAwEAwgQAIbADAADhBbADIrIDQADcBAAhswNAANwEACG0A0AA3AQAIbUDQADcBAAhtgNAANwEACER-gIBAOcFACH_AkAA6QUAIZwDAACJB7IDIqIDQACLBgAhowNAAOkFACGkAwEA5wUAIagDAQDnBQAhqgMBAOcFACGsAwAA5wesAyKtAwEA5wUAIa4DAQDnBQAhsAMAAOgHsAMisgNAAIsGACGzA0AAiwYAIbQDQACLBgAhtQNAAIsGACG2A0AAiwYAIQGIBAAAAKwDAgGIBAAAALADAhwHAADqBwAgEAAA6wcAIBIAAOwHACAVAADtBwAgFgAA7gcAIBgAAO8HACAaAADwBwAgHAAA8QcAIB0AAPIHACAeAADzBwAgJAAA9AcAIPoCAQDnBQAh_wJAAOkFACGcAwAAiQeyAyKiA0AAiwYAIaMDQADpBQAhpAMBAOcFACGoAwEA5wUAIaoDAQDnBQAhrAMAAOcHrAMirQMBAOcFACGuAwEA5wUAIbADAADoB7ADIrIDQACLBgAhswNAAIsGACG0A0AAiwYAIbUDQACLBgAhtgNAAIsGACELOwAAwwgAMDwAAMcIADCFBAAAxAgAMIYEAADFCAAwhwQAAMYIACCIBAAAkgcAMIkEAACSBwAwigQAAJIHADCLBAAAkgcAMIwEAADICAAwjQQAAJUHADAFOwAAvwoAIDwAAO8KACCFBAAAwAoAIIYEAADuCgAgiwQAABUAIAU7AAC9CgAgPAAA7AoAIIUEAAC-CgAghgQAAOsKACCLBAAAsgEAIAc7AAC8CAAgPAAAvwgAIIUEAAC9CAAghgQAAL4IACCJBAAAJAAgigQAACQAIIsEAAAnACALOwAAsQgAMDwAALUIADCFBAAAsggAMIYEAACzCAAwhwQAALQIACCIBAAArQcAMIkEAACtBwAwigQAAK0HADCLBAAArQcAMIwEAAC2CAAwjQQAALAHADALOwAApggAMDwAAKoIADCFBAAApwgAMIYEAACoCAAwhwQAAKkIACCIBAAAggcAMIkEAACCBwAwigQAAIIHADCLBAAAggcAMIwEAACrCAAwjQQAAIUHADALOwAAnQgAMDwAAKEIADCFBAAAnggAMIYEAACfCAAwhwQAAKAIACCIBAAA9gYAMIkEAAD2BgAwigQAAPYGADCLBAAA9gYAMIwEAACiCAAwjQQAAPkGADALOwAAkggAMDwAAJYIADCFBAAAkwgAMIYEAACUCAAwhwQAAJUIACCIBAAA5gYAMIkEAADmBgAwigQAAOYGADCLBAAA5gYAMIwEAACXCAAwjQQAAOkGADALOwAAhwgAMDwAAIsIADCFBAAAiAgAMIYEAACJCAAwhwQAAIoIACCIBAAA1wYAMIkEAADXBgAwigQAANcGADCLBAAA1wYAMIwEAACMCAAwjQQAANoGADAHOwAAgAgAIDwAAIMIACCFBAAAgQgAIIYEAACCCAAgiQQAADsAIIoEAAA7ACCLBAAAUwAgCzsAAPUHADA8AAD5BwAwhQQAAPYHADCGBAAA9wcAMIcEAAD4BwAgiAQAAJsGADCJBAAAmwYAMIoEAACbBgAwiwQAAJsGADCMBAAA-gcAMI0EAACeBgAwDB8AAP8HACAjAADGBgAg-gIBAAAAAf8CQAAAAAGcAwAAAOUDAqMDQAAAAAHNAxAAAAABzgMBAAAAAeEDAQAAAAHjAwAAAOMDAuUDQAAAAAHmA0AAAAABAgAAAD8AIDsAAP4HACADAAAAPwAgOwAA_gcAIDwAAPwHACABNAAA6goAMAIAAAA_ACA0AAD8BwAgAgAAAJ8GACA0AAD7BwAgCvoCAQDnBQAh_wJAAOkFACGcAwAAowblAyKjA0AA6QUAIc0DEACiBgAhzgMBAOcFACHhAwEA5wUAIeMDAAChBuMDIuUDQACLBgAh5gNAAIsGACEMHwAA_QcAICMAAKYGACD6AgEA5wUAIf8CQADpBQAhnAMAAKMG5QMiowNAAOkFACHNAxAAogYAIc4DAQDnBQAh4QMBAOcFACHjAwAAoQbjAyLlA0AAiwYAIeYDQACLBgAhBTsAAOUKACA8AADoCgAghQQAAOYKACCGBAAA5woAIIsEAADrAwAgDB8AAP8HACAjAADGBgAg-gIBAAAAAf8CQAAAAAGcAwAAAOUDAqMDQAAAAAHNAxAAAAABzgMBAAAAAeEDAQAAAAHjAwAAAOMDAuUDQAAAAAHmA0AAAAABAzsAAOUKACCFBAAA5goAIIsEAADrAwAgBggAAIYIACD6AgEAAAAB_wJAAAAAAakDAQAAAAHwAwIAAAAB8QMBAAAAAQIAAABTACA7AACACAAgAwAAADsAIDsAAIAIACA8AACECAAgCAAAADsAIAgAAIUIACA0AACECAAg-gIBAOcFACH_AkAA6QUAIakDAQDnBQAh8AMCAO0GACHxAwEA_AUAIQYIAACFCAAg-gIBAOcFACH_AkAA6QUAIakDAQDnBQAh8AMCAO0GACHxAwEA_AUAIQU7AADgCgAgPAAA4woAIIUEAADhCgAghgQAAOIKACCLBAAAmgEAIAM7AADgCgAghQQAAOEKACCLBAAAmgEAIAcBAACRCAAg-gIBAAAAAf8CQAAAAAGsAwAAAOkDAt4DgAAAAAHnAwEAAAAB6QNAAAAAAQIAAAA5ACA7AACQCAAgAwAAADkAIDsAAJAIACA8AACOCAAgATQAAN8KADACAAAAOQAgNAAAjggAIAIAAADbBgAgNAAAjQgAIAb6AgEA5wUAIf8CQADpBQAhrAMAAN0G6QMi3gOAAAAAAecDAQDnBQAh6QNAAIsGACEHAQAAjwgAIPoCAQDnBQAh_wJAAOkFACGsAwAA3QbpAyLeA4AAAAAB5wMBAOcFACHpA0AAiwYAIQU7AADaCgAgPAAA3QoAIIUEAADbCgAghgQAANwKACCLBAAA6wMAIAcBAACRCAAg-gIBAAAAAf8CQAAAAAGsAwAAAOkDAt4DgAAAAAHnAwEAAAAB6QNAAAAAAQM7AADaCgAghQQAANsKACCLBAAA6wMAIAkbAACcCAAg-gIBAAAAAf8CQAAAAAHjAwAAAOwDAuoDAQAAAAHsAwEAAAAB7QMBAAAAAe4DAQAAAAHvAwIAAAABAgAAADUAIDsAAJsIACADAAAANQAgOwAAmwgAIDwAAJkIACABNAAA2QoAMAIAAAA1ACA0AACZCAAgAgAAAOoGACA0AACYCAAgCPoCAQDnBQAh_wJAAOkFACHjAwAA7AbsAyLqAwEA5wUAIewDAQDnBQAh7QMBAOcFACHuAwEA5wUAIe8DAgDtBgAhCRsAAJoIACD6AgEA5wUAIf8CQADpBQAh4wMAAOwG7AMi6gMBAOcFACHsAwEA5wUAIe0DAQDnBQAh7gMBAOcFACHvAwIA7QYAIQU7AADUCgAgPAAA1woAIIUEAADVCgAghgQAANYKACCLBAAA6wMAIAkbAACcCAAg-gIBAAAAAf8CQAAAAAHjAwAAAOwDAuoDAQAAAAHsAwEAAAAB7QMBAAAAAe4DAQAAAAHvAwIAAAABAzsAANQKACCFBAAA1QoAIIsEAADrAwAgBhkAAO0FACD6AgEAAAAB_AIBAAAAAf0CAQAAAAH-AiAAAAAB_wJAAAAAAQIAAAAxACA7AAClCAAgAwAAADEAIDsAAKUIACA8AACkCAAgATQAANMKADACAAAAMQAgNAAApAgAIAIAAAD6BgAgNAAAowgAIAX6AgEA5wUAIfwCAQDnBQAh_QIBAOcFACH-AiAA6AUAIf8CQADpBQAhBhkAAOsFACD6AgEA5wUAIfwCAQDnBQAh_QIBAOcFACH-AiAA6AUAIf8CQADpBQAhBhkAAO0FACD6AgEAAAAB_AIBAAAAAf0CAQAAAAH-AiAAAAAB_wJAAAAAAQcXAACwCAAg-gIBAAAAAf0CAQAAAAH_AkAAAAABtwMBAAAAAbgDAAAAsgMDuQMAAACyAwICAAAALQAgOwAArwgAIAMAAAAtACA7AACvCAAgPAAArQgAIAE0AADSCgAwAgAAAC0AIDQAAK0IACACAAAAhgcAIDQAAKwIACAG-gIBAOcFACH9AgEA_AUAIf8CQADpBQAhtwMBAOcFACG4AwAAiAeyAyO5AwAAiQeyAyIHFwAArggAIPoCAQDnBQAh_QIBAPwFACH_AkAA6QUAIbcDAQDnBQAhuAMAAIgHsgMjuQMAAIkHsgMiBTsAAM0KACA8AADQCgAghQQAAM4KACCGBAAAzwoAIIsEAADrAwAgBxcAALAIACD6AgEAAAAB_QIBAAAAAf8CQAAAAAG3AwEAAAABuAMAAACyAwO5AwAAALIDAgM7AADNCgAghQQAAM4KACCLBAAA6wMAIAgJAAC4BwAgDQAAuwgAIPoCAQAAAAG6AwEAAAABuwMBAAAAAbwDAQAAAAG9A0AAAAABvgNAAAAAAQIAAAAaACA7AAC6CAAgAwAAABoAIDsAALoIACA8AAC4CAAgATQAAMwKADACAAAAGgAgNAAAuAgAIAIAAACxBwAgNAAAtwgAIAb6AgEA5wUAIboDAQDnBQAhuwMBAOcFACG8AwEA_AUAIb0DQADpBQAhvgNAAIsGACEICQAAtQcAIA0AALkIACD6AgEA5wUAIboDAQDnBQAhuwMBAOcFACG8AwEA_AUAIb0DQADpBQAhvgNAAIsGACEFOwAAxwoAIDwAAMoKACCFBAAAyAoAIIYEAADJCgAgiwQAAOsDACAICQAAuAcAIA0AALsIACD6AgEAAAABugMBAAAAAbsDAQAAAAG8AwEAAAABvQNAAAAAAb4DQAAAAAEDOwAAxwoAIIUEAADICgAgiwQAAOsDACAHFAAAwggAIPoCAQAAAAHDAwEAAAABxAMBAAAAAcUDAQAAAAHGAxAAAAABxwMQAAAAAQIAAAAnACA7AAC8CAAgAwAAACQAIDsAALwIACA8AADACAAgCQAAACQAIBQAAMEIACA0AADACAAg-gIBAOcFACHDAwEA5wUAIcQDAQDnBQAhxQMBAPwFACHGAxAA_QUAIccDEAD9BQAhBxQAAMEIACD6AgEA5wUAIcMDAQDnBQAhxAMBAOcFACHFAwEA_AUAIcYDEAD9BQAhxwMQAP0FACEFOwAAwgoAIDwAAMUKACCFBAAAwwoAIIYEAADECgAgiwQAAIMEACADOwAAwgoAIIUEAADDCgAgiwQAAIMEACAIBQAAqAcAIAYAAJ0HACD6AgEAAAAB_QIBAAAAAb8DAQAAAAHAAwEAAAABwQNAAAAAAcIDQAAAAAECAAAADQAgOwAAywgAIAMAAAANACA7AADLCAAgPAAAyggAIAE0AADBCgAwAgAAAA0AIDQAAMoIACACAAAAlgcAIDQAAMkIACAG-gIBAOcFACH9AgEA_AUAIb8DAQDnBQAhwAMBAOcFACHBA0AA6QUAIcIDQACLBgAhCAUAAKYHACAGAACaBwAg-gIBAOcFACH9AgEA_AUAIb8DAQDnBQAhwAMBAOcFACHBA0AA6QUAIcIDQACLBgAhCAUAAKgHACAGAACdBwAg-gIBAAAAAf0CAQAAAAG_AwEAAAABwAMBAAAAAcEDQAAAAAHCA0AAAAABHAcAAM0IACAQAADOCAAgEgAAzwgAIBUAANAIACAWAADRCAAgGAAA0ggAIBoAANMIACAcAADUCAAgHQAA1QgAIB4AANYIACAkAADXCAAg-gIBAAAAAf8CQAAAAAGcAwAAALIDAqIDQAAAAAGjA0AAAAABpAMBAAAAAagDAQAAAAGqAwEAAAABrAMAAACsAwKtAwEAAAABrgMBAAAAAbADAAAAsAMCsgNAAAAAAbMDQAAAAAG0A0AAAAABtQNAAAAAAbYDQAAAAAEEOwAAwwgAMIUEAADECAAwhwQAAMYIACCLBAAAkgcAMAM7AAC_CgAghQQAAMAKACCLBAAAFQAgAzsAAL0KACCFBAAAvgoAIIsEAACyAQAgAzsAALwIACCFBAAAvQgAIIsEAAAnACAEOwAAsQgAMIUEAACyCAAwhwQAALQIACCLBAAArQcAMAQ7AACmCAAwhQQAAKcIADCHBAAAqQgAIIsEAACCBwAwBDsAAJ0IADCFBAAAnggAMIcEAACgCAAgiwQAAPYGADAEOwAAkggAMIUEAACTCAAwhwQAAJUIACCLBAAA5gYAMAQ7AACHCAAwhQQAAIgIADCHBAAAiggAIIsEAADXBgAwAzsAAIAIACCFBAAAgQgAIIsEAABTACAEOwAA9QcAMIUEAAD2BwAwhwQAAPgHACCLBAAAmwYAMAQ7AADdBwAwhQQAAN4HADCHBAAA4AcAIIsEAADhBwAwBDsAAM8HADCFBAAA0AcAMIcEAADSBwAgiwQAANMHADADOwAAyAcAIIUEAADJBwAgiwQAAJoBACAEOwAAuQcAMIUEAAC6BwAwhwQAALwHACCLBAAAvQcAMAQ7AACpBwAwhQQAAKoHADCHBAAArAcAIIsEAACtBwAwBDsAAJ4HADCFBAAAnwcAMIcEAAChBwAgiwQAAJIHADAEOwAAjgcAMIUEAACPBwAwhwQAAJEHACCLBAAAkgcAMAQ7AAD-BgAwhQQAAP8GADCHBAAAgQcAIIsEAACCBwAwBDsAAPIGADCFBAAA8wYAMIcEAAD1BgAgiwQAAPYGADAEOwAA4gYAMIUEAADjBgAwhwQAAOUGACCLBAAA5gYAMAQ7AADTBgAwhQQAANQGADCHBAAA1gYAIIsEAADXBgAwBDsAAMcGADCFBAAAyAYAMIcEAADKBgAgiwQAAMsGADAEOwAAlwYAMIUEAACYBgAwhwQAAJoGACCLBAAAmwYAMAYBAAD4CQAgDAAA8gkAICUAAPkJACCiAwAAhAYAIPUDAACEBgAg9gMAAIQGACAAAAAAAAAAAAAAAAAAAAU7AAC4CgAgPAAAuwoAIIUEAAC5CgAghgQAALoKACCLBAAAFQAgAzsAALgKACCFBAAAuQoAIIsEAAAVACAGCQAAjAoAIAwAAPIJACARAACNCgAgogMAAIQGACCuAwAAhAYAIPgDAACEBgAgAAAABTsAALMKACA8AAC2CgAghQQAALQKACCGBAAAtQoAIIsEAACaAQAgAzsAALMKACCFBAAAtAoAIIsEAACaAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAU7AACuCgAgPAAAsQoAIIUEAACvCgAghgQAALAKACCLBAAAPwAgAzsAAK4KACCFBAAArwoAIIsEAAA_ACAAAAAFOwAAqQoAIDwAAKwKACCFBAAAqgoAIIYEAACrCgAgiwQAAEMAIAM7AACpCgAghQQAAKoKACCLBAAAQwAgAAAAAAAAAAAAAAAAAAAAAAAAAAAABTsAAKQKACA8AACnCgAghQQAAKUKACCGBAAApgoAIIsEAADrAwAgAzsAAKQKACCFBAAApQoAIIsEAADrAwAgAAAACzsAAOQJADA8AADoCQAwhQQAAOUJADCGBAAA5gkAMIcEAADnCQAgiAQAAL0HADCJBAAAvQcAMIoEAAC9BwAwiwQAAL0HADCMBAAA6QkAMI0EAADABwAwCzsAAMYJADA8AADLCQAwhQQAAMcJADCGBAAAyAkAMIcEAADJCQAgiAQAAMoJADCJBAAAygkAMIoEAADKCQAwiwQAAMoJADCMBAAAzAkAMI0EAADNCQAwCzsAAL0JADA8AADBCQAwhQQAAL4JADCGBAAAvwkAMIcEAADACQAgiAQAAOEHADCJBAAA4QcAMIoEAADhBwAwiwQAAOEHADCMBAAAwgkAMI0EAADkBwAwCzsAALQJADA8AAC4CQAwhQQAALUJADCGBAAAtgkAMIcEAAC3CQAgiAQAAK0HADCJBAAArQcAMIoEAACtBwAwiwQAAK0HADCMBAAAuQkAMI0EAACwBwAwCAQAALcHACANAAC7CAAg-gIBAAAAAfsCAQAAAAG7AwEAAAABvAMBAAAAAb0DQAAAAAG-A0AAAAABAgAAABoAIDsAALwJACADAAAAGgAgOwAAvAkAIDwAALsJACABNAAAowoAMAIAAAAaACA0AAC7CQAgAgAAALEHACA0AAC6CQAgBvoCAQDnBQAh-wIBAOcFACG7AwEA5wUAIbwDAQD8BQAhvQNAAOkFACG-A0AAiwYAIQgEAAC0BwAgDQAAuQgAIPoCAQDnBQAh-wIBAOcFACG7AwEA5wUAIbwDAQD8BQAhvQNAAOkFACG-A0AAiwYAIQgEAAC3BwAgDQAAuwgAIPoCAQAAAAH7AgEAAAABuwMBAAAAAbwDAQAAAAG9A0AAAAABvgNAAAAAARwHAADNCAAgCAAA-wgAIBAAAM4IACAVAADQCAAgFgAA0QgAIBgAANIIACAaAADTCAAgHAAA1AgAIB0AANUIACAeAADWCAAgJAAA1wgAIPoCAQAAAAH_AkAAAAABnAMAAACyAwKiA0AAAAABowNAAAAAAaQDAQAAAAGoAwEAAAABqQMBAAAAAawDAAAArAMCrQMBAAAAAa4DAQAAAAGwAwAAALADArIDQAAAAAGzA0AAAAABtANAAAAAAbUDQAAAAAG2A0AAAAABAgAAAAkAIDsAAMUJACADAAAACQAgOwAAxQkAIDwAAMQJACABNAAAogoAMAIAAAAJACA0AADECQAgAgAAAOUHACA0AADDCQAgEfoCAQDnBQAh_wJAAOkFACGcAwAAiQeyAyKiA0AAiwYAIaMDQADpBQAhpAMBAOcFACGoAwEA5wUAIakDAQDnBQAhrAMAAOcHrAMirQMBAOcFACGuAwEA5wUAIbADAADoB7ADIrIDQACLBgAhswNAAIsGACG0A0AAiwYAIbUDQACLBgAhtgNAAIsGACEcBwAA6gcAIAgAAPoIACAQAADrBwAgFQAA7QcAIBYAAO4HACAYAADvBwAgGgAA8AcAIBwAAPEHACAdAADyBwAgHgAA8wcAICQAAPQHACD6AgEA5wUAIf8CQADpBQAhnAMAAIkHsgMiogNAAIsGACGjA0AA6QUAIaQDAQDnBQAhqAMBAOcFACGpAwEA5wUAIawDAADnB6wDIq0DAQDnBQAhrgMBAOcFACGwAwAA6AewAyKyA0AAiwYAIbMDQACLBgAhtANAAIsGACG1A0AAiwYAIbYDQACLBgAhHAcAAM0IACAIAAD7CAAgEAAAzggAIBUAANAIACAWAADRCAAgGAAA0ggAIBoAANMIACAcAADUCAAgHQAA1QgAIB4AANYIACAkAADXCAAg-gIBAAAAAf8CQAAAAAGcAwAAALIDAqIDQAAAAAGjA0AAAAABpAMBAAAAAagDAQAAAAGpAwEAAAABrAMAAACsAwKtAwEAAAABrgMBAAAAAbADAAAAsAMCsgNAAAAAAbMDQAAAAAG0A0AAAAABtQNAAAAAAbYDQAAAAAEMDAAA4gkAIBEAAOMJACD6AgEAAAAB_wJAAAAAAYsDAQAAAAGOAyAAAAABogNAAAAAAaMDQAAAAAGuAwEAAAABzgMBAAAAAfcDIAAAAAH4AxAAAAABAgAAABUAIDsAAOEJACADAAAAFQAgOwAA4QkAIDwAANAJACABNAAAoQoAMBIJAADXBQAgDAAArAUAIBEAANoFACD3AgAA2QUAMPgCAAATABD5AgAA2QUAMPoCAQAAAAH_AkAA3QQAIYsDAQDCBAAhjgMgAMMEACGiA0AA3AQAIaMDQADdBAAhrgMBANgEACG6AwEAwQQAIc4DAQDCBAAh9wMgAMMEACH4AxAA1AUAIYEEAADYBQAgAgAAABUAIDQAANAJACACAAAAzgkAIDQAAM8JACAO9wIAAM0JADD4AgAAzgkAEPkCAADNCQAw-gIBAMEEACH_AkAA3QQAIYsDAQDCBAAhjgMgAMMEACGiA0AA3AQAIaMDQADdBAAhrgMBANgEACG6AwEAwQQAIc4DAQDCBAAh9wMgAMMEACH4AxAA1AUAIQ73AgAAzQkAMPgCAADOCQAQ-QIAAM0JADD6AgEAwQQAIf8CQADdBAAhiwMBAMIEACGOAyAAwwQAIaIDQADcBAAhowNAAN0EACGuAwEA2AQAIboDAQDBBAAhzgMBAMIEACH3AyAAwwQAIfgDEADUBQAhCvoCAQDnBQAh_wJAAOkFACGLAwEA5wUAIY4DIADoBQAhogNAAIsGACGjA0AA6QUAIa4DAQD8BQAhzgMBAOcFACH3AyAA6AUAIfgDEAD9BQAhDAwAANEJACARAADSCQAg-gIBAOcFACH_AkAA6QUAIYsDAQDnBQAhjgMgAOgFACGiA0AAiwYAIaMDQADpBQAhrgMBAPwFACHOAwEA5wUAIfcDIADoBQAh-AMQAP0FACELOwAA2AkAMDwAANwJADCFBAAA2QkAMIYEAADaCQAwhwQAANsJACCIBAAA4QcAMIkEAADhBwAwigQAAOEHADCLBAAA4QcAMIwEAADdCQAwjQQAAOQHADAHOwAA0wkAIDwAANYJACCFBAAA1AkAIIYEAADVCQAgiQQAACEAIIoEAAAhACCLBAAA0wMAIAX6AgEAAAABjgMgAAAAAaUDAgAAAAGmAwIAAAABpwMCAAAAAQIAAADTAwAgOwAA0wkAIAMAAAAhACA7AADTCQAgPAAA1wkAIAcAAAAhACA0AADXCQAg-gIBAOcFACGOAyAA6AUAIaUDAgDtBgAhpgMCAO0GACGnAwIA7QYAIQX6AgEA5wUAIY4DIADoBQAhpQMCAO0GACGmAwIA7QYAIacDAgDtBgAhHAcAAM0IACAIAAD7CAAgEgAAzwgAIBUAANAIACAWAADRCAAgGAAA0ggAIBoAANMIACAcAADUCAAgHQAA1QgAIB4AANYIACAkAADXCAAg-gIBAAAAAf8CQAAAAAGcAwAAALIDAqIDQAAAAAGjA0AAAAABqAMBAAAAAakDAQAAAAGqAwEAAAABrAMAAACsAwKtAwEAAAABrgMBAAAAAbADAAAAsAMCsgNAAAAAAbMDQAAAAAG0A0AAAAABtQNAAAAAAbYDQAAAAAECAAAACQAgOwAA4AkAIAMAAAAJACA7AADgCQAgPAAA3wkAIAE0AACgCgAwAgAAAAkAIDQAAN8JACACAAAA5QcAIDQAAN4JACAR-gIBAOcFACH_AkAA6QUAIZwDAACJB7IDIqIDQACLBgAhowNAAOkFACGoAwEA5wUAIakDAQDnBQAhqgMBAOcFACGsAwAA5wesAyKtAwEA5wUAIa4DAQDnBQAhsAMAAOgHsAMisgNAAIsGACGzA0AAiwYAIbQDQACLBgAhtQNAAIsGACG2A0AAiwYAIRwHAADqBwAgCAAA-ggAIBIAAOwHACAVAADtBwAgFgAA7gcAIBgAAO8HACAaAADwBwAgHAAA8QcAIB0AAPIHACAeAADzBwAgJAAA9AcAIPoCAQDnBQAh_wJAAOkFACGcAwAAiQeyAyKiA0AAiwYAIaMDQADpBQAhqAMBAOcFACGpAwEA5wUAIaoDAQDnBQAhrAMAAOcHrAMirQMBAOcFACGuAwEA5wUAIbADAADoB7ADIrIDQACLBgAhswNAAIsGACG0A0AAiwYAIbUDQACLBgAhtgNAAIsGACEcBwAAzQgAIAgAAPsIACASAADPCAAgFQAA0AgAIBYAANEIACAYAADSCAAgGgAA0wgAIBwAANQIACAdAADVCAAgHgAA1ggAICQAANcIACD6AgEAAAAB_wJAAAAAAZwDAAAAsgMCogNAAAAAAaMDQAAAAAGoAwEAAAABqQMBAAAAAaoDAQAAAAGsAwAAAKwDAq0DAQAAAAGuAwEAAAABsAMAAACwAwKyA0AAAAABswNAAAAAAbQDQAAAAAG1A0AAAAABtgNAAAAAAQwMAADiCQAgEQAA4wkAIPoCAQAAAAH_AkAAAAABiwMBAAAAAY4DIAAAAAGiA0AAAAABowNAAAAAAa4DAQAAAAHOAwEAAAAB9wMgAAAAAfgDEAAAAAEEOwAA2AkAMIUEAADZCQAwhwQAANsJACCLBAAA4QcAMAM7AADTCQAghQQAANQJACCLBAAA0wMAIAYBAACsCQAg-gIBAAAAAY4DIAAAAAHnAwEAAAAB8wMAAADzAwL0A0AAAAABAgAAABEAIDsAAOwJACADAAAAEQAgOwAA7AkAIDwAAOsJACABNAAAnwoAMAIAAAARACA0AADrCQAgAgAAAMEHACA0AADqCQAgBfoCAQDnBQAhjgMgAOgFACHnAwEA5wUAIfMDAADDB_MDIvQDQADpBQAhBgEAAKsJACD6AgEA5wUAIY4DIADoBQAh5wMBAOcFACHzAwAAwwfzAyL0A0AA6QUAIQYBAACsCQAg-gIBAAAAAY4DIAAAAAHnAwEAAAAB8wMAAADzAwL0A0AAAAABBDsAAOQJADCFBAAA5QkAMIcEAADnCQAgiwQAAL0HADAEOwAAxgkAMIUEAADHCQAwhwQAAMkJACCLBAAAygkAMAQ7AAC9CQAwhQQAAL4JADCHBAAAwAkAIIsEAADhBwAwBDsAALQJADCFBAAAtQkAMIcEAAC3CQAgiwQAAK0HADAAAAAAAAU7AACaCgAgPAAAnQoAIIUEAACbCgAghgQAAJwKACCLBAAA6wMAIAM7AACaCgAghQQAAJsKACCLBAAA6wMAIBIIAADlCAAgGgAA6ggAIB0AAOwIACAmAADmCAAgJwAA5wgAICgAAOgIACApAADoCAAgKgAA6QgAICsAAOsIACAsAADtCAAgLQAA7ggAIJMDAACEBgAglAMAAIQGACCVAwAAhAYAIJYDAACEBgAgngMAAIQGACCfAwAAhAYAIKIDAACEBgAgAAAAAAAABTsAAJUKACA8AACYCgAghQQAAJYKACCGBAAAlwoAIIsEAACyAQAgAzsAAJUKACCFBAAAlgoAIIsEAACyAQAgAAAABzsAAJAKACA8AACTCgAghQQAAJEKACCGBAAAkgoAIIkEAAADACCKBAAAAwAgiwQAAOsDACADOwAAkAoAIIUEAACRCgAgiwQAAOsDACASBwAA6AgAIAgAAOUIACAQAAD2CAAgEgAAjAoAIBUAAI4KACAWAADnCAAgGAAA6QgAIBoAAOoIACAcAADrCAAgHQAA7AgAIB4AAI8KACAkAADuCAAgogMAAIQGACCyAwAAhAYAILMDAACEBgAgtAMAAIQGACC1AwAAhAYAILYDAACEBgAgByAAAIgKACAiAACJCgAg0AMAAIQGACDRAwAAhAYAINIDAACEBgAg1AMAAIQGACDVAwAAhAYAIAUEAACGCgAgHwAA-AkAICMAAIoKACDlAwAAhAYAIOYDAACEBgAgAAABEwAAgwYAIAYKAADmCAAgCwAA8QkAIAwAAPIJACAOAADnCAAgogMAAIQGACCuAwAAhAYAIAEQAAD2CAAgBQQAAIYKACAUAACLCgAgxQMAAIQGACDGAwAAhAYAIMcDAACEBgAgAwQAAIYKACAIAADlCAAg8QMAAIQGACAcCAAA2ggAIBoAAOAIACAdAADiCAAgJgAA2wgAICcAANwIACAoAADdCAAgKQAA3ggAICoAAN8IACArAADhCAAgLQAA5AgAIPoCAQAAAAH_AkAAAAABiwMBAAAAAZIDAQAAAAGTAwEAAAABlAMBAAAAAZUDAQAAAAGWAwEAAAABmAMAAACYAwKaAwAAAJoDApwDAAAAnAMCnQMgAAAAAZ4DAQAAAAGfAwEAAAABoAMgAAAAAaEDIAAAAAGiA0AAAAABowNAAAAAAQIAAADrAwAgOwAAkAoAIAMAAAADACA7AACQCgAgPAAAlAoAIB4AAAADACAIAACMBgAgGgAAkgYAIB0AAJQGACAmAACNBgAgJwAAjgYAICgAAI8GACApAACQBgAgKgAAkQYAICsAAJMGACAtAACWBgAgNAAAlAoAIPoCAQDnBQAh_wJAAOkFACGLAwEA5wUAIZIDAQDnBQAhkwMBAPwFACGUAwEA_AUAIZUDAQD8BQAhlgMBAPwFACGYAwAAiAaYAyKaAwAAiQaaAyKcAwAAigacAyKdAyAA6AUAIZ4DAQD8BQAhnwMBAPwFACGgAyAA6AUAIaEDIADoBQAhogNAAIsGACGjA0AA6QUAIRwIAACMBgAgGgAAkgYAIB0AAJQGACAmAACNBgAgJwAAjgYAICgAAI8GACApAACQBgAgKgAAkQYAICsAAJMGACAtAACWBgAg-gIBAOcFACH_AkAA6QUAIYsDAQDnBQAhkgMBAOcFACGTAwEA_AUAIZQDAQD8BQAhlQMBAPwFACGWAwEA_AUAIZgDAACIBpgDIpoDAACJBpoDIpwDAACKBpwDIp0DIADoBQAhngMBAPwFACGfAwEA_AUAIaADIADoBQAhoQMgAOgFACGiA0AAiwYAIaMDQADpBQAhCwoAAO0JACAMAADvCQAgDgAA8AkAIPoCAQAAAAH_AkAAAAABiwMBAAAAAYwDAQAAAAGOAyAAAAABogNAAAAAAaMDQAAAAAGuAwEAAAABAgAAALIBACA7AACVCgAgAwAAALUBACA7AACVCgAgPAAAmQoAIA0AAAC1AQAgCgAAsAkAIAwAALIJACAOAACzCQAgNAAAmQoAIPoCAQDnBQAh_wJAAOkFACGLAwEA5wUAIYwDAQDnBQAhjgMgAOgFACGiA0AAiwYAIaMDQADpBQAhrgMBAPwFACELCgAAsAkAIAwAALIJACAOAACzCQAg-gIBAOcFACH_AkAA6QUAIYsDAQDnBQAhjAMBAOcFACGOAyAA6AUAIaIDQACLBgAhowNAAOkFACGuAwEA_AUAIRwaAADgCAAgHQAA4ggAICYAANsIACAnAADcCAAgKAAA3QgAICkAAN4IACAqAADfCAAgKwAA4QgAICwAAOMIACAtAADkCAAg-gIBAAAAAf8CQAAAAAGLAwEAAAABkgMBAAAAAZMDAQAAAAGUAwEAAAABlQMBAAAAAZYDAQAAAAGYAwAAAJgDApoDAAAAmgMCnAMAAACcAwKdAyAAAAABngMBAAAAAZ8DAQAAAAGgAyAAAAABoQMgAAAAAaIDQAAAAAGjA0AAAAABAgAAAOsDACA7AACaCgAgAwAAAAMAIDsAAJoKACA8AACeCgAgHgAAAAMAIBoAAJIGACAdAACUBgAgJgAAjQYAICcAAI4GACAoAACPBgAgKQAAkAYAICoAAJEGACArAACTBgAgLAAAlQYAIC0AAJYGACA0AACeCgAg-gIBAOcFACH_AkAA6QUAIYsDAQDnBQAhkgMBAOcFACGTAwEA_AUAIZQDAQD8BQAhlQMBAPwFACGWAwEA_AUAIZgDAACIBpgDIpoDAACJBpoDIpwDAACKBpwDIp0DIADoBQAhngMBAPwFACGfAwEA_AUAIaADIADoBQAhoQMgAOgFACGiA0AAiwYAIaMDQADpBQAhHBoAAJIGACAdAACUBgAgJgAAjQYAICcAAI4GACAoAACPBgAgKQAAkAYAICoAAJEGACArAACTBgAgLAAAlQYAIC0AAJYGACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGSAwEA5wUAIZMDAQD8BQAhlAMBAPwFACGVAwEA_AUAIZYDAQD8BQAhmAMAAIgGmAMimgMAAIkGmgMinAMAAIoGnAMinQMgAOgFACGeAwEA_AUAIZ8DAQD8BQAhoAMgAOgFACGhAyAA6AUAIaIDQACLBgAhowNAAOkFACEF-gIBAAAAAY4DIAAAAAHnAwEAAAAB8wMAAADzAwL0A0AAAAABEfoCAQAAAAH_AkAAAAABnAMAAACyAwKiA0AAAAABowNAAAAAAagDAQAAAAGpAwEAAAABqgMBAAAAAawDAAAArAMCrQMBAAAAAa4DAQAAAAGwAwAAALADArIDQAAAAAGzA0AAAAABtANAAAAAAbUDQAAAAAG2A0AAAAABCvoCAQAAAAH_AkAAAAABiwMBAAAAAY4DIAAAAAGiA0AAAAABowNAAAAAAa4DAQAAAAHOAwEAAAAB9wMgAAAAAfgDEAAAAAER-gIBAAAAAf8CQAAAAAGcAwAAALIDAqIDQAAAAAGjA0AAAAABpAMBAAAAAagDAQAAAAGpAwEAAAABrAMAAACsAwKtAwEAAAABrgMBAAAAAbADAAAAsAMCsgNAAAAAAbMDQAAAAAG0A0AAAAABtQNAAAAAAbYDQAAAAAEG-gIBAAAAAfsCAQAAAAG7AwEAAAABvAMBAAAAAb0DQAAAAAG-A0AAAAABHAgAANoIACAaAADgCAAgHQAA4ggAICcAANwIACAoAADdCAAgKQAA3ggAICoAAN8IACArAADhCAAgLAAA4wgAIC0AAOQIACD6AgEAAAAB_wJAAAAAAYsDAQAAAAGSAwEAAAABkwMBAAAAAZQDAQAAAAGVAwEAAAABlgMBAAAAAZgDAAAAmAMCmgMAAACaAwKcAwAAAJwDAp0DIAAAAAGeAwEAAAABnwMBAAAAAaADIAAAAAGhAyAAAAABogNAAAAAAaMDQAAAAAECAAAA6wMAIDsAAKQKACADAAAAAwAgOwAApAoAIDwAAKgKACAeAAAAAwAgCAAAjAYAIBoAAJIGACAdAACUBgAgJwAAjgYAICgAAI8GACApAACQBgAgKgAAkQYAICsAAJMGACAsAACVBgAgLQAAlgYAIDQAAKgKACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGSAwEA5wUAIZMDAQD8BQAhlAMBAPwFACGVAwEA_AUAIZYDAQD8BQAhmAMAAIgGmAMimgMAAIkGmgMinAMAAIoGnAMinQMgAOgFACGeAwEA_AUAIZ8DAQD8BQAhoAMgAOgFACGhAyAA6AUAIaIDQACLBgAhowNAAOkFACEcCAAAjAYAIBoAAJIGACAdAACUBgAgJwAAjgYAICgAAI8GACApAACQBgAgKgAAkQYAICsAAJMGACAsAACVBgAgLQAAlgYAIPoCAQDnBQAh_wJAAOkFACGLAwEA5wUAIZIDAQDnBQAhkwMBAPwFACGUAwEA_AUAIZUDAQD8BQAhlgMBAPwFACGYAwAAiAaYAyKaAwAAiQaaAyKcAwAAigacAyKdAyAA6AUAIZ4DAQD8BQAhnwMBAPwFACGgAyAA6AUAIaEDIADoBQAhogNAAIsGACGjA0AA6QUAIRAgAACQCQAg-gIBAAAAAf8CQAAAAAGcAwAAANQDAqMDQAAAAAHIAwEAAAABygMAAADKAwLMAwAAAMwDAs0DEAAAAAHOAwEAAAABzwMBAAAAAdADAQAAAAHRAwEAAAAB0gMBAAAAAdQDgAAAAAHVA0AAAAABAgAAAEMAIDsAAKkKACADAAAAQQAgOwAAqQoAIDwAAK0KACASAAAAQQAgIAAAjwkAIDQAAK0KACD6AgEA5wUAIf8CQADpBQAhnAMAALMG1AMiowNAAOkFACHIAwEA5wUAIcoDAACxBsoDIswDAACyBswDIs0DEACiBgAhzgMBAOcFACHPAwEA5wUAIdADAQD8BQAh0QMBAPwFACHSAwEA_AUAIdQDgAAAAAHVA0AAiwYAIRAgAACPCQAg-gIBAOcFACH_AkAA6QUAIZwDAACzBtQDIqMDQADpBQAhyAMBAOcFACHKAwAAsQbKAyLMAwAAsgbMAyLNAxAAogYAIc4DAQDnBQAhzwMBAOcFACHQAwEA_AUAIdEDAQD8BQAh0gMBAPwFACHUA4AAAAAB1QNAAIsGACENBAAAxQYAIB8AAP8HACD6AgEAAAAB-wIBAAAAAf8CQAAAAAGcAwAAAOUDAqMDQAAAAAHNAxAAAAABzgMBAAAAAeEDAQAAAAHjAwAAAOMDAuUDQAAAAAHmA0AAAAABAgAAAD8AIDsAAK4KACADAAAAPQAgOwAArgoAIDwAALIKACAPAAAAPQAgBAAApQYAIB8AAP0HACA0AACyCgAg-gIBAOcFACH7AgEA5wUAIf8CQADpBQAhnAMAAKMG5QMiowNAAOkFACHNAxAAogYAIc4DAQDnBQAh4QMBAOcFACHjAwAAoQbjAyLlA0AAiwYAIeYDQACLBgAhDQQAAKUGACAfAAD9BwAg-gIBAOcFACH7AgEA5wUAIf8CQADpBQAhnAMAAKMG5QMiowNAAOkFACHNAxAAogYAIc4DAQDnBQAh4QMBAOcFACHjAwAAoQbjAyLlA0AAiwYAIeYDQACLBgAhDAEAAPcJACAlAADZCAAg-gIBAAAAAf8CQAAAAAGLAwEAAAABkgMBAAAAAaEDIAAAAAGiA0AAAAABowNAAAAAAecDAQAAAAH1AwEAAAAB9gMBAAAAAQIAAACaAQAgOwAAswoAIAMAAAAFACA7AACzCgAgPAAAtwoAIA4AAAAFACABAAD2CQAgJQAAzgcAIDQAALcKACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGSAwEA5wUAIaEDIADoBQAhogNAAIsGACGjA0AA6QUAIecDAQDnBQAh9QMBAPwFACH2AwEA_AUAIQwBAAD2CQAgJQAAzgcAIPoCAQDnBQAh_wJAAOkFACGLAwEA5wUAIZIDAQDnBQAhoQMgAOgFACGiA0AAiwYAIaMDQADpBQAh5wMBAOcFACH1AwEA_AUAIfYDAQD8BQAhDQkAAIAKACAMAADiCQAg-gIBAAAAAf8CQAAAAAGLAwEAAAABjgMgAAAAAaIDQAAAAAGjA0AAAAABrgMBAAAAAboDAQAAAAHOAwEAAAAB9wMgAAAAAfgDEAAAAAECAAAAFQAgOwAAuAoAIAMAAAATACA7AAC4CgAgPAAAvAoAIA8AAAATACAJAAD_CQAgDAAA0QkAIDQAALwKACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGOAyAA6AUAIaIDQACLBgAhowNAAOkFACGuAwEA_AUAIboDAQDnBQAhzgMBAOcFACH3AyAA6AUAIfgDEAD9BQAhDQkAAP8JACAMAADRCQAg-gIBAOcFACH_AkAA6QUAIYsDAQDnBQAhjgMgAOgFACGiA0AAiwYAIaMDQADpBQAhrgMBAPwFACG6AwEA5wUAIc4DAQDnBQAh9wMgAOgFACH4AxAA_QUAIQsKAADtCQAgCwAA7gkAIA4AAPAJACD6AgEAAAAB_wJAAAAAAYsDAQAAAAGMAwEAAAABjgMgAAAAAaIDQAAAAAGjA0AAAAABrgMBAAAAAQIAAACyAQAgOwAAvQoAIA0JAACACgAgEQAA4wkAIPoCAQAAAAH_AkAAAAABiwMBAAAAAY4DIAAAAAGiA0AAAAABowNAAAAAAa4DAQAAAAG6AwEAAAABzgMBAAAAAfcDIAAAAAH4AxAAAAABAgAAABUAIDsAAL8KACAG-gIBAAAAAf0CAQAAAAG_AwEAAAABwAMBAAAAAcEDQAAAAAHCA0AAAAABBfoCAQAAAAGLAwEAAAABjAMBAAAAAY0DAQAAAAGOAyAAAAABAgAAAIMEACA7AADCCgAgAwAAAIYEACA7AADCCgAgPAAAxgoAIAcAAACGBAAgNAAAxgoAIPoCAQDnBQAhiwMBAOcFACGMAwEA5wUAIY0DAQDnBQAhjgMgAOgFACEF-gIBAOcFACGLAwEA5wUAIYwDAQDnBQAhjQMBAOcFACGOAyAA6AUAIRwIAADaCAAgGgAA4AgAIB0AAOIIACAmAADbCAAgKAAA3QgAICkAAN4IACAqAADfCAAgKwAA4QgAICwAAOMIACAtAADkCAAg-gIBAAAAAf8CQAAAAAGLAwEAAAABkgMBAAAAAZMDAQAAAAGUAwEAAAABlQMBAAAAAZYDAQAAAAGYAwAAAJgDApoDAAAAmgMCnAMAAACcAwKdAyAAAAABngMBAAAAAZ8DAQAAAAGgAyAAAAABoQMgAAAAAaIDQAAAAAGjA0AAAAABAgAAAOsDACA7AADHCgAgAwAAAAMAIDsAAMcKACA8AADLCgAgHgAAAAMAIAgAAIwGACAaAACSBgAgHQAAlAYAICYAAI0GACAoAACPBgAgKQAAkAYAICoAAJEGACArAACTBgAgLAAAlQYAIC0AAJYGACA0AADLCgAg-gIBAOcFACH_AkAA6QUAIYsDAQDnBQAhkgMBAOcFACGTAwEA_AUAIZQDAQD8BQAhlQMBAPwFACGWAwEA_AUAIZgDAACIBpgDIpoDAACJBpoDIpwDAACKBpwDIp0DIADoBQAhngMBAPwFACGfAwEA_AUAIaADIADoBQAhoQMgAOgFACGiA0AAiwYAIaMDQADpBQAhHAgAAIwGACAaAACSBgAgHQAAlAYAICYAAI0GACAoAACPBgAgKQAAkAYAICoAAJEGACArAACTBgAgLAAAlQYAIC0AAJYGACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGSAwEA5wUAIZMDAQD8BQAhlAMBAPwFACGVAwEA_AUAIZYDAQD8BQAhmAMAAIgGmAMimgMAAIkGmgMinAMAAIoGnAMinQMgAOgFACGeAwEA_AUAIZ8DAQD8BQAhoAMgAOgFACGhAyAA6AUAIaIDQACLBgAhowNAAOkFACEG-gIBAAAAAboDAQAAAAG7AwEAAAABvAMBAAAAAb0DQAAAAAG-A0AAAAABHAgAANoIACAaAADgCAAgHQAA4ggAICYAANsIACAnAADcCAAgKAAA3QgAICkAAN4IACArAADhCAAgLAAA4wgAIC0AAOQIACD6AgEAAAAB_wJAAAAAAYsDAQAAAAGSAwEAAAABkwMBAAAAAZQDAQAAAAGVAwEAAAABlgMBAAAAAZgDAAAAmAMCmgMAAACaAwKcAwAAAJwDAp0DIAAAAAGeAwEAAAABnwMBAAAAAaADIAAAAAGhAyAAAAABogNAAAAAAaMDQAAAAAECAAAA6wMAIDsAAM0KACADAAAAAwAgOwAAzQoAIDwAANEKACAeAAAAAwAgCAAAjAYAIBoAAJIGACAdAACUBgAgJgAAjQYAICcAAI4GACAoAACPBgAgKQAAkAYAICsAAJMGACAsAACVBgAgLQAAlgYAIDQAANEKACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGSAwEA5wUAIZMDAQD8BQAhlAMBAPwFACGVAwEA_AUAIZYDAQD8BQAhmAMAAIgGmAMimgMAAIkGmgMinAMAAIoGnAMinQMgAOgFACGeAwEA_AUAIZ8DAQD8BQAhoAMgAOgFACGhAyAA6AUAIaIDQACLBgAhowNAAOkFACEcCAAAjAYAIBoAAJIGACAdAACUBgAgJgAAjQYAICcAAI4GACAoAACPBgAgKQAAkAYAICsAAJMGACAsAACVBgAgLQAAlgYAIPoCAQDnBQAh_wJAAOkFACGLAwEA5wUAIZIDAQDnBQAhkwMBAPwFACGUAwEA_AUAIZUDAQD8BQAhlgMBAPwFACGYAwAAiAaYAyKaAwAAiQaaAyKcAwAAigacAyKdAyAA6AUAIZ4DAQD8BQAhnwMBAPwFACGgAyAA6AUAIaEDIADoBQAhogNAAIsGACGjA0AA6QUAIQb6AgEAAAAB_QIBAAAAAf8CQAAAAAG3AwEAAAABuAMAAACyAwO5AwAAALIDAgX6AgEAAAAB_AIBAAAAAf0CAQAAAAH-AiAAAAAB_wJAAAAAARwIAADaCAAgGgAA4AgAIB0AAOIIACAmAADbCAAgJwAA3AgAICgAAN0IACApAADeCAAgKgAA3wgAICwAAOMIACAtAADkCAAg-gIBAAAAAf8CQAAAAAGLAwEAAAABkgMBAAAAAZMDAQAAAAGUAwEAAAABlQMBAAAAAZYDAQAAAAGYAwAAAJgDApoDAAAAmgMCnAMAAACcAwKdAyAAAAABngMBAAAAAZ8DAQAAAAGgAyAAAAABoQMgAAAAAaIDQAAAAAGjA0AAAAABAgAAAOsDACA7AADUCgAgAwAAAAMAIDsAANQKACA8AADYCgAgHgAAAAMAIAgAAIwGACAaAACSBgAgHQAAlAYAICYAAI0GACAnAACOBgAgKAAAjwYAICkAAJAGACAqAACRBgAgLAAAlQYAIC0AAJYGACA0AADYCgAg-gIBAOcFACH_AkAA6QUAIYsDAQDnBQAhkgMBAOcFACGTAwEA_AUAIZQDAQD8BQAhlQMBAPwFACGWAwEA_AUAIZgDAACIBpgDIpoDAACJBpoDIpwDAACKBpwDIp0DIADoBQAhngMBAPwFACGfAwEA_AUAIaADIADoBQAhoQMgAOgFACGiA0AAiwYAIaMDQADpBQAhHAgAAIwGACAaAACSBgAgHQAAlAYAICYAAI0GACAnAACOBgAgKAAAjwYAICkAAJAGACAqAACRBgAgLAAAlQYAIC0AAJYGACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGSAwEA5wUAIZMDAQD8BQAhlAMBAPwFACGVAwEA_AUAIZYDAQD8BQAhmAMAAIgGmAMimgMAAIkGmgMinAMAAIoGnAMinQMgAOgFACGeAwEA_AUAIZ8DAQD8BQAhoAMgAOgFACGhAyAA6AUAIaIDQACLBgAhowNAAOkFACEI-gIBAAAAAf8CQAAAAAHjAwAAAOwDAuoDAQAAAAHsAwEAAAAB7QMBAAAAAe4DAQAAAAHvAwIAAAABHAgAANoIACAaAADgCAAgJgAA2wgAICcAANwIACAoAADdCAAgKQAA3ggAICoAAN8IACArAADhCAAgLAAA4wgAIC0AAOQIACD6AgEAAAAB_wJAAAAAAYsDAQAAAAGSAwEAAAABkwMBAAAAAZQDAQAAAAGVAwEAAAABlgMBAAAAAZgDAAAAmAMCmgMAAACaAwKcAwAAAJwDAp0DIAAAAAGeAwEAAAABnwMBAAAAAaADIAAAAAGhAyAAAAABogNAAAAAAaMDQAAAAAECAAAA6wMAIDsAANoKACADAAAAAwAgOwAA2goAIDwAAN4KACAeAAAAAwAgCAAAjAYAIBoAAJIGACAmAACNBgAgJwAAjgYAICgAAI8GACApAACQBgAgKgAAkQYAICsAAJMGACAsAACVBgAgLQAAlgYAIDQAAN4KACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGSAwEA5wUAIZMDAQD8BQAhlAMBAPwFACGVAwEA_AUAIZYDAQD8BQAhmAMAAIgGmAMimgMAAIkGmgMinAMAAIoGnAMinQMgAOgFACGeAwEA_AUAIZ8DAQD8BQAhoAMgAOgFACGhAyAA6AUAIaIDQACLBgAhowNAAOkFACEcCAAAjAYAIBoAAJIGACAmAACNBgAgJwAAjgYAICgAAI8GACApAACQBgAgKgAAkQYAICsAAJMGACAsAACVBgAgLQAAlgYAIPoCAQDnBQAh_wJAAOkFACGLAwEA5wUAIZIDAQDnBQAhkwMBAPwFACGUAwEA_AUAIZUDAQD8BQAhlgMBAPwFACGYAwAAiAaYAyKaAwAAiQaaAyKcAwAAigacAyKdAyAA6AUAIZ4DAQD8BQAhnwMBAPwFACGgAyAA6AUAIaEDIADoBQAhogNAAIsGACGjA0AA6QUAIQb6AgEAAAAB_wJAAAAAAawDAAAA6QMC3gOAAAAAAecDAQAAAAHpA0AAAAABDAEAAPcJACAMAADYCAAg-gIBAAAAAf8CQAAAAAGLAwEAAAABkgMBAAAAAaEDIAAAAAGiA0AAAAABowNAAAAAAecDAQAAAAH1AwEAAAAB9gMBAAAAAQIAAACaAQAgOwAA4AoAIAMAAAAFACA7AADgCgAgPAAA5AoAIA4AAAAFACABAAD2CQAgDAAAzQcAIDQAAOQKACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGSAwEA5wUAIaEDIADoBQAhogNAAIsGACGjA0AA6QUAIecDAQDnBQAh9QMBAPwFACH2AwEA_AUAIQwBAAD2CQAgDAAAzQcAIPoCAQDnBQAh_wJAAOkFACGLAwEA5wUAIZIDAQDnBQAhoQMgAOgFACGiA0AAiwYAIaMDQADpBQAh5wMBAOcFACH1AwEA_AUAIfYDAQD8BQAhHAgAANoIACAaAADgCAAgHQAA4ggAICYAANsIACAnAADcCAAgKAAA3QgAICkAAN4IACAqAADfCAAgKwAA4QgAICwAAOMIACD6AgEAAAAB_wJAAAAAAYsDAQAAAAGSAwEAAAABkwMBAAAAAZQDAQAAAAGVAwEAAAABlgMBAAAAAZgDAAAAmAMCmgMAAACaAwKcAwAAAJwDAp0DIAAAAAGeAwEAAAABnwMBAAAAAaADIAAAAAGhAyAAAAABogNAAAAAAaMDQAAAAAECAAAA6wMAIDsAAOUKACADAAAAAwAgOwAA5QoAIDwAAOkKACAeAAAAAwAgCAAAjAYAIBoAAJIGACAdAACUBgAgJgAAjQYAICcAAI4GACAoAACPBgAgKQAAkAYAICoAAJEGACArAACTBgAgLAAAlQYAIDQAAOkKACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGSAwEA5wUAIZMDAQD8BQAhlAMBAPwFACGVAwEA_AUAIZYDAQD8BQAhmAMAAIgGmAMimgMAAIkGmgMinAMAAIoGnAMinQMgAOgFACGeAwEA_AUAIZ8DAQD8BQAhoAMgAOgFACGhAyAA6AUAIaIDQACLBgAhowNAAOkFACEcCAAAjAYAIBoAAJIGACAdAACUBgAgJgAAjQYAICcAAI4GACAoAACPBgAgKQAAkAYAICoAAJEGACArAACTBgAgLAAAlQYAIPoCAQDnBQAh_wJAAOkFACGLAwEA5wUAIZIDAQDnBQAhkwMBAPwFACGUAwEA_AUAIZUDAQD8BQAhlgMBAPwFACGYAwAAiAaYAyKaAwAAiQaaAyKcAwAAigacAyKdAyAA6AUAIZ4DAQD8BQAhnwMBAPwFACGgAyAA6AUAIaEDIADoBQAhogNAAIsGACGjA0AA6QUAIQr6AgEAAAAB_wJAAAAAAZwDAAAA5QMCowNAAAAAAc0DEAAAAAHOAwEAAAAB4QMBAAAAAeMDAAAA4wMC5QNAAAAAAeYDQAAAAAEDAAAAtQEAIDsAAL0KACA8AADtCgAgDQAAALUBACAKAACwCQAgCwAAsQkAIA4AALMJACA0AADtCgAg-gIBAOcFACH_AkAA6QUAIYsDAQDnBQAhjAMBAOcFACGOAyAA6AUAIaIDQACLBgAhowNAAOkFACGuAwEA_AUAIQsKAACwCQAgCwAAsQkAIA4AALMJACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGMAwEA5wUAIY4DIADoBQAhogNAAIsGACGjA0AA6QUAIa4DAQD8BQAhAwAAABMAIDsAAL8KACA8AADwCgAgDwAAABMAIAkAAP8JACARAADSCQAgNAAA8AoAIPoCAQDnBQAh_wJAAOkFACGLAwEA5wUAIY4DIADoBQAhogNAAIsGACGjA0AA6QUAIa4DAQD8BQAhugMBAOcFACHOAwEA5wUAIfcDIADoBQAh-AMQAP0FACENCQAA_wkAIBEAANIJACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGOAyAA6AUAIaIDQACLBgAhowNAAOkFACGuAwEA_AUAIboDAQDnBQAhzgMBAOcFACH3AyAA6AUAIfgDEAD9BQAhEfoCAQAAAAH_AkAAAAABnAMAAACyAwKiA0AAAAABowNAAAAAAaQDAQAAAAGoAwEAAAABqgMBAAAAAawDAAAArAMCrQMBAAAAAa4DAQAAAAGwAwAAALADArIDQAAAAAGzA0AAAAABtANAAAAAAbUDQAAAAAG2A0AAAAABHQcAAM0IACAIAAD7CAAgEAAAzggAIBIAAM8IACAVAADQCAAgFgAA0QgAIBgAANIIACAaAADTCAAgHAAA1AgAIB0AANUIACAkAADXCAAg-gIBAAAAAf8CQAAAAAGcAwAAALIDAqIDQAAAAAGjA0AAAAABpAMBAAAAAagDAQAAAAGpAwEAAAABqgMBAAAAAawDAAAArAMCrQMBAAAAAa4DAQAAAAGwAwAAALADArIDQAAAAAGzA0AAAAABtANAAAAAAbUDQAAAAAG2A0AAAAABAgAAAAkAIDsAAPIKACADAAAABwAgOwAA8goAIDwAAPYKACAfAAAABwAgBwAA6gcAIAgAAPoIACAQAADrBwAgEgAA7AcAIBUAAO0HACAWAADuBwAgGAAA7wcAIBoAAPAHACAcAADxBwAgHQAA8gcAICQAAPQHACA0AAD2CgAg-gIBAOcFACH_AkAA6QUAIZwDAACJB7IDIqIDQACLBgAhowNAAOkFACGkAwEA5wUAIagDAQDnBQAhqQMBAOcFACGqAwEA5wUAIawDAADnB6wDIq0DAQDnBQAhrgMBAOcFACGwAwAA6AewAyKyA0AAiwYAIbMDQACLBgAhtANAAIsGACG1A0AAiwYAIbYDQACLBgAhHQcAAOoHACAIAAD6CAAgEAAA6wcAIBIAAOwHACAVAADtBwAgFgAA7gcAIBgAAO8HACAaAADwBwAgHAAA8QcAIB0AAPIHACAkAAD0BwAg-gIBAOcFACH_AkAA6QUAIZwDAACJB7IDIqIDQACLBgAhowNAAOkFACGkAwEA5wUAIagDAQDnBQAhqQMBAOcFACGqAwEA5wUAIawDAADnB6wDIq0DAQDnBQAhrgMBAOcFACGwAwAA6AewAyKyA0AAiwYAIbMDQACLBgAhtANAAIsGACG1A0AAiwYAIbYDQACLBgAhBfoCAQAAAAH7AgEAAAAB_wJAAAAAAfADAgAAAAHxAwEAAAABCwsAAO4JACAMAADvCQAgDgAA8AkAIPoCAQAAAAH_AkAAAAABiwMBAAAAAYwDAQAAAAGOAyAAAAABogNAAAAAAaMDQAAAAAGuAwEAAAABAgAAALIBACA7AAD4CgAgAwAAALUBACA7AAD4CgAgPAAA_AoAIA0AAAC1AQAgCwAAsQkAIAwAALIJACAOAACzCQAgNAAA_AoAIPoCAQDnBQAh_wJAAOkFACGLAwEA5wUAIYwDAQDnBQAhjgMgAOgFACGiA0AAiwYAIaMDQADpBQAhrgMBAPwFACELCwAAsQkAIAwAALIJACAOAACzCQAg-gIBAOcFACH_AkAA6QUAIYsDAQDnBQAhjAMBAOcFACGOAyAA6AUAIaIDQACLBgAhowNAAOkFACGuAwEA_AUAIQX6AgEAAAABjgMgAAAAAboDAQAAAAHzAwAAAPMDAvQDQAAAAAELCgAA7QkAIAsAAO4JACAMAADvCQAg-gIBAAAAAf8CQAAAAAGLAwEAAAABjAMBAAAAAY4DIAAAAAGiA0AAAAABowNAAAAAAa4DAQAAAAECAAAAsgEAIDsAAP4KACAdBwAAzQgAIAgAAPsIACAQAADOCAAgEgAAzwgAIBUAANAIACAYAADSCAAgGgAA0wgAIBwAANQIACAdAADVCAAgHgAA1ggAICQAANcIACD6AgEAAAAB_wJAAAAAAZwDAAAAsgMCogNAAAAAAaMDQAAAAAGkAwEAAAABqAMBAAAAAakDAQAAAAGqAwEAAAABrAMAAACsAwKtAwEAAAABrgMBAAAAAbADAAAAsAMCsgNAAAAAAbMDQAAAAAG0A0AAAAABtQNAAAAAAbYDQAAAAAECAAAACQAgOwAAgAsAIAMAAAC1AQAgOwAA_goAIDwAAIQLACANAAAAtQEAIAoAALAJACALAACxCQAgDAAAsgkAIDQAAIQLACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGMAwEA5wUAIY4DIADoBQAhogNAAIsGACGjA0AA6QUAIa4DAQD8BQAhCwoAALAJACALAACxCQAgDAAAsgkAIPoCAQDnBQAh_wJAAOkFACGLAwEA5wUAIYwDAQDnBQAhjgMgAOgFACGiA0AAiwYAIaMDQADpBQAhrgMBAPwFACEDAAAABwAgOwAAgAsAIDwAAIcLACAfAAAABwAgBwAA6gcAIAgAAPoIACAQAADrBwAgEgAA7AcAIBUAAO0HACAYAADvBwAgGgAA8AcAIBwAAPEHACAdAADyBwAgHgAA8wcAICQAAPQHACA0AACHCwAg-gIBAOcFACH_AkAA6QUAIZwDAACJB7IDIqIDQACLBgAhowNAAOkFACGkAwEA5wUAIagDAQDnBQAhqQMBAOcFACGqAwEA5wUAIawDAADnB6wDIq0DAQDnBQAhrgMBAOcFACGwAwAA6AewAyKyA0AAiwYAIbMDQACLBgAhtANAAIsGACG1A0AAiwYAIbYDQACLBgAhHQcAAOoHACAIAAD6CAAgEAAA6wcAIBIAAOwHACAVAADtBwAgGAAA7wcAIBoAAPAHACAcAADxBwAgHQAA8gcAIB4AAPMHACAkAAD0BwAg-gIBAOcFACH_AkAA6QUAIZwDAACJB7IDIqIDQACLBgAhowNAAOkFACGkAwEA5wUAIagDAQDnBQAhqQMBAOcFACGqAwEA5wUAIawDAADnB6wDIq0DAQDnBQAhrgMBAOcFACGwAwAA6AewAyKyA0AAiwYAIbMDQACLBgAhtANAAIsGACG1A0AAiwYAIbYDQACLBgAhBvoCAQAAAAH7AgEAAAABugMBAAAAAbwDAQAAAAG9A0AAAAABvgNAAAAAARwIAADaCAAgGgAA4AgAIB0AAOIIACAmAADbCAAgJwAA3AgAICgAAN0IACAqAADfCAAgKwAA4QgAICwAAOMIACAtAADkCAAg-gIBAAAAAf8CQAAAAAGLAwEAAAABkgMBAAAAAZMDAQAAAAGUAwEAAAABlQMBAAAAAZYDAQAAAAGYAwAAAJgDApoDAAAAmgMCnAMAAACcAwKdAyAAAAABngMBAAAAAZ8DAQAAAAGgAyAAAAABoQMgAAAAAaIDQAAAAAGjA0AAAAABAgAAAOsDACA7AACJCwAgAwAAAAMAIDsAAIkLACA8AACNCwAgHgAAAAMAIAgAAIwGACAaAACSBgAgHQAAlAYAICYAAI0GACAnAACOBgAgKAAAjwYAICoAAJEGACArAACTBgAgLAAAlQYAIC0AAJYGACA0AACNCwAg-gIBAOcFACH_AkAA6QUAIYsDAQDnBQAhkgMBAOcFACGTAwEA_AUAIZQDAQD8BQAhlQMBAPwFACGWAwEA_AUAIZgDAACIBpgDIpoDAACJBpoDIpwDAACKBpwDIp0DIADoBQAhngMBAPwFACGfAwEA_AUAIaADIADoBQAhoQMgAOgFACGiA0AAiwYAIaMDQADpBQAhHAgAAIwGACAaAACSBgAgHQAAlAYAICYAAI0GACAnAACOBgAgKAAAjwYAICoAAJEGACArAACTBgAgLAAAlQYAIC0AAJYGACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGSAwEA5wUAIZMDAQD8BQAhlAMBAPwFACGVAwEA_AUAIZYDAQD8BQAhmAMAAIgGmAMimgMAAIkGmgMinAMAAIoGnAMinQMgAOgFACGeAwEA_AUAIZ8DAQD8BQAhoAMgAOgFACGhAyAA6AUAIaIDQACLBgAhowNAAOkFACEG-gIBAAAAAfsCAQAAAAH9AgEAAAABvwMBAAAAAcEDQAAAAAHCA0AAAAABHAgAANoIACAaAADgCAAgHQAA4ggAICYAANsIACAnAADcCAAgKQAA3ggAICoAAN8IACArAADhCAAgLAAA4wgAIC0AAOQIACD6AgEAAAAB_wJAAAAAAYsDAQAAAAGSAwEAAAABkwMBAAAAAZQDAQAAAAGVAwEAAAABlgMBAAAAAZgDAAAAmAMCmgMAAACaAwKcAwAAAJwDAp0DIAAAAAGeAwEAAAABnwMBAAAAAaADIAAAAAGhAyAAAAABogNAAAAAAaMDQAAAAAECAAAA6wMAIDsAAI8LACAdCAAA-wgAIBAAAM4IACASAADPCAAgFQAA0AgAIBYAANEIACAYAADSCAAgGgAA0wgAIBwAANQIACAdAADVCAAgHgAA1ggAICQAANcIACD6AgEAAAAB_wJAAAAAAZwDAAAAsgMCogNAAAAAAaMDQAAAAAGkAwEAAAABqAMBAAAAAakDAQAAAAGqAwEAAAABrAMAAACsAwKtAwEAAAABrgMBAAAAAbADAAAAsAMCsgNAAAAAAbMDQAAAAAG0A0AAAAABtQNAAAAAAbYDQAAAAAECAAAACQAgOwAAkQsAIAMAAAADACA7AACPCwAgPAAAlQsAIB4AAAADACAIAACMBgAgGgAAkgYAIB0AAJQGACAmAACNBgAgJwAAjgYAICkAAJAGACAqAACRBgAgKwAAkwYAICwAAJUGACAtAACWBgAgNAAAlQsAIPoCAQDnBQAh_wJAAOkFACGLAwEA5wUAIZIDAQDnBQAhkwMBAPwFACGUAwEA_AUAIZUDAQD8BQAhlgMBAPwFACGYAwAAiAaYAyKaAwAAiQaaAyKcAwAAigacAyKdAyAA6AUAIZ4DAQD8BQAhnwMBAPwFACGgAyAA6AUAIaEDIADoBQAhogNAAIsGACGjA0AA6QUAIRwIAACMBgAgGgAAkgYAIB0AAJQGACAmAACNBgAgJwAAjgYAICkAAJAGACAqAACRBgAgKwAAkwYAICwAAJUGACAtAACWBgAg-gIBAOcFACH_AkAA6QUAIYsDAQDnBQAhkgMBAOcFACGTAwEA_AUAIZQDAQD8BQAhlQMBAPwFACGWAwEA_AUAIZgDAACIBpgDIpoDAACJBpoDIpwDAACKBpwDIp0DIADoBQAhngMBAPwFACGfAwEA_AUAIaADIADoBQAhoQMgAOgFACGiA0AAiwYAIaMDQADpBQAhAwAAAAcAIDsAAJELACA8AACYCwAgHwAAAAcAIAgAAPoIACAQAADrBwAgEgAA7AcAIBUAAO0HACAWAADuBwAgGAAA7wcAIBoAAPAHACAcAADxBwAgHQAA8gcAIB4AAPMHACAkAAD0BwAgNAAAmAsAIPoCAQDnBQAh_wJAAOkFACGcAwAAiQeyAyKiA0AAiwYAIaMDQADpBQAhpAMBAOcFACGoAwEA5wUAIakDAQDnBQAhqgMBAOcFACGsAwAA5wesAyKtAwEA5wUAIa4DAQDnBQAhsAMAAOgHsAMisgNAAIsGACGzA0AAiwYAIbQDQACLBgAhtQNAAIsGACG2A0AAiwYAIR0IAAD6CAAgEAAA6wcAIBIAAOwHACAVAADtBwAgFgAA7gcAIBgAAO8HACAaAADwBwAgHAAA8QcAIB0AAPIHACAeAADzBwAgJAAA9AcAIPoCAQDnBQAh_wJAAOkFACGcAwAAiQeyAyKiA0AAiwYAIaMDQADpBQAhpAMBAOcFACGoAwEA5wUAIakDAQDnBQAhqgMBAOcFACGsAwAA5wesAyKtAwEA5wUAIa4DAQDnBQAhsAMAAOgHsAMisgNAAIsGACGzA0AAiwYAIbQDQACLBgAhtQNAAIsGACG2A0AAiwYAIQb6AgEAAAAB-wIBAAAAAf0CAQAAAAHAAwEAAAABwQNAAAAAAcIDQAAAAAEdBwAAzQgAIAgAAPsIACAQAADOCAAgEgAAzwgAIBUAANAIACAWAADRCAAgGgAA0wgAIBwAANQIACAdAADVCAAgHgAA1ggAICQAANcIACD6AgEAAAAB_wJAAAAAAZwDAAAAsgMCogNAAAAAAaMDQAAAAAGkAwEAAAABqAMBAAAAAakDAQAAAAGqAwEAAAABrAMAAACsAwKtAwEAAAABrgMBAAAAAbADAAAAsAMCsgNAAAAAAbMDQAAAAAG0A0AAAAABtQNAAAAAAbYDQAAAAAECAAAACQAgOwAAmgsAIAMAAAAHACA7AACaCwAgPAAAngsAIB8AAAAHACAHAADqBwAgCAAA-ggAIBAAAOsHACASAADsBwAgFQAA7QcAIBYAAO4HACAaAADwBwAgHAAA8QcAIB0AAPIHACAeAADzBwAgJAAA9AcAIDQAAJ4LACD6AgEA5wUAIf8CQADpBQAhnAMAAIkHsgMiogNAAIsGACGjA0AA6QUAIaQDAQDnBQAhqAMBAOcFACGpAwEA5wUAIaoDAQDnBQAhrAMAAOcHrAMirQMBAOcFACGuAwEA5wUAIbADAADoB7ADIrIDQACLBgAhswNAAIsGACG0A0AAiwYAIbUDQACLBgAhtgNAAIsGACEdBwAA6gcAIAgAAPoIACAQAADrBwAgEgAA7AcAIBUAAO0HACAWAADuBwAgGgAA8AcAIBwAAPEHACAdAADyBwAgHgAA8wcAICQAAPQHACD6AgEA5wUAIf8CQADpBQAhnAMAAIkHsgMiogNAAIsGACGjA0AA6QUAIaQDAQDnBQAhqAMBAOcFACGpAwEA5wUAIaoDAQDnBQAhrAMAAOcHrAMirQMBAOcFACGuAwEA5wUAIbADAADoB7ADIrIDQACLBgAhswNAAIsGACG0A0AAiwYAIbUDQACLBgAhtgNAAIsGACEG-gIBAAAAAfsCAQAAAAH9AgEAAAAB_wJAAAAAAbgDAAAAsgMDuQMAAACyAwIF-gIBAAAAAfsCAQAAAAH9AgEAAAAB_gIgAAAAAf8CQAAAAAEdBwAAzQgAIAgAAPsIACAQAADOCAAgEgAAzwgAIBUAANAIACAWAADRCAAgGAAA0ggAIBoAANMIACAdAADVCAAgHgAA1ggAICQAANcIACD6AgEAAAAB_wJAAAAAAZwDAAAAsgMCogNAAAAAAaMDQAAAAAGkAwEAAAABqAMBAAAAAakDAQAAAAGqAwEAAAABrAMAAACsAwKtAwEAAAABrgMBAAAAAbADAAAAsAMCsgNAAAAAAbMDQAAAAAG0A0AAAAABtQNAAAAAAbYDQAAAAAECAAAACQAgOwAAoQsAIAMAAAAHACA7AAChCwAgPAAApQsAIB8AAAAHACAHAADqBwAgCAAA-ggAIBAAAOsHACASAADsBwAgFQAA7QcAIBYAAO4HACAYAADvBwAgGgAA8AcAIB0AAPIHACAeAADzBwAgJAAA9AcAIDQAAKULACD6AgEA5wUAIf8CQADpBQAhnAMAAIkHsgMiogNAAIsGACGjA0AA6QUAIaQDAQDnBQAhqAMBAOcFACGpAwEA5wUAIaoDAQDnBQAhrAMAAOcHrAMirQMBAOcFACGuAwEA5wUAIbADAADoB7ADIrIDQACLBgAhswNAAIsGACG0A0AAiwYAIbUDQACLBgAhtgNAAIsGACEdBwAA6gcAIAgAAPoIACAQAADrBwAgEgAA7AcAIBUAAO0HACAWAADuBwAgGAAA7wcAIBoAAPAHACAdAADyBwAgHgAA8wcAICQAAPQHACD6AgEA5wUAIf8CQADpBQAhnAMAAIkHsgMiogNAAIsGACGjA0AA6QUAIaQDAQDnBQAhqAMBAOcFACGpAwEA5wUAIaoDAQDnBQAhrAMAAOcHrAMirQMBAOcFACGuAwEA5wUAIbADAADoB7ADIrIDQACLBgAhswNAAIsGACG0A0AAiwYAIbUDQACLBgAhtgNAAIsGACEI-gIBAAAAAfsCAQAAAAH_AkAAAAAB4wMAAADsAwLsAwEAAAAB7QMBAAAAAe4DAQAAAAHvAwIAAAABHQcAAM0IACAIAAD7CAAgEAAAzggAIBIAAM8IACAVAADQCAAgFgAA0QgAIBgAANIIACAaAADTCAAgHAAA1AgAIB4AANYIACAkAADXCAAg-gIBAAAAAf8CQAAAAAGcAwAAALIDAqIDQAAAAAGjA0AAAAABpAMBAAAAAagDAQAAAAGpAwEAAAABqgMBAAAAAawDAAAArAMCrQMBAAAAAa4DAQAAAAGwAwAAALADArIDQAAAAAGzA0AAAAABtANAAAAAAbUDQAAAAAG2A0AAAAABAgAAAAkAIDsAAKcLACADAAAABwAgOwAApwsAIDwAAKsLACAfAAAABwAgBwAA6gcAIAgAAPoIACAQAADrBwAgEgAA7AcAIBUAAO0HACAWAADuBwAgGAAA7wcAIBoAAPAHACAcAADxBwAgHgAA8wcAICQAAPQHACA0AACrCwAg-gIBAOcFACH_AkAA6QUAIZwDAACJB7IDIqIDQACLBgAhowNAAOkFACGkAwEA5wUAIagDAQDnBQAhqQMBAOcFACGqAwEA5wUAIawDAADnB6wDIq0DAQDnBQAhrgMBAOcFACGwAwAA6AewAyKyA0AAiwYAIbMDQACLBgAhtANAAIsGACG1A0AAiwYAIbYDQACLBgAhHQcAAOoHACAIAAD6CAAgEAAA6wcAIBIAAOwHACAVAADtBwAgFgAA7gcAIBgAAO8HACAaAADwBwAgHAAA8QcAIB4AAPMHACAkAAD0BwAg-gIBAOcFACH_AkAA6QUAIZwDAACJB7IDIqIDQACLBgAhowNAAOkFACGkAwEA5wUAIagDAQDnBQAhqQMBAOcFACGqAwEA5wUAIawDAADnB6wDIq0DAQDnBQAhrgMBAOcFACGwAwAA6AewAyKyA0AAiwYAIbMDQACLBgAhtANAAIsGACG1A0AAiwYAIbYDQACLBgAhBvoCAQAAAAH7AgEAAAAB_wJAAAAAAawDAAAA6QMC3gOAAAAAAekDQAAAAAEJ-gIBAAAAAf8CQAAAAAH6AwEAAAAB-wMBAAAAAfwDAQAAAAH9A4AAAAAB_gOAAAAAAf8DAQAAAAGABAEAAAABHQcAAM0IACAIAAD7CAAgEAAAzggAIBIAAM8IACAVAADQCAAgFgAA0QgAIBgAANIIACAaAADTCAAgHAAA1AgAIB0AANUIACAeAADWCAAg-gIBAAAAAf8CQAAAAAGcAwAAALIDAqIDQAAAAAGjA0AAAAABpAMBAAAAAagDAQAAAAGpAwEAAAABqgMBAAAAAawDAAAArAMCrQMBAAAAAa4DAQAAAAGwAwAAALADArIDQAAAAAGzA0AAAAABtANAAAAAAbUDQAAAAAG2A0AAAAABAgAAAAkAIDsAAK4LACAH-gIBAAAAAf8CQAAAAAHKAwAAAMoDAt0DAQAAAAHeA4AAAAAB3wMgAAAAAeADQAAAAAEO-gIBAAAAAf8CQAAAAAGcAwAAANQDAqMDQAAAAAHKAwAAAMoDAswDAAAAzAMCzQMQAAAAAc4DAQAAAAHPAwEAAAAB0AMBAAAAAdEDAQAAAAHSAwEAAAAB1AOAAAAAAdUDQAAAAAEDAAAABwAgOwAArgsAIDwAALQLACAfAAAABwAgBwAA6gcAIAgAAPoIACAQAADrBwAgEgAA7AcAIBUAAO0HACAWAADuBwAgGAAA7wcAIBoAAPAHACAcAADxBwAgHQAA8gcAIB4AAPMHACA0AAC0CwAg-gIBAOcFACH_AkAA6QUAIZwDAACJB7IDIqIDQACLBgAhowNAAOkFACGkAwEA5wUAIagDAQDnBQAhqQMBAOcFACGqAwEA5wUAIawDAADnB6wDIq0DAQDnBQAhrgMBAOcFACGwAwAA6AewAyKyA0AAiwYAIbMDQACLBgAhtANAAIsGACG1A0AAiwYAIbYDQACLBgAhHQcAAOoHACAIAAD6CAAgEAAA6wcAIBIAAOwHACAVAADtBwAgFgAA7gcAIBgAAO8HACAaAADwBwAgHAAA8QcAIB0AAPIHACAeAADzBwAg-gIBAOcFACH_AkAA6QUAIZwDAACJB7IDIqIDQACLBgAhowNAAOkFACGkAwEA5wUAIagDAQDnBQAhqQMBAOcFACGqAwEA5wUAIawDAADnB6wDIq0DAQDnBQAhrgMBAOcFACGwAwAA6AewAyKyA0AAiwYAIbMDQACLBgAhtANAAIsGACG1A0AAiwYAIbYDQACLBgAhCvoCAQAAAAH7AgEAAAAB_wJAAAAAAZwDAAAA5QMCowNAAAAAAc0DEAAAAAHOAwEAAAAB4wMAAADjAwLlA0AAAAAB5gNAAAAAAR0HAADNCAAgCAAA-wgAIBAAAM4IACASAADPCAAgFgAA0QgAIBgAANIIACAaAADTCAAgHAAA1AgAIB0AANUIACAeAADWCAAgJAAA1wgAIPoCAQAAAAH_AkAAAAABnAMAAACyAwKiA0AAAAABowNAAAAAAaQDAQAAAAGoAwEAAAABqQMBAAAAAaoDAQAAAAGsAwAAAKwDAq0DAQAAAAGuAwEAAAABsAMAAACwAwKyA0AAAAABswNAAAAAAbQDQAAAAAG1A0AAAAABtgNAAAAAAQIAAAAJACA7AAC2CwAgAwAAAAcAIDsAALYLACA8AAC6CwAgHwAAAAcAIAcAAOoHACAIAAD6CAAgEAAA6wcAIBIAAOwHACAWAADuBwAgGAAA7wcAIBoAAPAHACAcAADxBwAgHQAA8gcAIB4AAPMHACAkAAD0BwAgNAAAugsAIPoCAQDnBQAh_wJAAOkFACGcAwAAiQeyAyKiA0AAiwYAIaMDQADpBQAhpAMBAOcFACGoAwEA5wUAIakDAQDnBQAhqgMBAOcFACGsAwAA5wesAyKtAwEA5wUAIa4DAQDnBQAhsAMAAOgHsAMisgNAAIsGACGzA0AAiwYAIbQDQACLBgAhtQNAAIsGACG2A0AAiwYAIR0HAADqBwAgCAAA-ggAIBAAAOsHACASAADsBwAgFgAA7gcAIBgAAO8HACAaAADwBwAgHAAA8QcAIB0AAPIHACAeAADzBwAgJAAA9AcAIPoCAQDnBQAh_wJAAOkFACGcAwAAiQeyAyKiA0AAiwYAIaMDQADpBQAhpAMBAOcFACGoAwEA5wUAIakDAQDnBQAhqgMBAOcFACGsAwAA5wesAyKtAwEA5wUAIa4DAQDnBQAhsAMAAOgHsAMisgNAAIsGACGzA0AAiwYAIbQDQACLBgAhtQNAAIsGACG2A0AAiwYAIQb6AgEAAAAB-wIBAAAAAcQDAQAAAAHFAwEAAAABxgMQAAAAAccDEAAAAAEcCAAA2ggAIB0AAOIIACAmAADbCAAgJwAA3AgAICgAAN0IACApAADeCAAgKgAA3wgAICsAAOEIACAsAADjCAAgLQAA5AgAIPoCAQAAAAH_AkAAAAABiwMBAAAAAZIDAQAAAAGTAwEAAAABlAMBAAAAAZUDAQAAAAGWAwEAAAABmAMAAACYAwKaAwAAAJoDApwDAAAAnAMCnQMgAAAAAZ4DAQAAAAGfAwEAAAABoAMgAAAAAaEDIAAAAAGiA0AAAAABowNAAAAAAQIAAADrAwAgOwAAvAsAIB0HAADNCAAgCAAA-wgAIBAAAM4IACASAADPCAAgFQAA0AgAIBYAANEIACAYAADSCAAgHAAA1AgAIB0AANUIACAeAADWCAAgJAAA1wgAIPoCAQAAAAH_AkAAAAABnAMAAACyAwKiA0AAAAABowNAAAAAAaQDAQAAAAGoAwEAAAABqQMBAAAAAaoDAQAAAAGsAwAAAKwDAq0DAQAAAAGuAwEAAAABsAMAAACwAwKyA0AAAAABswNAAAAAAbQDQAAAAAG1A0AAAAABtgNAAAAAAQIAAAAJACA7AAC-CwAgAwAAAAMAIDsAALwLACA8AADCCwAgHgAAAAMAIAgAAIwGACAdAACUBgAgJgAAjQYAICcAAI4GACAoAACPBgAgKQAAkAYAICoAAJEGACArAACTBgAgLAAAlQYAIC0AAJYGACA0AADCCwAg-gIBAOcFACH_AkAA6QUAIYsDAQDnBQAhkgMBAOcFACGTAwEA_AUAIZQDAQD8BQAhlQMBAPwFACGWAwEA_AUAIZgDAACIBpgDIpoDAACJBpoDIpwDAACKBpwDIp0DIADoBQAhngMBAPwFACGfAwEA_AUAIaADIADoBQAhoQMgAOgFACGiA0AAiwYAIaMDQADpBQAhHAgAAIwGACAdAACUBgAgJgAAjQYAICcAAI4GACAoAACPBgAgKQAAkAYAICoAAJEGACArAACTBgAgLAAAlQYAIC0AAJYGACD6AgEA5wUAIf8CQADpBQAhiwMBAOcFACGSAwEA5wUAIZMDAQD8BQAhlAMBAPwFACGVAwEA_AUAIZYDAQD8BQAhmAMAAIgGmAMimgMAAIkGmgMinAMAAIoGnAMinQMgAOgFACGeAwEA_AUAIZ8DAQD8BQAhoAMgAOgFACGhAyAA6AUAIaIDQACLBgAhowNAAOkFACEDAAAABwAgOwAAvgsAIDwAAMULACAfAAAABwAgBwAA6gcAIAgAAPoIACAQAADrBwAgEgAA7AcAIBUAAO0HACAWAADuBwAgGAAA7wcAIBwAAPEHACAdAADyBwAgHgAA8wcAICQAAPQHACA0AADFCwAg-gIBAOcFACH_AkAA6QUAIZwDAACJB7IDIqIDQACLBgAhowNAAOkFACGkAwEA5wUAIagDAQDnBQAhqQMBAOcFACGqAwEA5wUAIawDAADnB6wDIq0DAQDnBQAhrgMBAOcFACGwAwAA6AewAyKyA0AAiwYAIbMDQACLBgAhtANAAIsGACG1A0AAiwYAIbYDQACLBgAhHQcAAOoHACAIAAD6CAAgEAAA6wcAIBIAAOwHACAVAADtBwAgFgAA7gcAIBgAAO8HACAcAADxBwAgHQAA8gcAIB4AAPMHACAkAAD0BwAg-gIBAOcFACH_AkAA6QUAIZwDAACJB7IDIqIDQACLBgAhowNAAOkFACGkAwEA5wUAIagDAQDnBQAhqQMBAOcFACGqAwEA5wUAIawDAADnB6wDIq0DAQDnBQAhrgMBAOcFACGwAwAA6AewAyKyA0AAiwYAIbMDQACLBgAhtANAAIsGACG1A0AAiwYAIbYDQACLBgAhAS4EAgwIBgMPABwaXBEdXhMmVwgnWAkoWQUpWgUqWxArXRIsYQEtYhUEAQACDAoEDwAbJVQUDQcOBQgAAw8AGhAABhIABxUlDRYqCRguEBoyERw2Eh06Ex48FCRAFQMEAAQFAAIGAAIECQAHDCAEDwAMESILBQoSCAsWBgwXBA4bCQ8ACgIBAAIJAAcDBAAECQAHDQACBAocAAsdAAweAA4fAAEQAAYBDCMAAgQABBQADgIPAA8TKA0BEykAAgQABBcAAgIEAAQZAAICBAAEGwACAgEAAgQABAIEAAQIAAMEBAAEDwAZHwACI0QWAw8AGCAAFSJIFwEhABYBIkkAASNKAAcHSwAWTAAYTQAaTgAcTwAdUAAkUQACDFUAJVYAChpoAB1qACZjACdkAChlAClmACpnACtpACxrAC1sAAABLnYCAS58AgMPACFBACJCACMAAAADDwAhQQAiQgAjAQkABwEJAAcFDwAoQQArQgAsUwApVAAqAAAAAAAFDwAoQQArQgAsUwApVAAqAQEAAgEBAAIDDwAxQQAyQgAzAAAAAw8AMUEAMkIAMwAAAw8AOEEAOUIAOgAAAAMPADhBADlCADoCAQACCQAHAgEAAgkABwMPAD9BAEBCAEEAAAADDwA_QQBAQgBBAgQABAgAAwIEAAQIAAMFDwBGQQBJQgBKUwBHVABIAAAAAAAFDwBGQQBJQgBKUwBHVABIAgQABBsAAgIEAAQbAAIFDwBPQQBSQgBTUwBQVABRAAAAAAAFDwBPQQBSQgBTUwBQVABRAgEAAgQABAIBAAIEAAQDDwBYQQBZQgBaAAAAAw8AWEEAWUIAWgIEAAQfAAICBAAEHwACBQ8AX0EAYkIAY1MAYFQAYQAAAAAABQ8AX0EAYkIAY1MAYFQAYQEhABYBIQAWAw8AaEEAaUIAagAAAAMPAGhBAGlCAGoBIAAVASAAFQUPAG9BAHJCAHNTAHBUAHEAAAAAAAUPAG9BAHJCAHNTAHBUAHECBAAEFAAOAgQABBQADgUPAHhBAHtCAHxTAHlUAHoAAAAAAAUPAHhBAHtCAHxTAHlUAHoDBAAEBQACBgACAwQABAUAAgYAAgMPAIEBQQCCAUIAgwEAAAADDwCBAUEAggFCAIMBAwQABAkABw0AAgMEAAQJAAcNAAIDDwCIAUEAiQFCAIoBAAAAAw8AiAFBAIkBQgCKAQIEAAQXAAICBAAEFwACAw8AjwFBAJABQgCRAQAAAAMPAI8BQQCQAUIAkQEDCAADEAAGEgAHAwgAAxAABhIABwMPAJYBQQCXAUIAmAEAAAADDwCWAUEAlwFCAJgBARAABgEQAAYFDwCdAUEAoAFCAKEBUwCeAVQAnwEAAAAAAAUPAJ0BQQCgAUIAoQFTAJ4BVACfAQAAAw8ApgFBAKcBQgCoAQAAAAMPAKYBQQCnAUIAqAEAAAMPAK0BQQCuAUIArwEAAAADDwCtAUEArgFCAK8BAgQABBkAAgIEAAQZAAIDDwC0AUEAtQFCALYBAAAAAw8AtAFBALUBQgC2AS8CATBtATFuATJvATNwATVyATZ0HTd1Hjh4ATl6HTp7Hz19AT5-AT9_HUOCASBEgwEkRYQBBkaFAQZHhgEGSIcBBkmIAQZKigEGS4wBHUyNASVNjwEGTpEBHU-SASZQkwEGUZQBBlKVAR1VmAEnVpkBLVebAQNYnAEDWZ4BA1qfAQNboAEDXKIBA12kAR1epQEuX6cBA2CpAR1hqgEvYqsBA2OsAQNkrQEdZbABMGaxATRnswEHaLQBB2m3AQdquAEHa7kBB2y7AQdtvQEdbr4BNW_AAQdwwgEdccMBNnLEAQdzxQEHdMYBHXXJATd2ygE7d8sBCHjMAQh5zQEIes4BCHvPAQh80QEIfdMBHX7UATx_1gEIgAHYAR2BAdkBPYIB2gEIgwHbAQiEAdwBHYUB3wE-hgHgAUKHAeEBFIgB4gEUiQHjARSKAeQBFIsB5QEUjAHnARSNAekBHY4B6gFDjwHsARSQAe4BHZEB7wFEkgHwARSTAfEBFJQB8gEdlQH1AUWWAfYBS5cB9wESmAH4ARKZAfkBEpoB-gESmwH7ARKcAf0BEp0B_wEdngGAAkyfAYICEqABhAIdoQGFAk2iAYYCEqMBhwISpAGIAh2lAYsCTqYBjAJUpwGNAhOoAY4CE6kBjwITqgGQAhOrAZECE6wBkwITrQGVAh2uAZYCVa8BmAITsAGaAh2xAZsCVrIBnAITswGdAhO0AZ4CHbUBoQJXtgGiAlu3AaMCFbgBpAIVuQGlAhW6AaYCFbsBpwIVvAGpAhW9AasCHb4BrAJcvwGuAhXAAbACHcEBsQJdwgGyAhXDAbMCFcQBtAIdxQG3Al7GAbgCZMcBuQIXyAG6AhfJAbsCF8oBvAIXywG9AhfMAb8CF80BwQIdzgHCAmXPAcQCF9ABxgId0QHHAmbSAcgCF9MByQIX1AHKAh3VAc0CZ9YBzgJr1wHPAhbYAdACFtkB0QIW2gHSAhbbAdMCFtwB1QIW3QHXAh3eAdgCbN8B2gIW4AHcAh3hAd0CbeIB3gIW4wHfAhbkAeACHeUB4wJu5gHkAnTnAeUCDegB5gIN6QHnAg3qAegCDesB6QIN7AHrAg3tAe0CHe4B7gJ17wHwAg3wAfICHfEB8wJ28gH0Ag3zAfUCDfQB9gId9QH5Anf2AfoCffcB-wIF-AH8AgX5Af0CBfoB_gIF-wH_AgX8AYEDBf0BgwMd_gGEA37_AYYDBYACiAMdgQKJA3-CAooDBYMCiwMFhAKMAx2FAo8DgAGGApADhAGHApEDCYgCkgMJiQKTAwmKApQDCYsClQMJjAKXAwmNApkDHY4CmgOFAY8CnAMJkAKeAx2RAp8DhgGSAqADCZMCoQMJlAKiAx2VAqUDhwGWAqYDiwGXAqcDEJgCqAMQmQKpAxCaAqoDEJsCqwMQnAKtAxCdAq8DHZ4CsAOMAZ8CsgMQoAK0Ax2hArUDjQGiArYDEKMCtwMQpAK4Ax2lArsDjgGmArwDkgGnAr0DBKgCvgMEqQK_AwSqAsADBKsCwQMErALDAwStAsUDHa4CxgOTAa8CyAMEsALKAx2xAssDlAGyAswDBLMCzQMEtALOAx21AtEDlQG2AtIDmQG3AtQDC7gC1QMLuQLXAwu6AtgDC7sC2QMLvALbAwu9At0DHb4C3gOaAb8C4AMLwALiAx3BAuMDmwHCAuQDC8MC5QMLxALmAx3FAukDnAHGAuoDogHHAuwDAsgC7QMCyQLvAwLKAvADAssC8QMCzALzAwLNAvUDHc4C9gOjAc8C-AMC0AL6Ax3RAvsDpAHSAvwDAtMC_QMC1AL-Ax3VAoEEpQHWAoIEqQHXAoQEDtgChQQO2QKIBA7aAokEDtsCigQO3AKMBA7dAo4EHd4CjwSqAd8CkQQO4AKTBB3hApQEqwHiApUEDuMClgQO5AKXBB3lApoErAHmApsEsAHnApwEEegCnQQR6QKeBBHqAp8EEesCoAQR7AKiBBHtAqQEHe4CpQSxAe8CpwQR8AKpBB3xAqoEsgHyAqsEEfMCrAQR9AKtBB31ArAEswH2ArEEtwE"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("node:buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  AuditLogScalarFieldEnum: () => AuditLogScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  CitizenScalarFieldEnum: () => CitizenScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  DepartmentMemberScalarFieldEnum: () => DepartmentMemberScalarFieldEnum,
  DepartmentScalarFieldEnum: () => DepartmentScalarFieldEnum,
  FeedbackScalarFieldEnum: () => FeedbackScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  JsonNullValueInput: () => JsonNullValueInput,
  MediaAttachmentScalarFieldEnum: () => MediaAttachmentScalarFieldEnum,
  ModelName: () => ModelName,
  NotificationScalarFieldEnum: () => NotificationScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PaymentEventScalarFieldEnum: () => PaymentEventScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PaymentTransactionScalarFieldEnum: () => PaymentTransactionScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReportedLocationScalarFieldEnum: () => ReportedLocationScalarFieldEnum,
  RequestAssignmentScalarFieldEnum: () => RequestAssignmentScalarFieldEnum,
  RequestDepartmentRouteScalarFieldEnum: () => RequestDepartmentRouteScalarFieldEnum,
  RequestStatusHistoryScalarFieldEnum: () => RequestStatusHistoryScalarFieldEnum,
  ServiceRequestScalarFieldEnum: () => ServiceRequestScalarFieldEnum,
  SlaPolicyScalarFieldEnum: () => SlaPolicyScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  WardScalarFieldEnum: () => WardScalarFieldEnum,
  WorkUpdateScalarFieldEnum: () => WorkUpdateScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.10.0",
  engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  AuditLog: "AuditLog",
  Category: "Category",
  Citizen: "Citizen",
  Department: "Department",
  DepartmentMember: "DepartmentMember",
  Feedback: "Feedback",
  MediaAttachment: "MediaAttachment",
  Notification: "Notification",
  Payment: "Payment",
  PaymentEvent: "PaymentEvent",
  PaymentTransaction: "PaymentTransaction",
  ReportedLocation: "ReportedLocation",
  RequestAssignment: "RequestAssignment",
  RequestDepartmentRoute: "RequestDepartmentRoute",
  RequestStatusHistory: "RequestStatusHistory",
  ServiceRequest: "ServiceRequest",
  SlaPolicy: "SlaPolicy",
  User: "User",
  Ward: "Ward",
  WorkUpdate: "WorkUpdate"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AuditLogScalarFieldEnum = {
  id: "id",
  actorId: "actorId",
  action: "action",
  entityType: "entityType",
  entityId: "entityId",
  oldValues: "oldValues",
  newValues: "newValues",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  createdAt: "createdAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  departmentId: "departmentId",
  name: "name",
  description: "description",
  paymentRequired: "paymentRequired",
  defaultFeeAmount: "defaultFeeAmount",
  currency: "currency",
  isActive: "isActive",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CitizenScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  contactNumber: "contactNumber",
  address: "address",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId"
};
var DepartmentScalarFieldEnum = {
  id: "id",
  name: "name",
  code: "code",
  description: "description",
  isActive: "isActive",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var DepartmentMemberScalarFieldEnum = {
  id: "id",
  departmentId: "departmentId",
  userId: "userId",
  position: "position",
  isActive: "isActive",
  joinedAt: "joinedAt"
};
var FeedbackScalarFieldEnum = {
  id: "id",
  requestId: "requestId",
  citizenId: "citizenId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var MediaAttachmentScalarFieldEnum = {
  id: "id",
  requestId: "requestId",
  uploadedById: "uploadedById",
  purpose: "purpose",
  publicId: "publicId",
  secureUrl: "secureUrl",
  mimeType: "mimeType",
  sizeBytes: "sizeBytes",
  createdAt: "createdAt"
};
var NotificationScalarFieldEnum = {
  id: "id",
  userId: "userId",
  requestId: "requestId",
  type: "type",
  payload: "payload",
  readAt: "readAt",
  createdAt: "createdAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  requestId: "requestId",
  issuedById: "issuedById",
  purpose: "purpose",
  amount: "amount",
  currency: "currency",
  status: "status",
  expiresAt: "expiresAt",
  paidAt: "paidAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentEventScalarFieldEnum = {
  id: "id",
  transactionId: "transactionId",
  gateway: "gateway",
  gatewayEventId: "gatewayEventId",
  payload: "payload",
  signatureVerified: "signatureVerified",
  processedAt: "processedAt",
  createdAt: "createdAt"
};
var PaymentTransactionScalarFieldEnum = {
  id: "id",
  paymentId: "paymentId",
  gateway: "gateway",
  method: "method",
  amount: "amount",
  currency: "currency",
  idempotencyKey: "idempotencyKey",
  gatewaySessionId: "gatewaySessionId",
  gatewayTransactionId: "gatewayTransactionId",
  checkoutUrl: "checkoutUrl",
  status: "status",
  gatewayMetadata: "gatewayMetadata",
  verifiedAt: "verifiedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReportedLocationScalarFieldEnum = {
  id: "id",
  requestId: "requestId",
  wardId: "wardId",
  addressLine: "addressLine",
  landmark: "landmark",
  latitude: "latitude",
  longitude: "longitude"
};
var RequestAssignmentScalarFieldEnum = {
  id: "id",
  requestId: "requestId",
  assigneeId: "assigneeId",
  assignedById: "assignedById",
  note: "note",
  assignedAt: "assignedAt",
  releasedAt: "releasedAt"
};
var RequestDepartmentRouteScalarFieldEnum = {
  id: "id",
  requestId: "requestId",
  departmentId: "departmentId",
  routedById: "routedById",
  reason: "reason",
  routedAt: "routedAt",
  endedAt: "endedAt"
};
var RequestStatusHistoryScalarFieldEnum = {
  id: "id",
  requestId: "requestId",
  changedById: "changedById",
  fromStatus: "fromStatus",
  toStatus: "toStatus",
  note: "note",
  createdAt: "createdAt"
};
var ServiceRequestScalarFieldEnum = {
  id: "id",
  requestNo: "requestNo",
  citizenId: "citizenId",
  categoryId: "categoryId",
  currentDepartmentId: "currentDepartmentId",
  type: "type",
  title: "title",
  description: "description",
  priority: "priority",
  status: "status",
  responseDueAt: "responseDueAt",
  resolutionDueAt: "resolutionDueAt",
  firstRespondedAt: "firstRespondedAt",
  resolvedAt: "resolvedAt",
  closedAt: "closedAt",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SlaPolicyScalarFieldEnum = {
  id: "id",
  categoryId: "categoryId",
  responseWithinHours: "responseWithinHours",
  resolutionWithinHours: "resolutionWithinHours",
  reopenWindowHours: "reopenWindowHours",
  isActive: "isActive"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  phone: "phone",
  googleId: "googleId",
  githubId: "githubId",
  authProvider: "authProvider",
  role: "role",
  status: "status",
  emailVerified: "emailVerified",
  avatarUrl: "avatarUrl",
  avatarPublicId: "avatarPublicId",
  needPasswordChange: "needPasswordChange",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var WardScalarFieldEnum = {
  id: "id",
  name: "name",
  code: "code",
  city: "city",
  isActive: "isActive"
};
var WorkUpdateScalarFieldEnum = {
  id: "id",
  requestId: "requestId",
  authorId: "authorId",
  note: "note",
  visibleToCitizen: "visibleToCitizen",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var JsonNullValueInput = {
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var AttachmentPurpose = {
  EVIDENCE: "EVIDENCE",
  DOCUMENT: "DOCUMENT",
  PHOTO: "PHOTO",
  RECEIPT: "RECEIPT",
  OTHER: "OTHER"
};
var UserRole = {
  CITIZEN: "CITIZEN",
  STAFF: "STAFF",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN"
};
var UserStatus = {
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  SUSPENDED: "SUSPENDED",
  DELETED: "DELETED"
};
var AuthProvider = {
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
  CREDENTIAL: "CREDENTIAL"
};
var RequestType = {
  COMPLAINT: "COMPLAINT",
  SERVICE: "SERVICE",
  INFORMATION: "INFORMATION"
};
var RequestPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT"
};
var RequestStatus = {
  SUBMITTED: "SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  PENDING: "PENDING",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
  REOPENED: "REOPENED",
  REJECTED: "REJECTED"
};
var NotificationType = {
  REQUEST_CREATED: "REQUEST_CREATED",
  REQUEST_ASSIGNED: "REQUEST_ASSIGNED",
  STATUS_CHANGED: "STATUS_CHANGED",
  WORK_UPDATE_ADDED: "WORK_UPDATE_ADDED",
  FEEDBACK_REQUESTED: "FEEDBACK_REQUESTED",
  PAYMENT_REQUIRED: "PAYMENT_REQUIRED",
  PAYMENT_SUCCESSFUL: "PAYMENT_SUCCESSFUL"
};
var PaymentPurpose = {
  SERVICE_FEE: "SERVICE_FEE",
  INSPECTION_FEE: "INSPECTION_FEE",
  PENALTY: "PENALTY",
  PERMIT_FEE: "PERMIT_FEE",
  APPLICATION_FEE: "APPLICATION_FEE",
  OTHER: "OTHER"
};
var PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED"
};
var PaymentGateway = {
  BKASH: "BKASH",
  SSLCOMMERZ: "SSLCOMMERZ",
  CASH: "CASH"
};
var PaymentMethod = {
  BKASH: "BKASH",
  CARD: "CARD",
  NET_BANKING: "NET_BANKING",
  CASH: "CASH"
};
var PaymentTransactionStatus = {
  INITIATED: "INITIATED",
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to initialize Prisma.");
}
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/config/index.ts
import dotenv from "dotenv";
import path2 from "path";
dotenv.config({ path: path2.join(process.cwd(), ".env") });
var config_default = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  frontend_url: process.env.FRONTEND_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND,
  super_admin_name: process.env.SUPER_ADMIN_NAME,
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  tester_admin_name: process.env.TESTER_ADMIN_NAME,
  tester_admin_email: process.env.TESTER_ADMIN_EMAIL,
  tester_admin_password: process.env.TESTER_ADMIN_PASSWORD,
  tester_citizen_name: process.env.TESTER_CITIZEN_NAME,
  tester_citizen_email: process.env.TESTER_CITIZEN_EMAIL,
  tester_citizen_password: process.env.TESTER_CITIZEN_PASSWORD,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redis_user: process.env.REDIS_USER,
  redis_password: process.env.REDIS_PASSWORD,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,
  email_sender: process.env.EMAIL_SENDER,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  bkash_base_url: process.env.BKASH_BASE_URL,
  bkash_username: process.env.BKASH_USERNAME,
  bkash_password: process.env.BKASH_PASSWORD,
  bkash_app_key: process.env.BKASH_APP_KEY,
  bkash_app_secret: process.env.BKASH_APP_SECRET,
  bkash_callback_url: process.env.BKASH_CALLBACK_URL
};

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(payload, secret, {
    expiresIn
  });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken
    };
  } catch (error) {
    console.log("Token verification failed:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtils = {
  createToken,
  verifyToken
};

// src/app/lib/googleAuth.ts
import { OAuth2Client } from "google-auth-library";
var googleClient = new OAuth2Client({
  client_id: config_default.google_client_id
});

// src/app/lib/redis.ts
import { createClient } from "redis";
var redisClient = createClient({
  username: config_default.redis_user,
  password: config_default.redis_password,
  socket: {
    host: config_default.redis_host,
    port: Number(config_default.redis_port)
  }
});
redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});
if (!redisClient.isOpen) {
  redisClient.connect().catch((err) => {
    console.error("Redis Auto-Connect Error:", err);
  });
}

// src/app/module/auth/auth.service.ts
import crypto from "crypto";
import path3 from "path";

// src/app/lib/nodemailer.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config_default.smtp_user,
    pass: config_default.smtp_password
  }
});

// src/app/module/auth/auth.service.ts
import ejs from "ejs";
var registerCitizen = async (payload) => {
  const { name, password, citizen: citizenData } = payload;
  const email = payload.email.trim().toLowerCase();
  const isUserExists = await prisma.user.findUnique({
    where: { email }
  });
  if (isUserExists) {
    throw new Error("User with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config_default.bcrypt_salt_rounds)
  );
  const otpKey = `citizen-registration-otp:${email}`;
  const otpValue = crypto.randomInt(1e5, 1e6).toString();
  const expirationSeconds = 5 * 60;
  await redisClient.set(otpKey, otpValue, {
    expiration: {
      type: "EX",
      value: expirationSeconds
    }
  });
  const citizenRegistrationDataKey = `citizen-registration-data:${email}`;
  const redisUserDataPayload = {
    name,
    email,
    password: hashedPassword,
    citizen: citizenData
  };
  await redisClient.set(
    citizenRegistrationDataKey,
    JSON.stringify(redisUserDataPayload),
    {
      expiration: {
        type: "EX",
        value: expirationSeconds
      }
    }
  );
  const templtePath = path3.join(
    process.cwd(),
    "src/app/templates/registration-user-otp.ejs"
  );
  const templateData = {
    name,
    otp: otpValue,
    email,
    expirationMinutes: expirationSeconds / 60
  };
  const html = await ejs.renderFile(templtePath, templateData);
  await transporter.sendMail({
    from: config_default.email_sender,
    to: email,
    subject: "Email Verification",
    // text: `Your OTP is ${otp}`
    // html: `<h1>Your OTP is ${otp}</h1>`,
    html
  });
};
var verifyCitizenEmail = async (payload) => {
  const email = payload.email.trim().toLowerCase();
  const otp = payload.otp;
  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (isUserExists?.status === "BLOCKED") {
    throw new Error("User is Blocked!");
  }
  if (isUserExists?.emailVerified) {
    throw new Error("User not Verified!");
  }
  if (isUserExists?.isDeleted || isUserExists?.status === "DELETED") {
    throw new Error("User is Deleted!");
  }
  if (isUserExists?.googleId || isUserExists?.authProvider === "GOOGLE") {
    throw new Error("User has account with Google!");
  }
  const otpKey = `citizen-registration-otp:${email}`;
  const redisOtp = await redisClient.get(otpKey);
  if (!redisOtp) {
    throw new Error("Invalid OTP");
  }
  if (redisOtp !== otp) {
    throw new Error("OTP does not match!");
  }
  await redisClient.del(otpKey);
  const citizenRegistrationDataKey = `citizen-registration-data:${email}`;
  const redisCitizentPayload = await redisClient.get(
    citizenRegistrationDataKey
  );
  if (!redisCitizentPayload) {
    throw new Error("Redis Citizen Data Not Found!");
  }
  const citizenPayload = JSON.parse(redisCitizentPayload);
  const createdUser = await prisma.user.create({
    data: {
      name: citizenPayload.name,
      email: citizenPayload.email,
      password: citizenPayload.password,
      role: UserRole.CITIZEN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      citizen: {
        create: {
          name: citizenPayload.name,
          email: citizenPayload.email,
          contactNumber: citizenPayload?.citizen?.contactNumber || ""
        }
      }
    },
    omit: { password: true },
    include: { citizen: true }
  });
  await redisClient.del(citizenRegistrationDataKey);
  const templtePath = path3.join(
    process.cwd(),
    "src/app/templates/wellcome-email.ejs"
  );
  const templateData = {
    name: createdUser.name,
    email: createdUser.email
  };
  const html = await ejs.renderFile(templtePath, templateData);
  await transporter.sendMail({
    from: config_default.email_sender,
    to: email,
    subject: "Wellcome to CityCare Service",
    // text: `Your OTP is ${otp}`
    // html: `<h1>Your OTP is ${otp}</h1>`,
    html
  });
  const { citizen, ...user } = createdUser;
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    user,
    citizen,
    accessToken,
    refreshToken: refreshToken3
  };
};
var loginUser = async (payload) => {
  const { password } = payload;
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new Error("User is blocked");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new Error("User is deleted");
  }
  if (user.password !== null && user.googleId !== null) {
    throw new Error(
      "User Already has account, registered with Google. Try to login with Google!"
    );
  }
  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new Error("Invalid credentials");
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var logoutUser = async () => {
};
var refreshToken = async (token) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    token,
    config_default.jwt_refresh_secret
  );
  if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
    throw new Error(
      config_default.node_env === "development" ? verifiedRefreshToken.error : "Invalid refresh token"
    );
  }
  const data = verifiedRefreshToken.data;
  const user = await prisma.user.findUnique({
    where: { id: data.userId }
  });
  if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
    throw new Error("User is inactive or not found");
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var googleLogin = async (payload) => {
  let googleIdTokenPayload = null;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: payload.idToken,
      audience: config_default.google_client_id
    });
    googleIdTokenPayload = ticket.getPayload();
  } catch (error) {
    console.log("Google Id Token verification failed: ", error);
    throw new Error("Invalid or expired Google Id Token");
  }
  if (!googleIdTokenPayload) {
    throw new Error("Invalid or expired Google Id Token");
  }
  if (!googleIdTokenPayload.email) {
    throw new Error("Google Email Not found!");
  }
  if (!googleIdTokenPayload.name) {
    throw new Error("Google Email user name Not found!");
  }
  const ifCitizenExistWithGoogleAuth = await prisma.user.findUnique({
    where: {
      email: googleIdTokenPayload.email,
      role: UserRole.CITIZEN,
      googleId: googleIdTokenPayload.sub
    }
  });
  let user = ifCitizenExistWithGoogleAuth;
  if (!ifCitizenExistWithGoogleAuth) {
    const ifCitizenExistWithCredentials = await prisma.user.findUnique({
      where: {
        email: googleIdTokenPayload.email,
        role: UserRole.CITIZEN,
        authProvider: AuthProvider.CREDENTIAL
      }
    });
    if (ifCitizenExistWithCredentials) {
      if (ifCitizenExistWithCredentials.emailVerified)
        throw new Error("Email not verified!");
      if (ifCitizenExistWithCredentials.status === UserStatus.BLOCKED) {
        throw new Error("User is Blocked!");
      }
      if (ifCitizenExistWithCredentials?.isDeleted || ifCitizenExistWithCredentials?.status === UserStatus.DELETED) {
        throw new Error("User is Deleted");
      }
    }
    user = await prisma.user.update({
      where: {
        id: ifCitizenExistWithCredentials?.id
      },
      data: {
        googleId: googleIdTokenPayload.sub
      }
    });
  } else {
    user = await prisma.user.create({
      data: {
        name: googleIdTokenPayload.name,
        email: googleIdTokenPayload.email,
        role: UserRole.CITIZEN,
        googleId: googleIdTokenPayload.sub,
        authProvider: AuthProvider.GOOGLE,
        emailVerified: true,
        citizen: {
          create: {
            name: googleIdTokenPayload.name,
            email: googleIdTokenPayload.email
          }
        }
      }
    });
  }
  if (!user) {
    throw new Error("User Not Found");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new Error("User is Blocked!");
  }
  if (user?.isDeleted || user?.status === UserStatus.DELETED) {
    throw new Error("User is Deleted");
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var githubLogin = async () => {
};
var forgotPassword = async (payload) => {
  const { email } = payload;
  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExists) {
    throw new Error("User does not Exist!");
  }
  if (isUserExists.status === "BLOCKED") {
    throw new Error("User is Blocked!");
  }
  if (!isUserExists.emailVerified) {
    throw new Error("User not Verified!");
  }
  if (isUserExists.isDeleted || isUserExists.status === "DELETED") {
    throw new Error("User is Deleted!");
  }
  if (isUserExists.googleId || isUserExists.authProvider === "GOOGLE") {
    throw new Error("User has account with Google!");
  }
  const otp = crypto.randomInt(1e5, 1e6).toString();
  const key = `forgot-password-otp:${isUserExists.email}`;
  const expirationSeconds = 5 * 60;
  await redisClient.set(key, otp, {
    expiration: {
      type: "EX",
      value: expirationSeconds
    }
  });
  const templtePath = path3.join(
    process.cwd(),
    "src/app/templates/forgot-password.ejs"
  );
  const html = await ejs.renderFile(templtePath, {
    name: isUserExists.name,
    otp,
    expirationMinutes: expirationSeconds / 60
  });
  await transporter.sendMail({
    from: config_default.email_sender,
    to: isUserExists.email,
    subject: "CityCare: OTP to Reset Password",
    // text: `Your OTP is ${otp}`
    // html: `<h1>Your OTP is ${otp}</h1>`,
    html
  });
};
var resetPassword = async (payload) => {
  const { email, otp, newPassword } = payload;
  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExists) {
    throw new Error("User does not Exist!");
  }
  if (isUserExists.status === "BLOCKED") {
    throw new Error("User is Blocked!");
  }
  if (!isUserExists.emailVerified) {
    throw new Error("User not Verified!");
  }
  if (isUserExists.isDeleted || isUserExists.status === "DELETED") {
    throw new Error("User is Deleted!");
  }
  if (isUserExists.googleId || isUserExists.authProvider === "GOOGLE") {
    throw new Error("User has account with Google!");
  }
  const key = `forgot-password-otp:${isUserExists.email}`;
  const redisOtp = await redisClient.get(key);
  if (!redisOtp) {
    throw new Error("Invalid OTP");
  }
  if (redisOtp !== otp) {
    throw new Error("OTP does not match!");
  }
  const hashNewPassword = await bcrypt.hash(
    newPassword,
    Number(config_default.bcrypt_salt_rounds)
  );
  await prisma.user.update({
    where: {
      email: isUserExists.email
    },
    data: {
      password: hashNewPassword
    }
  });
  await redisClient.del([key]);
  const templtePath = path3.join(
    process.cwd(),
    "src/app/templates/reset-password.ejs"
  );
  const html = await ejs.renderFile(templtePath, {
    name: isUserExists.name
  });
  await transporter.sendMail({
    from: config_default.email_sender,
    to: isUserExists.email,
    subject: "CityCare: Password changed Successfully!",
    // text: `Your OTP is ${otp}`
    // html: `<h1>Your Password is changed</h1>`,
    html
  });
};
var authService = {
  registerCitizen,
  verifyCitizenEmail,
  loginUser,
  logoutUser,
  refreshToken,
  googleLogin,
  githubLogin,
  forgotPassword,
  resetPassword
};

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/module/auth/auth.controller.ts
var registerCitizen2 = catchAsync(async (req, res) => {
  console.log("User register api hits!");
  const payload = req.body;
  await authService.registerCitizen(payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Verification OTP Sent",
    data: null
  });
});
var verifyCitizenEmail2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.verifyCitizenEmail(payload);
  const { accessToken, refreshToken: refreshToken3, user, citizen } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Verification OTP sent",
    data: {
      accessToken,
      refreshToken: refreshToken3,
      user,
      citizen
    }
  });
});
var loginUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.loginUser(payload);
  const { accessToken, refreshToken: refreshToken3 } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Verification OTP Sent",
    data: {
      accessToken,
      refreshToken: refreshToken3
    }
  });
});
var logoutUser2 = catchAsync(
  async (req, res, next) => {
    const result = await authService.logoutUser();
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged out successfully",
      data: result
    });
  }
);
var refreshToken2 = catchAsync(async (req, res) => {
  if (!req.cookies.refreshToken) {
    throw new Error("Refresh token is missing");
  }
  console.log(req.cookies.refreshToken);
  const result = await authService.refreshToken(req.cookies.refreshToken);
  const { accessToken, refreshToken: newRefreshToken } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken
    }
  });
});
var googleLogin2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.googleLogin(payload);
  const { accessToken, refreshToken: refreshToken3 } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: refreshToken3
    }
  });
});
var githubLogin2 = async () => {
};
var forgotPassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  await authService.forgotPassword(payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `OTP sent to email : ${payload.email}`,
    data: null
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  await authService.resetPassword(payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Changed successfully",
    data: null
  });
});
var authController = {
  registerCitizen: registerCitizen2,
  verifyCitizenEmail: verifyCitizenEmail2,
  loginUser: loginUser2,
  logoutUser: logoutUser2,
  refreshToken: refreshToken2,
  googleLogin: googleLogin2,
  githubLogin: githubLogin2,
  forgotPassword: forgotPassword2,
  resetPassword: resetPassword2
};

// src/app/module/auth/auth.validation.ts
import { z } from "zod";
var passwordSchema = z.string().min(8, "Password must be at least 8 characters long").max(32, "Password cannot exceed 32 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(
  /[^A-Za-z0-9]/,
  "Password must contain at least one special character"
);
var citizenRegistrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email(),
  password: passwordSchema,
  citizen: z.object({
    contactNumber: z.string().optional()
  }).optional()
});
var citizenEmailVerifySchema = z.object({
  email: z.email(),
  otp: z.string().length(6, "OTP must be exactly 6 digits")
});
var loginSchema = z.object({
  email: z.email(),
  password: passwordSchema
});
var googleLoginSchema = z.object({
  idToken: z.string().min(1, "Google idToken is required")
});
var forgotPasswordSchema = z.object({
  email: z.email()
});
var resetPasswordSchema = z.object({
  email: z.email(),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
  newPassword: passwordSchema
});
var authValidation = {
  citizenRegistrationSchema,
  citizenEmailVerifySchema,
  loginSchema,
  googleLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};

// src/app/middlewares/validateRequest.ts
import httpStatus2 from "http-status";

// src/utils/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// src/app/middlewares/validateRequest.ts
var isEnvelopeSchema = (schema) => {
  const shape = schema.shape;
  if (!shape) return false;
  return "params" in shape || "query" in shape || "body" in shape;
};
var validateRequest = (zodSchema) => {
  return catchAsync(
    async (req, _res, next) => {
      const envelope = isEnvelopeSchema(zodSchema);
      const result = await zodSchema.safeParseAsync(
        envelope ? {
          params: req.params ?? {},
          query: req.query ?? {},
          body: req.body ?? {}
        } : req.body ?? {}
      );
      if (!result.success) {
        const errorMessages = result.error.issues.map((issue) => {
          const fieldPath = issue.path.join(".");
          return fieldPath ? `${fieldPath}: ${issue.message}` : issue.message;
        }).join("; ");
        throw new AppError(httpStatus2.BAD_REQUEST, errorMessages);
      }
      const data = result.data;
      if (envelope) {
        if (data.params) req.params = data.params;
        if (data.body) req.body = data.body;
      } else {
        req.body = result.data;
      }
      next();
    }
  );
};

// src/app/module/auth/auth.route.ts
var router = Router();
router.post(
  "/register",
  validateRequest(authValidation.citizenRegistrationSchema),
  authController.registerCitizen
);
router.post(
  "/verify-email",
  validateRequest(authValidation.citizenEmailVerifySchema),
  authController.verifyCitizenEmail
);
router.post(
  "/login",
  validateRequest(authValidation.loginSchema),
  authController.loginUser
);
router.post(
  "/google-login",
  validateRequest(authValidation.googleLoginSchema),
  authController.googleLogin
);
router.post("/github-login", authController.githubLogin);
router.post("/logout", authController.logoutUser);
router.post("/refresh-token", authController.refreshToken);
router.post(
  "/forgot-password",
  validateRequest(authValidation.forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validateRequest(authValidation.resetPasswordSchema),
  authController.resetPassword
);
var authRoutes = router;

// src/app/module/users/user.route.ts
import { Router as Router2 } from "express";

// src/app/module/users/user.controller.ts
import httpStatus3 from "http-status";

// src/app/lib/cloudinary.ts
import { v2 as Cloudinary } from "cloudinary";
Cloudinary.config({
  cloud_name: config_default.cloudinary_cloud_name,
  api_key: config_default.cloudinary_api_key,
  api_secret: config_default.cloudinary_api_secret
});
var cloudinary = Cloudinary;

// src/app/module/audit-log/audit-log.service.ts
var recordAuditLog = async (payload) => {
  const client = payload.tx ?? prisma;
  await client.auditLog.create({
    data: {
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId,
      actorId: payload.actorId ?? null,
      oldValues: payload.oldValues === void 0 ? void 0 : payload.oldValues,
      newValues: payload.newValues === void 0 ? void 0 : payload.newValues,
      ipAddress: payload.ipAddress ?? null,
      userAgent: payload.userAgent ?? null
    }
  });
};
var getAuditLogs = async (filters) => {
  const {
    action,
    entityType,
    entityId,
    actorId,
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = filters;
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const where = {};
  if (action) where.action = action.toUpperCase();
  if (entityType) where.entityType = entityType.toUpperCase();
  if (entityId) where.entityId = entityId;
  if (actorId) where.actorId = actorId;
  const [data, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      include: {
        actor: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    }),
    prisma.auditLog.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber)
    }
  };
};
var getAuditLogActions = async () => {
  const rows = await prisma.auditLog.findMany({
    distinct: ["action"],
    orderBy: { action: "asc" },
    select: { action: true }
  });
  return rows.map((r) => r.action);
};
var auditLogService = {
  recordAuditLog,
  getAuditLogs,
  getAuditLogActions
};

// src/app/module/users/user.service.ts
var getAllUsers = async (filters) => {
  const {
    searchTerm,
    role,
    status,
    departmentId,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = filters;
  const whereConditions = {
    isDeleted: false
  };
  if (role) {
    whereConditions.role = role.toUpperCase();
  }
  if (status) {
    whereConditions.status = status.toUpperCase();
  }
  if (searchTerm) {
    whereConditions.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
      { phone: { contains: searchTerm } }
    ];
  }
  if (departmentId) {
    whereConditions.departmentMemberships = {
      some: {
        departmentId,
        isActive: true
      }
    };
  }
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const [result, total] = await prisma.$transaction([
    prisma.user.findMany({
      where: whereConditions,
      orderBy: {
        [sortBy]: sortOrder
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      include: {
        departmentMemberships: {
          where: { isActive: true },
          select: {
            id: true,
            position: true,
            isActive: true,
            department: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        }
      },
      omit: { password: true }
    }),
    prisma.user.count({ where: whereConditions })
  ]);
  return {
    data: result,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber)
    }
  };
};
var getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      citizen: true
    },
    omit: { password: true }
  });
  if (!user) {
    throw new Error("User not found!");
  }
  return user;
};
var updateMyProfile = async (userId, payload) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!user) {
    throw new Error("User not found!");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new Error("User is deleted!");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new Error("User is Blocked!");
  }
  const { citizen: citizenData, ...userData } = payload;
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      ...userData,
      ...citizenData && {
        citizen: {
          update: {
            contactNumber: citizenData.contactNumber,
            address: citizenData.address
          }
        }
      }
    },
    include: {
      citizen: true
    },
    omit: { password: true }
  });
  return updatedUser;
};
var uploadProfileImage = async (userId, file) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!user) {
    throw new Error("User not found!");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new Error("User is deleted!");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new Error("User is Blocked!");
  }
  if (user.avatarPublicId) {
    await cloudinary.uploader.destroy(user.avatarPublicId);
  }
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "city-complaint/profile-images",
        resource_type: "image"
      },
      (error, uploadResult) => {
        if (error) {
          reject(new Error(error.message));
        } else if (!uploadResult) {
          reject(new Error("Cloudinary upload failed!"));
        } else {
          resolve(uploadResult);
        }
      }
    );
    stream.end(file.buffer);
  });
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      avatarUrl: result.secure_url,
      avatarPublicId: result.public_id
    },
    include: {
      citizen: true
    },
    omit: { password: true }
  });
  return updatedUser;
};
var deleteUser = async (targetUserId, actorId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: targetUserId
    }
  });
  if (!user) {
    throw new Error("User not found!");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new Error("User is already deleted!");
  }
  const isSelfDelete = actorId === void 0 || actorId === targetUserId;
  const deletedUser = await prisma.user.update({
    where: {
      id: targetUserId
    },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date(),
      status: UserStatus.DELETED
    },
    omit: { password: true }
  });
  await auditLogService.recordAuditLog({
    action: isSelfDelete ? "USER_SELF_DELETED" : "USER_DELETED",
    entityType: "USER",
    entityId: user.id,
    actorId: actorId ?? user.id,
    oldValues: { status: user.status, isDeleted: user.isDeleted },
    newValues: { status: UserStatus.DELETED, isDeleted: true }
  });
  return deletedUser;
};
var userService = {
  getAllUsers,
  getMe,
  updateMyProfile,
  uploadProfileImage,
  deleteUser
};

// src/app/module/users/user.controller.ts
var getAllUsers2 = catchAsync(async (req, res) => {
  const filters = {
    searchTerm: req.query.searchTerm,
    role: req.query.role,
    status: req.query.status,
    departmentId: req.query.departmentId,
    page: req.query.page ? Number(req.query.page) : void 0,
    limit: req.query.limit ? Number(req.query.limit) : void 0,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder
  };
  const result = await userService.getAllUsers(filters);
  sendResponse(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "Users fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await userService.getMe(userId);
  sendResponse(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "My profile fetched successfully",
    data: result
  });
});
var updateMyProfile2 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await userService.updateMyProfile(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "Profile updated successfully",
    data: result
  });
});
var uploadProfileImage2 = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new Error(
      "Profile image file is required! Send it as form-data with the key 'profileImage'."
    );
  }
  const result = await userService.uploadProfileImage(req.user.id, req.file);
  sendResponse(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "Profile image uploaded successfully",
    data: result
  });
});
var deleteMe = catchAsync(async (req, res) => {
  const userId = req.user.id;
  await userService.deleteUser(userId);
  sendResponse(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "Your account has been deleted successfully",
    data: null
  });
});
var deleteUser2 = catchAsync(async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    throw new Error("User ID Required!");
  }
  await userService.deleteUser(userId, req.user.id);
  sendResponse(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "User deleted successfully",
    data: null
  });
});
var userController = {
  getAllUsers: getAllUsers2,
  getMe: getMe2,
  updateMyProfile: updateMyProfile2,
  uploadProfileImage: uploadProfileImage2,
  deleteMe,
  deleteUser: deleteUser2
};

// src/app/middlewares/auth.ts
import httpStatus4 from "http-status";
var auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const token = req.cookies?.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : req.headers.authorization;
    if (!token) {
      throw new AppError(
        httpStatus4.UNAUTHORIZED,
        "You are not logged in. Please login to access this resource."
      );
    }
    const verifiedToken = jwtUtils.verifyToken(
      token,
      config_default.jwt_access_secret
    );
    if (!verifiedToken.success) {
      throw new AppError(httpStatus4.UNAUTHORIZED, verifiedToken.error);
    }
    const { userId, role } = verifiedToken.data;
    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus4.FORBIDDEN,
        "Forbidden. You don't have permission to access this resource."
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    if (!user) {
      throw new AppError(
        httpStatus4.UNAUTHORIZED,
        "User not found. Please login again to access this resource."
      );
    } else if (user.isDeleted || user.status === "DELETED") {
      throw new AppError(
        httpStatus4.FORBIDDEN,
        "Your account has been deleted. Please contact support for assistance."
      );
    } else if (user.status === "PENDING_VERIFICATION") {
      throw new AppError(
        httpStatus4.FORBIDDEN,
        "Your account is on verification. Please wait until verification completed."
      );
    } else if (user.status === "SUSPENDED") {
      throw new AppError(
        httpStatus4.FORBIDDEN,
        "Your account is suspended. Please contact support for assistance."
      );
    }
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };
    next();
  });
};

// src/app/lib/multer.ts
import multer from "multer";
var storage = multer.memoryStorage();
var upload = multer({ storage });

// src/app/module/users/user.route.ts
var router2 = Router2();
router2.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.getAllUsers
);
router2.get("/me", auth(), userController.getMe);
router2.patch("/me", auth(), userController.updateMyProfile);
router2.patch(
  "/profile-image",
  auth(UserRole.ADMIN, UserRole.CITIZEN, UserRole.STAFF, UserRole.SUPER_ADMIN),
  upload.single("profileImage"),
  userController.uploadProfileImage
);
router2.delete("/me", auth(), userController.deleteMe);
router2.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.deleteUser
);
var userRoutes = router2;

// src/app/module/department/department.route.ts
import { Router as Router3 } from "express";

// src/app/module/department/department.controller.ts
import httpStatus5 from "http-status";

// src/app/module/department/department.service.ts
var notDeleted = { deletedAt: null };
var createDepartment = async (payload) => {
  return prisma.department.create({
    data: payload
  });
};
var getAllDepartments = async () => {
  return prisma.department.findMany({
    where: notDeleted,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { members: true }
      }
    }
  });
};
var getDepartmentById = async (id) => {
  const department = await prisma.department.findFirst({
    where: {
      id,
      ...notDeleted
    },
    include: {
      members: {
        where: { isActive: true },
        select: {
          id: true,
          position: true,
          isActive: true,
          joinedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true
            }
          }
        }
      },
      _count: {
        select: { members: true }
      }
    }
  });
  if (!department) {
    throw new Error("Department not found!");
  }
  return department;
};
var updateDepartment = async (id, payload) => {
  const department = await prisma.department.findFirst({
    where: {
      id,
      ...notDeleted
    }
  });
  if (!department) {
    throw new Error("Department not found!");
  }
  return prisma.department.update({
    where: { id },
    data: payload
  });
};
var deleteDepartment = async (id, actorId) => {
  const department = await prisma.department.findFirst({
    where: {
      id,
      ...notDeleted
    }
  });
  if (!department) {
    throw new Error("Department not found!");
  }
  await prisma.department.update({
    where: { id },
    data: {
      isActive: false,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  await auditLogService.recordAuditLog({
    action: "DEPARTMENT_DELETED",
    entityType: "DEPARTMENT",
    entityId: department.id,
    actorId: actorId ?? null,
    oldValues: { name: department.name, isActive: department.isActive },
    newValues: { isActive: false, deletedAt: /* @__PURE__ */ new Date() }
  });
  return null;
};
var departmentService = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
};

// src/app/module/department/department.controller.ts
var createDepartment2 = catchAsync(async (req, res) => {
  const result = await departmentService.createDepartment(req.body);
  sendResponse(res, {
    statusCode: httpStatus5.CREATED,
    success: true,
    message: "Department created successfully",
    data: result
  });
});
var getAllDepartments2 = catchAsync(async (_req, res) => {
  const result = await departmentService.getAllDepartments();
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Departments fetched successfully",
    data: result
  });
});
var getDepartmentById2 = catchAsync(async (req, res) => {
  const result = await departmentService.getDepartmentById(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Department fetched successfully",
    data: result
  });
});
var updateDepartment2 = catchAsync(async (req, res) => {
  const result = await departmentService.updateDepartment(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Department updated successfully",
    data: result
  });
});
var deleteDepartment2 = catchAsync(async (req, res) => {
  await departmentService.deleteDepartment(req.params.id, req.user.id);
  sendResponse(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Department deleted successfully",
    data: null
  });
});
var departmentController = {
  createDepartment: createDepartment2,
  getAllDepartments: getAllDepartments2,
  getDepartmentById: getDepartmentById2,
  updateDepartment: updateDepartment2,
  deleteDepartment: deleteDepartment2
};

// src/app/module/department/departmentMember.controller.ts
import httpStatus6 from "http-status";

// src/app/module/department/departmentMember.service.ts
var getActiveDepartment = async (departmentId) => {
  const department = await prisma.department.findFirst({
    where: {
      id: departmentId,
      deletedAt: null
    }
  });
  if (!department) {
    throw new Error("Department not found!");
  }
  return department;
};
var addMember = async (departmentId, payload) => {
  await getActiveDepartment(departmentId);
  const user = await prisma.user.findFirst({
    where: {
      id: payload.userId,
      isDeleted: false
    }
  });
  if (!user) {
    throw new Error("User not found!");
  }
  if (user.status === UserStatus.DELETED || user.status === UserStatus.BLOCKED) {
    throw new Error(
      `User is ${user.status.toLowerCase()}. Cannot be added to a department!`
    );
  }
  return prisma.departmentMember.create({
    data: {
      departmentId,
      userId: payload.userId,
      position: payload.position
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true
        }
      }
    }
  });
};
var getMembers = async (departmentId) => {
  await getActiveDepartment(departmentId);
  return prisma.departmentMember.findMany({
    where: { departmentId },
    orderBy: { joinedAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          role: true,
          status: true
        }
      }
    }
  });
};
var updateMember = async (departmentId, memberId, payload) => {
  await getActiveDepartment(departmentId);
  const existingMember = await prisma.departmentMember.findFirst({
    where: {
      id: memberId,
      departmentId
    }
  });
  if (!existingMember) {
    throw new Error("Department member not found!");
  }
  return prisma.departmentMember.update({
    where: { id: memberId },
    data: payload,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true
        }
      }
    }
  });
};
var removeMember = async (departmentId, memberId) => {
  await getActiveDepartment(departmentId);
  const existingMember = await prisma.departmentMember.findFirst({
    where: {
      id: memberId,
      departmentId
    }
  });
  if (!existingMember) {
    throw new Error("Department member not found!");
  }
  await prisma.departmentMember.delete({
    where: { id: memberId }
  });
  return null;
};
var departmentMemberService = {
  addMember,
  getMembers,
  updateMember,
  removeMember
};

// src/app/module/department/departmentMember.controller.ts
var addMember2 = catchAsync(async (req, res) => {
  const result = await departmentMemberService.addMember(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus6.CREATED,
    success: true,
    message: "Member added to department successfully",
    data: result
  });
});
var getMembers2 = catchAsync(async (req, res) => {
  const result = await departmentMemberService.getMembers(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Department members fetched successfully",
    data: result
  });
});
var updateMember2 = catchAsync(async (req, res) => {
  const result = await departmentMemberService.updateMember(
    req.params.id,
    req.params.memberId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Department member updated successfully",
    data: result
  });
});
var removeMember2 = catchAsync(async (req, res) => {
  await departmentMemberService.removeMember(
    req.params.id,
    req.params.memberId
  );
  sendResponse(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Department member removed successfully",
    data: null
  });
});
var departmentMemberController = {
  addMember: addMember2,
  getMembers: getMembers2,
  updateMember: updateMember2,
  removeMember: removeMember2
};

// src/app/module/department/department.route.ts
var router3 = Router3();
router3.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  departmentController.createDepartment
);
router3.get("/", departmentController.getAllDepartments);
router3.get("/:id", departmentController.getDepartmentById);
router3.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  departmentController.updateDepartment
);
router3.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  departmentController.deleteDepartment
);
router3.post(
  "/:id/members",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  departmentMemberController.addMember
);
router3.get("/:id/members", auth(), departmentMemberController.getMembers);
router3.patch(
  "/:id/members/:memberId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  departmentMemberController.updateMember
);
router3.delete(
  "/:id/members/:memberId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  departmentMemberController.removeMember
);
var departmentRoutes = router3;

// src/app/module/category/category.route.ts
import { Router as Router4 } from "express";

// src/app/module/category/category.controller.ts
import httpStatus7 from "http-status";

// src/app/module/category/category.service.ts
var notDeleted2 = { deletedAt: null };
var createCategory = async (payload) => {
  const department = await prisma.department.findFirst({
    where: {
      id: payload.departmentId,
      ...notDeleted2
    }
  });
  if (!department) {
    throw new Error("Department not found!");
  }
  return prisma.category.create({
    data: {
      departmentId: payload.departmentId,
      name: payload.name,
      description: payload.description,
      paymentRequired: payload.paymentRequired,
      defaultFeeAmount: payload.defaultFeeAmount,
      currency: payload.currency,
      isActive: payload.isActive
    },
    include: {
      department: {
        select: {
          id: true,
          name: true,
          code: true
        }
      }
    }
  });
};
var getAllCategories = async (departmentId) => {
  return prisma.category.findMany({
    where: {
      ...notDeleted2,
      ...departmentId && { departmentId }
    },
    orderBy: { createdAt: "desc" },
    include: {
      department: {
        select: {
          id: true,
          name: true,
          code: true
        }
      }
    }
  });
};
var getCategoryById = async (id) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      ...notDeleted2
    },
    include: {
      department: {
        select: {
          id: true,
          name: true,
          code: true
        }
      },
      slaPolicy: true
    }
  });
  if (!category) {
    throw new Error("Category not found!");
  }
  return category;
};
var updateCategory = async (id, payload) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      ...notDeleted2
    }
  });
  if (!category) {
    throw new Error("Category not found!");
  }
  return prisma.category.update({
    where: { id },
    data: payload,
    include: {
      department: {
        select: {
          id: true,
          name: true,
          code: true
        }
      }
    }
  });
};
var deleteCategory = async (id, actorId) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      ...notDeleted2
    }
  });
  if (!category) {
    throw new Error("Category not found!");
  }
  await prisma.category.update({
    where: { id },
    data: {
      isActive: false,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  await auditLogService.recordAuditLog({
    action: "CATEGORY_DELETED",
    entityType: "CATEGORY",
    entityId: category.id,
    actorId: actorId ?? null,
    oldValues: { name: category.name, isActive: category.isActive },
    newValues: { isActive: false, deletedAt: /* @__PURE__ */ new Date() }
  });
  return null;
};
var categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};

// src/app/module/category/category.controller.ts
var createCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.createCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus7.CREATED,
    success: true,
    message: "Category created successfully",
    data: result
  });
});
var getAllCategories2 = catchAsync(async (req, res) => {
  const result = await categoryService.getAllCategories(
    req.query.departmentId
  );
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "Categories fetched successfully",
    data: result
  });
});
var getCategoryById2 = catchAsync(async (req, res) => {
  const result = await categoryService.getCategoryById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "Category fetched successfully",
    data: result
  });
});
var updateCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.updateCategory(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "Category updated successfully",
    data: result
  });
});
var deleteCategory2 = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id, req.user.id);
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "Category deleted successfully",
    data: null
  });
});
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  getCategoryById: getCategoryById2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/app/module/category/slaPolicy.controller.ts
import httpStatus8 from "http-status";

// src/app/module/category/slaPolicy.service.ts
var categoryScoped = (categoryId) => ({
  id: categoryId,
  deletedAt: null
  // categories are soft deleted — never expose SLAs of deleted ones
});
var getSlaByCategory = async (categoryId) => {
  const category = await prisma.category.findFirst({
    where: categoryScoped(categoryId),
    select: { id: true }
  });
  if (!category) {
    throw new Error("Category not found!");
  }
  return prisma.slaPolicy.findUnique({
    where: { categoryId }
  });
};
var createSlaForCategory = async (categoryId, payload) => {
  const category = await prisma.category.findFirst({
    where: categoryScoped(categoryId),
    select: { id: true }
  });
  if (!category) {
    throw new Error("Category not found!");
  }
  const existing = await prisma.slaPolicy.findUnique({
    where: { categoryId },
    select: { id: true }
  });
  if (existing) {
    throw new Error("SLA policy already exists for this category");
  }
  return prisma.slaPolicy.create({
    data: {
      categoryId,
      responseWithinHours: payload.responseWithinHours,
      resolutionWithinHours: payload.resolutionWithinHours,
      reopenWindowHours: payload.reopenWindowHours,
      isActive: payload.isActive
    }
  });
};
var updateSlaForCategory = async (categoryId, payload) => {
  const category = await prisma.category.findFirst({
    where: categoryScoped(categoryId),
    select: { id: true }
  });
  if (!category) {
    throw new Error("Category not found!");
  }
  const existing = await prisma.slaPolicy.findUnique({
    where: { categoryId }
  });
  if (!existing) {
    if (payload.responseWithinHours === void 0 || payload.resolutionWithinHours === void 0 || payload.reopenWindowHours === void 0) {
      throw new Error(
        "No SLA exists for this category yet \u2014 responseWithinHours, resolutionWithinHours and reopenWindowHours are all required to create one"
      );
    }
    return prisma.slaPolicy.create({
      data: {
        categoryId,
        responseWithinHours: payload.responseWithinHours,
        resolutionWithinHours: payload.resolutionWithinHours,
        reopenWindowHours: payload.reopenWindowHours,
        isActive: payload.isActive
      }
    });
  }
  return prisma.slaPolicy.update({
    where: { categoryId },
    data: {
      ...payload.responseWithinHours !== void 0 && {
        responseWithinHours: payload.responseWithinHours
      },
      ...payload.resolutionWithinHours !== void 0 && {
        resolutionWithinHours: payload.resolutionWithinHours
      },
      ...payload.reopenWindowHours !== void 0 && {
        reopenWindowHours: payload.reopenWindowHours
      },
      ...payload.isActive !== void 0 && { isActive: payload.isActive }
    }
  });
};
var slaPolicyService = {
  getSlaByCategory,
  createSlaForCategory,
  updateSlaForCategory
};

// src/app/module/category/slaPolicy.controller.ts
var createSla = catchAsync(async (req, res) => {
  const result = await slaPolicyService.createSlaForCategory(
    req.params.categoryId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus8.CREATED,
    success: true,
    message: "SLA policy created successfully",
    data: result
  });
});
var getSla = catchAsync(async (req, res) => {
  const result = await slaPolicyService.getSlaByCategory(
    req.params.categoryId
  );
  sendResponse(res, {
    statusCode: httpStatus8.OK,
    success: true,
    message: "SLA policy fetched successfully",
    data: result
    // null when the category has no SLA configured yet
  });
});
var updateSla = catchAsync(async (req, res) => {
  const result = await slaPolicyService.updateSlaForCategory(
    req.params.categoryId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus8.OK,
    success: true,
    message: "SLA policy updated successfully",
    data: result
  });
});
var slaPolicyController = {
  createSla,
  getSla,
  updateSla
};

// src/app/module/category/category.route.ts
var router4 = Router4();
router4.get("/", auth(), categoryController.getAllCategories);
router4.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  categoryController.createCategory
);
router4.get("/:id", auth(), categoryController.getCategoryById);
router4.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  categoryController.updateCategory
);
router4.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  categoryController.deleteCategory
);
router4.get("/:categoryId/sla", auth(), slaPolicyController.getSla);
router4.post(
  "/:categoryId/sla",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  slaPolicyController.createSla
);
router4.patch(
  "/:categoryId/sla",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  slaPolicyController.updateSla
);
var categoryRoutes = router4;

// src/app/module/ward/ward.route.ts
import { Router as Router5 } from "express";

// src/app/module/ward/ward.controller.ts
import httpStatus9 from "http-status";

// src/app/module/ward/ward.service.ts
var getAllWards = async (filters = {}) => {
  const { city, isActive } = filters;
  return prisma.ward.findMany({
    where: {
      ...city && { city: { equals: city, mode: "insensitive" } },
      ...isActive !== void 0 && { isActive }
    },
    orderBy: [{ city: "asc" }, { name: "asc" }]
  });
};
var getWardById = async (id) => {
  const ward = await prisma.ward.findUnique({
    where: { id }
  });
  if (!ward) {
    throw new Error("Ward not found!");
  }
  return ward;
};
var createWard = async (payload) => {
  return prisma.ward.create({
    data: payload
  });
};
var updateWard = async (id, payload) => {
  const ward = await prisma.ward.findUnique({
    where: { id }
  });
  if (!ward) {
    throw new Error("Ward not found!");
  }
  return prisma.ward.update({
    where: { id },
    data: payload
  });
};
var deleteWard = async (id, actorId) => {
  const ward = await prisma.ward.findUnique({
    where: { id }
  });
  if (!ward) {
    throw new Error("Ward not found!");
  }
  await prisma.ward.delete({
    where: { id }
  });
  await auditLogService.recordAuditLog({
    action: "WARD_DELETED",
    entityType: "WARD",
    entityId: ward.id,
    actorId: actorId ?? null,
    oldValues: { name: ward.name, city: ward.city },
    newValues: null
  });
  return null;
};
var wardService = {
  getAllWards,
  getWardById,
  createWard,
  updateWard,
  deleteWard
};

// src/app/module/ward/ward.controller.ts
var createWard2 = catchAsync(async (req, res) => {
  const result = await wardService.createWard(req.body);
  sendResponse(res, {
    statusCode: httpStatus9.CREATED,
    success: true,
    message: "Ward created successfully",
    data: result
  });
});
var getAllWards2 = catchAsync(async (req, res) => {
  const filters = {
    city: req.query.city,
    isActive: req.query.isActive ? req.query.isActive === "true" : void 0
  };
  const result = await wardService.getAllWards(filters);
  sendResponse(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Wards fetched successfully",
    data: result
  });
});
var getWardById2 = catchAsync(async (req, res) => {
  const result = await wardService.getWardById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Ward fetched successfully",
    data: result
  });
});
var updateWard2 = catchAsync(async (req, res) => {
  const result = await wardService.updateWard(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Ward updated successfully",
    data: result
  });
});
var deleteWard2 = catchAsync(async (req, res) => {
  await wardService.deleteWard(req.params.id, req.user.id);
  sendResponse(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Ward deleted successfully",
    data: null
  });
});
var wardController = {
  createWard: createWard2,
  getAllWards: getAllWards2,
  getWardById: getWardById2,
  updateWard: updateWard2,
  deleteWard: deleteWard2
};

// src/app/module/ward/ward.validation.ts
import { z as z2 } from "zod";
var createWardSchema = z2.object({
  name: z2.string().min(1, "Ward name is required"),
  code: z2.string().min(1, "Ward code is required"),
  city: z2.string().min(1, "City is required"),
  isActive: z2.boolean().optional()
});
var updateWardSchema = createWardSchema.partial();
var wardValidation = {
  createWardSchema,
  updateWardSchema
};

// src/app/module/ward/ward.route.ts
var router5 = Router5();
router5.get("/", auth(), wardController.getAllWards);
router5.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(wardValidation.createWardSchema),
  wardController.createWard
);
router5.get("/:id", auth(), wardController.getWardById);
router5.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(wardValidation.updateWardSchema),
  wardController.updateWard
);
router5.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  wardController.deleteWard
);
var wardRoutes = router5;

// src/app/module/service-request/service-request.route.ts
import { Router as Router12 } from "express";

// src/app/module/service-request/service-request.controller.ts
import httpStatus10 from "http-status";

// src/app/module/notification/notification.service.ts
var notificationInclude = {
  request: { select: { id: true, requestNo: true, title: true, status: true } }
};
var safeCreate = async (input, client = prisma) => {
  try {
    await client.notification.create({
      data: {
        userId: input.userId,
        requestId: input.requestId,
        type: input.type,
        payload: input.payload
      }
    });
  } catch (error) {
    console.error("[notification] failed to create notification:", error);
  }
};
var buildRequestPayload = (request, extra) => ({
  requestId: request.id,
  requestNo: request.requestNo,
  title: request.title,
  status: request.status,
  ...extra ?? {}
});
var notifyRequestCreated = async (request, citizenUserId, options) => {
  await safeCreate(
    {
      userId: citizenUserId,
      requestId: request.id,
      type: NotificationType.REQUEST_CREATED,
      payload: buildRequestPayload(request, {
        message: `Your request ${request.requestNo} has been submitted successfully`
      })
    },
    options?.tx
  );
};
var notifyRequestAssigned = async (request, assigneeUserId, assigneeName, options) => {
  await safeCreate(
    {
      userId: assigneeUserId,
      requestId: request.id,
      type: NotificationType.REQUEST_ASSIGNED,
      payload: buildRequestPayload(request, {
        assigneeUserId,
        assigneeName,
        message: `Request ${request.requestNo} has been assigned to ${assigneeName ?? "you"}`
      })
    },
    options?.tx
  );
};
var notifyStatusChanged = async (request, fromStatus, recipientRole, recipientUserId, options) => {
  await safeCreate(
    {
      userId: recipientUserId,
      requestId: request.id,
      type: NotificationType.STATUS_CHANGED,
      payload: buildRequestPayload(request, {
        fromStatus,
        toStatus: request.status,
        audience: recipientRole,
        message: `Request ${request.requestNo} status changed from ${fromStatus ?? "\u2014"} to ${request.status}`
      })
    },
    options?.tx
  );
};
var notifyPaymentRequired = async (request, citizenUserId, amount, currency, options) => {
  await safeCreate(
    {
      userId: citizenUserId,
      requestId: request.id,
      type: NotificationType.PAYMENT_REQUIRED,
      payload: buildRequestPayload(request, {
        amount,
        currency,
        message: `Payment of ${amount} ${currency} is required for request ${request.requestNo}`
      })
    },
    options?.tx
  );
};
var notifyPaymentSuccessful = async (request, citizenUserId, amount, currency, options) => {
  await safeCreate(
    {
      userId: citizenUserId,
      requestId: request.id,
      type: NotificationType.PAYMENT_SUCCESSFUL,
      payload: buildRequestPayload(request, {
        amount,
        currency,
        message: `Payment of ${amount} ${currency} received for request ${request.requestNo}`
      })
    },
    options?.tx
  );
};
var getMyNotifications = async (userId, filters) => {
  const page = Math.max(Number(filters.page) || 1, 1);
  const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);
  const where = { userId };
  if (filters.unreadOnly) where.readAt = null;
  const [data, total] = await prisma.$transaction([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: notificationInclude
    }),
    prisma.notification.count({ where })
  ]);
  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
};
var markAsRead = async (notificationId, userId) => {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
    select: { id: true, userId: true, readAt: true }
  });
  if (!notification) throw new Error("Notification not found.");
  if (notification.readAt)
    throw new Error("Notification already marked as read.");
  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: /* @__PURE__ */ new Date() },
    select: { id: true, userId: true, readAt: true }
  });
  return updated;
};
var markAllAsRead = async (userId) => {
  const result = await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: /* @__PURE__ */ new Date() }
  });
  return { count: result.count };
};
var notificationService = {
  notifyRequestCreated,
  notifyRequestAssigned,
  notifyStatusChanged,
  notifyPaymentRequired,
  notifyPaymentSuccessful,
  getMyNotifications,
  markAsRead,
  markAllAsRead
};

// src/app/module/service-request/service-request.service.ts
var serviceRequestInclude = {
  citizen: {
    select: { id: true, name: true, email: true, contactNumber: true }
  },
  category: {
    include: {
      department: { select: { id: true, name: true, code: true } }
    }
  },
  currentDepartment: {
    select: { id: true, name: true, code: true }
  },
  reportedLocation: {
    include: {
      ward: { select: { id: true, name: true, code: true, city: true } }
    }
  }
};
var generateRequestNo = async () => {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const prefix = `REQ-${year}-`;
  const lastRequest = await prisma.serviceRequest.findFirst({
    where: { requestNo: { startsWith: prefix } },
    orderBy: { requestNo: "desc" },
    select: { requestNo: true }
  });
  const lastSequence = lastRequest ? parseInt(lastRequest.requestNo.split("-")[2], 10) : 0;
  const nextSequence = isNaN(lastSequence) ? 1 : lastSequence + 1;
  return `${prefix}${nextSequence.toString().padStart(5, "0")}`;
};
var calculateDueDates = (slaPolicy) => {
  if (!slaPolicy) return { responseDueAt: null, resolutionDueAt: null };
  const now = Date.now();
  return {
    responseDueAt: new Date(now + slaPolicy.responseWithinHours * 36e5),
    resolutionDueAt: new Date(
      now + slaPolicy.resolutionWithinHours * 36e5
    )
  };
};
var createServiceRequest = async (userId, payload) => {
  const citizen = await prisma.citizen.findUnique({ where: { userId } });
  if (!citizen)
    throw new Error(
      "Citizen profile not found. Please complete your profile first."
    );
  const category = await prisma.category.findFirst({
    where: { id: payload.categoryId, isActive: true, deletedAt: null },
    include: { department: true, slaPolicy: true }
  });
  if (!category) throw new Error("Category not found or inactive.");
  const ward = await prisma.ward.findFirst({
    where: { id: payload.wardId, isActive: true }
  });
  if (!ward) throw new Error("Ward not found or inactive.");
  const requestNo = await generateRequestNo();
  const { responseDueAt, resolutionDueAt } = calculateDueDates(
    category.slaPolicy
  );
  const serviceRequest = await prisma.$transaction(async (tx) => {
    const created = await tx.serviceRequest.create({
      data: {
        requestNo,
        citizenId: citizen.id,
        categoryId: category.id,
        currentDepartmentId: category.departmentId,
        type: payload.type,
        title: payload.title,
        description: payload.description,
        priority: payload.priority ?? RequestPriority.MEDIUM,
        status: RequestStatus.SUBMITTED,
        responseDueAt,
        resolutionDueAt
      },
      include: serviceRequestInclude
    });
    await tx.reportedLocation.create({
      data: {
        requestId: created.id,
        wardId: payload.wardId,
        addressLine: payload.addressLine,
        landmark: payload.landmark,
        latitude: payload.latitude ?? null,
        longitude: payload.longitude ?? null
      }
    });
    await tx.requestDepartmentRoute.create({
      data: {
        requestId: created.id,
        departmentId: category.departmentId,
        routedById: userId,
        reason: "Initial submission"
      }
    });
    return created;
  }, {
    maxWait: 1e4,
    timeout: 2e4
  });
  await notificationService.notifyRequestCreated(serviceRequest, userId);
  return serviceRequest;
};
var getAllServiceRequests = async (filters, userId, userRole) => {
  const {
    searchTerm,
    status,
    priority,
    categoryId,
    departmentId,
    wardId,
    citizenId,
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = filters;
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const where = {};
  if (citizenId) {
    where.citizenId = citizenId;
  } else if (userRole === "CITIZEN") {
    const citizen = await prisma.citizen.findUnique({ where: { userId } });
    if (!citizen) throw new Error("Citizen profile not found.");
    where.citizenId = citizen.id;
  } else if (userRole === "STAFF") {
    const memberships = await prisma.departmentMember.findMany({
      where: { userId, isActive: true },
      select: { departmentId: true }
    });
    const deptIds = memberships.map((m) => m.departmentId);
    where.currentDepartmentId = deptIds.length > 0 ? { in: deptIds } : "no-access";
  }
  if (searchTerm) {
    where.OR = [
      { requestNo: { contains: searchTerm, mode: "insensitive" } },
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (categoryId) where.categoryId = categoryId;
  if (departmentId) where.currentDepartmentId = departmentId;
  if (wardId) where.reportedLocation = { wardId };
  const [data, total] = await prisma.$transaction([
    prisma.serviceRequest.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      include: serviceRequestInclude
    }),
    prisma.serviceRequest.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber)
    }
  };
};
var getServiceRequestById = async (id, userId, userRole) => {
  const serviceRequest = await prisma.serviceRequest.findFirst({
    where: { id },
    include: serviceRequestInclude
  });
  if (!serviceRequest) return null;
  if (userRole === "CITIZEN") {
    const citizen = await prisma.citizen.findUnique({ where: { userId } });
    if (!citizen || serviceRequest.citizenId !== citizen.id) {
      throw new Error("You don't have permission to view this request.");
    }
  } else if (userRole === "STAFF") {
    const memberships = await prisma.departmentMember.findMany({
      where: { userId, isActive: true },
      select: { departmentId: true }
    });
    const deptIds = memberships.map((m) => m.departmentId);
    if (!deptIds.includes(serviceRequest.currentDepartmentId)) {
      throw new Error("You don't have permission to view this request.");
    }
  }
  return serviceRequest;
};
var getMyServiceRequests = async (userId, filters) => {
  const citizen = await prisma.citizen.findUnique({ where: { userId } });
  if (!citizen) throw new Error("Citizen profile not found.");
  return getAllServiceRequests(
    { ...filters, citizenId: citizen.id },
    userId,
    "CITIZEN"
  );
};
var getRequestTimeline = async (id, userId, userRole) => {
  const serviceRequest = await getServiceRequestById(id, userId, userRole);
  if (!serviceRequest) throw new Error("Service request not found.");
  const routes = await prisma.requestDepartmentRoute.findMany({
    where: { requestId: id },
    orderBy: { routedAt: "asc" },
    include: {
      department: { select: { id: true, name: true, code: true } },
      routedBy: { select: { id: true, name: true, email: true } }
    }
  });
  const statusHistory = await prisma.requestStatusHistory.findMany({
    where: { requestId: id },
    orderBy: { createdAt: "asc" },
    include: {
      changedBy: { select: { id: true, name: true, email: true } }
    }
  });
  const assignments = await prisma.requestAssignment.findMany({
    where: { requestId: id },
    orderBy: { assignedAt: "asc" },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      assignedBy: { select: { id: true, name: true, email: true } }
    }
  });
  const timeline = [
    {
      type: "SUBMITTED",
      timestamp: serviceRequest.createdAt,
      note: `Request ${serviceRequest.requestNo} submitted`
    }
  ];
  for (const route of routes) {
    timeline.push({
      type: "ROUTED",
      timestamp: route.routedAt,
      note: route.reason ?? `Routed to ${route.department.name}`,
      actor: route.routedBy,
      department: route.department
    });
  }
  for (const entry of statusHistory) {
    timeline.push({
      type: "STATUS_CHANGED",
      timestamp: entry.createdAt,
      note: entry.note ?? `Status changed from ${entry.fromStatus ?? "\u2014"} to ${entry.toStatus}`,
      actor: entry.changedBy,
      meta: { fromStatus: entry.fromStatus, toStatus: entry.toStatus }
    });
  }
  for (const a of assignments) {
    timeline.push({
      type: "ASSIGNED",
      timestamp: a.assignedAt,
      note: a.note ?? `Assigned to ${a.assignee.name}`,
      actor: a.assignedBy,
      meta: { assigneeId: a.assignee.id, assigneeName: a.assignee.name }
    });
    if (a.releasedAt) {
      timeline.push({
        type: "RELEASED",
        timestamp: a.releasedAt,
        note: `Assignment for ${a.assignee.name} released`,
        actor: a.assignedBy,
        meta: { assigneeId: a.assignee.id, assigneeName: a.assignee.name }
      });
    }
  }
  return timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};
var serviceRequestService = {
  createServiceRequest,
  getAllServiceRequests,
  getServiceRequestById,
  getMyServiceRequests,
  getRequestTimeline
};

// src/app/module/service-request/service-request.controller.ts
var parseFilters = (query) => ({
  searchTerm: query.searchTerm,
  status: query.status,
  priority: query.priority,
  categoryId: query.categoryId,
  departmentId: query.departmentId,
  wardId: query.wardId,
  page: query.page ? Number(query.page) : void 0,
  limit: query.limit ? Number(query.limit) : void 0,
  sortBy: query.sortBy,
  sortOrder: query.sortOrder
});
var createServiceRequest2 = catchAsync(async (req, res) => {
  const result = await serviceRequestService.createServiceRequest(req.user.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus10.CREATED,
    success: true,
    message: "Service request created successfully",
    data: result
  });
});
var getAllServiceRequests2 = catchAsync(async (req, res) => {
  const result = await serviceRequestService.getAllServiceRequests(parseFilters(req.query), req.user.id, req.user.role);
  sendResponse(res, {
    statusCode: httpStatus10.OK,
    success: true,
    message: "Service requests fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getMyServiceRequests2 = catchAsync(async (req, res) => {
  const result = await serviceRequestService.getMyServiceRequests(req.user.id, parseFilters(req.query));
  sendResponse(res, {
    statusCode: httpStatus10.OK,
    success: true,
    message: "My service requests fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getServiceRequestById2 = catchAsync(async (req, res) => {
  const result = await serviceRequestService.getServiceRequestById(String(req.params.id), req.user.id, req.user.role);
  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus10.NOT_FOUND,
      success: false,
      message: "Service request not found",
      data: null
    });
    return;
  }
  sendResponse(res, {
    statusCode: httpStatus10.OK,
    success: true,
    message: "Service request fetched successfully",
    data: result
  });
});
var getRequestTimeline2 = catchAsync(async (req, res) => {
  const result = await serviceRequestService.getRequestTimeline(String(req.params.id), req.user.id, req.user.role);
  sendResponse(res, {
    statusCode: httpStatus10.OK,
    success: true,
    message: "Request timeline fetched successfully",
    data: result
  });
});
var serviceRequestController = {
  createServiceRequest: createServiceRequest2,
  getAllServiceRequests: getAllServiceRequests2,
  getMyServiceRequests: getMyServiceRequests2,
  getServiceRequestById: getServiceRequestById2,
  getRequestTimeline: getRequestTimeline2
};

// src/app/module/service-request/service-request.validation.ts
import { z as z3 } from "zod";
var createServiceRequestSchema = z3.object({
  body: z3.object({
    categoryId: z3.string().uuid("Invalid category ID"),
    title: z3.string().min(1, "Title is required").max(200, "Title cannot exceed 200 characters"),
    description: z3.string().min(1, "Description is required"),
    type: z3.nativeEnum(RequestType),
    priority: z3.nativeEnum(RequestPriority).optional(),
    wardId: z3.string().uuid("Invalid ward ID"),
    addressLine: z3.string().min(1, "Address is required").max(500, "Address cannot exceed 500 characters"),
    landmark: z3.string().max(200, "Landmark cannot exceed 200 characters").optional(),
    latitude: z3.number().min(-90).max(90).optional(),
    longitude: z3.number().min(-180).max(180).optional()
  })
});
var updateServiceRequestSchema = z3.object({
  params: z3.object({
    id: z3.string().uuid("Invalid request ID")
  }),
  body: z3.object({
    title: z3.string().min(1).max(200).optional(),
    description: z3.string().min(1).optional(),
    type: z3.nativeEnum(RequestType).optional(),
    priority: z3.nativeEnum(RequestPriority).optional(),
    wardId: z3.string().uuid().optional(),
    addressLine: z3.string().min(1).max(500).optional(),
    landmark: z3.string().max(200).optional(),
    latitude: z3.number().min(-90).max(90).optional(),
    longitude: z3.number().min(-180).max(180).optional()
  })
});
var listServiceRequestsSchema = z3.object({
  query: z3.object({
    searchTerm: z3.string().optional(),
    status: z3.nativeEnum(RequestStatus).optional(),
    priority: z3.nativeEnum(RequestPriority).optional(),
    categoryId: z3.string().uuid().optional(),
    departmentId: z3.string().uuid().optional(),
    wardId: z3.string().uuid().optional(),
    page: z3.coerce.number().int().positive().default(1),
    limit: z3.coerce.number().int().positive().max(100).default(20),
    sortBy: z3.string().default("createdAt"),
    sortOrder: z3.enum(["asc", "desc"]).default("desc")
  })
});
var getServiceRequestByIdSchema = z3.object({
  params: z3.object({
    id: z3.string().uuid("Invalid request ID")
  })
});
var serviceRequestValidation = {
  createServiceRequestSchema,
  updateServiceRequestSchema,
  listServiceRequestsSchema,
  getServiceRequestByIdSchema
};

// src/app/module/request-routing/request-routing.route.ts
import { Router as Router6 } from "express";

// src/app/module/request-routing/request-routing.controller.ts
import httpStatus11 from "http-status";

// src/app/module/request-routing/request-routing.service.ts
var routeInclude = {
  department: { select: { id: true, name: true, code: true } },
  routedBy: { select: { id: true, name: true, email: true } },
  request: { select: { id: true, requestNo: true, status: true, currentDepartmentId: true } }
};
var routeRequest = async (requestId, userId, userRole, payload) => {
  const request = await prisma.serviceRequest.findFirst({ where: { id: requestId } });
  if (!request) throw new Error("Service request not found.");
  if (userRole === "STAFF") {
    const memberships = await prisma.departmentMember.findMany({
      where: { userId, isActive: true },
      select: { departmentId: true }
    });
    const deptIds = memberships.map((m) => m.departmentId);
    if (!deptIds.includes(request.currentDepartmentId)) {
      throw new Error("You can only route requests that belong to your department.");
    }
  }
  const targetDepartment = await prisma.department.findFirst({
    where: { id: payload.departmentId, isActive: true, deletedAt: null }
  });
  if (!targetDepartment) throw new Error("Target department not found or inactive.");
  if (request.currentDepartmentId === payload.departmentId) {
    throw new Error("Request is already assigned to that department.");
  }
  const newRoute = await prisma.$transaction(async (tx) => {
    await tx.requestDepartmentRoute.updateMany({
      where: { requestId, endedAt: null },
      data: { endedAt: /* @__PURE__ */ new Date() }
    });
    const created = await tx.requestDepartmentRoute.create({
      data: {
        requestId,
        departmentId: payload.departmentId,
        routedById: userId,
        reason: payload.reason ?? null
      },
      include: routeInclude
    });
    await tx.serviceRequest.update({
      where: { id: requestId },
      data: { currentDepartmentId: payload.departmentId }
    });
    return created;
  }, {
    maxWait: 1e4,
    timeout: 2e4
  });
  return newRoute;
};
var getRoutes = async (requestId) => {
  const request = await prisma.serviceRequest.findFirst({ where: { id: requestId } });
  if (!request) throw new Error("Service request not found.");
  const routes = await prisma.requestDepartmentRoute.findMany({
    where: { requestId },
    orderBy: { routedAt: "asc" },
    include: routeInclude
  });
  return routes;
};
var endRoute = async (requestId, routeId) => {
  const route = await prisma.requestDepartmentRoute.findFirst({
    where: { id: routeId, requestId }
  });
  if (!route) throw new Error("Route entry not found.");
  if (route.endedAt) throw new Error("This route has already been ended.");
  const updated = await prisma.requestDepartmentRoute.update({
    where: { id: routeId },
    data: { endedAt: /* @__PURE__ */ new Date() },
    include: routeInclude
  });
  return updated;
};
var requestRoutingService = {
  routeRequest,
  getRoutes,
  endRoute
};

// src/app/module/request-routing/request-routing.controller.ts
var routeRequest2 = catchAsync(async (req, res) => {
  const result = await requestRoutingService.routeRequest(
    String(req.params.id),
    req.user.id,
    req.user.role,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus11.CREATED,
    success: true,
    message: "Request routed to department successfully",
    data: result
  });
});
var getRoutes2 = catchAsync(async (req, res) => {
  const result = await requestRoutingService.getRoutes(String(req.params.id));
  sendResponse(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Routing history fetched successfully",
    data: result
  });
});
var endRoute2 = catchAsync(async (req, res) => {
  const result = await requestRoutingService.endRoute(
    String(req.params.id),
    String(req.params.routeId)
  );
  sendResponse(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Route ended successfully",
    data: result
  });
});
var requestRoutingController = {
  routeRequest: routeRequest2,
  getRoutes: getRoutes2,
  endRoute: endRoute2
};

// src/app/module/request-routing/request-routing.validation.ts
import { z as z4 } from "zod";
var routeRequestSchema = z4.object({
  params: z4.object({
    id: z4.string().uuid("Invalid request ID")
  }),
  body: z4.object({
    departmentId: z4.string().uuid("Invalid department ID"),
    reason: z4.string().min(1).max(500).optional()
  })
});
var endRouteSchema = z4.object({
  params: z4.object({
    id: z4.string().uuid("Invalid request ID"),
    routeId: z4.string().uuid("Invalid route ID")
  })
});
var requestRoutingValidation = {
  routeRequestSchema,
  endRouteSchema
};

// src/app/module/request-routing/request-routing.route.ts
var router6 = Router6({ mergeParams: true });
router6.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
  validateRequest(requestRoutingValidation.routeRequestSchema),
  requestRoutingController.routeRequest
);
router6.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
  requestRoutingController.getRoutes
);
router6.patch(
  "/:routeId/end",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(requestRoutingValidation.endRouteSchema),
  requestRoutingController.endRoute
);
var requestRoutingRoutes = router6;

// src/app/module/request-assignment/request-assignment.route.ts
import { Router as Router7 } from "express";

// src/app/module/request-assignment/request-assignment.controller.ts
import httpStatus12 from "http-status";

// src/app/module/request-status/request-status.constants.ts
var STATUS_TRANSITIONS = {
  [RequestStatus.SUBMITTED]: [RequestStatus.UNDER_REVIEW, RequestStatus.REJECTED],
  [RequestStatus.UNDER_REVIEW]: [
    RequestStatus.ASSIGNED,
    RequestStatus.PENDING,
    RequestStatus.REJECTED
  ],
  [RequestStatus.ASSIGNED]: [
    RequestStatus.IN_PROGRESS,
    RequestStatus.UNDER_REVIEW
  ],
  [RequestStatus.IN_PROGRESS]: [
    RequestStatus.RESOLVED,
    RequestStatus.PENDING,
    RequestStatus.UNDER_REVIEW
  ],
  [RequestStatus.PENDING]: [
    RequestStatus.IN_PROGRESS,
    RequestStatus.UNDER_REVIEW,
    RequestStatus.REJECTED
  ],
  [RequestStatus.RESOLVED]: [
    RequestStatus.CLOSED,
    RequestStatus.REOPENED
  ],
  [RequestStatus.REOPENED]: [
    RequestStatus.UNDER_REVIEW,
    RequestStatus.ASSIGNED,
    RequestStatus.IN_PROGRESS
  ],
  [RequestStatus.CLOSED]: [RequestStatus.REOPENED],
  [RequestStatus.REJECTED]: []
};
var TIMESTAMP_MAP = {
  [RequestStatus.UNDER_REVIEW]: "firstRespondedAt",
  [RequestStatus.RESOLVED]: "resolvedAt",
  [RequestStatus.CLOSED]: "closedAt"
};

// src/app/module/request-status/request-status.service.ts
var statusHistoryInclude = {
  changedBy: { select: { id: true, name: true, email: true } }
};
var validateTransition = (from, to) => {
  const allowed = STATUS_TRANSITIONS[from];
  if (!allowed.includes(to)) {
    throw new Error(
      `Invalid status transition: ${from} \u2192 ${to}. Allowed transitions from ${from}: [${allowed.join(", ") || "none \u2014 this is a terminal status"}]`
    );
  }
};
var buildTimestampUpdate = (toStatus, existing) => {
  const field = TIMESTAMP_MAP[toStatus];
  if (!field) return {};
  if (existing[field] !== null) return {};
  return { [field]: /* @__PURE__ */ new Date() };
};
var changeStatus = async (requestId, changedById, payload, tx) => {
  const run = async (client) => {
    const request = await client.serviceRequest.findFirst({
      where: { id: requestId },
      select: {
        id: true,
        requestNo: true,
        title: true,
        status: true,
        currentDepartmentId: true,
        citizenId: true,
        firstRespondedAt: true,
        resolvedAt: true,
        closedAt: true,
        citizen: { select: { user: { select: { id: true } } } }
      }
    });
    if (!request) throw new Error("Service request not found.");
    const fromStatus = request.status;
    const { toStatus, note } = payload;
    validateTransition(fromStatus, toStatus);
    const timestampUpdate = buildTimestampUpdate(toStatus, {
      firstRespondedAt: request.firstRespondedAt,
      resolvedAt: request.resolvedAt,
      closedAt: request.closedAt
    });
    await client.serviceRequest.update({
      where: { id: requestId },
      data: { status: toStatus, ...timestampUpdate }
    });
    const history = await client.requestStatusHistory.create({
      data: {
        requestId,
        changedById,
        fromStatus,
        toStatus,
        note: note ?? null
      },
      include: statusHistoryInclude
    });
    await auditLogService.recordAuditLog({
      action: "REQUEST_STATUS_CHANGED",
      entityType: "SERVICE_REQUEST",
      entityId: requestId,
      actorId: changedById,
      oldValues: { status: fromStatus },
      newValues: { status: toStatus, note: note ?? null },
      tx: client
    });
    const requestSnapshot = {
      id: request.id,
      requestNo: request.requestNo,
      title: request.title,
      status: toStatus,
      currentDepartmentId: request.currentDepartmentId,
      citizenId: request.citizenId
    };
    const citizenUserId = request.citizen?.user.id ?? null;
    if (citizenUserId && citizenUserId !== changedById) {
      await notificationService.notifyStatusChanged(
        requestSnapshot,
        fromStatus,
        "CITIZEN",
        citizenUserId,
        { tx: client }
      );
    }
    if (!tx) {
      const members = await client.departmentMember.findMany({
        where: { departmentId: request.currentDepartmentId, isActive: true },
        select: { userId: true }
      });
      for (const member of members) {
        if (member.userId === changedById) continue;
        await notificationService.notifyStatusChanged(
          requestSnapshot,
          fromStatus,
          "STAFF",
          member.userId,
          { tx: client }
        );
      }
    }
    return history;
  };
  return tx ? run(tx) : prisma.$transaction(run, {
    maxWait: 1e4,
    timeout: 2e4
  });
};
var getStatusHistory = async (requestId, userId, userRole, filters) => {
  const request = await prisma.serviceRequest.findFirst({
    where: { id: requestId }
  });
  if (!request) throw new Error("Service request not found.");
  if (userRole === "CITIZEN") {
    const citizen = await prisma.citizen.findUnique({ where: { userId } });
    if (!citizen || request.citizenId !== citizen.id) {
      throw new Error(
        "You don't have permission to view this request's status history."
      );
    }
  }
  if (userRole === "STAFF") {
    const memberships = await prisma.departmentMember.findMany({
      where: { userId, isActive: true },
      select: { departmentId: true }
    });
    const deptIds = memberships.map(
      (m) => m.departmentId
    );
    if (!deptIds.includes(request.currentDepartmentId)) {
      throw new Error(
        "You don't have permission to view this request's status history."
      );
    }
  }
  const page = Math.max(Number(filters.page) || 1, 1);
  const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);
  const [data, total] = await prisma.$transaction([
    prisma.requestStatusHistory.findMany({
      where: { requestId },
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
      include: statusHistoryInclude
    }),
    prisma.requestStatusHistory.count({ where: { requestId } })
  ]);
  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
};
var requestStatusService = {
  changeStatus,
  getStatusHistory
};

// src/app/module/request-assignment/request-assignment.service.ts
var assignmentInclude = {
  assignee: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      departmentMemberships: {
        where: { isActive: true },
        select: {
          departmentId: true,
          position: true,
          isActive: true
        }
      }
    }
  },
  assignedBy: {
    select: { id: true, name: true, email: true }
  },
  request: {
    select: {
      id: true,
      requestNo: true,
      title: true,
      status: true,
      currentDepartmentId: true
    }
  }
};
var assignRequest = async (requestId, userId, userRole, payload) => {
  const request = await prisma.serviceRequest.findFirst({
    where: { id: requestId }
  });
  if (!request) throw new Error("Service request not found.");
  if (userRole === "STAFF") {
    const memberships = await prisma.departmentMember.findMany({
      where: { userId, isActive: true },
      select: { departmentId: true }
    });
    const deptIds = memberships.map(
      (m) => m.departmentId
    );
    if (!deptIds.includes(request.currentDepartmentId)) {
      throw new Error(
        "You can only assign requests that belong to your department."
      );
    }
  }
  const assignee = await prisma.user.findFirst({
    where: {
      id: payload.assigneeId,
      role: UserRole.STAFF,
      isDeleted: false
    },
    include: {
      departmentMemberships: {
        where: { isActive: true },
        select: { departmentId: true, position: true, isActive: true }
      }
    }
  });
  if (!assignee) throw new Error("Assignee not found or not a staff member.");
  const isMemberOfDept = assignee.departmentMemberships.some(
    (m) => m.departmentId === request.currentDepartmentId && m.isActive
  );
  if (!isMemberOfDept) {
    throw new Error(
      "Assignee must be an active member of the request's current department."
    );
  }
  const existingActive = await prisma.requestAssignment.findFirst({
    where: { requestId, releasedAt: null }
  });
  if (existingActive) {
    throw new Error(
      "Request already has an active assignment. Release it first."
    );
  }
  const assignment = await prisma.$transaction(async (tx) => {
    const created = await tx.requestAssignment.create({
      data: {
        requestId,
        assigneeId: payload.assigneeId,
        assignedById: userId,
        note: payload.note ?? null
      },
      include: assignmentInclude
    });
    await requestStatusService.changeStatus(
      requestId,
      userId,
      { toStatus: "ASSIGNED", note: `Assigned to staff member` },
      tx
    );
    await auditLogService.recordAuditLog({
      action: "REQUEST_ASSIGNED",
      entityType: "SERVICE_REQUEST",
      entityId: requestId,
      actorId: userId,
      newValues: {
        assignmentId: created.id,
        assigneeId: payload.assigneeId,
        note: payload.note ?? null
      },
      tx
    });
    return created;
  }, {
    maxWait: 1e4,
    timeout: 2e4
  });
  await notificationService.notifyRequestAssigned(
    {
      id: request.id,
      requestNo: request.requestNo,
      title: request.title,
      status: request.status,
      currentDepartmentId: request.currentDepartmentId,
      citizenId: request.citizenId
    },
    assignee.id,
    assignee.name
  );
  return assignment;
};
var getAssignments = async (requestId, filters) => {
  const request = await prisma.serviceRequest.findFirst({
    where: { id: requestId }
  });
  if (!request) throw new Error("Service request not found.");
  const page = Math.max(Number(filters.page) || 1, 1);
  const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);
  const sortBy = filters.sortBy ?? "assignedAt";
  const sortOrder = filters.sortOrder ?? "desc";
  const [data, total] = await prisma.$transaction([
    prisma.requestAssignment.findMany({
      where: { requestId },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: assignmentInclude
    }),
    prisma.requestAssignment.count({ where: { requestId } })
  ]);
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var releaseAssignment = async (requestId, assignmentId, userId, userRole, payload) => {
  const request = await prisma.serviceRequest.findFirst({
    where: { id: requestId }
  });
  if (!request) throw new Error("Service request not found.");
  if (userRole === "STAFF") {
    const memberships = await prisma.departmentMember.findMany({
      where: { userId, isActive: true },
      select: { departmentId: true }
    });
    const deptIds = memberships.map(
      (m) => m.departmentId
    );
    if (!deptIds.includes(request.currentDepartmentId)) {
      throw new Error(
        "You can only release assignments for requests in your department."
      );
    }
  }
  const assignment = await prisma.requestAssignment.findFirst({
    where: { id: assignmentId, requestId }
  });
  if (!assignment) throw new Error("Assignment not found.");
  if (assignment.releasedAt) throw new Error("Assignment already released.");
  const updated = await prisma.$transaction(async (tx) => {
    const released = await tx.requestAssignment.update({
      where: { id: assignmentId },
      data: {
        releasedAt: /* @__PURE__ */ new Date(),
        note: payload.note ? `${assignment.note ? assignment.note + " | " : ""}${payload.note}` : assignment.note
      },
      include: assignmentInclude
    });
    const activeCount = await tx.requestAssignment.count({
      where: { requestId, releasedAt: null }
    });
    if (activeCount === 0) {
      await requestStatusService.changeStatus(
        requestId,
        userId,
        {
          toStatus: "UNDER_REVIEW",
          note: "Assignment released \u2014 returned to review queue"
        },
        tx
      );
    }
    await auditLogService.recordAuditLog({
      action: "ASSIGNMENT_RELEASED",
      entityType: "SERVICE_REQUEST",
      entityId: requestId,
      actorId: userId,
      oldValues: {
        assignmentId: assignment.id,
        assigneeId: assignment.assigneeId,
        releasedAt: null
      },
      newValues: {
        assignmentId: assignment.id,
        assigneeId: assignment.assigneeId,
        releasedAt: released.releasedAt
      },
      tx
    });
    return released;
  }, {
    maxWait: 1e4,
    timeout: 2e4
  });
  return updated;
};
var requestAssignmentService = {
  assignRequest,
  getAssignments,
  releaseAssignment
};

// src/app/module/request-assignment/request-assignment.controller.ts
var assignRequest2 = catchAsync(async (req, res) => {
  const result = await requestAssignmentService.assignRequest(
    String(req.params.id),
    req.user.id,
    req.user.role,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus12.CREATED,
    success: true,
    message: "Request assigned to staff successfully",
    data: result
  });
});
var getAssignments2 = catchAsync(async (req, res) => {
  const result = await requestAssignmentService.getAssignments(
    String(req.params.id),
    req.query
  );
  sendResponse(res, {
    statusCode: httpStatus12.OK,
    success: true,
    message: "Assignments fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var releaseAssignment2 = catchAsync(async (req, res) => {
  const result = await requestAssignmentService.releaseAssignment(
    String(req.params.id),
    String(req.params.assignmentId),
    req.user.id,
    req.user.role,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus12.OK,
    success: true,
    message: "Assignment released successfully",
    data: result
  });
});
var requestAssignmentController = {
  assignRequest: assignRequest2,
  getAssignments: getAssignments2,
  releaseAssignment: releaseAssignment2
};

// src/app/module/request-assignment/request-assignment.validation.ts
import { z as z5 } from "zod";
var assignRequestSchema = z5.object({
  params: z5.object({
    id: z5.string().uuid("Invalid request ID")
  }),
  body: z5.object({
    assigneeId: z5.string().uuid("Invalid assignee ID"),
    note: z5.string().max(500, "Note cannot exceed 500 characters").optional()
  })
});
var releaseAssignmentSchema = z5.object({
  params: z5.object({
    id: z5.string().uuid("Invalid request ID"),
    assignmentId: z5.string().uuid("Invalid assignment ID")
  }),
  body: z5.object({
    note: z5.string().max(500, "Note cannot exceed 500 characters").optional()
  })
});
var listAssignmentsSchema = z5.object({
  params: z5.object({
    id: z5.string().uuid("Invalid request ID")
  }),
  query: z5.object({
    page: z5.coerce.number().int().positive().default(1),
    limit: z5.coerce.number().int().positive().max(100).default(20),
    sortBy: z5.string().default("assignedAt"),
    sortOrder: z5.enum(["asc", "desc"]).default("desc")
  })
});
var requestAssignmentValidation = {
  assignRequestSchema,
  releaseAssignmentSchema,
  listAssignmentsSchema
};

// src/app/module/request-assignment/request-assignment.route.ts
var router7 = Router7({ mergeParams: true });
router7.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
  validateRequest(requestAssignmentValidation.assignRequestSchema),
  requestAssignmentController.assignRequest
);
router7.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
  validateRequest(requestAssignmentValidation.listAssignmentsSchema),
  requestAssignmentController.getAssignments
);
router7.patch(
  "/:assignmentId/release",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
  validateRequest(requestAssignmentValidation.releaseAssignmentSchema),
  requestAssignmentController.releaseAssignment
);
var requestAssignmentRoutes = router7;

// src/app/module/request-status/request-status.route.ts
import { Router as Router8 } from "express";

// src/app/module/request-status/request-status.controller.ts
import httpStatus13 from "http-status";
var changeStatus2 = catchAsync(async (req, res) => {
  const result = await requestStatusService.changeStatus(
    String(req.params.id),
    req.user.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus13.OK,
    success: true,
    message: `Request status changed to ${result.toStatus} successfully`,
    data: result
  });
});
var getStatusHistory2 = catchAsync(async (req, res) => {
  const result = await requestStatusService.getStatusHistory(
    String(req.params.id),
    req.user.id,
    req.user.role,
    req.query
  );
  sendResponse(res, {
    statusCode: httpStatus13.OK,
    success: true,
    message: "Status history fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var requestStatusController = {
  changeStatus: changeStatus2,
  getStatusHistory: getStatusHistory2
};

// src/app/module/request-status/request-status.validation.ts
import { z as z6 } from "zod";
var changeStatusSchema = z6.object({
  params: z6.object({
    id: z6.string().uuid("Invalid request ID")
  }),
  body: z6.object({
    toStatus: z6.nativeEnum(RequestStatus, {
      message: `toStatus must be one of: ${Object.values(RequestStatus).join(", ")}`
    }),
    note: z6.string().max(1e3, "Note cannot exceed 1000 characters").optional()
  })
});
var listStatusHistorySchema = z6.object({
  params: z6.object({
    id: z6.string().uuid("Invalid request ID")
  }),
  query: z6.object({
    page: z6.coerce.number().int().positive().default(1),
    limit: z6.coerce.number().int().positive().max(100).default(20)
  })
});
var requestStatusValidation = {
  changeStatusSchema,
  listStatusHistorySchema
};

// src/app/module/request-status/request-status.route.ts
var router8 = Router8({ mergeParams: true });
router8.patch(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
  validateRequest(requestStatusValidation.changeStatusSchema),
  requestStatusController.changeStatus
);
router8.get(
  "/history",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
  validateRequest(requestStatusValidation.listStatusHistorySchema),
  requestStatusController.getStatusHistory
);
var requestStatusRoutes = router8;

// src/app/module/work-update/work-update.route.ts
import { Router as Router9 } from "express";

// src/app/module/work-update/work-update.controller.ts
import httpStatus14 from "http-status";

// src/app/module/work-update/work-update.service.ts
var workUpdateInclude = {
  author: { select: { id: true, name: true, email: true } }
};
var createWorkUpdate = async (requestId, authorId, userRole, payload) => {
  const request = await prisma.serviceRequest.findFirst({ where: { id: requestId } });
  if (!request) throw new Error("Service request not found.");
  if (userRole === "STAFF") {
    const memberships = await prisma.departmentMember.findMany({
      where: { userId: authorId, isActive: true },
      select: { departmentId: true }
    });
    const deptIds = memberships.map((m) => m.departmentId);
    if (!deptIds.includes(request.currentDepartmentId)) {
      throw new Error("You can only add updates to requests in your department.");
    }
  }
  const update = await prisma.workUpdate.create({
    data: {
      requestId,
      authorId,
      note: payload.note,
      visibleToCitizen: payload.visibleToCitizen ?? false
    },
    include: workUpdateInclude
  });
  return update;
};
var getWorkUpdates = async (requestId, userId, userRole, filters) => {
  const request = await prisma.serviceRequest.findFirst({ where: { id: requestId } });
  if (!request) throw new Error("Service request not found.");
  const page = Math.max(Number(filters.page) || 1, 1);
  const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);
  const where = { requestId };
  if (userRole === "CITIZEN") {
    const citizen = await prisma.citizen.findUnique({ where: { userId } });
    if (!citizen || request.citizenId !== citizen.id) {
      throw new Error("You don't have permission to view updates for this request.");
    }
    where.visibleToCitizen = true;
  }
  if (userRole === "STAFF") {
    const memberships = await prisma.departmentMember.findMany({
      where: { userId, isActive: true },
      select: { departmentId: true }
    });
    const deptIds = memberships.map((m) => m.departmentId);
    if (!deptIds.includes(request.currentDepartmentId)) {
      throw new Error("You don't have permission to view updates for this request.");
    }
  }
  const [data, total] = await prisma.$transaction([
    prisma.workUpdate.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: workUpdateInclude
    }),
    prisma.workUpdate.count({ where })
  ]);
  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
};
var workUpdateService = {
  createWorkUpdate,
  getWorkUpdates
};

// src/app/module/work-update/work-update.controller.ts
var createWorkUpdate2 = catchAsync(async (req, res) => {
  const result = await workUpdateService.createWorkUpdate(
    String(req.params.id),
    req.user.id,
    req.user.role,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus14.CREATED,
    success: true,
    message: "Work update added successfully",
    data: result
  });
});
var getWorkUpdates2 = catchAsync(async (req, res) => {
  const result = await workUpdateService.getWorkUpdates(
    String(req.params.id),
    req.user.id,
    req.user.role,
    req.query
  );
  sendResponse(res, {
    statusCode: httpStatus14.OK,
    success: true,
    message: "Work updates fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var workUpdateController = {
  createWorkUpdate: createWorkUpdate2,
  getWorkUpdates: getWorkUpdates2
};

// src/app/module/work-update/work-update.validation.ts
import { z as z7 } from "zod";
var createWorkUpdateSchema = z7.object({
  params: z7.object({
    id: z7.string().uuid("Invalid request ID")
  }),
  body: z7.object({
    note: z7.string().min(1, "Note is required").max(2e3, "Note cannot exceed 2000 characters"),
    visibleToCitizen: z7.boolean().default(false)
  })
});
var listWorkUpdatesSchema = z7.object({
  params: z7.object({
    id: z7.string().uuid("Invalid request ID")
  }),
  query: z7.object({
    page: z7.coerce.number().int().positive().default(1),
    limit: z7.coerce.number().int().positive().max(100).default(20)
  })
});
var workUpdateValidation = {
  createWorkUpdateSchema,
  listWorkUpdatesSchema
};

// src/app/module/work-update/work-update.route.ts
var router9 = Router9({ mergeParams: true });
router9.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
  validateRequest(workUpdateValidation.createWorkUpdateSchema),
  workUpdateController.createWorkUpdate
);
router9.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
  validateRequest(workUpdateValidation.listWorkUpdatesSchema),
  workUpdateController.getWorkUpdates
);
var workUpdateRoutes = router9;

// src/app/module/media-attachment/media-attachment.route.ts
import { Router as Router10 } from "express";

// src/app/module/media-attachment/media-attachment.controller.ts
import httpStatus15 from "http-status";

// src/app/module/media-attachment/media-attachment.service.ts
var attachmentInclude = {
  uploadedBy: { select: { id: true, name: true, email: true } }
};
var uploadToCloudinary = (file, requestId) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder: `city-complaint/requests/${requestId}`, resource_type: "auto" },
    (error, result) => {
      if (error) reject(new Error(error.message));
      else if (!result) reject(new Error("Cloudinary upload failed."));
      else resolve(result);
    }
  );
  stream.end(file.buffer);
});
var uploadAttachment = async (requestId, uploadedById, userRole, file, purpose) => {
  const request = await prisma.serviceRequest.findFirst({ where: { id: requestId } });
  if (!request) throw new Error("Service request not found.");
  if (userRole === "CITIZEN") {
    const citizen = await prisma.citizen.findUnique({ where: { userId: uploadedById } });
    if (!citizen || request.citizenId !== citizen.id) {
      throw new Error("You can only upload attachments for your own requests.");
    }
  }
  if (userRole === "STAFF") {
    const memberships = await prisma.departmentMember.findMany({
      where: { userId: uploadedById, isActive: true },
      select: { departmentId: true }
    });
    const deptIds = memberships.map((m) => m.departmentId);
    if (!deptIds.includes(request.currentDepartmentId)) {
      throw new Error("You can only upload attachments for requests in your department.");
    }
  }
  const uploaded = await uploadToCloudinary(file, requestId);
  const attachment = await prisma.mediaAttachment.create({
    data: {
      requestId,
      uploadedById,
      purpose,
      publicId: uploaded.public_id,
      secureUrl: uploaded.secure_url,
      mimeType: file.mimetype,
      sizeBytes: file.size
    },
    include: attachmentInclude
  });
  return attachment;
};
var getAttachments = async (requestId, userId, userRole, filters) => {
  const request = await prisma.serviceRequest.findFirst({ where: { id: requestId } });
  if (!request) throw new Error("Service request not found.");
  if (userRole === "CITIZEN") {
    const citizen = await prisma.citizen.findUnique({ where: { userId } });
    if (!citizen || request.citizenId !== citizen.id) {
      throw new Error("You don't have permission to view attachments for this request.");
    }
  }
  if (userRole === "STAFF") {
    const memberships = await prisma.departmentMember.findMany({
      where: { userId, isActive: true },
      select: { departmentId: true }
    });
    const deptIds = memberships.map((m) => m.departmentId);
    if (!deptIds.includes(request.currentDepartmentId)) {
      throw new Error("You don't have permission to view attachments for this request.");
    }
  }
  const page = Math.max(Number(filters.page) || 1, 1);
  const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);
  const [data, total] = await prisma.$transaction([
    prisma.mediaAttachment.findMany({
      where: { requestId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: attachmentInclude
    }),
    prisma.mediaAttachment.count({ where: { requestId } })
  ]);
  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
};
var deleteAttachment = async (requestId, attachmentId, userId, userRole) => {
  const attachment = await prisma.mediaAttachment.findFirst({
    where: { id: attachmentId, requestId }
  });
  if (!attachment) throw new Error("Attachment not found.");
  if (userRole === "CITIZEN") {
    const citizen = await prisma.citizen.findUnique({ where: { userId } });
    if (!citizen || attachment.uploadedById !== userId) {
      throw new Error("You can only delete your own attachments.");
    }
  }
  await cloudinary.uploader.destroy(attachment.publicId, { resource_type: "auto" });
  await prisma.mediaAttachment.delete({ where: { id: attachmentId } });
};
var mediaAttachmentService = {
  uploadAttachment,
  getAttachments,
  deleteAttachment
};

// src/app/module/media-attachment/media-attachment.controller.ts
var uploadAttachment2 = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new Error("File is required. Send it as multipart/form-data with the key 'file'.");
  }
  const purpose = req.body.purpose ?? AttachmentPurpose.OTHER;
  const result = await mediaAttachmentService.uploadAttachment(
    String(req.params.id),
    req.user.id,
    req.user.role,
    req.file,
    purpose
  );
  sendResponse(res, {
    statusCode: httpStatus15.CREATED,
    success: true,
    message: "Attachment uploaded successfully",
    data: result
  });
});
var getAttachments2 = catchAsync(async (req, res) => {
  const result = await mediaAttachmentService.getAttachments(
    String(req.params.id),
    req.user.id,
    req.user.role,
    req.query
  );
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Attachments fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var deleteAttachment2 = catchAsync(async (req, res) => {
  await mediaAttachmentService.deleteAttachment(
    String(req.params.id),
    String(req.params.attachmentId),
    req.user.id,
    req.user.role
  );
  sendResponse(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Attachment deleted successfully",
    data: null
  });
});
var mediaAttachmentController = {
  uploadAttachment: uploadAttachment2,
  getAttachments: getAttachments2,
  deleteAttachment: deleteAttachment2
};

// src/app/module/media-attachment/media-attachment.validation.ts
import { z as z8 } from "zod";
var uploadAttachmentSchema = z8.object({
  params: z8.object({
    id: z8.string().uuid("Invalid request ID")
  }),
  body: z8.object({
    purpose: z8.nativeEnum(AttachmentPurpose).default(AttachmentPurpose.OTHER)
  })
});
var listAttachmentsSchema = z8.object({
  params: z8.object({
    id: z8.string().uuid("Invalid request ID")
  }),
  query: z8.object({
    page: z8.coerce.number().int().positive().default(1),
    limit: z8.coerce.number().int().positive().max(100).default(20)
  })
});
var deleteAttachmentSchema = z8.object({
  params: z8.object({
    id: z8.string().uuid("Invalid request ID"),
    attachmentId: z8.string().uuid("Invalid attachment ID")
  })
});
var mediaAttachmentValidation = {
  uploadAttachmentSchema,
  listAttachmentsSchema,
  deleteAttachmentSchema
};

// src/app/module/media-attachment/media-attachment.route.ts
var router10 = Router10({ mergeParams: true });
router10.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
  upload.single("file"),
  validateRequest(mediaAttachmentValidation.uploadAttachmentSchema),
  mediaAttachmentController.uploadAttachment
);
router10.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
  validateRequest(mediaAttachmentValidation.listAttachmentsSchema),
  mediaAttachmentController.getAttachments
);
router10.delete(
  "/:attachmentId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
  validateRequest(mediaAttachmentValidation.deleteAttachmentSchema),
  mediaAttachmentController.deleteAttachment
);
var mediaAttachmentRoutes = router10;

// src/app/module/feedback/feedback.route.ts
import { Router as Router11 } from "express";

// src/app/module/feedback/feedback.controller.ts
import httpStatus16 from "http-status";

// src/app/module/feedback/feedback.service.ts
var feedbackInclude = {
  citizen: { select: { id: true, name: true, email: true } },
  request: { select: { id: true, requestNo: true, title: true, status: true } }
};
var TERMINAL_STATUSES = [
  RequestStatus.RESOLVED,
  RequestStatus.CLOSED
];
var getFeedback = async (requestId, userId, userRole) => {
  const request = await prisma.serviceRequest.findFirst({
    where: { id: requestId }
  });
  if (!request) throw new Error("Service request not found.");
  if (userRole === "CITIZEN") {
    const citizen = await prisma.citizen.findUnique({ where: { userId } });
    if (!citizen || request.citizenId !== citizen.id) {
      throw new Error(
        "You don't have permission to view feedback for this request."
      );
    }
  }
  if (userRole === "STAFF") {
    const memberships = await prisma.departmentMember.findMany({
      where: { userId, isActive: true },
      select: { departmentId: true }
    });
    const deptIds = memberships.map(
      (m) => m.departmentId
    );
    if (!deptIds.includes(request.currentDepartmentId)) {
      throw new Error(
        "You don't have permission to view feedback for this request."
      );
    }
  }
  const feedback = await prisma.feedback.findUnique({
    where: { requestId },
    include: feedbackInclude
  });
  return feedback;
};
var createFeedback = async (requestId, userId, payload) => {
  const citizen = await prisma.citizen.findUnique({ where: { userId } });
  if (!citizen)
    throw new Error(
      "Citizen profile not found. Please complete your profile first."
    );
  const request = await prisma.serviceRequest.findFirst({
    where: { id: requestId }
  });
  if (!request) throw new Error("Service request not found.");
  if (request.citizenId !== citizen.id) {
    throw new Error("You can only give feedback on your own requests.");
  }
  if (!TERMINAL_STATUSES.includes(request.status)) {
    throw new Error(
      `Feedback can only be given when the request is RESOLVED or CLOSED. Current status: ${request.status}.`
    );
  }
  const existing = await prisma.feedback.findUnique({ where: { requestId } });
  if (existing) throw new Error("Feedback already exists for this request.");
  const feedback = await prisma.feedback.create({
    data: {
      requestId,
      citizenId: citizen.id,
      rating: payload.rating,
      comment: payload.comment ?? null
    },
    include: feedbackInclude
  });
  return feedback;
};
var feedbackService = {
  createFeedback,
  getFeedback
};

// src/app/module/feedback/feedback.controller.ts
var createFeedback2 = catchAsync(async (req, res) => {
  const result = await feedbackService.createFeedback(
    String(req.params.id),
    req.user.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus16.CREATED,
    success: true,
    message: "Feedback submitted successfully",
    data: result
  });
});
var getFeedback2 = catchAsync(async (req, res) => {
  const result = await feedbackService.getFeedback(
    String(req.params.id),
    req.user.id,
    req.user.role
  );
  sendResponse(res, {
    statusCode: httpStatus16.OK,
    success: true,
    message: "Feedback fetched successfully",
    data: result
  });
});
var feedbackController = {
  createFeedback: createFeedback2,
  getFeedback: getFeedback2
};

// src/app/module/feedback/feedback.validation.ts
import { z as z9 } from "zod";
var createFeedbackSchema = z9.object({
  params: z9.object({
    id: z9.string().uuid("Invalid request ID")
  }),
  body: z9.object({
    rating: z9.number({ message: "Rating must be a number" }).int("Rating must be a whole number").min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
    comment: z9.string().max(1e3, "Comment cannot exceed 1000 characters").optional()
  })
});
var getFeedbackSchema = z9.object({
  params: z9.object({
    id: z9.string().uuid("Invalid request ID")
  })
});
var feedbackValidation = {
  createFeedbackSchema,
  getFeedbackSchema
};

// src/app/module/feedback/feedback.route.ts
var router11 = Router11({ mergeParams: true });
router11.post(
  "/",
  auth(UserRole.CITIZEN),
  validateRequest(feedbackValidation.createFeedbackSchema),
  feedbackController.createFeedback
);
router11.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
  validateRequest(feedbackValidation.getFeedbackSchema),
  feedbackController.getFeedback
);
var feedbackRoutes = router11;

// src/app/module/service-request/service-request.route.ts
var router12 = Router12();
router12.post(
  "/",
  auth(UserRole.CITIZEN),
  validateRequest(serviceRequestValidation.createServiceRequestSchema),
  serviceRequestController.createServiceRequest
);
router12.get(
  "/my",
  auth(UserRole.CITIZEN),
  serviceRequestController.getMyServiceRequests
);
router12.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
  serviceRequestController.getAllServiceRequests
);
router12.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
  validateRequest(serviceRequestValidation.getServiceRequestByIdSchema),
  serviceRequestController.getServiceRequestById
);
router12.get(
  "/:id/timeline",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
  validateRequest(serviceRequestValidation.getServiceRequestByIdSchema),
  serviceRequestController.getRequestTimeline
);
router12.use("/:id/routes", requestRoutingRoutes);
router12.use("/:id/assignments", requestAssignmentRoutes);
router12.use("/:id/status", requestStatusRoutes);
router12.use("/:id/updates", workUpdateRoutes);
router12.use("/:id/attachments", mediaAttachmentRoutes);
router12.use("/:id/feedback", feedbackRoutes);
var serviceRequestRoutes = router12;

// src/app/module/notification/notification.route.ts
import { Router as Router13 } from "express";

// src/app/module/notification/notification.controller.ts
import httpStatus17 from "http-status";
var getMyNotifications2 = catchAsync(async (req, res) => {
  const filters = {
    unreadOnly: req.query.unreadOnly === "true",
    page: req.query.page ? Number(req.query.page) : void 0,
    limit: req.query.limit ? Number(req.query.limit) : void 0
  };
  const result = await notificationService.getMyNotifications(
    req.user.id,
    filters
  );
  sendResponse(res, {
    statusCode: httpStatus17.OK,
    success: true,
    message: "Notifications fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var markAsRead2 = catchAsync(async (req, res) => {
  const result = await notificationService.markAsRead(
    String(req.params.id),
    req.user.id
  );
  sendResponse(res, {
    statusCode: httpStatus17.OK,
    success: true,
    message: "Notification marked as read",
    data: result
  });
});
var markAllAsRead2 = catchAsync(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.id);
  sendResponse(res, {
    statusCode: httpStatus17.OK,
    success: true,
    message: "All notifications marked as read",
    data: result
  });
});
var notificationController = {
  getMyNotifications: getMyNotifications2,
  markAsRead: markAsRead2,
  markAllAsRead: markAllAsRead2
};

// src/app/module/notification/notification.validation.ts
import { z as z10 } from "zod";
var getNotificationsSchema = z10.object({
  query: z10.object({
    unreadOnly: z10.enum(["true", "false"]).optional().transform((value) => value === "true"),
    page: z10.coerce.number().int().positive().default(1),
    limit: z10.coerce.number().int().positive().max(100).default(20)
  })
});
var markNotificationReadSchema = z10.object({
  params: z10.object({
    id: z10.string().uuid("Invalid notification ID")
  })
});
var notificationValidation = {
  getNotificationsSchema,
  markNotificationReadSchema
};

// src/app/module/notification/notification.route.ts
var router13 = Router13();
router13.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
  validateRequest(notificationValidation.getNotificationsSchema),
  notificationController.getMyNotifications
);
router13.patch(
  "/read-all",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
  notificationController.markAllAsRead
);
router13.patch(
  "/:id/read",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CITIZEN),
  validateRequest(notificationValidation.markNotificationReadSchema),
  notificationController.markAsRead
);
var notificationRoutes = router13;

// src/app.ts
import cors from "cors";

// src/app/middlewares/globalErrorHandlers.ts
import httpStatus18 from "http-status";
var toErrorsArray = (err, fallbackMessage) => {
  if (Array.isArray(err.issues) && err.issues.length > 0) {
    return err.issues.map((issue) => ({
      path: issue.path?.length ? issue.path.map(String).join(".") : void 0,
      message: issue.message ?? fallbackMessage
    }));
  }
  return [{ message: fallbackMessage }];
};
var globalErrorHandler = async (err, _req, res, _next) => {
  if (config_default.node_env === "development") {
    console.log("Error from Global Error Handler", err);
  }
  let statusCode = httpStatus18.INTERNAL_SERVER_ERROR;
  let errorMessage = err.message || "Internal Server Error";
  const errorName = err.name || "Internal Server Error";
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = httpStatus18.BAD_REQUEST;
    errorMessage = "You have provided incorrect field type or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus18.BAD_REQUEST;
      errorMessage = "Duplicate Key Error";
    } else if (err.code === "P2003") {
      statusCode = httpStatus18.BAD_REQUEST;
      errorMessage = "Foreign key constraint failed";
    } else if (err.code === "P2025") {
      statusCode = httpStatus18.BAD_REQUEST;
      errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpStatus18.UNAUTHORIZED;
      errorMessage = "Authentication failed against database server. Please Check Your Credentials";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus18.BAD_REQUEST;
      errorMessage = "Can't reach database server";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = httpStatus18.INTERNAL_SERVER_ERROR;
    errorMessage = "Error occurred during query execution";
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
  } else if (err instanceof Error) {
    errorMessage = err.message;
  }
  const isDev = config_default.node_env === "development";
  const safeMessage = isDev || statusCode < 500 ? errorMessage : "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: safeMessage,
    errors: isDev ? toErrorsArray(err, safeMessage) : [],
    ...isDev && { name: errorName, error: err, stack: err.stack }
  });
};

// src/app/middlewares/notFound.ts
import httpStatus19 from "http-status";
var notFound = (req, res) => {
  res.status(httpStatus19.NOT_FOUND).json({
    success: false,
    statusCode: httpStatus19.NOT_FOUND,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    errors: []
  });
};

// src/app.ts
import httpStatus24 from "http-status";
import cookieParser from "cookie-parser";
import helmet from "helmet";

// src/app/module/audit-log/audit-log.route.ts
import { Router as Router14 } from "express";

// src/app/module/audit-log/audit-log.controller.ts
import httpStatus20 from "http-status";
var getAuditLogs2 = catchAsync(async (req, res) => {
  const filters = {
    action: req.query.action,
    entityType: req.query.entityType,
    entityId: req.query.entityId,
    actorId: req.query.actorId,
    page: req.query.page ? Number(req.query.page) : void 0,
    limit: req.query.limit ? Number(req.query.limit) : void 0,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder
  };
  const result = await auditLogService.getAuditLogs(filters);
  sendResponse(res, {
    statusCode: httpStatus20.OK,
    success: true,
    message: "Audit logs fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getAuditLogActions2 = catchAsync(async (_req, res) => {
  const actions = await auditLogService.getAuditLogActions();
  sendResponse(res, {
    statusCode: httpStatus20.OK,
    success: true,
    message: "Audit log actions fetched successfully",
    data: actions
  });
});
var auditLogController = {
  getAuditLogs: getAuditLogs2,
  getAuditLogActions: getAuditLogActions2
};

// src/app/module/audit-log/audit-log.validation.ts
import { z as z11 } from "zod";
var getAuditLogsSchema = z11.object({
  query: z11.object({
    action: z11.string().optional(),
    entityType: z11.string().optional(),
    entityId: z11.uuid().optional(),
    actorId: z11.uuid().optional(),
    page: z11.coerce.number().int().min(1).optional(),
    limit: z11.coerce.number().int().min(1).max(100).optional(),
    sortBy: z11.enum(["createdAt", "action", "entityType"]).optional(),
    sortOrder: z11.enum(["asc", "desc"]).optional()
  })
});
var auditLogValidation = {
  getAuditLogsSchema
};

// src/app/module/audit-log/audit-log.route.ts
var router14 = Router14();
router14.get(
  "/actions",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  auditLogController.getAuditLogActions
);
router14.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(auditLogValidation.getAuditLogsSchema),
  auditLogController.getAuditLogs
);
var auditLogRoutes = router14;

// src/app/module/payment/payment.route.ts
import { Router as Router15 } from "express";

// src/app/module/payment/payment.controller.ts
import httpStatus23 from "http-status";

// src/app/module/payment/payment.service.ts
import httpStatus22 from "http-status";

// src/app/lib/bkash.ts
import httpStatus21 from "http-status";
var getBkashIdToken = async () => {
  try {
    const IdTokenKey = "bkash:idToken";
    const RefreshTokenKey = "bkash:refreshToken";
    let bkashIdToken = await redisClient.get(IdTokenKey);
    const bkashIdTokenTTL = await redisClient.ttl(IdTokenKey);
    const bkashRefreshToken = await redisClient.get(RefreshTokenKey);
    const bkashRefreshTokenTTL = await redisClient.ttl(RefreshTokenKey);
    if ((bkashIdTokenTTL <= 600 || !bkashIdToken) && bkashRefreshToken && bkashRefreshTokenTTL > 600) {
      const refreshTokenResponse = await fetch(
        `${config_default.bkash_base_url}/tokenized/checkout/token/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            username: config_default.bkash_username,
            password: config_default.bkash_password
          },
          body: JSON.stringify({
            app_key: config_default.bkash_app_key,
            app_secret: config_default.bkash_app_secret,
            refresh_token: bkashRefreshToken
          })
        }
      );
      if (!refreshTokenResponse.ok) {
        throw new AppError(
          httpStatus21.BAD_GATEWAY,
          "Bkash Access Token Grant Failed"
        );
      }
      const bkashRefreshTokenResult = await refreshTokenResponse.json();
      bkashIdToken = bkashRefreshTokenResult.id_token;
      await redisClient.set(IdTokenKey, bkashIdToken, {
        expiration: {
          type: "EX",
          value: 60 * 60
          // 1 hour
        }
      });
      return bkashIdToken;
    }
    if (bkashIdToken && bkashIdTokenTTL > 600) {
      return bkashIdToken;
    }
    const response = await fetch(
      `${config_default.bkash_base_url}/tokenized/checkout/token/grant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: config_default.bkash_username,
          password: config_default.bkash_password
        },
        body: JSON.stringify({
          app_key: config_default.bkash_app_key,
          app_secret: config_default.bkash_app_secret
        })
      }
    );
    if (!response.ok) {
      throw new AppError(
        httpStatus21.BAD_GATEWAY,
        "Bkash Access Token Grant Failed"
      );
    }
    const result = await response.json();
    await redisClient.set(IdTokenKey, result.id_token, {
      expiration: {
        type: "EX",
        value: 60 * 60
      }
    });
    await redisClient.set(RefreshTokenKey, result.refresh_token, {
      expiration: {
        type: "EX",
        value: 60 * 60 * 24 * 28
      }
    });
    bkashIdToken = result.id_token;
    return bkashIdToken;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      httpStatus21.BAD_GATEWAY,
      error.message || "Bkash service error"
    );
  }
};

// src/app/module/payment/payment.service.ts
var parseBkashDate = (timeStr) => {
  if (!timeStr) return /* @__PURE__ */ new Date();
  const direct = new Date(timeStr);
  if (!isNaN(direct.getTime())) return direct;
  const normalized = timeStr.replace(/(\d{2}:\d{2}:\d{2}):(\d{3})/, "$1.$2").replace(" GMT", "");
  const parsed = new Date(normalized);
  if (!isNaN(parsed.getTime())) return parsed;
  return /* @__PURE__ */ new Date();
};
var issuePayment = async (payload, issuedByUser) => {
  const { requestId, purpose, amount, currency = "BDT", expiresAt } = payload;
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { citizen: true }
  });
  if (!request) {
    throw new AppError(httpStatus22.NOT_FOUND, "Service request not found");
  }
  const payment = await prisma.payment.create({
    data: {
      requestId,
      issuedById: issuedByUser.id,
      purpose,
      amount,
      currency,
      status: PaymentStatus.PENDING,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    },
    include: {
      request: {
        select: { id: true, requestNo: true, title: true, status: true }
      }
    }
  });
  await notificationService.notifyPaymentRequired(
    request,
    request.citizen.userId,
    amount,
    currency
  );
  await auditLogService.recordAuditLog({
    action: "PAYMENT_ISSUED",
    entityType: "PAYMENT",
    entityId: payment.id,
    actorId: issuedByUser.id,
    newValues: {
      requestId: payment.requestId,
      purpose: payment.purpose,
      amount: payment.amount,
      currency: payment.currency
    }
  });
  return payment;
};
var initiateCheckout = async (paymentId, user) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      request: {
        include: {
          citizen: true
        }
      }
    }
  });
  if (!payment) {
    throw new AppError(httpStatus22.NOT_FOUND, "Payment invoice not found");
  }
  if (payment.status === PaymentStatus.PAID) {
    throw new AppError(
      httpStatus22.BAD_REQUEST,
      "Payment has already been completed"
    );
  }
  if (payment.status !== PaymentStatus.PENDING) {
    throw new AppError(
      httpStatus22.BAD_REQUEST,
      `Payment cannot be initiated for invoice in ${payment.status} status`
    );
  }
  if (payment.expiresAt && /* @__PURE__ */ new Date() > payment.expiresAt) {
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.EXPIRED }
    });
    throw new AppError(
      httpStatus22.BAD_REQUEST,
      "Payment invoice has expired. Please contact support."
    );
  }
  if (user.role === UserRole.CITIZEN && payment.request.citizen.userId !== user.id) {
    throw new AppError(
      httpStatus22.FORBIDDEN,
      "You are not authorized to pay this invoice"
    );
  }
  const bkashIdToken = await getBkashIdToken();
  if (!bkashIdToken) {
    throw new AppError(httpStatus22.BAD_GATEWAY, "No bKash access token found");
  }
  const callbackURL = `${config_default.bkash_callback_url}/payments/callback`;
  const createPaymentResponse = await fetch(
    `${config_default.bkash_base_url}/tokenized/checkout/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: bkashIdToken,
        "X-App-Key": config_default.bkash_app_key
      },
      body: JSON.stringify({
        mode: "0011",
        payerReference: user.email,
        callbackURL,
        amount: Number(payment.amount).toFixed(2),
        currency: payment.currency,
        intent: "sale",
        merchantInvoiceNumber: payment.id
      })
    }
  );
  if (!createPaymentResponse.ok) {
    throw new AppError(
      httpStatus22.BAD_GATEWAY,
      "Failed to connect to bKash payment gateway"
    );
  }
  const result = await createPaymentResponse.json();
  if (result.statusCode !== "0000") {
    throw new AppError(
      httpStatus22.BAD_GATEWAY,
      result.statusMessage || "bKash checkout creation failed"
    );
  }
  const idempotencyKey = `${payment.id}_${Date.now()}`;
  const transaction = await prisma.$transaction(async (tx) => {
    const createdTx = await tx.paymentTransaction.create({
      data: {
        paymentId: payment.id,
        gateway: PaymentGateway.BKASH,
        method: PaymentMethod.BKASH,
        amount: payment.amount,
        currency: payment.currency,
        idempotencyKey,
        gatewaySessionId: result.paymentID,
        checkoutUrl: result.bkashURL,
        status: PaymentTransactionStatus.INITIATED,
        gatewayMetadata: result
      }
    });
    await tx.paymentEvent.create({
      data: {
        transactionId: createdTx.id,
        gateway: PaymentGateway.BKASH,
        gatewayEventId: result.paymentID,
        payload: result,
        signatureVerified: false
      }
    });
    return createdTx;
  }, {
    maxWait: 1e4,
    timeout: 2e4
  });
  return {
    paymentId: payment.id,
    transactionId: transaction.id,
    gatewaySessionId: result.paymentID,
    checkoutUrl: result.bkashURL,
    amount: payment.amount,
    currency: payment.currency
  };
};
var handleCallback = async (query) => {
  const { paymentID, status } = query;
  if (!paymentID || !status) {
    throw new AppError(
      httpStatus22.BAD_REQUEST,
      "bKash callback missing paymentID or status"
    );
  }
  const transaction = await prisma.paymentTransaction.findUnique({
    where: { gatewaySessionId: paymentID },
    include: {
      payment: {
        include: {
          request: {
            include: {
              citizen: true
            }
          }
        }
      }
    }
  });
  if (!transaction) {
    throw new AppError(
      httpStatus22.NOT_FOUND,
      "Payment transaction not found for this bKash session"
    );
  }
  if (transaction.status === PaymentTransactionStatus.SUCCESS) {
    return {
      status: "success",
      message: "Payment already completed successfully",
      paymentId: transaction.paymentId,
      trxId: transaction.gatewayTransactionId || "",
      amount: transaction.amount,
      currency: transaction.currency,
      paidAt: transaction.verifiedAt || /* @__PURE__ */ new Date(),
      redirectUrl: `${config_default.frontend_url}/dashboard/payments?status=success&trxId=${transaction.gatewayTransactionId}`
    };
  }
  if (status === "cancel") {
    await prisma.$transaction(async (tx) => {
      await tx.paymentTransaction.update({
        where: { id: transaction.id },
        data: { status: PaymentTransactionStatus.CANCELLED }
      });
      await tx.paymentEvent.create({
        data: {
          transactionId: transaction.id,
          gateway: PaymentGateway.BKASH,
          gatewayEventId: paymentID,
          payload: { status: "cancel", paymentID }
        }
      });
    });
    return {
      status: "cancelled",
      message: "Payment was cancelled by the user",
      paymentId: transaction.paymentId,
      redirectUrl: `${config_default.frontend_url}/dashboard/payments?status=cancel`
    };
  }
  if (status === "failure") {
    await prisma.$transaction(async (tx) => {
      await tx.paymentTransaction.update({
        where: { id: transaction.id },
        data: { status: PaymentTransactionStatus.FAILED }
      });
      await tx.paymentEvent.create({
        data: {
          transactionId: transaction.id,
          gateway: PaymentGateway.BKASH,
          gatewayEventId: paymentID,
          payload: { status: "failure", paymentID }
        }
      });
    });
    return {
      status: "failed",
      message: "Payment processing failed on bKash",
      paymentId: transaction.paymentId,
      redirectUrl: `${config_default.frontend_url}/dashboard/payments?status=failure`
    };
  }
  const bkashIdToken = await getBkashIdToken();
  if (!bkashIdToken) {
    throw new AppError(httpStatus22.BAD_GATEWAY, "No bKash access token found");
  }
  const executeResponse = await fetch(
    `${config_default.bkash_base_url}/tokenized/checkout/execute`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: bkashIdToken,
        "X-App-Key": config_default.bkash_app_key
      },
      body: JSON.stringify({ paymentID })
    }
  );
  if (!executeResponse.ok) {
    throw new AppError(
      httpStatus22.BAD_GATEWAY,
      "Failed to execute payment with bKash"
    );
  }
  let result = await executeResponse.json();
  if (result.statusCode === "2062" || result.statusMessage?.toLowerCase().includes("already been completed")) {
    const queryResponse = await fetch(
      `${config_default.bkash_base_url}/tokenized/checkout/payment/status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: bkashIdToken,
          "X-App-Key": config_default.bkash_app_key
        },
        body: JSON.stringify({ paymentID })
      }
    );
    if (queryResponse.ok) {
      const queryData = await queryResponse.json();
      if (queryData.transactionStatus === "Completed" && queryData.statusCode === "0000") {
        result = queryData;
      }
    }
  }
  if (result.statusCode !== "0000" || result.transactionStatus !== "Completed") {
    await prisma.$transaction(async (tx) => {
      await tx.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: PaymentTransactionStatus.FAILED,
          gatewayMetadata: result
        }
      });
      await tx.paymentEvent.create({
        data: {
          transactionId: transaction.id,
          gateway: PaymentGateway.BKASH,
          gatewayEventId: paymentID,
          payload: result
        }
      });
    }, { maxWait: 1e4, timeout: 2e4 });
    throw new AppError(
      httpStatus22.BAD_REQUEST,
      result.statusMessage || "bKash payment execution was not completed"
    );
  }
  const executedAt = parseBkashDate(result.paymentExecuteTime);
  await prisma.$transaction(async (tx) => {
    await tx.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: PaymentTransactionStatus.SUCCESS,
        gatewayTransactionId: result.trxID,
        verifiedAt: executedAt,
        gatewayMetadata: result
      }
    });
    await tx.payment.update({
      where: { id: transaction.paymentId },
      data: {
        status: PaymentStatus.PAID,
        paidAt: executedAt
      }
    });
    await tx.paymentEvent.create({
      data: {
        transactionId: transaction.id,
        gateway: PaymentGateway.BKASH,
        gatewayEventId: result.trxID || paymentID,
        payload: result,
        signatureVerified: true,
        processedAt: /* @__PURE__ */ new Date()
      }
    });
  }, { maxWait: 1e4, timeout: 2e4 });
  await notificationService.notifyPaymentSuccessful(
    transaction.payment.request,
    transaction.payment.request.citizen.userId,
    Number(transaction.amount).toFixed(2),
    transaction.currency
  );
  await auditLogService.recordAuditLog({
    action: "PAYMENT_COMPLETED",
    entityType: "PAYMENT",
    entityId: transaction.paymentId,
    actorId: transaction.payment.request.citizen.userId,
    newValues: {
      trxID: result.trxID,
      amount: result.amount,
      currency: result.currency,
      paymentID: result.paymentID
    }
  });
  return {
    status: "success",
    message: "Payment completed successfully",
    paymentId: transaction.paymentId,
    trxId: result.trxID,
    amount: result.amount,
    currency: result.currency,
    paidAt: executedAt,
    redirectUrl: `${config_default.frontend_url}/dashboard/payments?status=success&trxId=${result.trxID}`
  };
};
var getPaymentById = async (paymentId, user) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      request: {
        select: {
          id: true,
          requestNo: true,
          title: true,
          status: true,
          citizen: {
            select: {
              id: true,
              userId: true,
              contactNumber: true
            }
          }
        }
      },
      issuedBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      transactions: {
        orderBy: { createdAt: "desc" },
        include: {
          events: {
            orderBy: { createdAt: "desc" }
          }
        }
      }
    }
  });
  if (!payment) {
    throw new AppError(httpStatus22.NOT_FOUND, "Payment invoice not found");
  }
  if (user.role === UserRole.CITIZEN && payment.request.citizen.userId !== user.id) {
    throw new AppError(
      httpStatus22.FORBIDDEN,
      "You are not allowed to view this payment"
    );
  }
  return payment;
};
var getMyPayments = async (user, query) => {
  const citizen = await prisma.citizen.findUnique({
    where: { userId: user.id }
  });
  if (!citizen) {
    throw new AppError(httpStatus22.NOT_FOUND, "Citizen profile not found");
  }
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";
  const where = {
    request: {
      citizenId: citizen.id
    }
  };
  if (query.status) where.status = query.status;
  if (query.requestId) where.requestId = query.requestId;
  if (query.purpose) where.purpose = query.purpose;
  const [data, total] = await prisma.$transaction([
    prisma.payment.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
      include: {
        request: {
          select: { id: true, requestNo: true, title: true, status: true }
        },
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    }),
    prisma.payment.count({ where })
  ]);
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getAllPayments = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";
  const where = {};
  if (query.status) where.status = query.status;
  if (query.requestId) where.requestId = query.requestId;
  if (query.purpose) where.purpose = query.purpose;
  const [data, total] = await prisma.$transaction([
    prisma.payment.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
      include: {
        request: {
          select: {
            id: true,
            requestNo: true,
            title: true,
            status: true,
            citizen: {
              select: {
                id: true,
                userId: true,
                user: { select: { name: true, email: true } }
              }
            }
          }
        },
        issuedBy: {
          select: { id: true, name: true, email: true }
        },
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    }),
    prisma.payment.count({ where })
  ]);
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var refundPayment = async (paymentId, payload, actor) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      transactions: {
        where: { status: PaymentTransactionStatus.SUCCESS },
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });
  if (!payment) {
    throw new AppError(httpStatus22.NOT_FOUND, "Payment not found");
  }
  if (payment.status !== PaymentStatus.PAID) {
    throw new AppError(
      httpStatus22.BAD_REQUEST,
      "Only successfully paid invoices can be refunded"
    );
  }
  const successfulTx = payment.transactions[0];
  if (!successfulTx || !successfulTx.gatewayTransactionId) {
    throw new AppError(
      httpStatus22.BAD_REQUEST,
      "No valid gateway transaction found to refund"
    );
  }
  const bkashIdToken = await getBkashIdToken();
  const refundAmount = payload.amount || Number(payment.amount);
  const bkashRefundResponse = await fetch(
    `${config_default.bkash_base_url}/tokenized/checkout/payment/refund`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: bkashIdToken,
        "X-App-Key": config_default.bkash_app_key
      },
      body: JSON.stringify({
        paymentID: successfulTx.gatewaySessionId,
        trxID: successfulTx.gatewayTransactionId,
        amount: refundAmount.toFixed(2),
        sku: payload.sku || "Complaint Service Fee Refund",
        reason: payload.reason
      })
    }
  );
  if (!bkashRefundResponse.ok) {
    throw new AppError(
      httpStatus22.BAD_GATEWAY,
      "bKash refund endpoint request failed"
    );
  }
  const refundResult = await bkashRefundResponse.json();
  if (refundResult.statusCode !== "0000") {
    throw new AppError(
      httpStatus22.BAD_REQUEST,
      refundResult.statusMessage || "bKash refund failed"
    );
  }
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.REFUNDED }
    });
    await tx.paymentEvent.create({
      data: {
        transactionId: successfulTx.id,
        gateway: PaymentGateway.BKASH,
        gatewayEventId: refundResult.refundTrxID || successfulTx.gatewaySessionId || "",
        payload: refundResult,
        signatureVerified: true,
        processedAt: /* @__PURE__ */ new Date()
      }
    });
  });
  await auditLogService.recordAuditLog({
    action: "PAYMENT_REFUNDED",
    entityType: "PAYMENT",
    entityId: paymentId,
    actorId: actor.id,
    newValues: {
      refundTrxId: refundResult.refundTrxID,
      amount: refundResult.amount,
      reason: payload.reason
    }
  });
  return {
    success: true,
    message: "Payment refunded successfully",
    refundTrxId: refundResult.refundTrxID,
    amount: refundResult.amount
  };
};
var paymentService = {
  issuePayment,
  initiateCheckout,
  handleCallback,
  getPaymentById,
  getMyPayments,
  getAllPayments,
  refundPayment
};

// src/app/module/payment/payment.controller.ts
var issuePayment2 = catchAsync(async (req, res) => {
  const result = await paymentService.issuePayment(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus23.CREATED,
    success: true,
    message: "Payment invoice issued successfully",
    data: result
  });
});
var initiateCheckout2 = catchAsync(async (req, res) => {
  const result = await paymentService.initiateCheckout(
    String(req.params.id),
    req.user
  );
  sendResponse(res, {
    statusCode: httpStatus23.OK,
    success: true,
    message: "bKash checkout session initiated successfully",
    data: result
  });
});
var handleCallback2 = catchAsync(async (req, res) => {
  const result = await paymentService.handleCallback(req.query);
  if (req.headers.accept?.includes("application/json") || !result.redirectUrl) {
    sendResponse(res, {
      statusCode: httpStatus23.OK,
      success: result.status === "success",
      message: result.message,
      data: result
    });
  } else {
    res.redirect(result.redirectUrl);
  }
});
var getPaymentById2 = catchAsync(async (req, res) => {
  const result = await paymentService.getPaymentById(
    String(req.params.id),
    req.user
  );
  sendResponse(res, {
    statusCode: httpStatus23.OK,
    success: true,
    message: "Payment details fetched successfully",
    data: result
  });
});
var getMyPayments2 = catchAsync(async (req, res) => {
  const result = await paymentService.getMyPayments(req.user, req.query);
  sendResponse(res, {
    statusCode: httpStatus23.OK,
    success: true,
    message: "Citizen payments fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getAllPayments2 = catchAsync(async (req, res) => {
  const result = await paymentService.getAllPayments(req.query);
  sendResponse(res, {
    statusCode: httpStatus23.OK,
    success: true,
    message: "All payments fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var refundPayment2 = catchAsync(async (req, res) => {
  const result = await paymentService.refundPayment(
    String(req.params.id),
    req.body,
    req.user
  );
  sendResponse(res, {
    statusCode: httpStatus23.OK,
    success: true,
    message: "Payment refunded successfully via bKash",
    data: result
  });
});
var paymentController = {
  issuePayment: issuePayment2,
  initiateCheckout: initiateCheckout2,
  handleCallback: handleCallback2,
  getPaymentById: getPaymentById2,
  getMyPayments: getMyPayments2,
  getAllPayments: getAllPayments2,
  refundPayment: refundPayment2
};

// src/app/module/payment/payment.validation.ts
import { z as z12 } from "zod";
var issuePaymentSchema = z12.object({
  body: z12.object({
    requestId: z12.string().uuid("Invalid Service Request ID"),
    purpose: z12.nativeEnum(PaymentPurpose, {
      message: `Purpose must be one of: ${Object.values(PaymentPurpose).join(", ")}`
    }),
    amount: z12.number({ message: "Amount must be a number" }).positive("Amount must be greater than zero"),
    currency: z12.string().default("BDT").optional(),
    expiresAt: z12.string().datetime("Invalid expiration datetime").optional()
  })
});
var initiateCheckoutSchema = z12.object({
  params: z12.object({
    id: z12.string().uuid("Invalid Payment ID")
  })
});
var callbackQuerySchema = z12.object({
  query: z12.object({
    paymentID: z12.string({ message: "bKash paymentID is required" }),
    status: z12.enum(["success", "cancel", "failure"], {
      message: "Status must be success, cancel, or failure"
    })
  })
});
var queryPaymentSchema = z12.object({
  query: z12.object({
    page: z12.string().optional(),
    limit: z12.string().optional(),
    sortBy: z12.string().optional(),
    sortOrder: z12.enum(["asc", "desc"]).optional(),
    status: z12.nativeEnum(PaymentStatus).optional(),
    requestId: z12.string().uuid().optional(),
    purpose: z12.nativeEnum(PaymentPurpose).optional()
  }).optional()
});
var refundPaymentSchema = z12.object({
  params: z12.object({
    id: z12.string().uuid("Invalid Payment ID")
  }),
  body: z12.object({
    amount: z12.number().positive().optional(),
    reason: z12.string().min(3, "Reason must be at least 3 characters"),
    sku: z12.string().optional()
  })
});
var paymentValidation = {
  issuePaymentSchema,
  initiateCheckoutSchema,
  callbackQuerySchema,
  queryPaymentSchema,
  refundPaymentSchema
};

// src/app/module/payment/payment.route.ts
var router15 = Router15();
router15.get(
  "/callback",
  validateRequest(paymentValidation.callbackQuerySchema),
  paymentController.handleCallback
);
router15.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
  validateRequest(paymentValidation.issuePaymentSchema),
  paymentController.issuePayment
);
router15.get(
  "/my-payments",
  auth(UserRole.CITIZEN),
  validateRequest(paymentValidation.queryPaymentSchema),
  paymentController.getMyPayments
);
router15.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
  validateRequest(paymentValidation.queryPaymentSchema),
  paymentController.getAllPayments
);
router15.post(
  "/:id/checkout",
  auth(UserRole.CITIZEN, UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
  validateRequest(paymentValidation.initiateCheckoutSchema),
  paymentController.initiateCheckout
);
router15.post(
  "/:id/refund",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(paymentValidation.refundPaymentSchema),
  paymentController.refundPayment
);
router15.get(
  "/:id",
  auth(UserRole.CITIZEN, UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF),
  paymentController.getPaymentById
);
var paymentRoutes = router15;

// src/app.ts
var app = express();
app.use(helmet());
app.use(
  cors({
    origin: config_default.frontend_url,
    credentials: true
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/departments/", departmentRoutes);
app.use("/api/v1/categories/", categoryRoutes);
app.use("/api/v1/wards/", wardRoutes);
app.use("/api/v1/requests/", serviceRequestRoutes);
app.use("/api/v1/notifications/", notificationRoutes);
app.use("/api/v1/audit-logs/", auditLogRoutes);
app.use("/api/v1/payments/", paymentRoutes);
app.get("/test", async (_req, res, next) => {
  try {
    const idToken = await getBkashIdToken();
    const idTokenTTL = await redisClient.ttl("bkash:idToken");
    const refreshToken3 = await redisClient.get("bkash:refreshToken");
    const refreshTokenTTL = await redisClient.ttl("bkash:refreshToken");
    console.log("bKash id_token:", idToken);
    console.log("bKash id_token TTL:", `${idTokenTTL} seconds remaining`);
    console.log("bKash refresh_token:", refreshToken3);
    console.log("bKash refresh_token TTL:", `${refreshTokenTTL} seconds remaining`);
    return res.status(httpStatus24.OK).json({
      success: true,
      statusCode: httpStatus24.OK,
      message: "bKash Token Grant & Redis Caching Successful!",
      data: {
        idToken,
        idTokenTTL: `${idTokenTTL} seconds remaining`,
        refreshToken: refreshToken3,
        refreshTokenTTL: `${refreshTokenTTL} seconds remaining`
      }
    });
  } catch (error) {
    console.error("bKash Token Test Error:", error);
    next(error);
  }
});
app.get("/", (_req, res) => {
  res.status(httpStatus24.OK).json({
    success: true,
    statusCode: httpStatus24.OK,
    message: "Welcome to the Citycare Backend System!",
    data: null
  });
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;
export {
  app_default as default
};

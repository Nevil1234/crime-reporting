CREATE EXTENSION IF NOT EXISTS postgis;

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COMPLAINANT', 'OFFICER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('EMERGENCY', 'HIGH', 'NORMAL');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "MessageSender" AS ENUM ('COMPLAINANT', 'OFFICER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'COMPLAINANT',
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrimeReport" (
    "id" TEXT NOT NULL,
    "crimeType" TEXT NOT NULL,
    "description" TEXT,
    "location" geography(Point, 4326),
    "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "anonymousToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "complainantId" TEXT,
    "officerId" TEXT,
    "stationId" TEXT,

    CONSTRAINT "CrimeReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoliceOfficer" (
    "id" TEXT NOT NULL,
    "badgeNumber" TEXT NOT NULL,
    "currentLocation" geography(Point, 4326),
    "activeCases" INTEGER NOT NULL DEFAULT 0,
    "maxCapacity" INTEGER NOT NULL DEFAULT 5,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PoliceOfficer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoliceStation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" geography(Point, 4326),
    "contactNumber" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PoliceStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "EvidenceType" NOT NULL,
    "reportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentBy" "MessageSender" NOT NULL,
    "reportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeatmapData" (
    "id" TEXT NOT NULL,
    "location" geography(Polygon, 4326),
    "intensity" DOUBLE PRECISION NOT NULL,
    "reportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HeatmapData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "CrimeReport_anonymousToken_key" ON "CrimeReport"("anonymousToken");

-- CreateIndex
CREATE INDEX "CrimeReport_location_idx" ON "CrimeReport" USING GIST ("location");

-- CreateIndex
CREATE INDEX "CrimeReport_createdAt_idx" ON "CrimeReport"("createdAt");

-- CreateIndex
CREATE INDEX "CrimeReport_priority_idx" ON "CrimeReport"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "PoliceOfficer_badgeNumber_key" ON "PoliceOfficer"("badgeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PoliceOfficer_userId_key" ON "PoliceOfficer"("userId");

-- CreateIndex
CREATE INDEX "PoliceOfficer_currentLocation_idx" ON "PoliceOfficer" USING GIST ("currentLocation");

-- CreateIndex
CREATE INDEX "PoliceStation_location_idx" ON "PoliceStation" USING GIST ("location");

-- CreateIndex
CREATE INDEX "Evidence_reportId_idx" ON "Evidence"("reportId");

-- CreateIndex
CREATE INDEX "Message_reportId_idx" ON "Message"("reportId");

-- CreateIndex
CREATE INDEX "HeatmapData_location_idx" ON "HeatmapData" USING GIST ("location");

-- AddForeignKey
ALTER TABLE "CrimeReport" ADD CONSTRAINT "CrimeReport_complainantId_fkey" FOREIGN KEY ("complainantId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrimeReport" ADD CONSTRAINT "CrimeReport_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "PoliceOfficer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrimeReport" ADD CONSTRAINT "CrimeReport_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "PoliceStation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoliceOfficer" ADD CONSTRAINT "PoliceOfficer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoliceOfficer" ADD CONSTRAINT "PoliceOfficer_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "PoliceStation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "CrimeReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "CrimeReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeatmapData" ADD CONSTRAINT "HeatmapData_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "CrimeReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

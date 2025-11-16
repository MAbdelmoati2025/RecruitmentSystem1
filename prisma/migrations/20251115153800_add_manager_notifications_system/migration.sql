-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "completedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ManagerNotification" (
    "id" SERIAL NOT NULL,
    "managerId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ManagerNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ManagerNotification_managerId_idx" ON "ManagerNotification"("managerId");

-- CreateIndex
CREATE INDEX "ManagerNotification_read_idx" ON "ManagerNotification"("read");

-- CreateIndex
CREATE INDEX "ManagerNotification_type_idx" ON "ManagerNotification"("type");

-- AddForeignKey
ALTER TABLE "ManagerNotification" ADD CONSTRAINT "ManagerNotification_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

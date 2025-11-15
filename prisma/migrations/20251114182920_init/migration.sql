-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "managerId" INTEGER;

-- CreateTable
CREATE TABLE "Manager" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "position" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Manager_username_key" ON "Manager"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_email_key" ON "Manager"("email");

-- CreateIndex
CREATE INDEX "Assignment_managerId_idx" ON "Assignment"("managerId");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE SET NULL ON UPDATE CASCADE;

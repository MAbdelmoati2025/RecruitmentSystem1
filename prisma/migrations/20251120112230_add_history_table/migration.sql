-- CreateTable
CREATE TABLE "CandidateHistory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "age" INTEGER,
    "address" TEXT,
    "company" TEXT,
    "position" TEXT,
    "education" TEXT,
    "uploadBatch" TEXT,
    "source" TEXT,
    "uploadedBy" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CandidateHistory_phone_idx" ON "CandidateHistory"("phone");

-- CreateIndex
CREATE INDEX "CandidateHistory_uploadBatch_idx" ON "CandidateHistory"("uploadBatch");

-- CreateIndex
CREATE INDEX "CandidateHistory_isActive_idx" ON "CandidateHistory"("isActive");

-- CreateIndex
CREATE INDEX "CandidateHistory_createdAt_idx" ON "CandidateHistory"("createdAt");

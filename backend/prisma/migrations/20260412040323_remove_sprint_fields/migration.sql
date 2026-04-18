-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JiraSyncQueue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storyId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "retries" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JiraSyncQueue_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JiraSyncQueue" ("action", "createdAt", "error", "id", "retries", "status", "storyId", "updatedAt") SELECT "action", "createdAt", "error", "id", "retries", "status", "storyId", "updatedAt" FROM "JiraSyncQueue";
DROP TABLE "JiraSyncQueue";
ALTER TABLE "new_JiraSyncQueue" RENAME TO "JiraSyncQueue";
CREATE UNIQUE INDEX "JiraSyncQueue_storyId_key" ON "JiraSyncQueue"("storyId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

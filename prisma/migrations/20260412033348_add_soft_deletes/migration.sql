/*
  Warnings:

  - You are about to drop the `Sprint` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `userId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `sprintId` on the `Story` table. All the data in the column will be lost.
  - Added the required column `author` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Sprint_projectId_name_key";

-- AlterTable
ALTER TABLE "Epic" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "deletedAt" DATETIME;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Sprint";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storyId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Comment_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("content", "createdAt", "id", "storyId", "updatedAt") SELECT "content", "createdAt", "id", "storyId", "updatedAt" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE TABLE "new_Story" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "epicId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "storyPoints" INTEGER,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "type" TEXT NOT NULL DEFAULT 'story',
    "status" TEXT NOT NULL DEFAULT 'unassigned',
    "acceptanceCriteria" TEXT,
    "observations" TEXT,
    "dueDate" DATETIME,
    "jiraIssueKey" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Story_epicId_fkey" FOREIGN KEY ("epicId") REFERENCES "Epic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Story_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Story" ("acceptanceCriteria", "assigneeId", "createdAt", "description", "dueDate", "epicId", "id", "jiraIssueKey", "observations", "priority", "status", "storyPoints", "title", "type", "updatedAt") SELECT "acceptanceCriteria", "assigneeId", "createdAt", "description", "dueDate", "epicId", "id", "jiraIssueKey", "observations", "priority", "status", "storyPoints", "title", "type", "updatedAt" FROM "Story";
DROP TABLE "Story";
ALTER TABLE "new_Story" RENAME TO "Story";
CREATE UNIQUE INDEX "Story_jiraIssueKey_key" ON "Story"("jiraIssueKey");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

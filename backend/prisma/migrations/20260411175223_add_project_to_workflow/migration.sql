/*
  Warnings:

  - Added the required column `projectId` to the `WorkflowState` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WorkflowState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isInitial" BOOLEAN NOT NULL DEFAULT false,
    "isFinal" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "WorkflowState_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WorkflowState" ("description", "id", "isFinal", "isInitial", "name", "order", "projectId") SELECT "description", "id", "isFinal", "isInitial", "name", "order", '08f49a34-ffa4-4fe2-a290-6fe69f125deb' FROM "WorkflowState";
DROP TABLE "WorkflowState";
ALTER TABLE "new_WorkflowState" RENAME TO "WorkflowState";
CREATE UNIQUE INDEX "WorkflowState_projectId_name_key" ON "WorkflowState"("projectId", "name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

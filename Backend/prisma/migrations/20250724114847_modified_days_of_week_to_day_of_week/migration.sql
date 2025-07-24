/*
  Warnings:

  - You are about to drop the column `daysOfWeek` on the `TrainerAvailability` table. All the data in the column will be lost.
  - Added the required column `dayOfWeek` to the `TrainerAvailability` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TrainerAvailability" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trainerId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,
    CONSTRAINT "TrainerAvailability_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TrainerAvailability" ("endTime", "id", "startTime", "trainerId") SELECT "endTime", "id", "startTime", "trainerId" FROM "TrainerAvailability";
DROP TABLE "TrainerAvailability";
ALTER TABLE "new_TrainerAvailability" RENAME TO "TrainerAvailability";
CREATE UNIQUE INDEX "TrainerAvailability_id_key" ON "TrainerAvailability"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

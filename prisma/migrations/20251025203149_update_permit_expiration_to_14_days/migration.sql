/*
  Warnings:

  - You are about to drop the column `age` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `mailingAddress` on the `users` table. All the data in the column will be lost.
  - Added the required column `addressLine1` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirthDay` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirthMonth` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirthYear` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `town` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_admins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_admins" ("createdAt", "id", "password", "updatedAt", "username") SELECT "createdAt", "id", "password", "updatedAt", "username" FROM "admins";
DROP TABLE "admins";
ALTER TABLE "new_admins" RENAME TO "admins";
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "dateOfBirthMonth" INTEGER NOT NULL,
    "dateOfBirthDay" INTEGER NOT NULL,
    "dateOfBirthYear" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "eyeColor" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "town" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "permitType" TEXT NOT NULL,
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "communicationsOptIn" BOOLEAN NOT NULL DEFAULT false,
    "paymentCompleted" BOOLEAN NOT NULL DEFAULT false,
    "paymentId" TEXT,
    "paymentDate" DATETIME,
    "permitNumber" TEXT,
    "tempPermitExpirationDate" DATETIME,
    "permitScreenshot" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("communicationsOptIn", "createdAt", "email", "eyeColor", "firstName", "height", "id", "lastName", "paymentCompleted", "paymentId", "permitType", "phoneNumber", "sex", "termsAccepted", "updatedAt") SELECT "communicationsOptIn", "createdAt", "email", "eyeColor", "firstName", "height", "id", "lastName", "paymentCompleted", "paymentId", "permitType", "phoneNumber", "sex", "termsAccepted", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_permitNumber_key" ON "users"("permitNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

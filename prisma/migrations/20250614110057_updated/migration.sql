/*
  Warnings:

  - Added the required column `Description` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "Description" TEXT NOT NULL;

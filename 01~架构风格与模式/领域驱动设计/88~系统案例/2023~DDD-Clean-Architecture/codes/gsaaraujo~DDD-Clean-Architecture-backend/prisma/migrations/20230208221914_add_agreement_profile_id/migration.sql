/*
  Warnings:

  - Added the required column `id` to the `agreements_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "agreements_profiles" ADD COLUMN     "id" VARCHAR(36) NOT NULL,
ADD CONSTRAINT "agreements_profiles_pkey" PRIMARY KEY ("id");

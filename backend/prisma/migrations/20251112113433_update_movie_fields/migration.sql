/*
  Warnings:

  - Made the column `synopsis` on table `movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `release_year` on table `movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `director` on table `movie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "movie" ALTER COLUMN "synopsis" SET NOT NULL,
ALTER COLUMN "release_year" SET NOT NULL,
ALTER COLUMN "release_year" SET DATA TYPE TEXT,
ALTER COLUMN "director" SET NOT NULL;

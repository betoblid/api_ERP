/*
  Warnings:

  - Added the required column `password` to the `Funcionario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Funcionario" ADD COLUMN     "password" TEXT NOT NULL;

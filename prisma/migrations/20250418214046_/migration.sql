/*
  Warnings:

  - Added the required column `dataAgendado` to the `OrdemServico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horarioExecucao` to the `OrdemServico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `OrdemServico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrdemServico" ADD COLUMN     "dataAgendado" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "horarioExecucao" TEXT NOT NULL,
ADD COLUMN     "titulo" TEXT NOT NULL;

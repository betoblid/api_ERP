/*
  Warnings:

  - You are about to drop the column `numero` on the `Pedido` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Pedido_numero_key";

-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "numero";

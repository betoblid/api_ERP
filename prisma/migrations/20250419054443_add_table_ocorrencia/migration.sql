-- CreateEnum
CREATE TYPE "TipoOcorrencia" AS ENUM ('entrega', 'retirada');

-- CreateEnum
CREATE TYPE "StatusOcorrencia" AS ENUM ('pendente', 'finalizado', 'cancelado');

-- CreateTable
CREATE TABLE "Ocorrencia" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoOcorrencia" NOT NULL,
    "recebidoPor" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "horario" TIMESTAMP(3) NOT NULL,
    "local" TEXT NOT NULL,
    "observacao" TEXT,
    "status" "StatusOcorrencia" NOT NULL DEFAULT 'finalizado',
    "pedidoId" INTEGER NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ocorrencia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ocorrencia" ADD CONSTRAINT "Ocorrencia_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

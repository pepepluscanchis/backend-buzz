-- AlterTable: Bus (última posición conocida, reportada por el gateway de tracking)
ALTER TABLE "Bus" ADD COLUMN "lastLat" DOUBLE PRECISION;
ALTER TABLE "Bus" ADD COLUMN "lastLng" DOUBLE PRECISION;
ALTER TABLE "Bus" ADD COLUMN "lastLocationAt" TIMESTAMP(3);

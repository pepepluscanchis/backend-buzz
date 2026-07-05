-- AlterTable: User (make password optional, add fields)
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
ALTER TABLE "User" ADD COLUMN "authProvider" TEXT NOT NULL DEFAULT 'LOCAL';
ALTER TABLE "User" ADD COLUMN "vehiclePlate" TEXT;

-- AlterTable: Bus (add missing columns)
ALTER TABLE "Bus" ADD COLUMN "model" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Bus" ADD COLUMN "capacity" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Bus" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Bus" ADD COLUMN "routeId" TEXT;
ALTER TABLE "Bus" ALTER COLUMN "model" DROP DEFAULT;
ALTER TABLE "Bus" ALTER COLUMN "capacity" DROP DEFAULT;
ALTER TABLE "Bus" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable: Route
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pathCoords" JSONB,
    "publicLetter" TEXT,
    "colorHex" TEXT,
    "badge" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Stop
CREATE TABLE "Stop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "routeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey: Bus -> Route
ALTER TABLE "Bus" ADD CONSTRAINT "Bus_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: Route -> Company
ALTER TABLE "Route" ADD CONSTRAINT "Route_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: Stop -> Route
ALTER TABLE "Stop" ADD CONSTRAINT "Stop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Arrancando el motor del Seeder...');

  // 1. Crear o actualizar la empresa Nuevo California
  const company = await prisma.company.upsert({
    where: { name: 'Nuevo California' },
    update: {},
    create: {
      name: 'Nuevo California',
      ruc: '20123456789',
    },
  });   
  console.log('🏢 Empresa Nuevo California asegurada.');

  // 2. Crear o actualizar al admin "jefazo"
  const hashedPassword = await bcrypt.hash('123456', 10);
  const user = await prisma.user.upsert({
    where: { email: 'jefazo@gmail.com' },
    update: {
      password: hashedPassword, // 🔥 Ahora sí va a pisar la clave vieja si el usuario ya existe
    },
    create: {
      email: 'jefazo@gmail.com',
      password: hashedPassword,
      name: 'Jefazo California',
      role: 'ADMIN',
      companyId: company.id,
    },
  });
  console.log('👨‍💼 Usuario admin (jefazo@gmail.com) asegurado.');

  // 3. LIMPIEZA SEGURA: Buscamos si la ruta ya existe
  const oldRoute = await prisma.route.findFirst({
    where: { name: 'Letra V - La Esperanza / Buenos Aires' },
  });

  if (oldRoute) {
    // A. Desvinculamos los micros de esta ruta para que no den error
    await prisma.bus.updateMany({
      where: { routeId: oldRoute.id },
      data: { routeId: null },
    });
    
    // B. Borramos los paraderos amarrados a esta ruta
    await prisma.stop.deleteMany({
      where: { routeId: oldRoute.id },
    });

    // C. Ahora sí, borramos la ruta con total seguridad
    await prisma.route.delete({
      where: { id: oldRoute.id },
    });
  }

  // 4. Creamos la Ruta nueva con sus Paraderos incrustados
  const route = await prisma.route.create({
    data: {
      name: 'Letra V - La Esperanza / Buenos Aires',
      isActive: true,
      companyId: company.id,
      pathCoords: [
        { lat: -8.11599, lng: -79.02582 },
        { lat: -8.1165, lng: -79.0261 },
        { lat: -8.117, lng: -79.0265 },
        { lat: -8.1182, lng: -79.0271 },
      ],
      stops: {
        create: [
          { name: 'Paradero Óvalo Papal', latitude: -8.11604, longitude: -79.03722 },
          { name: 'Paradero UCV', latitude: -8.12050, longitude: -79.03010 },
        ],
      },
    },
  });
  console.log('🗺️ Ruta Letra V y paraderos dibujados.');

  // 5. Crear o actualizar los buses y amarrarlos a la nueva ruta
  await prisma.bus.upsert({
    where: { plate: 'T1A-123' },
    update: { routeId: route.id }, 
    create: {
      plate: 'T1A-123',
      model: 'Mercedes Sprinter',
      capacity: 18,
      unitNumber: 'M-45',
      companyId: company.id,
      routeId: route.id,
    },
  });

  await prisma.bus.upsert({
    where: { plate: 'T2B-456' },
    update: { routeId: route.id },
    create: {
      plate: 'T2B-456',
      model: 'Volvo B270F',
      capacity: 30,
      unitNumber: 'M-46',
      companyId: company.id,
      routeId: route.id,
    },
  });
  console.log(' Micros T1A-123 y T2B-456 enllantados y asignados.');

  console.log(' ¡Base de datos sembrada con éxito, primo!');
}

main()
  .catch((e) => {
    console.error('❌ Error sembrando los datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
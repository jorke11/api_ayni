import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function seedSupplyItems() {
  const items: { name: string; category: 'MEDICINE' | 'FOOD' | 'CLOTHING' | 'HYGIENE' | 'OTHER'; unit: string }[] = [
    { name: 'Agua embotellada', category: 'FOOD', unit: 'litro' },
    { name: 'Arroz', category: 'FOOD', unit: 'kg' },
    { name: 'Atún enlatado', category: 'FOOD', unit: 'unidad' },
    { name: 'Analgésico (paracetamol)', category: 'MEDICINE', unit: 'caja' },
    { name: 'Suero oral', category: 'MEDICINE', unit: 'sobre' },
    { name: 'Cobija', category: 'CLOTHING', unit: 'unidad' },
    { name: 'Ropa de abrigo', category: 'CLOTHING', unit: 'unidad' },
    { name: 'Kit de higiene personal', category: 'HYGIENE', unit: 'kit' },
    { name: 'Pañales', category: 'HYGIENE', unit: 'paquete' },
  ];

  for (const item of items) {
    const existing = await prisma.supplyItem.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.supplyItem.create({ data: { id: randomUUID(), ...item } });
    }
  }
}

async function seedAdminStaff() {
  const adminCedula = process.env.SEED_ADMIN_CEDULA ?? '0000000000';
  const adminPin = process.env.SEED_ADMIN_PIN ?? '0000';

  const existing = await prisma.staffUser.findUnique({ where: { cedula: adminCedula } });
  if (existing) {
    return;
  }

  const pinHash = await bcrypt.hash(adminPin, 10);
  await prisma.staffUser.create({
    data: {
      id: randomUUID(),
      cedula: adminCedula,
      fullName: 'Administrador Ayni',
      pinHash,
      role: 'ADMIN',
      active: true,
    },
  });

  console.log(`Usuario ADMIN creado -> cédula: ${adminCedula}, PIN: ${adminPin}`);
}

async function main() {
  await seedSupplyItems();
  await seedAdminStaff();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

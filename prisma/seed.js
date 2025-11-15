import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء عملية إضافة البيانات...');

  // إضافة موظفين تجريبيين
  const admin = await prisma.employee.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: '123456',
      fullName: 'أحمد محمد',
      email: 'admin@company.com',
      position: 'مدير النظام'
    }
  });

  const employee1 = await prisma.employee.upsert({
    where: { username: 'employee1' },
    update: {},
    create: {
      username: 'employee1',
      password: '123456',
      fullName: 'سارة علي',
      email: 'sara@company.com',
      position: 'موظفة مبيعات'
    }
  });

  const employee2 = await prisma.employee.upsert({
    where: { username: 'employee2' },
    update: {},
    create: {
      username: 'employee2',
      password: '123456',
      fullName: 'محمد حسن',
      email: 'mohamed@company.com',
      position: 'موظف مبيعات'
    }
  });

  const employee3 = await prisma.employee.upsert({
    where: { username: 'employee3' },
    update: {},
    create: {
      username: 'employee3',
      password: '123456',
      fullName: 'فاطمة أحمد',
      email: 'fatma@company.com',
      position: 'موظفة مبيعات'
    }
  });

  console.log('✅ تم إضافة الموظفين بنجاح');
  console.log('👤 Admin:', admin);
  console.log('👤 Employee 1:', employee1);
  console.log('👤 Employee 2:', employee2);
  console.log('👤 Employee 3:', employee3);

  console.log('✅ تم إنشاء الموظفين بنجاح');
  console.log('ℹ️  يمكنك الآن رفع ملف المرشحين من خلال الواجهة');
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء عملية إضافة البيانات...');

  // ============ إضافة المدراء ============
  console.log('\n📊 إضافة المدراء...');
  
  const manager1 = await prisma.manager.upsert({
    where: { username: 'manager' },
    update: {},
    create: {
      username: 'manager',
      password: '123456',
      fullName: 'خالد إبراهيم',
      email: 'manager@company.com',
      position: 'مدير عام',
      phone: '01012345678'
    }
  });

  const manager2 = await prisma.manager.upsert({
    where: { username: 'manager2' },
    update: {},
    create: {
      username: 'manager2',
      password: '123456',
      fullName: 'نور الدين محمود',
      email: 'manager2@company.com',
      position: 'مدير المبيعات',
      phone: '01098765432'
    }
  });

  console.log('✅ تم إضافة المدراء بنجاح');
  console.log('👔 Manager 1:', manager1.fullName, '-', manager1.username);
  console.log('👔 Manager 2:', manager2.fullName, '-', manager2.username);

  // ============ إضافة الموظفين ============
  console.log('\n👥 إضافة الموظفين...');

  const employee1 = await prisma.employee.upsert({
    where: { username: 'employee1' },
    update: {},
    create: {
      username: 'employee1',
      password: '123456',
      fullName: 'أحمد محمد',
      email: 'ahmed@company.com',
      position: 'موظف مبيعات',
      phone: '01123456789'
    }
  });

  const employee2 = await prisma.employee.upsert({
    where: { username: 'employee2' },
    update: {},
    create: {
      username: 'employee2',
      password: '123456',
      fullName: 'سارة علي',
      email: 'sara@company.com',
      position: 'موظفة مبيعات',
      phone: '01234567890'
    }
  });

  const employee3 = await prisma.employee.upsert({
    where: { username: 'employee3' },
    update: {},
    create: {
      username: 'employee3',
      password: '123456',
      fullName: 'محمد حسن',
      email: 'mohamed@company.com',
      position: 'موظف مبيعات',
      phone: '01098765432'
    }
  });

  const employee4 = await prisma.employee.upsert({
    where: { username: 'employee4' },
    update: {},
    create: {
      username: 'employee4',
      password: '123456',
      fullName: 'فاطمة أحمد',
      email: 'fatma@company.com',
      position: 'موظفة مبيعات',
      phone: '01187654321'
    }
  });

  const employee5 = await prisma.employee.upsert({
    where: { username: 'employee5' },
    update: {},
    create: {
      username: 'employee5',
      password: '123456',
      fullName: 'عمر خالد',
      email: 'omar@company.com',
      position: 'موظف مبيعات',
      phone: '01145678901'
    }
  });

  console.log('✅ تم إضافة الموظفين بنجاح');
  console.log('👤 Employee 1:', employee1.fullName, '-', employee1.username);
  console.log('👤 Employee 2:', employee2.fullName, '-', employee2.username);
  console.log('👤 Employee 3:', employee3.fullName, '-', employee3.username);
  console.log('👤 Employee 4:', employee4.fullName, '-', employee4.username);
  console.log('👤 Employee 5:', employee5.fullName, '-', employee5.username);

  console.log('\n✅ تم إنشاء جميع الحسابات بنجاح');
  console.log('\n📋 ملخص الحسابات:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('المدراء:');
  console.log('  👔 Username: manager  | Password: 123456 | Name:', manager1.fullName);
  console.log('  👔 Username: manager2 | Password: 123456 | Name:', manager2.fullName);
  console.log('\nالموظفين:');
  console.log('  👤 Username: employee1 | Password: 123456 | Name:', employee1.fullName);
  console.log('  👤 Username: employee2 | Password: 123456 | Name:', employee2.fullName);
  console.log('  👤 Username: employee3 | Password: 123456 | Name:', employee3.fullName);
  console.log('  👤 Username: employee4 | Password: 123456 | Name:', employee4.fullName);
  console.log('  👤 Username: employee5 | Password: 123456 | Name:', employee5.fullName);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\nℹ️  يمكنك الآن:');
  console.log('   1. تسجيل الدخول كمدير ورفع ملف المرشحين');
  console.log('   2. تكليف الموظفين بالمرشحين');
  console.log('   3. تسجيل الدخول كموظف ومتابعة المهام');
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
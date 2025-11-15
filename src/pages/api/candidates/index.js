import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { age, address, company, position, education, page = 1, limit = 50 } = req.query;
      
      const where = {};
      if (age) where.age = parseInt(age);
      if (address) where.address = { contains: address, mode: 'insensitive' };
      if (company) where.company = { contains: company, mode: 'insensitive' };
      if (position) where.position = { contains: position, mode: 'insensitive' };
      if (education) where.education = { contains: education, mode: 'insensitive' };

      // Pagination للأداء مع 10,000 رقم
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const [candidates, total] = await Promise.all([
        prisma.candidate.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.candidate.count({ where })
      ]);

      res.status(200).json({ 
        candidates, 
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
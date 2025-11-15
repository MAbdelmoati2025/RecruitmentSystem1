import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { candidates, uploadBatch } = req.body;
    
    // استخدم createMany للأداء الأفضل مع 10,000 رقم
    const result = await prisma.candidate.createMany({
      data: candidates.map(c => ({
        ...c,
        uploadBatch: uploadBatch || new Date().toISOString()
      })),
      skipDuplicates: true, // تجاهل الأرقام المكررة
    });

    res.status(200).json({ 
      success: true, 
      count: result.count 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
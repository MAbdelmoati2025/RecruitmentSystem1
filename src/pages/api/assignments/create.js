import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { employeeId, candidateIds } = req.body;

    const assignments = await prisma.assignment.createMany({
      data: candidateIds.map(candidateId => ({
        employeeId,
        candidateId,
        status: 'pending'
      })),
      skipDuplicates: true
    });

    res.status(200).json({ 
      success: true, 
      count: assignments.count 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
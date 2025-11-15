import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const employees = await prisma.employee.findMany({
        include: {
          assignments: {
            include: {
              candidate: true
            }
          }
        }
      });

      const summary = employees.map(emp => ({
        id: emp.id,
        name: emp.fullName,
        position: emp.position,
        totalAssigned: emp.assignments.length,
        completed: emp.assignments.filter(a => a.status === 'completed').length,
        inProgress: emp.assignments.filter(a => a.status === 'in_progress').length,
        pending: emp.assignments.filter(a => a.status === 'pending').length,
      }));

      res.status(200).json(summary);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
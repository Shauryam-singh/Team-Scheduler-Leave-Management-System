import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const getLeaves = async (req: Request, res: Response) => {
  try {
    const leaves = await prisma.leave.findMany({
      include: { user: true },
    });
    res.json(leaves);
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
};

export const createLeave = async (req: AuthRequest, res: Response) => {
  const { reason, startDate, endDate } = req.body;

  try {
    const newLeave = await prisma.leave.create({
      data: {
        reason,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'pending',
        userId: req.user!.userId,
      },
    });

    res.status(201).json(newLeave);
  } catch (error) {
    console.error('Error creating leave:', error);
    res.status(500).json({ error: 'Failed to create leave' });
  }
};

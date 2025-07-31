import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const getLeaves = async (req: AuthRequest, res: Response) => {
  const { userId, role } = req.user!;

  try {
    let leaves;
    if (role === 'admin') {
      leaves = await prisma.leave.findMany({ include: { user: true } });
    } else if (role === 'manager') {
      leaves = await prisma.leave.findMany({
        where: { user: { role: 'employee' } },
        include: { user: true },
      });
    } else {
      leaves = await prisma.leave.findMany({
        where: { userId },
        include: { user: true },
      });
    }

    res.json(leaves);
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
};

export const createLeave = async (req: AuthRequest, res: Response) => {
  const { reason, startDate, endDate } = req.body;
  const { userId } = req.user!;

  try {
    const newLeave = await prisma.leave.create({
      data: {
        reason,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'pending',
        userId,
      },
    });

    res.status(201).json(newLeave);
  } catch (error) {
    console.error('Error creating leave:', error);
    res.status(500).json({ error: 'Failed to create leave' });
  }
};

export const updateLeaveStatus = async (req: AuthRequest, res: Response) => {
  const { role } = req.user!;
  if (role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedLeave = await prisma.leave.update({
      where: { id },
      data: { status },
    });
    res.json(updatedLeave);
  } catch (error) {
    console.error('Error updating leave:', error);
    res.status(500).json({ error: 'Failed to update leave' });
  }
};

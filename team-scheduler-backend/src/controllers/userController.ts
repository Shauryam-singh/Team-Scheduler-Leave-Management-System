import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, name: true, email: true, role: true }
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, password } = req.body;
    const updateData: any = {};
    if (name) updateData.name = name;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.userId },
      data: updateData,
      select: { id: true, name: true, email: true, role: true }
    });

    res.json(updatedUser);
  } catch {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

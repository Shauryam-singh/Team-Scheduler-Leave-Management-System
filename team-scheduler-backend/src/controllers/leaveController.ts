import { Request, Response } from 'express';

export const getLeaves = async (req: Request, res: Response) => {
  // Temporary mock response
  res.json([{ id: 1, reason: 'Vacation', startDate: '2024-08-01', endDate: '2024-08-05' }]);
};

export const createLeave = async (req: Request, res: Response) => {
  const { reason, startDate, endDate } = req.body;
  // Temporary mock creation logic
  const newLeave = { id: Date.now(), reason, startDate, endDate };
  res.status(201).json(newLeave);
};

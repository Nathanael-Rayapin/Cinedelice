import type { Request, Response } from "express";
import { prisma } from "../models/index.ts";

export async function getAllUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({
    omit: { password: true }
  });
  res.json(users);
}

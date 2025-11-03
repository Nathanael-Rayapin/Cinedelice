import { Router } from "express";
import { router as recipesRouter} from "../routers/recipes.router.ts";

export const router=Router();

router.use(recipesRouter);
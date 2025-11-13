import { Router } from "express";
import { router as authRouter} from "../routers/auth.router.ts";
import { router as categoriesRouter } from "../routers/categories.router.ts";
import { router as usersRouter} from "./users.router.ts";
import { router as recipesRouter} from "./recipes.router.ts";
import { router as movieRouter } from "./movies.router.ts";
export const router=Router();

router.use(recipesRouter);
router.use(usersRouter);
router.use(authRouter);
router.use(categoriesRouter);
router.use(movieRouter);
import { Router } from "express";
import { router as recipesRouter} from "../routers/recipes.router.ts";
import { router as authRouter} from "../routers/auth.router.ts";
import { router as usersRouter} from "../routers/users.router.ts";
import { router as categoriesRouter } from "../routers/categories.router.ts";

export const router=Router();

router.use(recipesRouter);
router.use(usersRouter);
router.use(authRouter);
router.use(categoriesRouter);
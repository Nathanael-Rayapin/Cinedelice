import { Router } from "express";
import { router as authRouter} from "../routers/auth.router.ts";
import { router as categoriesRouter } from "../routers/categories.router.ts";
import { router as adminRouter} from "../routers/admin.router.ts";

export const router=Router();

//router.use(recipesRouter);
router.use(adminRouter);
router.use(authRouter);
router.use(categoriesRouter);
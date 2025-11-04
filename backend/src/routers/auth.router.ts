import { Router } from "express";
import * as authController from "../controllers/auth.controller.ts";
//import { checkRoles } from "../middlewares/access-control-middleware.ts";
import rateLimit from "express-rate-limit";

export const router = Router();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,// 1 minute
  max: 10,// Limit each IP to 10 requests per `window` (here, per minute)
  message:"Trop de requête, réesseyez plus tard",
});

router.post("/auth/register", authController.registerUser);
//router.post("/auth/login", limiter, authController.loginUser);
//router.post("/auth/refresh", authController.refreshTokens);
//router.post("/auth/logout", authController.logoutUser);
//router.get("/auth/me", checkRoles(["user", "admin"]), authController.getAuthenticatedUser);


import { Router } from "express";
import { handleHealthCheck } from "../controllers/healthcheck.controller.js";

const router = Router();

router.route("/health-check").get(handleHealthCheck);

export default router;

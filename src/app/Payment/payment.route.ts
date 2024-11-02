import express from "express";
import { PaymentController } from "./payment.controller";


const router = express.Router();


router.post("/paymentConfirm", PaymentController.paymentConfirmation);

export const paymentRoutes = router;

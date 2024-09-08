import { Router } from "express";
import {
  createGiftcard,
  getCardById,
  redeemGiftcard,
} from "../controllers/Giftcards.controller";

export const giftCardRouter = Router();

// Route to add a new reservation

giftCardRouter.delete("/redeem/:cardId", redeemGiftcard);
giftCardRouter.post("/create", createGiftcard);
giftCardRouter.get("/:cardId", getCardById);

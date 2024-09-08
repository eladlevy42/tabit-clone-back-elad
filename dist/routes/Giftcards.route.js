"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.giftCardRouter = void 0;
const express_1 = require("express");
const Giftcards_controller_1 = require("../controllers/Giftcards.controller");
exports.giftCardRouter = (0, express_1.Router)();
// Route to add a new reservation
exports.giftCardRouter.delete("/redeem/:cardId", Giftcards_controller_1.redeemGiftcard);
exports.giftCardRouter.post("/create", Giftcards_controller_1.createGiftcard);
exports.giftCardRouter.get("/:cardId", Giftcards_controller_1.getCardById);
exports.giftCardRouter.post("/send-sms", Giftcards_controller_1.sendSMS);

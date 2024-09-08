"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantsRoute = void 0;
const express_1 = require("express");
const Restaurant_controller_1 = require("../controllers/Restaurant.controller");
exports.restaurantsRoute = (0, express_1.Router)();
// Public routes
// restaurantsRoute.post("/", getAvailableTables);
exports.restaurantsRoute.get("/", Restaurant_controller_1.getAllRestaurants);
exports.restaurantsRoute.get("/photos/:id", Restaurant_controller_1.getPhotosByRestId);
// Get a restaurant by ID
exports.restaurantsRoute.get("/now/:id", Restaurant_controller_1.getAvaliableTablesForNow);
exports.restaurantsRoute.get("/giftIt", Restaurant_controller_1.getGiftIt);
exports.restaurantsRoute.get("/:id", Restaurant_controller_1.getRestaurantById);
exports.restaurantsRoute.get("/hour/:restId", Restaurant_controller_1.getRestaurantOpeningHours);

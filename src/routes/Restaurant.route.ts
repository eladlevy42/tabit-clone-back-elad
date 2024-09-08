import { Router } from "express";
import {
  getAllRestaurants,
  // getAvailableTables,
  getRestaurantById,
  getAvaliableTablesForNow,
  getPhotosByRestId,
  getGiftIt,
  getRestaurantOpeningHours,
} from "../controllers/Restaurant.controller";

export const restaurantsRoute = Router();

// Public routes
// restaurantsRoute.post("/", getAvailableTables);
restaurantsRoute.get("/", getAllRestaurants);
restaurantsRoute.get("/photos/:id", getPhotosByRestId);
// Get a restaurant by ID

restaurantsRoute.get("/now/:id", getAvaliableTablesForNow);
restaurantsRoute.get("/giftIt", getGiftIt);
restaurantsRoute.get("/:id", getRestaurantById);
restaurantsRoute.get("/hour/:restId", getRestaurantOpeningHours);

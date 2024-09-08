import { Router } from "express";
import {
  addReservation,
  deleteReservation,
  editReservation,
  getReservationById,
  getReservationByRestaurantIdAndDate,
} from "../controllers/Reservation.controller";

export const reservationRoutes = Router();

// Route to add a new reservation
reservationRoutes.post("/", addReservation);

// Route to delete a reservation by its ID
reservationRoutes.delete("/:reservationId", deleteReservation);

// Route to edit a reservation (partial update)
reservationRoutes.put("/", editReservation);

// Route to get reservations by restaurant ID and date
reservationRoutes.get("/byRestaurant", getReservationByRestaurantIdAndDate);

reservationRoutes.get("/:reservationId", getReservationById);

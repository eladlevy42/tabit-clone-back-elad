"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationRoutes = void 0;
const express_1 = require("express");
const Reservation_controller_1 = require("../controllers/Reservation.controller");
exports.reservationRoutes = (0, express_1.Router)();
// Route to add a new reservation
exports.reservationRoutes.post("/", Reservation_controller_1.addReservation);
// Route to delete a reservation by its ID
exports.reservationRoutes.delete("/:reservationId", Reservation_controller_1.deleteReservation);
// Route to edit a reservation (partial update)
exports.reservationRoutes.put("/", Reservation_controller_1.editReservation);
// Route to get reservations by restaurant ID and date
exports.reservationRoutes.get("/byRestaurant", Reservation_controller_1.getReservationByRestaurantIdAndDate);
exports.reservationRoutes.get("/:reservationId", Reservation_controller_1.getReservationById);

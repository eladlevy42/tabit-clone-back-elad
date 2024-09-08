"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Restaurant_route_1 = require("./routes/Restaurant.route");
const cors_1 = __importDefault(require("cors"));
const Reservation_route_1 = require("./routes/Reservation.route");
const Tables_route_1 = require("./routes/Tables.route");
const Giftcards_route_1 = require("./routes/Giftcards.route");
const db_1 = require("./config/db");
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
// Connect to the database
(0, db_1.connectDB)(); // Ensure the database connection is established
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["*"], // Use your frontend link here
    methods: ["POST", "GET", "PUT", "DELETE"], // Corrected methods
    credentials: true,
}));
// Routes
app.use("/api/tables", Tables_route_1.tablesRoute);
app.use("/api/restaurants", Restaurant_route_1.restaurantsRoute);
app.use("/api/reservations", Reservation_route_1.reservationRoutes);
app.use("/api/giftcard", Giftcards_route_1.giftCardRouter);
app.get("/", (req, res) => res.json("Express on Vercel"));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

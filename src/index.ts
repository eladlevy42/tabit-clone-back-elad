import express from "express";
import { restaurantsRoute } from "./routes/Restaurant.route";
import cors from "cors";
import { reservationRoutes } from "./routes/Reservation.route";
import { tablesRoute } from "./routes/Tables.route";
import { giftCardRouter } from "./routes/Giftcards.route";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 3000;
const app = express();

// Connect to the database
connectDB(); // Ensure the database connection is established

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["https://tabit-clone-app.vercel.app"], // Specify your frontend origin
    methods: ["POST", "GET", "PUT", "DELETE"], // Allowed methods
    credentials: true, // Allow credentials (cookies, etc.)
  })
);

// Routes
app.use("/api/tables", tablesRoute);
app.use("/api/restaurants", restaurantsRoute);
app.use("/api/reservations", reservationRoutes);
app.use("/api/giftcard", giftCardRouter);

app.get("/", (req, res) => res.json("Express on Vercel"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import { Router } from "express";
import {
  getAllAvaliableTablesByRest,
  getAvailableTables,
  getTablePositionsForRest,
} from "../controllers/Tables.controller";

export const tablesRoute = Router();

tablesRoute.get("/", getAvailableTables);
tablesRoute.get("/:restId", getAllAvaliableTablesByRest);
tablesRoute.get("/position/:restId", getTablePositionsForRest);

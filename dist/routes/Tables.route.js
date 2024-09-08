"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tablesRoute = void 0;
const express_1 = require("express");
const Tables_controller_1 = require("../controllers/Tables.controller");
exports.tablesRoute = (0, express_1.Router)();
exports.tablesRoute.get("/", Tables_controller_1.getAvailableTables);
exports.tablesRoute.get("/:restId", Tables_controller_1.getAllAvaliableTablesByRest);
exports.tablesRoute.get("/position/:restId", Tables_controller_1.getTablePositionsForRest);

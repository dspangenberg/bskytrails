"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var better_sqlite3_1 = require("drizzle-orm/better-sqlite3");
var migrator_1 = require("drizzle-orm/better-sqlite3/migrator");
var better_sqlite3_2 = require("better-sqlite3");
var sqlite = new better_sqlite3_2.default('sqlite.db');
var db = (0, better_sqlite3_1.drizzle)(sqlite);
// this will automatically run needed migrations on the database
(0, migrator_1.migrate)(db, { migrationsFolder: './drizzle' });

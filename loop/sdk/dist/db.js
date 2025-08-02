"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const bun_sqlite_1 = require("bun:sqlite");
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.resolve(__dirname, '../../records.db');
exports.db = new bun_sqlite_1.Database(dbPath);
// Enable WAL mode for better concurrency and performance.
exports.db.exec('PRAGMA journal_mode = WAL;');
console.log(`Database connected at ${dbPath}`);

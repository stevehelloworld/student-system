"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app_1 = __importDefault(require("./app"));
app_1.default.use((0, cors_1.default)());
app_1.default.use(express_1.default.json());
app_1.default.get('/', (req, res) => {
    res.send('Attendance System API');
});
app_1.default.use('/api/auth', auth_1.default);
app_1.default.use('/api/users', users_1.default);
const PORT = process.env.PORT || 4000;
app_1.default.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminOrManager = exports.isAdmin = exports.checkRole = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../prisma");
// Middleware to verify JWT token
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Token não fornecido" });
            return; // caso não existir o token, quebre o código
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const payload = decoded;
        const user = yield prisma_1.prisma.usuario.findUnique({
            where: { id: payload.id },
            include: { funcionario: true },
        });
        if (!user || !user.ativo) {
            res.status(401).json({ message: "Usuário não encontrado ou inativo" });
            return; // 👈 isso resolve o erro
        }
        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            funcionarioId: (_b = user.funcionarioId) !== null && _b !== void 0 ? _b : undefined,
            funcionario: user.funcionario,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token inválido" });
        return;
    }
});
exports.verifyToken = verifyToken;
// Middleware to check user role
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: "Não autenticado" });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: "Você não tem permissão para acessar esta página" });
            return;
        }
        next();
    };
};
exports.checkRole = checkRole;
// Admin only middleware
exports.isAdmin = (0, exports.checkRole)(["admin"]);
// Admin or manager middleware
exports.isAdminOrManager = (0, exports.checkRole)(["admin", "gerente"]);

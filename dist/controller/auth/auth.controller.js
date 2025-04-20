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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AuthController {
    // Registro de um novo usuário
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password, funcionarioId, role } = req.body;
                // Verifica se o usuário ou email já existe
                const existingUser = yield prisma.usuario.findFirst({
                    where: {
                        OR: [{ username }, { email }],
                    },
                });
                if (existingUser) {
                    res.status(400).json({ message: "Usuário ou email já existe" });
                    return;
                }
                // Se funcionarioId for informado, valida se o funcionário existe
                if (funcionarioId) {
                    const funcionario = yield prisma.funcionario.findUnique({
                        where: { id: funcionarioId },
                    });
                    if (!funcionario) {
                        res.status(400).json({ message: "Funcionário não encontrado" });
                        return;
                    }
                }
                // Gera hash da senha
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
                // Cria o usuário no banco
                const newUser = yield prisma.usuario.create({
                    data: {
                        username,
                        email,
                        password: hashedPassword,
                        funcionarioId: funcionarioId || null,
                        role,
                    },
                });
                // Remove a senha antes de retornar o usuário
                const { password: _ } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
                res.status(201).json({
                    message: "Usuário criado com sucesso",
                    user: userWithoutPassword,
                });
            }
            catch (error) {
                console.error("Erro ao registrar usuário:", error);
                res.status(500).json({ message: "Erro interno do servidor" });
            }
        });
    }
    // Login de usuário e retorno de token JWT
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield prisma.usuario.findUnique({
                    where: { email },
                    include: { funcionario: true },
                });
                if (!user) {
                    res.status(400).json({ message: "Credenciais inválidas" });
                    return;
                }
                if (!user.ativo) {
                    res.status(403).json({ message: "Usuário desativado" });
                    return;
                }
                const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    res.status(400).json({ message: "Credenciais inválidas" });
                    return;
                }
                const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
                const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
                res.json({
                    message: "Login realizado com sucesso",
                    token,
                    user: userWithoutPassword,
                });
            }
            catch (error) {
                console.error("Erro ao fazer login:", error);
                res.status(500).json({ message: "Erro interno do servidor" });
            }
        });
    }
    // Obter usuário autenticado
    static getCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(401).json({ message: "Usuário não autenticado" });
                    return;
                }
                const user = yield prisma.usuario.findUnique({
                    where: { id: userId },
                    include: { funcionario: true },
                });
                if (!user) {
                    res.status(404).json({ message: "Usuário não encontrado" });
                    return;
                }
                const { password } = user, userWithoutPassword = __rest(user, ["password"]);
                res.json(userWithoutPassword);
            }
            catch (error) {
                console.error("Erro ao buscar usuário:", error);
                res.status(500).json({ message: "Erro interno do servidor" });
            }
        });
    }
}
exports.AuthController = AuthController;

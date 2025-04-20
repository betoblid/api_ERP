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
exports.UserController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../prisma");
class UserController {
    //Pegar todos os usuários
    static getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma_1.prisma.usuario.findMany({
                    include: { funcionario: true },
                    orderBy: { createdAt: "desc" },
                });
                const usersWithoutPasswords = users.map((_a) => {
                    var { password } = _a, rest = __rest(_a, ["password"]);
                    return rest;
                });
                res.json(usersWithoutPasswords);
            }
            catch (error) {
                console.error("Get all users error:", error);
                res.status(500).json({ message: "Erro ao buscar usuários" });
            }
        });
    }
    // pegar usuário pelo ID
    static getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield prisma_1.prisma.usuario.findUnique({
                    where: { id: parseInt(id) },
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
                console.error("Get user by ID error:", error);
                res.status(500).json({ message: "Erro ao buscar usuário" });
            }
        });
    }
    //atualizr dados do usuário
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { username, email, role, funcionarioId, ativo } = req.body;
                const existingUser = yield prisma_1.prisma.usuario.findUnique({
                    where: { id: Number(id) },
                });
                if (!existingUser) {
                    res.status(404).json({ message: "Usuário não encontrado" });
                    return;
                }
                if (funcionarioId !== undefined) {
                    if (funcionarioId !== null) {
                        const funcionario = yield prisma_1.prisma.funcionario.findUnique({
                            where: { id: Number(funcionarioId) },
                        });
                        if (!funcionario) {
                            res.status(400).json({ message: "Funcionário não encontrado" });
                            return;
                        }
                    }
                }
                const updatedUser = yield prisma_1.prisma.usuario.update({
                    where: { id: Number(id) },
                    data: {
                        username: username !== null && username !== void 0 ? username : existingUser.username,
                        email: email !== null && email !== void 0 ? email : existingUser.email,
                        role: role !== null && role !== void 0 ? role : existingUser.role,
                        funcionarioId: funcionarioId !== null && funcionarioId !== void 0 ? funcionarioId : existingUser.funcionarioId,
                        ativo: ativo !== null && ativo !== void 0 ? ativo : existingUser.ativo,
                    },
                    include: { funcionario: true },
                });
                const { password } = updatedUser, userWithoutPassword = __rest(updatedUser, ["password"]);
                res.json({
                    message: "Usuário atualizado com sucesso",
                    user: userWithoutPassword,
                });
            }
            catch (error) {
                console.error("Update user error:", error);
                res.status(500).json({ message: "Erro ao atualizar usuário" });
            }
        });
    }
    // alterar senha do usuário
    static changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { currentPassword, newPassword } = req.body;
                const user = yield prisma_1.prisma.usuario.findUnique({
                    where: { id: parseInt(id) },
                });
                if (!user) {
                    res.status(404).json({ message: "Usuário não encontrado" });
                    return;
                }
                const isPasswordValid = yield bcryptjs_1.default.compare(currentPassword, user.password);
                if (!isPasswordValid) {
                    res.status(400).json({ message: "Senha atual incorreta" });
                    return;
                }
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(newPassword, salt);
                yield prisma_1.prisma.usuario.update({
                    where: { id: Number(id) },
                    data: { password: hashedPassword },
                });
                res.json({ message: "Senha alterada com sucesso" });
            }
            catch (error) {
                console.error("Change password error:", error);
                res.status(500).json({ message: "Erro ao alterar senha" });
            }
        });
    }
    //Apagar usuário
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield prisma_1.prisma.usuario.findUnique({
                    where: { id: parseInt(id) },
                });
                if (!user) {
                    res.status(404).json({ message: "Usuário não encontrado" });
                    return;
                }
                yield prisma_1.prisma.usuario.update({
                    where: { id: Number(id) },
                    data: { ativo: false },
                });
                res.json({ message: "Usuário desativado com sucesso" });
            }
            catch (error) {
                console.error("Delete user error:", error);
                res.status(500).json({ message: "Erro ao desativar usuário" });
            }
        });
    }
    //Ativar acesso do usuário
    static reactivateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield prisma_1.prisma.usuario.findUnique({
                    where: { id: parseInt(id) },
                });
                if (!user) {
                    res.status(404).json({ message: "Usuário não encontrado" });
                    return;
                }
                yield prisma_1.prisma.usuario.update({
                    where: { id: Number(id) },
                    data: { ativo: true },
                });
                res.json({ message: "Usuário reativado com sucesso" });
            }
            catch (error) {
                console.error("Reactivate user error:", error);
                res.status(500).json({ message: "Erro ao reativar usuário" });
            }
        });
    }
}
exports.UserController = UserController;

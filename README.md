# ERP API - Sistema Completo de Gestão

Bem-vindo à **ERP API**, um sistema desenvolvido por **Beto** com o objetivo de atender todas as funcionalidades essenciais que uma empresa precisa para começar no mercado. Essa API foi construída com **Node.js**, **Express**, **Prisma** e **JWT**, e é totalmente tipada com **TypeScript**.

## 📦 Variáveis de Ambiente

Antes de iniciar, crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/erp
JWT_SECRET=sua_chave_secreta
PORT=3000
```

> ⚠️ É essencial configurar corretamente essas variáveis para que a API funcione!


---

## 🔐 Autenticação

### POST `/auth/login`
**Descrição:** Realiza o login e retorna um token JWT.

**Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Retorno:**
```json
{
  "token": "jwt_token"
}
```

**Testando com curl:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@exemplo.com", "password":"senha123"}'
```

---

### POST `/auth/register`
**Descrição:** Cadastro de usuários (somente Admins).

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "username": "admin",
  "email": "admin@exemplo.com",
  "password": "123456",
  "role": "ADMIN",
  "funcionarioId": 1
}
```

**Retorno:**
```json
{
  "message": "Usuário registrado com sucesso",
  "user": { ... }
}
```

**Testando com curl:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@exemplo.com",
    "password": "123456",
    "role": "ADMIN",
    "funcionarioId": 1
  }'
```

---

## 👤 Usuário

### GET `/usuarios`
**Descrição:** Listar todos os usuários (Admin).

**Testando com curl:**
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/usuarios
```

### GET `/usuarios/:id`
**Descrição:** Buscar usuário por ID (Admin ou o próprio).

### PUT `/usuarios/:id`
**Descrição:** Atualizar dados (somente Admin).

### PUT `/usuarios/:id/change-password`
**Descrição:** Alterar senha (Admin ou o próprio).

### DELETE `/usuarios/:id`
**Descrição:** Deletar usuário (Admin).

### PUT `/usuarios/:id/reactivate`
**Descrição:** Reativar usuário (Admin).

---

## 👥 Funcionários

### GET `/funcionario`
### GET `/funcionario/:id`
### POST `/funcionario` (Admin/Gerente)
### PUT `/funcionario/:id` (Admin/Gerente)
### DELETE `/funcionario/:id` (Admin/Gerente)

**Campos:** nome, cpf, cargo, email, jornadaInicio, jornadaFim

**Testando com curl (criação):**
```bash
curl -X POST http://localhost:3000/funcionario \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "cpf": "12345678900",
    "cargo": "Vendedor",
    "email": "joao@empresa.com",
    "jornadaInicio": "08:00",
    "jornadaFim": "17:00"
  }'
```

---

## 👔 Clientes

### GET `/clientes`
### GET `/cliente/:id`
### POST `/cliente/register` (Admin/Gerente)
### PUT `/clientes/:id` (Admin/Gerente)
### DELETE `/cliente/:id` (Admin/Gerente)

---

## 📦 Produtos

### GET `/produto`
### GET `/produto/:id`
### POST `/produto`
### PUT `/produto/:id`
### DELETE `/produto/:id`

---

## 📁 Categorias

### GET `/categoria`
### GET `/categoria/:id`
### POST `/categoria` (Admin/Gerente)
### PUT `/categoria/:id` (Admin/Gerente)
### DELETE `/categoria/:id` (Admin/Gerente)

---

## 📋 Pedidos

### GET `/pedido`
### GET `/pedido/:id`
### POST `/pedido`
### PUT `/pedido/:id/status`
### DELETE `/pedido/:id` (Admin/Gerente)

---

## ⏱️ Pontos

### GET `/funcionario/ponto/:funcionarioId`
### POST `/funcionario/ponto`
### DELETE `/funcionario/ponto/:id` (Admin/Gerente)

---

## 📌 Observações

- ✅ Todos os endpoints que modificam dados exigem **autenticação via JWT**.
- 🔐 Perfis de acesso: `ADMIN`, `GERENTE`, `USUARIO`.
- 🧪 Utilize ferramentas como **Postman**, **Insomnia** ou o terminal com `curl` para testar.
- 📄 A documentação está sempre em evolução.

---

## 🚀 Tecnologias

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Auth
- cors
- zod
- bcryptjs

---

Caso precise de ajuda com deploy, autenticação, permissões ou integração com front-end, conte comigo! 🚀


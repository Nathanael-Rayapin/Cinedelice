import assert from "node:assert";
import { describe, it } from "node:test";
import { prisma } from "../models/index.ts";
import http from "http";
import axios from "axios";
import { app } from "../app.ts"; 

// ==============================
// TESTS POUR LE CONTROLLER USERS
// ==============================

describe("[POST] /users", () => {

  // === Test 1 : création valide ===
  it("should save the user in the database with its password hashed", async () => {
    const server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(4000, resolve));

    const USER = {
      username: "lucky_" + Date.now(),
      email: "luc_" + Date.now() + "@test.com",
      password: "Password123!",
      cgu_accepted: true,
      age_declaration: true
    };

    const response = await axios.post("http://localhost:4000/api/users", USER);

    const savedUser = await prisma.user.findUnique({
      where: { email: USER.email }
    });

    assert.ok(savedUser);
    assert.equal(savedUser?.username, USER.username);
    assert.match(savedUser?.password, /argon2id/);
    assert.equal(response.status, 201);

    await prisma.user.delete({ where: { email: USER.email } });
    server.close();
  });

  // === Test 2 : refus si age_declaration = false ===
  it("should NOT save the user if age declaration is false", async () => {
    const server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(4001, resolve));

    const USER = {
      username: "lucky_" + Date.now(),
      email: "luc_" + Date.now() + "@test.com",
      password: "Password123!",
      cgu_accepted: true,
      age_declaration: false
    };

    let statusCode = null;

    try {
      await axios.post("http://localhost:4001/api/users", USER);
    } catch (error: any) {
      statusCode = error.response?.status;
    }

    assert.equal(statusCode, 400, "Tous les champs obligatoires doivent être respectés");

    const savedUser = await prisma.user.findUnique({
      where: { email: USER.email }
    });

    assert.equal(savedUser, null, "Aucun utilisateur ne doit être créé");

    server.close();
  });
});

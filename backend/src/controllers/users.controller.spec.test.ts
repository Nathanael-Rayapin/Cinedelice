import assert from "node:assert";
import { describe, it } from "node:test";
import { prisma } from "../../src/models/index.ts";
import http from "http";
import axios from "axios";
import { app } from "../app.ts"; // <-- important : importer ton serveur Express

// Creation d'un user validé
describe("[POST] /users", () => {

  it("should save the user in the database with its password hashed", async () => {
    // ARRANGE préparation
    // On creer le server test
    const server = http.createServer(app);
    // On démarre un serveur Express juste pour ce test
    await new Promise<void>((resolve) => server.listen(4000, resolve));
    // On crée un utilisateur AVEC des valeurs uniques 
    // pour éviter les doublons en BDD
    const USER = {
      username: "lucky_" + Date.now(),// unique
      email: "luc_" + Date.now() + "@test.com", // unique
      password: "Password123!",
      cgu_accepted: true,
      age_declaration: true
    };

    // ACT agir
    const response = await axios.post("http://localhost:4000/api/users", USER);

    // ASSERT vérification
    // On récupère l'utilisateur créé en base pour vérifier que le mot de passe a bien été hashé
    const savedUser = await prisma.user.findUnique({
      where: { email: USER.email }
    });
    // Vérifie qu'un id existe (l'enregistrement a bien été créé)
    assert.ok(savedUser);
    // Vérifie que le username, mdp en hashé est en base correspond à celui envoyé
    assert.equal(savedUser?.username, USER.username);
    assert.match(savedUser?.password, /argon2id/);  // hash ok
    assert.equal(response.status, 201); // statut 201 Created

    // CLEANUP
    await prisma.user.delete({ where: { email: USER.email } });
    server.close();
  });
});
// Creation d'un user sans declaration d'age
it("shouldn't save the user in the database with its password hashed if age declaration is false", async () => {
  // ARRANGE préparation
  // On creer le server test
  const server = http.createServer(app);
  // On démarre un serveur Express juste pour ce test
  await new Promise<void>((resolve) => server.listen(4001, resolve));
  // On crée un utilisateur AVEC des valeurs uniques 
  // pour éviter les doublons en BDD
  const USER = {
    username: "lucky_" + Date.now(),// unique
    email: "luc_" + Date.now() + "@test.com", // unique
    password: "Password123!",
    cgu_accepted: true,
    age_declaration: false
  };
  let statusCode = null;

  // ACT agir
  try{
    await axios.post("http://localhost:4001/api/users", USER);
  } catch (error: any) {
    statusCode = error.response?.status; // axios renvoie l’erreur ici
  }
  // ASSERT vérification
  assert.equal(statusCode, 400,"Tous champs sont obligatoires"); // statut 400 Bad Request

  // Vérifier que l'user n’a PAS été créé
  const savedUser = await prisma.user.findUnique({
    where: { email: USER.email }
  });

  assert.equal(savedUser, null, "Aucun utilisateur ne doit être créé");
  server.close();
});
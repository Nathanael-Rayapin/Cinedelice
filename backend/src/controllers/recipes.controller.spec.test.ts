import assert from "node:assert";
import { describe, it } from "node:test";
import http from "http";
import axios from "axios";
import { prisma } from "../../src/models/index.ts";
import { app } from "../app.ts";

describe("[GET] /recipes - Filter by category", () => {

  it("should return only recipes from the requested category", async () => {
    const server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(4002, resolve));

    try {
      const user = await prisma.user.create({
        data: {
          username: "test_user_" + Date.now(),
          email: "test_user_" + Date.now() + "@test.com",
          password: "fakePass",
          role: "user",
          cgu_accepted: true,
          age_declaration: true,
        },
      });

      const categoryA = await prisma.category.create({
        data: { name: "Action" + Date.now() },
      });

      const categoryB = await prisma.category.create({
        data: { name: "Drame" + Date.now() },
      });

      const movie = await prisma.movie.create({
        data: {
          title: "Film test " + Date.now(),
          id_movie_tmdb: 999999,
          image: "/poster.jpg",
          director: "Test Director",
          release_year: "2020-01-01",
          synopsis: "synopsis",
        },
      });

      // Recette dans catégorie A
      await prisma.recipe.create({
        data: {
          title: "Recette1",
          image: "img.jpg",
          description: "desc A",
          ingredients: "ing1\ning2",
          preparation_steps: "step1\nstep2",
          number_of_person: 2,
          preparation_time: 10,
          status: "published",
          category_id: categoryA.id,
          movie_id: movie.id,
          user_id: user.id,
        },
      });

      // Recette dans catégorie B
      await prisma.recipe.create({
        data: {
          title: "Recette2",
          image: "img.jpg",
          description: "desc B",
          ingredients: "ing1\ning2",
          preparation_steps: "step1\nstep2",
          number_of_person: 2,
          preparation_time: 10,
          status: "published",
          category_id: categoryB.id,
          movie_id: movie.id,
          user_id: user.id,
        },
      });
      // Construire l'URL pour l'endpoint de l'API avec le nom de la catégorie encodé
      const url = `http://localhost:4002/api/recipes?categorie=${encodeURIComponent(categoryA.name)}`;
      // Envoyer une requête GET à l'endpoint de l'API
      const response = await axios.get(url);

      assert.equal(response.status, 200);
      // Vérifier que les données de la réponse sont un tableau
      assert.ok(Array.isArray(response.data));

      // Vérifier si les données de la réponse contiennent des enregistrements de la catégorie B
      const containsCatB = response.data.some(
        (r: any) => r.category.name === categoryB.name
      );
      // Vérifier si les données de la réponse contiennent des enregistrements de la catégorie B
      assert.equal(containsCatB, false);

      const containsCatA = response.data.some(
        (r: any) => r.category.name === categoryA.name
      );
      assert.equal(containsCatA, true);
    // Nettoyer la base de données après la test
    } finally {
      await prisma.recipe.deleteMany();
      await prisma.movie.deleteMany();
      await prisma.category.deleteMany();
      await prisma.user.deleteMany();

      server.close();
    }
  });
});

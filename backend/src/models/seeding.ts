import { prisma } from './index.ts';
// Pour hasher les mots de pass
//import * as argon2 from"argon2";


async function main() {
  console.log('🌱 Démarrage du seeding...');

  // ==== Création d'utilisateurs ====
  const user1 = await prisma.user.create({
    data: {
      username: 'luc',
      email: 'luc@example.com',
      password: 'password',
      age_declaration: true,
      cgu_accepted: true,
      role: 'user',
    },
  });

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password: 'password',
      //password: await argon2.hash('password'),
      age_declaration: true,
      cgu_accepted: true,
      role: 'admin',
    },
  });

  // ==== Création de catégories ====
  const category1 = await prisma.category.create({
    data: { name: 'Dessert' },
  });
  const category2 = await prisma.category.create({
    data: { name: 'Plat principal' },
  });


  // ==== Création de recettes ====
  await prisma.recipe.createMany({
    data: [
      {
        user_id: user1.id,
        category_id: category1.id,
        movie_id: 550,
        title: 'Tiramisu du Parrain',
        number_of_person: 4,
        preparation_time: 45,
        description: 'Un dessert culte inspiré du film Le Parrain 🍰',
        image: 'https://images.unsplash.com/photo-1497888329096-51c27beff665?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171',
        ingredients: '250g mascarpone; 3 œufs; 100g sucre; café; cacao',
        preparation_steps: 'Mélanger; Monter les blancs; Assembler; Réfrigérer',
        status: 'published',
      },
      {
        user_id: admin.id,
        category_id: category2.id,
        movie_id: 200,
        title: 'Spaghetti à la sauce Don Corleone',
        number_of_person: 2,
        preparation_time: 30,
        description: 'Recette inspirée d’une scène culte de la saga italienne 🍝',
        image: 'https://plus.unsplash.com/premium_photo-1674511582428-58ce834ce172?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
        ingredients: 'spaghetti; tomate; ail; basilic; huile d’olive',
        preparation_steps: 'Faire bouillir; Préparer la sauce; Mélanger',
        status: 'draft',
      },
    ],
  });

  console.log('✅ Données insérées avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

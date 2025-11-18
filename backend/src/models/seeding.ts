import { prisma } from './index.ts';
import * as argon2 from "argon2";
async function main() {
  console.log('🌱 Démarrage du seeding...');

  // Hash des mots de passe
  const userPassword = await argon2.hash("password");
  const adminPassword = await argon2.hash("password");

  // ==== Création d'utilisateurs ====
  const user1 = await prisma.user.create({
    data: {
      username: 'luc',
      email: 'luc@example.com',
      password: userPassword,// mot de passe hashé
      age_declaration: true,
      cgu_accepted: true,
      role: 'user',
    },
  });

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword, // mot de passe hashé
      age_declaration: true,
      cgu_accepted: true,
      role: 'admin',
    },
  });

  // ==== Création de films (Movie) ====
  await prisma.movie.createMany({
    data: [
      { id_movie_tmdb: 550, title: "Le Parrain",synopsis: "L’ascension d’une famille mafieuse dans l’Amérique des années 40.",
        image: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        release_year:"12.11.1977",director: "Francis Ford Coppola"
      },
      { id_movie_tmdb: 200, title: "Don Corleone",
        synopsis: "Un puissant chef de la mafia italienne impose son autorité tout en protégeant sa famille dans un monde de loyautés et de trahisons.", 
        image: "https://www.quick-toy.fr/img/p/071013_115143_8bd7nFnt_imagePrincipale.jpg",
        release_year:"12.12.1972",director: "Francis Ford Coppola"
      },
      { id_movie_tmdb: 13, title: "Ratatouille",
        synopsis: "Un rat passionné de cuisine tente de devenir chef à Paris.",
        image: "https://image.tmdb.org/t/p/w1280/iFcWBdTPeHQDS3OQxBcH3QaYXYv.jpg",
        release_year:"07.10.2007",director: "Brad Bird"
      },
      { id_movie_tmdb: 680, title: "Pulp Fiction",
        synopsis: "Des histoires entremêlées dans le Los Angeles des années 90.",
        image: "https://image.tmdb.org/t/p/w1280/4TBdF7nFw2aKNM0gPOlDNq3v3se.jpg",
        release_year:"03.18.1994",director: "Quentin Tarantino"
      },
      { id_movie_tmdb: 120, title: "Le Seigneur des Anneaux",
        synopsis: "La quête de l’Anneau unique pour sauver la Terre du Milieu.",
        
        image: "https://image.tmdb.org/t/p/w1280/5OPg6M0yHr21Ovs1fni2H1xpKuF.jpg",
        release_year:"06.22.2001",director: "Peter Jackson"
      },
      { id_movie_tmdb: 11, title: "Julie & Julia", 
        synopsis: "L’histoire croisée d’une jeune blogueuse qui se lance le défi de cuisiner toutes les recettes de Julia Child, et du parcours de la célèbre cheffe américaine.", 
        image: "https://image.tmdb.org/t/p/w1280/rtZquHKuEntFq3YTO3v4L5RtANw.jpg",
        release_year:"04.09.2009",director: "Nora Ephron"
      },
      { id_movie_tmdb: 194, title: "Amélie Poulain",
        synopsis: "À Montmartre, une jeune femme rêveuse décide de changer la vie des gens autour d’elle par de petits gestes poétiques.",
        image: "https://image.tmdb.org/t/p/w1280/tdXtLG6L1QMwrv0MNdW6B9IwC8B.jpg",
        release_year:"25.04.2001",director: "Jean Pierre Jeunet"
      },
      { id_movie_tmdb: 475557, title: "Parasite",
        synopsis: "Une satire sociale sur deux familles opposées.", 
        image: "https://image.tmdb.org/t/p/w1280/tzMIFRvXLdjSMJbm6lQohWQE49Q.jpg",
        release_year:"07.10.2014",director: "Bong Joon-ho"
      },
      { id_movie_tmdb: 245891, title: "John Wick",
        synopsis: "Un ancien tueur à gages reprend du service.", 
        image: "https://image.tmdb.org/t/p/w1280/n1YTIyhAqqqFyDGFTzV7WaU1JfK.jpg",
        release_year:"07.08.2014",director: "Chad Stahelski"
      },
      { id_movie_tmdb: 299536, title: "Avengers",
        synopsis: "Les super-héros s’unissent pour sauver la Terre.", 
        image: "https://image.tmdb.org/t/p/w1280/ylsAO88v2tF0iXRFojPa0UaAJf1.jpg",
        release_year:"09.11.2012",director: "Joss Whedon"
      },
      { id_movie_tmdb: 129, title: "Le Voyage de Chihiro",
        synopsis: "Une fillette se retrouve dans un monde magique.", 
        image: "https://image.tmdb.org/t/p/w1280/12TAqK0AUgdcYE9ZYZ9r7ASbH5Q.jpg",
        release_year:"25.01.2001",director: "Hayao Miyazaki"
      },
      { id_movie_tmdb: 49026, title: "Inglourious Basterds",
        synopsis: "Des soldats juifs américains traquent les nazis.", 
        image: "https://image.tmdb.org/t/p/w1280/lPKwFzX4TiWLA4Mo5Bnf8aIIrJm.jpg",
        release_year:"14.01.2009",director: "Quentin Tarantino"
      },
      { id_movie_tmdb: 157336, title: "Interstellar", 
        synopsis: "Un groupe d’explorateurs traverse un trou de ver pour trouver une nouvelle planète habitable et sauver l’humanité.", 
        image: "https://image.tmdb.org/t/p/w1280/1pnigkWWy8W032o9TKDneBa3eVK.jpg",
        release_year:"05.11.2014",director: "Christopher Nolan"
      },
      { id_movie_tmdb: 767, title: "Harry Potter",
        synopsis: "Un jeune sorcier découvre ses pouvoirs.", 
        image: "https://image.tmdb.org/t/p/w1280/fbxQ44VRdM2PVzHSNajUseUteem.jpg",
        release_year:"05.11.2001",director: "Chris Columbus"
      },
    ],
  });

  // ==== Création de catégories ====
  const category1 = await prisma.category.create({
    data: { name: 'Dessert' },
  });
  const category2 = await prisma.category.create({
    data: { name: 'Plat principal' },
  });
  const category3 = await prisma.category.create({
    data: { name: 'Entrée' },
  });
  const category4 = await prisma.category.create({
    data: { name: 'Autres' },
  });


  // ==== Création de recettes ====
  await prisma.recipe.createMany({
    data: [
      {
        user_id: user1.id,
        category_id: category1.id,
        movie_id: 1,
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
        movie_id: 2,
        title: 'Spaghetti à la sauce Don Corleone',
        number_of_person: 2,
        preparation_time: 30,
        description: 'Recette inspirée d’une scène culte de la saga italienne 🍝',
        image: 'https://plus.unsplash.com/premium_photo-1674511582428-58ce834ce172?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
        ingredients: 'spaghetti; tomate; ail; basilic; huile d’olive',
        preparation_steps: 'Faire bouillir; Préparer la sauce; Mélanger',
        status: 'draft',
      },
      {
        user_id: user1.id,
        category_id: category1.id,
        movie_id: 3,
        title: 'Ratatouille de Rémy',
        number_of_person: 4,
        preparation_time: 90,
        description: 'Le confit byaldi qui a ému Anton Ego dans Ratatouille 🐀',
        image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
        ingredients: 'aubergine; courgette; tomate; poivron rouge; poivron jaune; ail; thym; huile d\'olive; concentré de tomate',
        preparation_steps: 'Préparer la piperade; Couper les légumes en fines rondelles; Disposer en spirale dans le plat; Arroser d\'huile d\'olive; Cuire au four 45min à 135°C; Servir avec réduction de poivron',
        status: 'published',
      },
      {
        user_id: admin.id,
        category_id: category2.id,
        movie_id: 4,
        title: 'Big Kahuna Burger',
        number_of_person: 4,
        preparation_time: 30,
        description: 'Le burger mythique de Pulp Fiction que mange Jules 🍔',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
        ingredients: '4 pains burger; 600g bœuf haché; cheddar; laitue; tomate; oignon; cornichons; ketchup; sauce spéciale',
        preparation_steps: 'Former les steaks; Assaisonner généreusement; Cuire 4min de chaque côté; Faire fondre le cheddar; Toaster les pains; Assembler avec tous les ingrédients',
        status: 'published',
      },
      {
        user_id: user1.id,
        category_id: category3.id,
        movie_id: 5,
        title: 'Lembas Elfique',
        number_of_person: 8,
        preparation_time: 40,
        description: 'Le pain de route des Elfes dans Le Seigneur des Anneaux 🧝',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
        ingredients: '250g farine; 125g beurre; 100g miel; 50g amandes en poudre; cannelle; cardamome; zeste d\'orange',
        preparation_steps: 'Mélanger la farine et les épices; Incorporer le beurre; Ajouter miel et amandes; Former des galettes fines; Cuire 15min à 180°C; Envelopper dans des feuilles',
        status: 'published',
      },
      {
        user_id: admin.id,
        category_id: category2.id,
        movie_id: 6,
        title: 'Bœuf Bourguignon de Julie',
        number_of_person: 6,
        preparation_time: 180,
        description: 'Le plat signature de Julie & Julia 🍷',
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
        ingredients: '1.5kg bœuf à braiser; 200g lardons; 300g oignons grelots; 300g champignons; 75cl vin rouge; bouquet garni; farine; beurre; cognac',
        preparation_steps: 'Faire mariner la viande 12h; Faire revenir les lardons; Dorer la viande; Flamber au cognac; Ajouter le vin; Mijoter 3h à feu doux; Ajouter légumes 30min avant la fin',
        status: 'published',
      },
      {
        user_id: user1.id,
        category_id: category1.id,
        movie_id: 7,
        title: 'Tarte aux Pommes d\'Amélie',
        number_of_person: 6,
        preparation_time: 50,
        description: 'La tarte que casse Amélie Poulain avec une cuillère 🥄',
        image: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
        ingredients: 'pâte brisée; 6 pommes; 100g sucre; 50g beurre; cannelle; sucre vanillé; confiture d\'abricot',
        preparation_steps: 'Étaler la pâte; Disposer les pommes en rosace; Parsemer de noisettes de beurre; Saupoudrer de sucre et cannelle; Cuire 35min à 200°C; Glacer à l\'abricot',
        status: 'published',
      },
      {
        user_id: admin.id,
        category_id: category4.id,
        movie_id: 8,
        title: 'Chapaguri de Parasite',
        number_of_person: 4,
        preparation_time: 15,
        description: 'Le Ram-don avec bœuf Hanwoo du film Parasite 🍜',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
        ingredients: 'nouilles Chapagetti; nouilles Neoguri; 300g bœuf de qualité; oignon vert; sauce soja; huile de sésame; ail',
        preparation_steps: 'Cuire les deux types de nouilles ensemble; Égoutter en gardant un peu d\'eau; Mélanger les sachets d\'assaisonnement; Poêler le bœuf; Mélanger nouilles et sauce; Garnir avec le bœuf',
        status: 'published',
      },
      {
        user_id: user1.id,
        category_id: category1.id,
        movie_id: 9,
        title: 'Beignets de John Wick',
        number_of_person: 12,
        preparation_time: 60,
        description: 'Les donuts que John Wick mange au Continental 🍩',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
        ingredients: '500g farine; 80g sucre; 2 œufs; 250ml lait; 50g beurre; levure; vanille; huile de friture; glaçage chocolat; vermicelles colorés',
        preparation_steps: 'Préparer la pâte levée; Laisser lever 1h; Étaler et découper des anneaux; Laisser reposer 15min; Frire 2min de chaque côté; Glacer et décorer',
        status: 'draft',
      },
      {
        user_id: admin.id,
        category_id: category2.id,
        movie_id: 10,
        title: 'Shawarma des Avengers',
        number_of_person: 4,
        preparation_time: 45,
        description: 'Le kebab de la scène post-générique d\'Avengers 🌯',
        image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
        ingredients: '600g poulet; 4 pains pita; tomate; concombre; oignon; sauce tahini; sauce piquante; épices shawarma; citron',
        preparation_steps: 'Mariner le poulet aux épices 2h; Griller ou rôtir le poulet; Émincer finement; Réchauffer les pitas; Garnir de viande et légumes; Arroser de sauces',
        status: 'published',
      },
      {
        user_id: user1.id,
        category_id: category1.id,
        movie_id: 11,
        title: 'Gâteau du Voyage de Chihiro',
        number_of_person: 8,
        preparation_time: 35,
        description: 'Le mystérieux gâteau que mange Chihiro 🍰',
        image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
        ingredients: '4 œufs; 120g sucre; 120g farine; beurre; crème fouettée; fraises; glaçage blanc',
        preparation_steps: 'Battre œufs et sucre; Incorporer la farine tamisée; Cuire 25min à 180°C; Laisser refroidir; Garnir de crème fouettée; Décorer de fraises et glaçage',
        status: 'published',
      },
      {
        user_id: admin.id,
        category_id: category2.id,
        movie_id: 12,
        title: 'Strudel d\'Inglourious Basterds',
        number_of_person: 6,
        preparation_time: 70,
        description: 'Le strudel de la scène tendue au café 🥐',
        image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
        ingredients: 'pâte feuilletée; 800g pommes; 100g sucre; cannelle; raisins secs; chapelure; beurre fondu; crème fraîche',
        preparation_steps: 'Éplucher et émincer les pommes; Mélanger avec sucre et cannelle; Étaler la pâte; Parsemer de chapelure; Disposer les pommes; Rouler le strudel; Badigeonner de beurre; Cuire 45min à 180°C',
        status: 'published',
      },
      {
        user_id: user1.id,
        category_id: category2.id,
        movie_id: 13,
        title: 'Soupe de Paddington',
        number_of_person: 4,
        preparation_time: 40,
        description: 'La soupe à l\'orange préparée par Paddington 🐻',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
        ingredients: 'carottes; patate douce; oignon; ail; gingembre; jus et zeste d\'orange; bouillon de légumes; crème',
        preparation_steps: 'Faire revenir oignon et ail; Ajouter carottes et patate douce; Verser le bouillon; Ajouter zeste et jus d\'orange; Mijoter 25min; Mixer; Ajouter la crème',
        status: 'published',
      },
      {
        user_id: admin.id,
        category_id: category1.id,
        movie_id: 14,
        title: 'Gâteau de Harry Potter',
        number_of_person: 10,
        preparation_time: 55,
        description: 'Le gâteau d\'anniversaire rose et vert d\'Harry 🎂',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
        ingredients: '300g farine; 250g sucre; 4 œufs; 250g beurre; levure; vanille; colorant rose; colorant vert; glaçage; chocolat pour écrire',
        preparation_steps: 'Préparer la génoise; Diviser la pâte en deux; Colorer une moitié en rose; Cuire séparément; Laisser refroidir; Glacer en vert et rose; Écrire "Happee Birthdae Harry"',
        status: 'published',
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

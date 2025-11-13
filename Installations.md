# Front
<!-- Dépendances -->
npm create vite@latest
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm install -D sass-embedded
npm install tailwindcss@latest @tailwindcss/vite@latest daisyui@latest
npm install react-icons --save
npm install react-hook-form
npm i react-router
npm i typewriter-effect

# Back
<!-- Dépendances -->
npm init -y
npm install express
npm install -D typescript
npm install prisma @prisma/client
npm install -D prisma
npm install argon2
npm i jsonwebtoken
npm install typescript ts-node @types/node --save-dev
npm i eslint
npm i --save-dev @types/express
npm i cors
npm i --save-dev @types/cors
npm i axios


# BDD
psql -U postgres
CREATE USER cinedelices WITH LOGIN PASSWORD 'cinedelices';
CREATE DATABASE cinedelices WITH OWNER cinedelices;
\c cinedelices cinedelices
ALTER USER cinedelices CREATEDB; Donner le droit de créer une base
npm run db:migrate:dev creation de des tables 

# Attention
Pas de git init dans les projets backend et frontend, on le fait à la racine des 2 projets. Pas de package.json non plus à la racine, on les met dans leur projets respectives.
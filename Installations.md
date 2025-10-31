# Front
<!-- Dépendances -->
npm create vite@latest
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm install -D sass-embedded
npm install tailwindcss@latest @tailwindcss/vite@latest daisyui@latest
npm install react-icons --save

# Back
<!-- Dépendances -->
npm init -y
npm install express
npm install -D typescript
npm install prisma @prisma/client
npm install -D prisma
npm install argon2
npm i jsonwebtoken

# Attention
Pas de git init dans les projets backend et frontend, on le fait à la racine des 2 projets. Pas de package.json non plus à la racine, on les met dans leur projets respectives.
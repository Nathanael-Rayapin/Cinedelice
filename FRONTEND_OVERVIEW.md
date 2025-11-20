**Vue d'ensemble du dossier frontend**

Structure principale
- `public/` : fichiers visibles directement par le navigateur, comme `index.html` (la page qui démarre l'app). On y met aussi favicon et fichiers statiques.

- `src/` : le code de l'application (React + TypeScript).

  - `src/main.tsx` : le démarrage de l'app. Il « colle » l'application React dans `index.html`.

  - `src/App.tsx` : le squelette qui dit quelles pages existent et quelle route (URL) montre quelle page.

  - `src/pages/` : dossier qui contient les pages complètes (chaque page est un dossier avec son `.tsx`). Exemples :
    - `Home/` : page d'accueil (liste de films et recettes par exemple).
    - `Recipes/` : page catalogue des recettes.
    - `Movie-Detail/` : page d'un film spécifique.

  - `src/components/` : petits morceaux réutilisables (boutons, cartes, header). Un composant peut être utilisé sur plusieurs pages. (voir détails de chaque composant plus bas).
    - Exemple : `Recipe-Card` (affiche une recette) est utilisé dans la page `Recipes` et aussi dans `Movie-Detail`.

  - `src/services/` : fonctions pour parler au backend (faire des requêtes). Elles utilisent `axios` et appellent des URL comme `/recipes` ou `/movies`.
    - Ex : `getRecipes()` demande la liste des recettes au backend.

  - `src/hooks/` : fonctions spéciales (hooks) qui contiennent de la logique que l'on réutilise. Exemple :
    - `useSearch` : charge films+recettes et filtre les résultats pour l'auto-complétion.
    - `usePagination` : découpe une grande liste en pages plus petites.
    (voir plus de détails sur les hooks plus bas).

  - `src/store/` : petit magasin d'état partagé où on garde des infos que plusieurs composants lisent (ex: « est-ce que le site est en train de charger ? »).

  - `src/utils/` : petites fonctions pratiques (format de date, notifications, etc.).

  - `src/interfaces/` : descriptions des objets (types). Par exemple, à quoi ressemble une recette : elle a un `id`, un `title`, une `image`, etc.

Comment ça fonctionne quand on clique sur une recette
- L'utilisateur clique sur une carte (Recipe-Card).
- Le navigateur va sur `/recettes/123` (par exemple).
- Le composant `Recipe-Detail` demande la recette au backend via `recipes.service.ts` (fonction `getOneRecipe(123)`).
- Quand la réponse arrive, la page affiche les détails.

Filtrer par catégorie (exemple concret déjà implémenté)
- Quand tu sélectionnes une catégorie dans la dropdown, l'application change l'URL en `/recettes?categorie=Dessert`.
- La page `Recipes` lit `?categorie` (avec `useLocation`) et appelle `getRecipes({ categorie: 'Dessert' })`.
- Le backend renvoie seulement les recettes qui ont `category.name = 'Dessert'`.

Pagination (pour ne pas tout afficher d'un coup)
- `usePagination` reçoit la liste complète et le nombre d'éléments par page (ex: 8).
- Il renvoie les recettes à afficher sur la page courante (`currentItems`) et des fonctions pour changer de page.
- `Pagination-Controls` affiche les numéros de page et les boutons suivant/précédent.

Styles et apparence
- Les styles sont écrits en `.scss` (Sass). Chaque composant peut avoir son propre fichier `.scss` pour définir sa couleur, marge, bordures, etc.

Comment démarrer le projet en local (très simple)
1. Ouvre un terminal dans le dossier `frontend`.
2. Tape `npm install` pour installer les dépendances (une seule fois).
3. Tape `npm run dev` pour lancer le serveur de développement.
4. Ouvre `http://localhost:5173` (ou l'url indiquée) dans ton navigateur.

Filer d'aide rapide (termes simples)
- Composant : petit morceau d'interface réutilisable (comme une brique LEGO).
- Page : assemblage de composants pour faire un écran complet.
- Service : fonction qui parle au backend (comme un facteur entre le frontend et la base de données).
- Hook : petit outil réutilisable pour la logique (ex: `useSearch`).

**Détails des composants (court et simple)**

Voici chaque composant important du dossier `src/components/` avec une phrase qui explique ce qu'il fait :

- `Navbar` : la barre en haut de la page. Contient le logo, la recherche, la dropdown des catégories et les liens vers les pages.
- `Search` : la petite barre de recherche (auto-complétion). Affiche des suggestions pendant que tu tapes.
- `Categories-Dropdown` : le menu qui montre les catégories (Dessert, Entrée...). Permet de choisir une catégorie.
- `Recipe-Card` : une carte qui affiche une recette (image, titre, auteur). Utilisée dans les listes de recettes.
- `Recipe-Cover` : un composant qui montre la couverture d'une recette (image + actions rapides).
- `Movie-Card` : une carte pour afficher un film (image, titre). Utilisée sur la page d'accueil ou liste de films.
- `Pagination-Controls` : affiche les numéros de page et boutons suivant/précédent pour naviguer dans une longue liste.
- `Profile-Dropdown` : menu pour l'utilisateur connecté (profil, déconnexion, etc.).
- `Burger-Menu-Dropdown` : menu hamburger pour l'affichage mobile (ouvre le menu principal).
- `Footer` : le pied de page qui apparaît en bas du site.
- `Layout` : un composant qui enveloppe les pages et place le `Navbar` et le `Footer` au bon endroit.
- `Modal` : une fenêtre qui s'affiche par-dessus la page (pop-up) pour montrer des informations ou formulaires.
- `Loading` : petit composant qui affiche un cercle/animation quand la page charge.
- `ProtectedRoute` : petit garde qui empêche l'accès aux pages réservées si l'utilisateur n'est pas connecté.
- `Custom-Error` : affiche un message d'erreur joliment formaté.
- `TextAreaField` : composant de champ texte (zone de saisie) pour les formulaires.
- `Tab-Bar` : barre d'onglets pour naviguer entre vues proches.

Chaque composant a normalement :
- un fichier `.tsx` (le code),
- parfois un fichier `.scss` (les styles),
- parfois des tests `.test.tsx` pour vérifier qu'il fonctionne.

**Détails des hooks (court et simple)**

Les hooks sont dans `src/hooks/`. Voici ceux présents et ce qu'ils font :

- `useSearch` :
  - Charge la liste des recettes et des films au démarrage.
  - Filtre (cherche) les titres qui correspondent à ce que tu tapes et renvoie les suggestions.

- `usePagination` :
  - Prend une liste complète et un nombre par page (ex : 8) et calcule quelles items afficher pour la page courante.
  - Donne aussi les numéros de page et les fonctions pour changer de page.

- `usePageMeta` :
  - Sert à changer le titre de la page et les meta-tags (description) quand on visite une page. Utile pour le SEO et pour que l'onglet du navigateur montre le bon titre.

Chaque hook est une petite « boîte » de logique réutilisable : on appelle le hook dans un composant et il rend la vie plus simple.

---



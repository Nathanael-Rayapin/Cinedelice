import burger1 from '../../assets/images/burger1.jpg';

import chocolats from "../../assets/images/chocolats.jpg";
import ramen from "../../assets/images/ramen.jpg";
import applePie from "../../assets/images/apple_pie.webp";
import bieraubeurre from "../../assets/images/bieraubeurre.jpg";
import carbonade from "../../assets/images/carbonade.webp";
import kahunaBurger from "../../assets/images/kahuna_burger.jpg";
import soupeAuxChoux from "../../assets/images/soupe_aux_choux.webp";
import spaghetti from "../../assets/images/spaghetti_bolognaise.webp";
import ratatouille from "../../assets/images/ratatouille_plat.jpg";

import ratatouilleFilm from "../../assets/images/ratatouille_film.jpg";
import charlieEtLaChocolaterie from "../../assets/images/charlie-et-la-chocolaterie.jpg";
import pulpFiction from "../../assets/images/pulp_fiction.jpg";
import leParrain from "../../assets/images/le_parrain.jpg";
import americanPie from "../../assets/images/american_pie.jpg";
import bienvenueChezLesChtis from "../../assets/images/bienvenue_chez_les_chtis.jpg";
import harryPotter from "../../assets/images/harry_potter.jpg";
import kungFuPanda from "../../assets/images/Kung_fu_panda.webp";
import laSoupeAuxChouxFilm from "../../assets/images/soupe_aux_choux_film.webp";

export const coverRecipe = burger1;

export const recipes = [
    { 
        id: 1, 
        img: chocolats, 
        title: "Chocolats", 
        duration: "45 min", 
        author: "Luc", 
        likes: 1647, 
        comment: 45, 
        badge: "dessert",
        movieId: 2 // Charlie et la chocolaterie
    },
    { 
        id: 2, 
        img: ramen, 
        title: "Ramen", 
        duration: "45 min", 
        author: "Rachel", 
        likes: 2453, 
        comment: 45, 
        badge: "plat",
        movieId: 8 // Kung Fu Panda
    },
    { 
        id: 3, 
        img: applePie, 
        title: "Apple Pie", 
        duration: "45 min", 
        author: "Marie", 
        likes: 1823, 
        comment: 45, 
        badge: "dessert",
        movieId: 5 // American Pie
    },
    { 
        id: 4, 
        img: bieraubeurre, 
        title: "Bière au beurre", 
        duration: "45 min", 
        author: "Harry", 
        likes: 3102, 
        comment: 45, 
        badge: "boisson",
        movieId: 7 // Harry Potter
    },
    { 
        id: 5, 
        img: carbonade, 
        title: "Carbonade", 
        duration: "45 min", 
        author: "Pierre", 
        likes: 1456, 
        comment: 45, 
        badge: "plat",
        movieId: 6 // Bienvenue chez les Ch’tis
    },
    { 
        id: 6, 
        img: kahunaBurger, 
        title: "Kahuna Burger", 
        duration: "45 min", 
        author: "Vincent", 
        likes: 2789, 
        comment: 45, 
        badge: "plat",
        movieId: 3 // Pulp Fiction
    },
    { 
        id: 7, 
        img: soupeAuxChoux, 
        title: "Soupe aux choux", 
        duration: "45 min", 
        author: "Claude", 
        likes: 987, 
        comment: 45, 
        badge: "plat",
        movieId: 9 // La soupe aux choux
    },
    { 
        id: 8, 
        img: spaghetti, 
        title: "Spaghetti Bolognaise", 
        duration: "45 min", 
        author: "Luigi", 
        likes: 4521, 
        comment: 45, 
        badge: "plat",
        movieId: 4 // Le Parrain
    },
    { 
        id: 1, 
        img: ratatouille, 
        title: "Ratatouille", 
        duration: "35 min", 
        author: "Michel", 
        likes: 2145, 
        comment: 53, 
        badge: "plat",
        movieId: 1 // Ratatouille
    }
];

export const movies = [
    { 
        id: 1, 
        id_movie_tmdb: 1,
        image: ratatouilleFilm, 
        title: "Ratatouille", 
        release_year: "2007",
        director: "Brad Pitt",
        synopsis: "Un jeune rat de cuisine rêve de devenir un grand chef français et s'associe à un plongeur pour réaliser son rêve, malgré les obstacles.", 
        id_movie_tmdb: 0,
        release_year: "2007", 
        director: "Brad Bird", 
    },
    { 
        id: 2, 
        id_movie_tmdb: 2,
        image: charlieEtLaChocolaterie, 
        title: "Charlie et la chocolaterie", 
        release_year: "2004",
        director: "Jason Reitman",
        synopsis: "Le jeune Charlie Bucket gagne une visite de la plus incroyable et mystérieuse usine de chocolat du monde, dirigée par l'excentrique Willy Wonka.",
        id_movie_tmdb: 0,
        release_year: "2005",
        director: "Tim Burton",
    },
    { 
        id: 3, 
        id_movie_tmdb: 3,
        image: pulpFiction, 
        title: "Pulp Fiction",
        release_year: "1994",
        director: "Quentin Tarantino",
        synopsis: "L'odyssée sanglante et burlesque de petits malfrats dans la jungle de Hollywood à travers trois histoires qui s'entremêlent. Dans un restaurant, un couple de jeunes braqueurs, Pumpkin et Yolanda, discutent des risques que comporte leur activité.",
        id_movie_tmdb: 0,
        release_year: "1994",
        director: "Quentin Tarantino",
    },
    { 
        id: 4, 
        id_movie_tmdb: 4,
        image: leParrain, 
        title: "Le Parrain", 
        release_year: "2012",
        director: "Emir Kusturica",
        synopsis: "Le patriarche vieillissant d'une dynastie mafieuse transfère le contrôle de son empire clandestin à son fils réticent.",
        id_movie_tmdb: 0,
        release_year: "1972",
        director: "Francis Ford Coppola",
    },
    { 
        id: 5, 
        id_movie_tmdb: 5,
        image: americanPie, 
        title: "American Pie", 
        release_year: "2001",
        director: "Alejandro González Iñárritu",
        synopsis: "Quatre lycéens tentent de perdre leur virginité avant d'obtenir leur diplôme. Leurs tentatives ratées mènent à des situations hilarantes.",
        id_movie_tmdb: 0,
        release_year: "1999",
        director: "Paul Weitz",
    },
    { 
        id: 6, 
        id_movie_tmdb: 6,
        image: bienvenueChezLesChtis, 
        title: "Bienvenue chez les Ch'tis",
        release_year: "2000",
        director: "John Goodman",
        synopsis: "Un directeur de la poste muté dans le Nord de la France redécouvre la chaleur humaine et l'amitié qu'il pensait avoir perdues.",
        id_movie_tmdb: 0,
        release_year: "2008",
        director: "Dany Boon",
    },
    { 
        id: 7, 
        id_movie_tmdb: 7,
        image: harryPotter, 
        title: "Harry Potter", 
        release_year: "2001",
        director: "David Yates",
        synopsis: "Un jeune orphelin découvre qu'il est un sorcier et est invité à étudier dans une école de magie où il se fait des amis et découvre son destin.",
        id_movie_tmdb: 0,
        release_year: "2001",
        director: "Chris Columbus",
    },
    { 
        id: 8, 
        id_movie_tmdb: 8,
        image: kungFuPanda, 
        title: "Kung Fu Panda", 
        release_year: "2008",
        director: "Alejandro G. Iñárritu",
        synopsis: "Un panda maladroit et paresseux est désigné de manière inattendue pour devenir le Guerrier Dragon, et doit apprendre à embrasser sa nature pour sauver la Vallée de la Paix.",
        id_movie_tmdb: 0,
        release_year: "2008",
        director: "Mark Osborne",
    },
    { 
        id: 9, 
        id_movie_tmdb: 9,
        image: laSoupeAuxChouxFilm, 
        title: "La Soupe aux choux", 
        release_year: "2012",
        director: "Xavier Beauvois",
        synopsis: "Deux paysans âgés et originaux voient leur vie bouleversée par l'arrivée d'un extraterrestre qui raffole de la soupe aux choux.",
        id_movie_tmdb: 0,
        release_year: "1981",
        director: "Jean Girault",
    }
];

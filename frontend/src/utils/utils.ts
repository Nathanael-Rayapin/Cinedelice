// 💡 Explication de la condition ci-dessous :
// location === `/${tab.toLowerCase().replace(' ', '-')}` ? 'active' : ''
// ----------------------------------------------------------
// En gros on veut comparer l'URL actuelle avec les string fournis en props => ["Pour vous", "Tendances", "Favoris"]
// Et pour faire ça il faut que les éléments du tableau soit formater de la manière suivante :
// - `tab.toLowerCase()` met le nom en minuscules → "Pour vous" devient "pour vous"
// - `.replace(' ', '-')` remplace les espaces par des tirets → "pour vous" devient "pour-vous"
// - On ajoute "/" devant pour former un chemin → "/pour-vous"
// - Si l’URL actuelle (ex: "/pour-vous") correspond à ce nom, on applique la classe "active"
// - Sinon, on ne met aucune classe ('')
// 👉 En clair : si on est sur la page de l’onglet, le bouton devient visuellement "actif"
export function formatTabPath(tab: string): string {
    return `/${tab.toLowerCase().replace(' ', '-')}`;
}
export const pseudoPattern = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/i;
export const emailPattern = /^.+@.+$/i;
export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/;

export function formatTabPath(tab: string, basePath?: string): string {
  // Nettoie et formate le nom du tab
  const cleanTab = tab.toLowerCase().replace(/\s+/g, '-');

  // Si le chemin commence déjà par "/" c'est un chemin absolu => on ne concatène pas basePath
  if (cleanTab.startsWith('/')) {
    return cleanTab;
  }

  // Si un basePath est fourni, concatène proprement
  if (basePath) {
    return `${basePath.replace(/\/$/, '')}/${cleanTab}`;
  }

  // Par défaut
  return `/${cleanTab}`;
}

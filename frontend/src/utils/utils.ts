export const pseudoPattern = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/i;
export const emailPattern = /^.+@.+$/i;
export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/;

export function formatTabPath(tab: string, basePath?: string): string {
  // Nettoie et formate le nom du tab
  const cleanTab = tab.toLowerCase().replace(/\s+/g, '-');

  // Si un chemin de base est fourni, on le garde
  if (basePath) {
    return `${basePath}/${cleanTab}`;
  }

  // Par défaut, on utilise simplement /{tab}
  return `/${cleanTab}`;
}

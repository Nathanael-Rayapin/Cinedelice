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

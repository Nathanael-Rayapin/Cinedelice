/**
 * Transforme "" => undefined  
 * Car FormData envoie "" quand un champ est vide.
 */
export const emptyToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }
  return value;
};

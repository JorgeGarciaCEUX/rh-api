export const trimExtraSpaces = (input: string): string => {
  return input
    .trim() // Elimina espacios al principio y al final
    .replace(/\s+/g, " "); // Reemplaza múltiples espacios por un solo espacio
};

export const upperTrimExtraSpaces = (input: string): string => {
  return input
    .toUpperCase()
    .trim() // Elimina espacios al principio y al final
    .replace(/\s+/g, " "); // Reemplaza múltiples espacios por un solo espacio
};

// src/utils/common.js

export const toTitleCaseSafeES = (str) => {
 if (!str) return "";

  // Normalizar el string para manejar correctamente tildes y Ñ
  const normalized = str.normalize("NFC").toLowerCase();

  // Separar en palabras y capitalizar la primera letra
  const words = normalized.split(/\s+/);

  const titleCased = words.map((word) => {
    if (!word) return "";

    const firstChar = word[0].toLocaleUpperCase("es"); // Primera letra en mayúscula
    const rest = word.slice(1).toLocaleLowerCase("es"); // Resto en minúscula, incluyendo tildes

    return firstChar + rest;
  });

  return titleCased.join(" ");
};
import { TOKEN_COLORS } from 'const/consts';

export const getRandomTokenColor = (usedColors: string[]) => {
  const availableColors = TOKEN_COLORS.filter(
    (color) => !usedColors.includes(color),
  );
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  return availableColors[randomIndex];
};

import shuffle from 'lodash.shuffle';

const NUMERO_DE_CARTAS = 12;
const CartaImages = [
  "/1-1.png", "/1-2.png",
  "/2-1.png", "/2-2.png",
  "/3-1.png", "/3-2.png",
  "/4-1.png", "/4-2.png",
  "/5-1.png", "/5-2.png",
  "/6-1.png", "/6-2.png"
];

export default () => {
  const cartas = [];

  // Crear las cartas emparejadas según el índice de las imágenes
  for (let i = 0; i < NUMERO_DE_CARTAS / 2; i++) {
    const carta = {
      icono: CartaImages[i * 2],
      fueAdivinada: false
    };
    const cartaPar = {
      icono: CartaImages[i * 2 + 1],
      fueAdivinada: false
    };

    cartas.push(carta, cartaPar);
  }

  return shuffle(cartas);
};

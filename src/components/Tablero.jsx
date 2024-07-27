import React, { useEffect } from 'react';
import Carta from './Carta';

export default function Tablero({ baraja, parejaSeleccionada, seleccionarCarta, setParejaSeleccionada }) {
  useEffect(() => {
    if (parejaSeleccionada.length === 2) {
      const [carta1, carta2] = parejaSeleccionada;
      if (carta1.icono === carta2.icono) {
        // Marcar las cartas como adivinadas y resetear selección
        carta1.fueAdivinada = true;
        carta2.fueAdivinada = true;
      }
      setTimeout(() => {
        setParejaSeleccionada([]); // Resetear selección
      }, 1000);
    }
  }, [parejaSeleccionada, setParejaSeleccionada]);

  return (
    <div className="tablero">
      {baraja.map((carta, index) => (
        <Carta
          key={index}
          icono={carta.icono}
          estaSiendoComparada={parejaSeleccionada.includes(carta)}
          seleccionarCarta={() => seleccionarCarta(carta)}
          fueAdivinada={carta.fueAdivinada}
        />
      ))}
    </div>
  );
}

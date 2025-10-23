/* eslint-disable react/prop-types */
import { useEffect } from "react";
import Carta from "./Carta";

export default function Tablero({
  baraja,
  parejaSeleccionada,
  seleccionarCarta,
  setParejaSeleccionada,
}) {
  useEffect(() => {
    if (parejaSeleccionada.length === 2) {
      const [carta1, carta2] = parejaSeleccionada;
      if (carta1.icono === carta2.icono) {
        carta1.fueAdivinada = true;
        carta2.fueAdivinada = true;
      }
      setTimeout(() => setParejaSeleccionada([]), 1000);
    }
  }, [parejaSeleccionada, setParejaSeleccionada]);

  return (
    <div className="board">            {/* <- panel detrás del grid (opcional) */}
      <div className="tablero">        {/* <- grid 3x4 */}
        {baraja.map((carta, i) => (
          <Carta
            key={i}
            icono={carta.icono}
            estaSiendoComparada={parejaSeleccionada.includes(carta)}
            fueAdivinada={carta.fueAdivinada}
            onPick={() => seleccionarCarta(carta)}   
          />
        ))}
      </div>
    </div>
  );
}

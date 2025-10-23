import ReactCardFlip from "react-card-flip";

export default function Carta({
  onPick,
  estaSiendoComparada,
  fueAdivinada,
  icono,
}) {
  const flipped = estaSiendoComparada || fueAdivinada;

  return (
    <div className="carta" onClick={onPick}>
      <ReactCardFlip
        isFlipped={flipped}
        flipDirection="vertical"
        containerStyle={{ width: "100%", height: "100%" }} // <- llena la celda
      >
        {/* Frente (boca abajo): cuadrito azul */}
        <div className={`portada ${flipped ? "oculto" : ""}`} aria-hidden />

        {/* Dorso (boca arriba): contenido */}
        <div className={`contenido ${flipped ? "visible" : ""}`}>
          <img className="card_img" src={icono} alt="carta" />
        </div>
      </ReactCardFlip>
    </div>
  );
}


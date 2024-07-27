import ReactCardFlip from 'react-card-flip';

export default function Carta({ index, seleccionarCarta, estaSiendoComparada, fueAdivinada, icono }) {
  return (
    <div className="carta" onClick={() => seleccionarCarta(index)}>
      <ReactCardFlip isFlipped={estaSiendoComparada || fueAdivinada} flipDirection="vertical">
        <div className={`portada ${estaSiendoComparada || fueAdivinada ? 'oculto' : ''}`}></div>
        <div className={`contenido ${estaSiendoComparada || fueAdivinada ? 'visible' : ''}`}>
          <img className='card_img' src={icono} alt='...' />
        </div>
      </ReactCardFlip>
    </div>
  );
}

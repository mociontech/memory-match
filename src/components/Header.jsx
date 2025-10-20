/* eslint-disable react/prop-types */
export default function Header({ numeroDeIntentos }) {
  return (
    <header>
      {/* <div>
        <button className="boton-reiniciar" onClick={resetearPartida}>
          Reiniciar
        </button>
      </div> */}
      <img src="/landscape-title.svg" alt="" className="title-svg" />
      <div className="titulo">Intentos: {numeroDeIntentos}</div>
      <img src="/humano.svg" alt="" className="humano-title" />
    </header>
  );
}

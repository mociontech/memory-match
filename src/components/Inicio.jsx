/* src/components/Inicio.jsx */
export default function Inicio({ onStart }) {
  return (
    <div className="inicio-container">
      <div className="inicio-stage">
        <div className="inicio-top">
          {/* LOGO BTL: 319×149 */}
          <img src="/btl.png" alt="BTL" className="inicio-logo" />
          {/* 15 AÑOS: 782×491 */}
          <img src="/15 años 1.png" alt="15 años" className="inicio-hero" />
        </div>

        {/* Título y subtítulo como PNGs */}
        <img src="/Memory Match.png"    alt="Memory Match" className="inicio-title-img" />
        <img src="/Pon a prueba tu memoria.png" alt="Pon a prueba tu memoria" className="inicio-sub-img" />

        {/* Botón */}
        <img
          src="/Botón-Primario.png"
          alt="Iniciar"
          className="inicio-btn-img"
          onClick={onStart}
          role="button"
        />
      </div>
    </div>
  );
}


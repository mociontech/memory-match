/* src/components/Fin.jsx */
export default function Fin({ onBack }) {
  return (
    <div className="fin">
      {/* Fila superior: logos */}
      <div className="fin-top">
        <img src="/logo-mini.png"        alt="BTL"      className="hdr-btl" />
        <img src="/quince-anos-alt.png"  alt="15 años"  className="hdr-15"  />
      </div>

      {/* Columna central */}
      <div className="fin-panel">
        {/* ¡Lo lograste! (PNG) */}
        <img src="/lograste.png" alt="¡Lo lograste!" className="fin-lograste" />

        {/* Mensaje */}
        <p className="fin-msg">Completaste todas las parejas en menos de 10 intentos.</p>

        {/* ¡Gracias por participar! (PNG) */}
        <img src="/¡Gracias por participar!.png" alt="¡Gracias por participar!" className="fin-gracias" />

        {/* Botón Volver (PNG clickeable) */}
        <img
          src="/volver.png"
          alt="Volver"
          className="fin-volver"
          role="button"
          onClick={onBack}
        />
      </div>
    </div>
  );
}

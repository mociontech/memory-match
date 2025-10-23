export default function Header({ numeroDeIntentos }) {
  return (
    <header className="hdr">
      <div className="hdr-top">
        {/* LOGO BTL (nuevo) */}
        <img src="/logo-mini.png" alt="BTL" className="hdr-btl" />

        {/* 15 AÑOS (nuevo) */}
        <img src="/quince-anos-alt.png" alt="15 AÑOS" className="hdr-15" />
      </div>

      {/* CHIP INTENTOS */}
      <div className="hdr-intentos">
        <span>INTENTOS: {numeroDeIntentos}</span>
      </div>
    </header>
  );
}



import { Component } from "react";
import construirBaraja from "./utils/construirBaraja";
import Tablero from "./components/Tablero";
import Header from "./components/Header";
import { register, updateScore } from "./utils/db";
// import axios from "axios";

const getEstadoInicial = () => {
  const baraja = construirBaraja();
  return {
    baraja,
    parejaSeleccionada: [],
    estaComparando: false,
    numeroDeIntentos: 0,
    juegoCompletado: false,
  };
};

const sp = new URLSearchParams(window.location.search);
const zone = sp.get("zone")?.toLowerCase() || "";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...getEstadoInicial(),
      pantalla: "juego", //////////////////
      nombre: "",
      correo: "",
      empresa: "",
    };
    this.timeoutId = null;
  }

  irARegistro = () => {
    this.setState({ pantalla: "registro" });
  };

  irAJuego = () => {
    this.setState({ pantalla: "juego" });
  };

  irALogin = () => {
    this.setState({ pantalla: "login" });
  };

  irAInstrucciones = () => {
    this.setState({ pantalla: "instrucciones" });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleRegistro = async () => {
    const { nombre, correo, empresa } = this.state;
    // Enviamos los datos siempre, sin validar longitud o presencia
    try {
      await register(nombre, correo, empresa);
    } catch (error) {
      // Logueamos el error pero continuamos: se pidió que el envío
      // siempre ocurra y que el juego continúe independientemente
      // de la respuesta del endpoint.
      console.error("Error en register (ignorado):", error);
    }

    // Ir al juego incluso si el registro falló o alguna campo está vacío
    this.irAJuego();
  };

  seleccionarCarta(carta) {
    if (
      this.state.estaComparando ||
      this.state.parejaSeleccionada.indexOf(carta) > -1 ||
      carta.fueAdivinada
    ) {
      return;
    }

    const parejaSeleccionada = [...this.state.parejaSeleccionada, carta];
    this.setState({
      parejaSeleccionada,
    });

    if (parejaSeleccionada.length === 2) {
      this.compararPareja(parejaSeleccionada);
    }
  }

  compararPareja(parejaSeleccionada) {
    this.setState({ estaComparando: true });

    setTimeout(() => {
      const [primeraCarta, segundaCarta] = parejaSeleccionada;
      let baraja = this.state.baraja;

      if (this.esPareja(primeraCarta, segundaCarta)) {
        baraja = baraja.map((carta) => {
          if (!this.esPareja(carta, primeraCarta)) {
            return carta;
          }

          return { ...carta, fueAdivinada: true };
        });
      }

      this.verificarSiHayGanador(baraja);
      this.setState({
        parejaSeleccionada: [],
        baraja,
        estaComparando: false,
        numeroDeIntentos: this.state.numeroDeIntentos + 1,
      });
    }, 1000);
  }

  esPareja(carta1, carta2) {
    const nombreCarta1 = carta1.icono.split("/")[1].split("-")[0];
    const nombreCarta2 = carta2.icono.split("/")[1].split("-")[0];
    return nombreCarta1 === nombreCarta2;
  }

  verificarSiHayGanador(baraja) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    setTimeout(() => {
      this.volverAInicio();
    }, 120000);

    if (baraja.filter((carta) => !carta.fueAdivinada).length === 0) {
      clearTimeout(this.timeoutId);

      const intentos = this.state.numeroDeIntentos;
      let puntos = 0;

      if (intentos <= 10) {
        puntos = 15;
      } else if (intentos <= 15) {
        puntos = 10;
      } else {
        puntos = 5;
      }

      console.log('Juego completado:', {
        intentos,
        puntos,
        usuario: {
          nombre: this.state.nombre,
          correo: this.state.correo,
          empresa: this.state.empresa
        }
      });

      // Enviar score al backend
      updateScore(this.state.correo, puntos)
        .catch(error => console.error("Error enviando score:", error));

      this.setState({
        pantalla: "final",
        puntaje: puntos,
      });
    }
  }


  resetearPartida() {
    this.setState(getEstadoInicial());
  }

  volverAInicio = () => {
    this.setState({
      ...getEstadoInicial(),
      pantalla: "login",
      nombre: "",
      correo: "",
      empresa: "",
    });
  };



  render() {
    if (this.state.pantalla === "login") {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundImage: "url('/Inicio.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: "relative",
          }}
        >
          <button
            onClick={this.irARegistro}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          />
        </div>
      );
    }


    if (this.state.pantalla === "registro") {
      return (
        <div
          className="login-screen flex flex-col justify-center items-center"
          style={{
            position: "relative",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            width: "80vw",
            height: "100vh",
            backgroundImage: "url('/Registro.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            touchAction: "manipulation",
          }}
        >
          <div className="relative z-10 flex flex-col items-center w-full h-full">
            {/* Botón Inicio */}
            <button
              onClick={this.volverAInicio}
              style={{
                position: 'absolute',
                top: '5px',
                left: '130px',
                background: 'transparent',
                border: 'none',
                padding: 0,
                lineHeight: 0,
                cursor: 'pointer',
                zIndex: 1000,
              }}
            >
              <img
                src="/BtnInicio.png"
                alt="Inicio"
                style={{ width: '30px', height: '30px', display: 'block' }}
              />
            </button>

            {/* Input Nombre */}
            <input
              type="text"
              placeholder="Nombre"
              name="nombre"
              value={this.state.nombre}
              autoComplete="off"
              inputMode="text"
              className="niveau-input"
              style={{
                width: '100px',
                height: '30px',
                top: '110px',
                left: '20px',
                position: 'absolute',
                zIndex: 10,
                textAlign: 'left',
                paddingLeft: '20px',
                height: '5px',
                backgroundImage: "url('/NombreInput.png')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left center',
                border: 'none',
                fontSize: '10px',
                color: 'white',
              }}
              onChange={this.handleChange}
            />

            {/* Input Correo */}
            <input
              type="email"
              placeholder="Correo corporativo"
              name="correo"
              value={this.state.correo}
              autoComplete="off"
              inputMode="email"
              className="niveau-input"
              style={{
                width: '100px',
                height: '30px',
                top: '140px',
                left: '20px',
                position: 'absolute',
                zIndex: 10,
                textAlign: 'left',
                paddingLeft: '20px',
                height: '5px',
                backgroundImage: "url('/CorreoInput.png')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left center',
                border: 'none',
                fontSize: '10px',
                color: 'white',
              }}
              onChange={this.handleChange}
            />

            {/* Input Empresa */}
            <input
              type="text"
              placeholder="Empresa"
              name="empresa"
              value={this.state.empresa}
              autoComplete="off"
              inputMode="text"
              className="niveau-input"
              style={{
                width: '100px',
                height: '30px',
                top: '170px',
                left: '20px',
                position: 'absolute',
                zIndex: 10,
                textAlign: 'left',
                paddingLeft: '20px',
                height: '5px',
                backgroundImage: "url('/EmpresaInput.png')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left center',
                border: 'none',
                fontSize: '10px',
                color: 'white',
              }}
              onChange={this.handleChange}
            />

            {/* Botón Continuar */}
            <button
              style={{
                width: '140px',
                top: '200px',
                left: '15px',
                position: 'absolute',
                zIndex: 10,
                background: 'transparent',
                border: 'none',
              }}
              onClick={this.handleRegistro}
            >
              <img
                src="/Continuar.png"
                alt="Registrarme"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '400px'
                }}
              />
            </button>
          </div>
        </div>
      );
    }



    if (this.state.pantalla === "juego") {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundImage: "url('/FondoMiQ.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: "relative",
          }}
        >
          <button
            onClick={this.volverAInicio}
            style={{
              position: 'absolute',
              top: '5px',
              left: '130px',
              background: 'transparent',
              border: 'none',
              padding: 0,
              lineHeight: 0,
              cursor: 'pointer',
              zIndex: 1000,
            }}
          >
            <img
              src="/BtnInicio.png"
              alt="Inicio"
              style={{ width: '30px', height: '30px', display: 'block' }}
            />
          </button>
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
            rel="stylesheet"
          />
          <Tablero
            baraja={this.state.baraja}
            parejaSeleccionada={this.state.parejaSeleccionada}
            seleccionarCarta={(carta) => this.seleccionarCarta(carta)}
          />
          <Header
            numeroDeIntentos={this.state.numeroDeIntentos}
            resetearPartida={() => this.resetearPartida()}
          />
        </div>
      );
    }

    if (this.state.pantalla === "final") {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundImage: "url('/final.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: "relative",
          }}
        >
          <button
            onClick={this.volverAInicio}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          />
        </div>
      );
    }
  }
}


export default App;

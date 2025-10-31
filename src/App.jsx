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
      pantalla: "login", //////////////////
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

    if (!nombre || !correo || !empresa) {
      alert("Por favor, completa todos los campos");
      return;
    }

    try {
      await register(nombre, correo, empresa);
      this.irAJuego();
    } catch (error) {
      console.error("Error en registro:", error);
      alert("Hubo un error al registrar. Por favor intenta nuevamente.");
    }
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
            backgroundImage: "url('/assets/Inicio.png')",
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
        <div className="login-screen flex flex-col justify-center items-center">
          <div className="relative z-10 flex flex-col items-center">
            <button
              onClick={this.volverAInicio}
              style={{
                position: 'absolute',
                top: '20px',
                left: '420px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                zIndex: 1000,   // encima de todo
              }}
            >
              <img
                src="/assets/BtnInicio.png"
                alt="Inicio"
                style={{ width: '180px', height: '180px' }}
              />
            </button>
            {/* Formulario */}
            <div className="flex flex-col items-center gap-8 w-full max-w-[600px] mt-32 px-4">

              <input
                type="text"
                placeholder="Nombre"
                name="nombre"
                value={this.state.nombre}
                autoComplete="off"
                className="niveau-input"
                style={{
                  width: '70%',
                  top: '900px',
                  left: '110px',
                  position: 'absolute',
                  zIndex: 10,
                  textAlign: 'left',
                  paddingLeft: '120px',
                  height: '100px',
                  backgroundImage: "url('/assets/NombreInput.png')",
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  border: 'none',
                }}
                onChange={this.handleChange}
              />

              <input
                type="email"
                placeholder="Correo corporativo"
                name="correo"
                value={this.state.correo}
                autoComplete="off"
                className="niveau-input"
                style={{
                  width: '70%',
                  top: '1050px',
                  left: '110px',
                  position: 'absolute',
                  zIndex: 10,
                  textAlign: 'left',
                  paddingLeft: '120px',
                  height: '100px',
                  backgroundImage: "url('/assets/CorreoInput.png')",
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  border: 'none',
                }}
                onChange={this.handleChange}
              />

              <input
                type="text"
                placeholder="Empresa"
                name="empresa"
                value={this.state.empresa}
                autoComplete="off"
                className="niveau-input"
                style={{
                  width: '70%',
                  top: '1200px',
                  left: '110px',
                  position: 'absolute',
                  zIndex: 10,
                  textAlign: 'left',
                  paddingLeft: '120px',
                  height: '100px',
                  backgroundImage: "url('/assets/EmpresaInput.png')",
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  border: 'none',
                }}
                onChange={this.handleChange}
              />

              {/* Botón */}
              <button
                style={{
                  width: '60%',
                  top: '1400px',
                  left: '120px',
                  position: 'absolute',
                  zIndex: 10,
                  background: 'transparent',
                  border: 'none',
                }}
                onClick={this.handleRegistro}
              >
                <img src="/assets/Continuar.png" alt="Registrarme" className="h-full w-auto" />
              </button>

            </div>
          </div>
        </div>
      );
    }

    if (this.state.pantalla === "juego") {
      return (


        <div className="App memory">
          <button
            onClick={this.volverAInicio}
            style={{
              position: 'absolute',
              top: '20px',
              left: '420px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              zIndex: 1000,   // encima de todo
            }}
          >
            <img
              src="/assets/BtnInicio.png"
              alt="Inicio"
              style={{ width: '180px', height: '180px' }}
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
            backgroundImage: "url('/assets/final.png')",
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

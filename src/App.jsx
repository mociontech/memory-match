import { Component } from "react";
import construirBaraja from "./utils/construirBaraja";
import Tablero from "./components/Tablero";
import Header from "./components/Header";
import { register } from "./utils/db";
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
      numero: "",
    };
    this.timeoutId = null;
  }

  irARegistro = () => {
    this.setState({ pantalla: "registro" });
  };

  irACodigoID = () => {
    this.setState({ pantalla: "codigo_id" });
  };

  irACodigoTeclado = () => {
    this.setState({ pantalla: "codigo_teclado" });
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
    //if (this.state.nombre && this.state.correo) {
    this.setState({ registrado: true }, () => {
      this.irAInstrucciones();
    });

    //await register(this.state.nombre, this.state.correo);
    //} else {
    //alert("Por favor, completa todos los campos");
    //}
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

    // Si ya no quedan cartas sin adivinar, el jugador ganó
    if (baraja.filter((carta) => !carta.fueAdivinada).length === 0) {
      clearTimeout(this.timeoutId);

      // Calcular puntaje según número de intentos
      const intentos = this.state.numeroDeIntentos;
      let puntos = 0;

      if (intentos <= 10) {
        puntos = 15;
      } else if (intentos <= 15) {
        puntos = 10;
      } else {
        puntos = 5;
      }

      // Guardar puntaje en el estado (o podrías enviarlo a una base de datos)
      this.setState({
        pantalla: "final",
        puntaje: puntos,
      });

      console.log(`Juego completado en ${intentos} intentos. Puntaje: ${puntos}`);
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
      numero: "",
    });
  };



  render() {
    if (this.state.pantalla === "login") {
      return (
        <div className="login-screen flex flex-col justify-center items-center">
          <div className="relative z-10 flex flex-col items-center">
            <img
              src="src/assets/PAYROLL.png"
              alt="DEELHR"
              style={{
                width: '60%',
                top: '350px',
                left: '200px',
                position: 'absolute',
                zIndex: 10
              }}
            />

            <img
              src="src/assets/TextoMemoria.png"
              alt="Bienvenida"
              style={{
                width: '60%',
                top: '550px',
                left: '200px',
                position: 'absolute',
                zIndex: 10
              }}
            />


            <button
              style={{
                width: '60%',
                top: '850px',
                left: '200px',
                position: 'absolute',
                zIndex: 10,
                background: 'transparent',
                border: 'none',
              }}
              onClick={this.irARegistro}
            >
              <img src="src/assets/Iniciar.png" alt="Iniciar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>

            <button
              style={{
                width: '60%',
                top: '1050px',
                left: '200px',
                position: 'absolute',
                zIndex: 10,
                background: 'transparent',
                border: 'none',
              }}
              onClick={this.irACodigoTeclado}
            >
              <img src="src/assets/YaTengoID.png" alt="Ya Tengo ID" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>

            <img
              src="src/assets/DEEL_LOGO.png"
              alt="DEEL LOGO"
              style={{
                width: '40%',
                top: '1650px',
                left: '540px',
                position: 'absolute',
                zIndex: 10
              }}
            />
          </div>
        </div>
      );
    }

    if (this.state.pantalla === "registro") {
      return (
        <div className="login-screen flex flex-col justify-center items-center">
          <div className="relative z-10 flex flex-col items-center">
            <img
              src="src/assets/DEEL_LOGO.png"
              alt="DEEL LOGO"
              style={{
                width: '30%',
                top: '200px',
                left: '380px',
                position: 'absolute',
                zIndex: 10
              }}
            />

            <img
              src="src/assets/REGISTRO.png"
              alt="DEEL LOGO"
              style={{
                width: '50%',
                top: '500px',
                left: '270px',
                position: 'absolute',
                zIndex: 10
              }}
            />

            {/* Formulario */}
            <div className="flex flex-col items-center gap-8 w-full max-w-[600px] mt-32 px-4">

              <input
                type="text"
                placeholder="Nombre"
                name="nombre"
                value={this.state.nombre}
                autoComplete="off"
                style={{
                  width: '70%',
                  top: '800px',
                  left: '160px',
                  position: 'absolute',
                  zIndex: 10,
                  textAlign: 'left',
                  paddingLeft: '20px'
                }}
                onChange={this.handleChange}
              />

              <input
                type="email"
                placeholder="Correo"
                name="correo"
                value={this.state.correo}
                autoComplete="off"
                style={{
                  width: '70%',
                  top: '950px',
                  left: '160px',
                  position: 'absolute',
                  zIndex: 10,
                  textAlign: 'left',
                  paddingLeft: '20px'
                }}
                onChange={this.handleChange}
              />

              <input
                type="number"
                placeholder="Número"
                name="numero"
                value={this.state.numero}
                autoComplete="off"
                style={{
                  width: '70%',
                  top: '1100px',
                  left: '160px',
                  position: 'absolute',
                  zIndex: 10,
                  textAlign: 'left',
                  paddingLeft: '20px'
                }}
                onChange={this.handleChange}
              />

              {/* Botón */}
              <button
                style={{
                  width: '60%',
                  top: '1400px',
                  left: '180px',
                  position: 'absolute',
                  zIndex: 10,
                  background: 'transparent',
                  border: 'none',
                }}
                onClick={this.irACodigoID}
              >
                <img src="src/assets/Registrarme.png" alt="Registrarme" className="h-full w-auto" />
              </button>

            </div>
          </div>
        </div>
      );
    }

    if (this.state.pantalla === "codigo_id") {
      return (
        <div className="login-screen flex flex-col justify-center items-center">
          <div className="relative z-10 flex flex-col items-center">
            <img
              src="src/assets/DEEL_LOGO.png"
              alt="DEEL LOGO"
              style={{
                width: '30%',
                top: '200px',
                left: '380px',
                position: 'absolute',
                zIndex: 10
              }}
            />

            <img
              src="src/assets/TUID.png"
              alt="DEEL LOGO"
              style={{
                width: '60%',
                top: '580px',
                left: '220px',
                position: 'absolute',
                zIndex: 10
              }}
            />

            <img
              src="src/assets/TextoID.png"
              alt="DEEL LOGO"
              style={{
                width: '60%',
                top: '760px',
                left: '220px',
                position: 'absolute',
                zIndex: 10
              }}
            />

            <img
              src="src/assets/CampoVacio.png"
              alt="DEEL LOGO"
              style={{
                width: '70%',
                top: '1100px',
                left: '170px',
                position: 'absolute',
                zIndex: 10
              }}
            />

            <button
              style={{
                width: '60%',
                top: '1400px',
                left: '160px',
                position: 'absolute',
                zIndex: 10,
                background: 'transparent',
                border: 'none',
              }}
              onClick={this.irACodigoTeclado}
            >
              <img src="src/assets/Iniciar.png" alt="Registrarme" className="h-full w-auto" />
            </button>


          </div>
        </div>
      );
    }

    if (this.state.pantalla === "codigo_teclado") {
      return (
        <div className="login-screen flex flex-col justify-center items-center">
          <div className="relative z-10 flex flex-col items-center">
            <img
              src="src/assets/DEEL_LOGO.png"
              alt="DEEL LOGO"
              style={{
                width: '30%',
                top: '200px',
                left: '380px',
                position: 'absolute',
                zIndex: 10
              }}
            />

            <img
              src="src/assets/IngresaCodigo.png"
              style={{
                width: '60%',
                top: '520px',
                left: '220px',
                position: 'absolute',
                zIndex: 10
              }}
            />

            <img
              src="src/assets/CampoVacio.png"
              style={{
                width: '70%',
                top: '800px',
                left: '170px',
                position: 'absolute',
                zIndex: 10
              }}
            />

            <button
              style={{
                width: '60%',
                top: '1000px',
                left: '160px',
                position: 'absolute',
                zIndex: 10,
                background: 'transparent',
                border: 'none',
              }}
              onClick={this.irAJuego}
            >
              <img src="src/assets/Iniciar.png" alt="Registrarme" className="h-full w-auto" />
            </button>


          </div>
        </div>
      );

    }

    if (this.state.pantalla === "juego") {
      return (
        <div className="App memory">
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
        <div className="login-screen flex flex-col justify-center items-center">
          <div className="relative z-10 flex flex-col items-center">
            <img
              src="src/assets/DEEL_LOGO.png"
              alt="DEEL LOGO"
              style={{
                width: '50%',
                top: '200px',
                left: '280px',
                position: 'absolute',
                zIndex: 10
              }}
            />

            <img
              src="src/assets/ExitoPayroll.png"
              style={{
                width: '70%',
                top: '520px',
                left: '170px',
                position: 'absolute',
                zIndex: 10
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: '1350px',
                left: '240px',
                width: '600px',
                height: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '80px',
                fontWeight: 'bold',
                color: 'black',
                backgroundImage: "url('src/assets/CampoVacio.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {this.state.puntaje} puntos
            </div>


            <button
              style={{
                width: '60%',
                top: '1600px',
                left: '180px',
                position: 'absolute',
                zIndex: 10,
                background: 'transparent',
                border: 'none',
              }}
              onClick={this.volverAInicio}
            >
              <img src="src/assets/Volver.png" alt="Registrarme" className="h-full w-auto" />
            </button>


          </div>
        </div>
      );
    }
  }
}


export default App;

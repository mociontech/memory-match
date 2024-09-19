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
    juegoCompletado: false, // Nuevo estado para el juego completado
  };
};

const sp = new URLSearchParams(window.location.search);
const zone = sp.get("zone")?.toLowerCase() || "";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...getEstadoInicial(),
      nombre: "",
      correo: "",
      registrado: false,
      zoneExp: zone,
    };
    this.timeoutId = null;
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleRegistro = async () => {
    if (this.state.nombre && this.state.correo) {
      this.setState({ registrado: true });
      await register(this.state.nombre, this.state.correo);
    } else {
      alert("Por favor, completa todos los campos");
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
    this.timeoutId = setTimeout(() => {
      this.volverAInicio();
    }, 120000);

    if (baraja.filter((carta) => !carta.fueAdivinada).length === 0) {
      clearTimeout(this.timeoutId);
      this.setState({ juegoCompletado: true });
      if (this.state.numeroDeIntentos >= 10) {
        return alert("Deses hacerlo en menos de 10 intentos para lograrlo");
      }
    }
  }

  resetearPartida() {
    this.setState(getEstadoInicial());
  }

  volverAInicio() {
    this.setState(getEstadoInicial());
    this.setState({
      juegoCompletado: false,
      registrado: false,
      nombre: "",
      correo: "",
    });
  }

  render() {
    if (!this.state.registrado) {
      return (
        <div className="top">
          <div className="registro inicio">
            <div className="registro-space">
              <form>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  className="mt"
                  value={this.state.nombre}
                  onChange={this.handleChange}
                />
                <input
                  type="email"
                  name="correo"
                  placeholder="Correo"
                  className="mt"
                  value={this.state.correo}
                  onChange={this.handleChange}
                />
                <button
                  type="button"
                  className="boton"
                  onClick={this.handleRegistro}
                ></button>
              </form>
            </div>
          </div>
        </div>
      );
    }

    if (this.state.juegoCompletado) {
      return (
        <div className="felicitaciones">
          {this.state.numeroDeIntentos < 11 ? (
            <div
              className="ganaste"
              onClick={() => {
                window.location.href =
                  "https://landing-ochre-gamma.vercel.app/";
              }}
            ></div>
          ) : (
            <div
              className="perdiste"
              onClick={() => {
                window.location.href =
                  "https://landing-ochre-gamma.vercel.app/";
              }}
            >
              <button
                onClick={() => this.volverAInicio()}
                style={{
                  display: "block",
                  margin: "auto",
                  width: "70%",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="App memory">
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <Header
          numeroDeIntentos={this.state.numeroDeIntentos}
          resetearPartida={() => this.resetearPartida()}
        />
        <Tablero
          baraja={this.state.baraja}
          parejaSeleccionada={this.state.parejaSeleccionada}
          seleccionarCarta={(carta) => this.seleccionarCarta(carta)}
        />
      </div>
    );
  }
}

export default App;

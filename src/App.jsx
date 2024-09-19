import { Component } from "react";
import construirBaraja from "./utils/construirBaraja";
import Tablero from "./components/Tablero";
import Header from "./components/Header";
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
      // const newUniqueId = Math.random().toString(36).substring(7);
      // const newHashId = "RD-Memory-Match-" + newUniqueId;
      // const url = `https://mocionws.info/dbController.php?method=newRecordExclude&table=leads&name=${this.state.nombre}&email=${this.state.correo}&uniqueId=${newHashId}&experience=${this.state.zoneExp}`;
      // await axios.get(url);
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
          <div className="registro">
            <img src="marco1.png" alt="" className="imagentop"></img>
            <div className="title-container">
              <h1 className="text1 montserrat">¡Pon a prueba tu memoria! </h1>
              <h2 className="text2 montserrat">
                Encuentra todas las parejas en el menor número de intentos
                posible y demuestra tu habilidad. ¿Listo para el desafío?
              </h2>
            </div>
            <link
              href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
              rel="stylesheet"
            />
            <div className="registro-space">
              <h1 className="registratetitulo">Registrate</h1>
              <form>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={this.state.nombre}
                  onChange={this.handleChange}
                />
                <input
                  type="email"
                  name="correo"
                  placeholder="Correo"
                  value={this.state.correo}
                  onChange={this.handleChange}
                />
                <button type="button" onClick={this.handleRegistro}>
                  ¡Juega ahora!
                </button>
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
            <div className="ganaste">
              <img src="Gracias.png" alt="" className="imagenGracias"></img>
            </div>
          ) : (
            <div>
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
      <div className="App">
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
        <img src="/humano.svg" alt="" className="humano-logo" />
      </div>
    );
  }
}

export default App;

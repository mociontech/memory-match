import { Component } from "react";
import construirBaraja from "./utils/construirBaraja";
import Tablero from "./components/Tablero";
import Header from "./components/Header";
import Registro from "./components/Registro";

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
      nombre: "",
      correo: "",
      registrado: false,
      zoneExp: zone,
    };
    this.timeoutId = null;
  }



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
      //this.volverAInicio();
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
    window.location.href = "https://landing-the-band.netlify.app"
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
        <Registro></Registro>
      );
    }

    if (this.state.juegoCompletado) {
      return (
        <div className="felicitaciones">
          {this.state.numeroDeIntentos < 11 ? (
            <div
              className="ganaste"
              onClick={() => {
                window.location.href = "https://landing-the-band.netlify.app";
              }}
            ></div>
          ) : (
            <div
              className="perdiste"
              onClick={() => {
                window.location.href = "https://landing-the-band.netlify.app";
              }}
            >
              <button
                onClick={() => this.volverAInicio()}
                className="lost-button antonio"
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


        <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100vh'
                    }}>

                      <Tablero 
                        baraja={this.state.baraja}
                        parejaSeleccionada={this.state.parejaSeleccionada}
                        seleccionarCarta={(carta) => this.seleccionarCarta(carta)}
                      />
                  </div>
      </div>
    );
  }
}

export default App;

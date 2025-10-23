import { Component } from "react";
import construirBaraja from "./utils/construirBaraja";
import Tablero from "./components/Tablero";
import Header from "./components/Header";
import axios from "axios";
import Inicio from "./components/Inicio";
import Fin from "./components/Fin";

/* ===== Estado inicial ===== */
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
      pantalla: "inicio",
    };
    this.timeoutId = null;
  }

  /* ===== Navegación ===== */
  iniciarJuego = () => {
    this.setState({
      ...getEstadoInicial(),
      registrado: true,
      pantalla: "juego",
    });
  };

  volverAInicio = () => {
    this.setState({
      ...getEstadoInicial(),
      registrado: false,
      nombre: "",
      correo: "",
      pantalla: "inicio",
    });
  };

  /* ===== Registro (si lo usas) ===== */
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleRegistro = async () => {
    if (this.state.nombre && this.state.correo) {
      this.setState({ registrado: true });
      const newUniqueId = Math.random().toString(36).substring(7);
      const newHashId = "RD-Memory-Match-" + newUniqueId;
      const url = `https://mocionws.info/dbController.php?method=newRecordExclude&table=leads&name=${this.state.nombre}&email=${this.state.correo}&uniqueId=${newHashId}&experience=${this.state.zoneExp}`;
      await axios.get(url);
    } else {
      alert("Por favor, completa todos los campos");
    }
  };

  /* ===== Juego ===== */
  seleccionarCarta(carta) {
    if (
      this.state.estaComparando ||
      this.state.parejaSeleccionada.indexOf(carta) > -1 ||
      carta.fueAdivinada
    ) {
      return;
    }

    const parejaSeleccionada = [...this.state.parejaSeleccionada, carta];
    this.setState({ parejaSeleccionada });

    if (parejaSeleccionada.length === 2) {
      this.compararPareja(parejaSeleccionada);
    }
  }

  compararPareja(parejaSeleccionada) {
    this.setState({ estaComparando: true });

    setTimeout(() => {
      const [primeraCarta, segundaCarta] = parejaSeleccionada;
      let baraja = this.state.baraja.slice();

      if (this.esPareja(primeraCarta, segundaCarta)) {
        baraja = baraja.map((carta) =>
          this.esPareja(carta, primeraCarta) ? { ...carta, fueAdivinada: true } : carta
        );
      }

      const siguienteIntento = this.state.numeroDeIntentos + 1;
      const completo = baraja.every((c) => c.fueAdivinada);

      if (completo) {
        // Límite alcanzado o superado → alert y volver a inicio
        if (siguienteIntento > 10) {
          if (this.timeoutId) clearTimeout(this.timeoutId);

          setTimeout(() => {
            window.alert("Debes hacerlo en menos de 10 intentos para lograrlo");
            this.volverAInicio();
          }, 150);

          this.setState({
            parejaSeleccionada: [],
            baraja,
            estaComparando: false,
            numeroDeIntentos: siguienteIntento,
          });
          return;
        }

        // Ganó dentro del límite → pantalla Fin
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.setState({
          parejaSeleccionada: [],
          baraja,
          estaComparando: false,
          numeroDeIntentos: siguienteIntento,
          juegoCompletado: true,
        });
        return;
      }

      // Aún no completa
      this.setState({
        parejaSeleccionada: [],
        baraja,
        estaComparando: false,
        numeroDeIntentos: siguienteIntento,
      });

      this.verificarSiHayGanador(baraja);
    }, 900);
  }

  esPareja(c1, c2) {
    const n1 = c1.icono.split("/")[1].split("-")[0];
    const n2 = c2.icono.split("/")[1].split("-")[0];
    return n1 === n2;
  }

  verificarSiHayGanador(baraja) {
    // Auto-timeout: 2 min sin acción → volver a inicio
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.volverAInicio();
    }, 120000);
  }

  resetearPartida() {
    this.setState(getEstadoInicial());
  }

  render() {
    /* 1) Pantalla de inicio */
    if (this.state.pantalla === "inicio") {
      return <Inicio onStart={this.iniciarJuego} />;
    }

    /* 2) Pantalla final (solo si ganó dentro de 10 intentos) */
    if (this.state.juegoCompletado) {
      return <Fin onBack={this.volverAInicio} />;
    }

    /* 3) Form de registro (si lo sigues usando) */
    if (!this.state.registrado) {
      return (
        <div className="top">
          <div className="registro">
            <img src="marco1.png" alt="" className="imagentop" />
            <div className="title-container">
              <h1 className="text1 montserrat">¡Pon a prueba tu memoria! </h1>
              <h2 className="text2 montserrat">
                Encuentra todas las parejas en el menor número de intentos posible y
                demuestra tu habilidad. ¿Listo para el desafío?
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

    /* 4) Juego */
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

        <div className="board">
          <Tablero
            baraja={this.state.baraja}
            parejaSeleccionada={this.state.parejaSeleccionada}
            seleccionarCarta={(carta) => this.seleccionarCarta(carta)}
          />
        </div>

        <img src="/humano.svg" alt="" className="humano-logo" />
      </div>
    );
  }
}

export default App;

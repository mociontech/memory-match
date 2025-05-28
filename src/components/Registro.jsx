import React, { useState } from 'react';
import { register } from "../utils/db";

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [documento, setDocumento] = useState('');
  const [celular, setCelular] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [registrado, setRegistrado] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'nombre':
        setNombre(value);
        break;
      case 'correo':
        setCorreo(value);
        break;
      case 'documento':
        setDocumento(value);
        break;
      case 'celular':
        setCelular(value);
        break;
      default:
        break;
    }
  };

  const handleAceptaTerminos = (event) => {
    setAceptaTerminos(event.target.checked);
  };

  const handleRegistro = async () => {
    if (nombre && correo && documento && celular && aceptaTerminos) {
      setRegistrado(true);
      await register(nombre, documento, correo, celular);
    } else if (!aceptaTerminos) {
      alert("Debes aceptar los términos y condiciones");
    } else {
      alert("Por favor, completa todos los campos");
    }
  };

  return (
    <div className="top">
      <div className="registro inicio">
        <div className="registro-space">
          <form>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              className="antonio"
              value={nombre}
              onChange={handleChange}
            />
            <input
              type="email"
              name="correo"
              placeholder="Correo"
              className="antonio"
              value={correo}
              onChange={handleChange}
            />
            <input
              type="text"
              name="documento"
              placeholder="Documento"
              className="antonio"
              value={documento}
              onChange={handleChange}
            />
            <input
              type="text"
              name="celular"
              placeholder="Celular"
              className="antonio"
              value={celular}
              onChange={handleChange}
            />
            <div className="terminos">
              <input
                type="checkbox"
                id="terminos"
                checked={aceptaTerminos}
                onChange={handleAceptaTerminos}
                className="checkbox"
              />
              <label htmlFor="terminos" className="label-terminos">
                Acepto los <a href="#">términos y condiciones</a>
              </label>
            </div>
            <button
              type="button"
              className="boton"
              onClick={handleRegistro}
            >
              Registrar
            </button>
          </form>
          {registrado && <p>Registrado con éxito</p>}
        </div>
      </div>
    </div>
  );
}

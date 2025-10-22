/**
 * Edge DataHub SDK - JavaScript Version
 * Simple SDK for Event Gamification
 * Para eventos con conectividad intermitente
 */

export class EdgeDataHubSDK {
  constructor() {
    this.baseUrl = "http://192.168.0.100:3000/api/edge";
    //this.baseUrl = "http://localhost:3003/api/edge";
    this.eventId = "bf50d11c-2571-4270-9535-994d2931a06b"; // HARDCODED: ID del evento
    this.eventExperienceId = "9ad13d53-62f3-466c-8c0c-edbd9cf58137"; // HARDCODED: ID de la experiencia
  }

  // ===== OPERACIONES PRINCIPALES =====

  /**
   * Registra un asistente
   * @param {Object} data - Datos del asistente (eventId se agrega automáticamente)
   */
  async registerAttendee(data) {
    try {
          this.validateRequiredFields(data, ["fullName", "email"]);

    const payload = { ...data, eventId: this.eventId };

    const response = await fetch(`${this.baseUrl}/attendees/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error registrando asistente: ${errorData.message || response.statusText}`
      );
    }

    return await response.json();
    } catch (error) {
      console.log("error en solicitud register",error)
    }
  }

  /**
   * Busca asistente por código
   * @param {string} code - Código único del asistente
   */
  async findAttendeeByCode(code) {
    const url = `${this.baseUrl}/attendees/${encodeURIComponent(code)}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(`Error buscando asistente: ${errorMessage}`);
      }

      try {
        return JSON.parse(responseText);
      } catch (e) {
        console.error("Error al parsear la respuesta JSON:", e);
        throw new Error("La respuesta del servidor no es un JSON válido");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }

  /**
   * Registra jugada en experiencia
   * @param {Object} data - Datos de la jugada (eventExperienceId se agrega automáticamente)
   */
  async logExperiencePlay(data) {
    this.validateRequiredFields(data, ["attendeeId", "play_timestamp", "score"]);

    const payload = { ...data, eventExperienceId: this.eventExperienceId };

    const response = await fetch(`${this.baseUrl}/experience`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error registrando jugada: ${errorData.message || response.statusText}`
      );
    }

    return await response.json();
  }

  /**
   * Redime puntos
   * @param {Object} data - Datos de redención (eventId se agrega automáticamente)
   */
  async redeemPoints(data) {
    this.validateRequiredFields(data, ["attendeeId", "pointsRedeemed", "reason"]);

    const payload = { ...data, eventId: this.eventId };

    const response = await fetch(`${this.baseUrl}/redemption`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error redimiendo puntos: ${errorData.message || response.statusText}`
      );
    }

    return await response.json();
  }

  // ===== UTILIDADES =====

  /**
   * Valida que los campos requeridos estén presentes
   * @param {Object} data
   * @param {string[]} requiredFields
   */
  validateRequiredFields(data, requiredFields) {
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`❌ Campo requerido faltante: ${field}`);
      }
    }
  }

  /** Obtiene la URL base configurada */
  getBaseUrl() {
    return this.baseUrl;
  }

  /** Obtiene el ID del evento */
  getEventId() {
    return this.eventId;
  }

  /** Obtiene el ID de la experiencia */
  getEventExperienceId() {
    return this.eventExperienceId;
  }
}

// Inicializar SDK
export const edgeDataHubSDK = new EdgeDataHubSDK();

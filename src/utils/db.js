export async function register(name, correo, empresa, score) {
  const ENDPOINT = "https://mocion.app/evius/api/events/register";

  try {
    const payload = {
      origin: "station",
      fullName: name,
      email: correo,
      attendeeData: { k_empresa: empresa },
      eventId: "dc6c34ce-ccec-40d9-a7a9-adaf2d7abea5",
      ...(typeof score === "number" ? { score } : {}),
    };

    console.log("Enviando registro inicial:", {
      endpoint: ENDPOINT,
      payload,
    });

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Registro falló: ${response.status} ${response.statusText} ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en register():", error);
    throw error;
  }
}

export async function updateScore(email, score) {
  const ENDPOINT = "https://mocion.app/evius/api/experience-play-data";

  const payload = {
    eventExperienceId: "4ef57e40-0915-4cff-a796-3dc55fe68dd1",
    email,
    play_timestamp: new Date().toISOString(),
    score,
  };

  console.log("Enviando score:", payload);

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(
        `Error al actualizar score: ${response.status} ${response.statusText} ${text}`
      );
    }

    const data = await response.json().catch(() => ({}));
    console.log("✅ Score actualizado correctamente:", data);
    return data;
  } catch (error) {
    console.error("❌ Error en updateScore():", error);
    throw error;
  }
}


#!/usr/bin/env node
/**
 * verifySubmissions.js
 * Script para enviar registros al endpoint y revisar envíos guardados localmente.
 *
 * Uso:
 *  node verifySubmissions.js --name "Luis Ortiz" --email "luis@evius.co" --company "Coca Cola"
 *  node verifySubmissions.js --show 10
 */

import { appendFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";

const LOG_PATH = join(process.cwd(), "submissions.log");
const ENDPOINT = "https://mocion.app/evius/api/events/register";
const FIXED_EVENT_ID = "dc6c34ce-ccec-40d9-a7a9-adaf2d7abea5";

async function ensureFetch() {
  if (typeof fetch === "undefined") {
    try {
      // node 18+ tiene fetch; si no, intentar importar node-fetch
      global.fetch = (await import("node-fetch")).default;
    } catch (e) {
      throw new Error("fetch no disponible. Instala node >=18 o añade node-fetch.");
    }
  }
}

function appendLog(entry) {
  const line = JSON.stringify(entry) + "\n";
  appendFileSync(LOG_PATH, line, { encoding: "utf8" });
}

function readLastLines(n = 20) {
  if (!existsSync(LOG_PATH)) return [];
  const data = readFileSync(LOG_PATH, "utf8").trim();
  if (!data) return [];
  const lines = data.split("\n");
  return lines.slice(-n).map((l) => {
    try {
      return JSON.parse(l);
    } catch {
      return { raw: l };
    }
  });
}

async function sendRegistration({ name, email, company }) {
  await ensureFetch();

  const payload = {
    origin: "station",
    fullName: name,
    email: email,
    attendeeData: { k_empresa: company },
    eventId: FIXED_EVENT_ID,
  };

  const startedAt = new Date().toISOString();
  let resMeta = { status: "error", statusCode: null, body: null };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    resMeta.statusCode = res.status;
    const text = await res.text();
    try {
      resMeta.body = JSON.parse(text);
    } catch {
      resMeta.body = text;
    }

    resMeta.status = res.ok ? "ok" : "failed";
  } catch (error) {
    resMeta.body = String(error);
    resMeta.status = "network_error";
  }

  const logEntry = {
    timestamp: startedAt,
    payload,
    result: resMeta,
  };

  appendLog(logEntry);
  return logEntry;
}

/* CLI handling */
async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    console.log("Opciones:");
    console.log("--name \"Full Name\" --email \"a@b.com\" --company \"Company\"   => enviar registro");
    console.log("--show [n]   => mostrar últimos n envíos (por defecto 20)");
    process.exit(0);
  }

  if (argv.includes("--show")) {
    const idx = argv.indexOf("--show");
    const nArg = argv[idx + 1];
    const n = nArg && !nArg.startsWith("--") ? parseInt(nArg, 10) || 20 : 20;
    const recent = readLastLines(n);
    console.log(`Mostrando últimos ${recent.length} registros (submissions.log en ${LOG_PATH}):`);
    recent.forEach((r, i) => {
      console.log("----");
      console.log(`#${i + 1}`, JSON.stringify(r, null, 2));
    });
    process.exit(0);
  }

  // parse flags for send
  const getFlag = (name) => {
    const i = argv.indexOf(name);
    if (i === -1) return null;
    return argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : null;
  };

  const name = getFlag("--name");
  const email = getFlag("--email");
  const company = getFlag("--company");

  if (!name || !email || !company) {
    console.error("Faltan parámetros. Requeridos: --name --email --company");
    process.exit(1);
  }

  console.log("Enviando registro a", ENDPOINT);
  const result = await sendRegistration({ name, email, company });
  console.log("Resultado:");
  console.log(JSON.stringify(result, null, 2));
  console.log(`Guardado en ${LOG_PATH}`);
}

// Detectar ejecución directa en ESM
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  });
}


export default { sendRegistration, readLastLines, appendLog };

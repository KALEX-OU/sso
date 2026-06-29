let currentCorrelationId: string | null = null;

/**
 * Imposta il Correlation ID corrente in memoria per arricchire i log successivi.
 */
export function setCorrelationId(id: string | null) {
  currentCorrelationId = id;
}

/**
 * Recupera il Correlation ID corrente.
 */
export function getCorrelationId(): string | null {
  return currentCorrelationId;
}

const isProduction = process.env.NODE_ENV === "production";

function log(level: "INFO" | "WARN" | "ERROR" | "DEBUG", message: string, details?: unknown) {
  const timestamp = new Date().toISOString();
  const correlationId = currentCorrelationId;

  if (isProduction) {
    // Formato JSON strutturato ideale per Google Cloud Logging o altri aggregatori
    const payload = {
      timestamp,
      severity: level,
      message,
      correlationId,
      ...(details ? { details } : {})
    };
    // Utilizza console.log standard per convogliare lo stdout/stderr strutturato
    if (level === "ERROR") {
      console.error(JSON.stringify(payload));
    } else if (level === "WARN") {
      console.warn(JSON.stringify(payload));
    } else {
      console.log(JSON.stringify(payload));
    }
  } else {
    // Formato colorato e leggibile per lo sviluppo locale
    const color = {
      INFO: "\x1b[32m",  // Verde
      WARN: "\x1b[33m",  // Giallo
      ERROR: "\x1b[31m", // Rosso
      DEBUG: "\x1b[36m"  // Ciano
    }[level];
    const reset = "\x1b[0m";
    const correlationStr = correlationId ? ` [CID: ${correlationId}]` : "";

    if (level === "ERROR") {
      console.error(`${color}[${timestamp}] [${level}]${correlationStr} ${message}${reset}`, details !== undefined ? details : "");
    } else if (level === "WARN") {
      console.warn(`${color}[${timestamp}] [${level}]${correlationStr} ${message}${reset}`, details !== undefined ? details : "");
    } else {
      console.log(`${color}[${timestamp}] [${level}]${correlationStr} ${message}${reset}`, details !== undefined ? details : "");
    }
  }
}

export const logger = {
  info: (message: string, details?: unknown) => log("INFO", message, details),
  warn: (message: string, details?: unknown) => log("WARN", message, details),
  error: (message: string, details?: unknown) => log("ERROR", message, details),
  debug: (message: string, details?: unknown) => log("DEBUG", message, details)
};

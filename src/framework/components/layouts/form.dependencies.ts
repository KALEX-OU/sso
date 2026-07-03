// Dipendenze condizionali di visibilità dei campi dei form dinamici (estratte da Form.tsx — F5.3).
// Struttura: moduleId → funzione(values) → mappa campo→visibile (false = campo nascosto).
// Per aggiungere le regole di un nuovo modulo si edita SOLO questo file, non Form.tsx.

export const FIELD_DEPENDENCIES: Record<string, (values: Record<string, unknown>) => Record<string, boolean>> = {
  organization: (values) => {
    const type = (values?.type as string) || "business";
    return {
      vatNumber: type !== "personal",
      fiscalCode: ["personal", "business"].includes(type),
      sdiCode: type === "business",
      officeCode: type === "government",
      cigCode: type === "government",
      cupCode: type === "government"
    };
  }
};

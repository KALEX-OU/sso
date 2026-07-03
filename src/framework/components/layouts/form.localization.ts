// Localizzazione statica dei form dinamici del framework (estratta da Form.tsx — F5.3).
// Struttura: lingua → moduleId → campo → { label, placeholder?, options? }.
// Per aggiungere le etichette di un nuovo modulo si edita SOLO questo file, non Form.tsx.

export interface OptionItem {
  value: string;
  label: string;
}

export const LOCALIZATION: Record<string, Record<string, Record<string, { label: string; placeholder?: string; options?: OptionItem[] }>>> = {
  it: {
    user: {
      fullName: { label: "Nome e Cognome", placeholder: "E.g. Mario Rossi" },
      email: { label: "Email (Sola Lettura)", placeholder: "E.g. mario@example.com" },
      mobile: { label: "Telefono Cellulare", placeholder: "E.g. +39 347 1234567" },
      locale: {
        label: "Lingua dell'Interfaccia",
        options: [
          { value: "it", label: "Italiano (IT)" },
          { value: "en", label: "English (EN)" },
          { value: "es", label: "Español (ES)" }
        ]
      },
      theme: {
        label: "Tema Grafico",
        options: [
          { value: "light", label: "Tema Chiaro (Light)" },
          { value: "dark", label: "Tema Scuro (Dark)" }
        ]
      },
      avatarUrl: { label: "URL Avatar", placeholder: "E.g. https://..." }
    },
    organization: {
      name: { label: "Ragione Sociale / Nome", placeholder: "E.g. KALEX S.r.l." },
      type: {
        label: "Tipologia Organizzazione",
        options: [
          { value: "personal", label: "Personale (B2C / Consumatore)" },
          { value: "business", label: "Azienda / Libero Professionista (B2B)" },
          { value: "government", label: "Ente Pubblico / Pubblica Amministrazione (B2G)" },
          { value: "education", label: "Istituzione Educativa / Università (B2E)" }
        ]
      },
      country: { label: "Paese", placeholder: "E.g. IT" },
      vatNumber: { label: "Partita IVA", placeholder: "E.g. IT01234567890" },
      fiscalCode: { label: "Codice Fiscale", placeholder: "E.g. RSSMRA80A01H501U" },
      address: { label: "Indirizzo Sede", placeholder: "E.g. Via Roma 1, 00100 Roma RM" },
      billingAddress: { label: "Indirizzo di Fatturazione", placeholder: "E.g. Via Roma 1, 00100 Roma RM" },
      sdiCode: { label: "Codice Destinatario (SDI)", placeholder: "E.g. SUBM19N" },
      officeCode: { label: "Codice Univoco Ufficio (iPA)", placeholder: "E.g. UF23N9" },
      cigCode: { label: "Codice CIG (Gara)", placeholder: "E.g. Z123456789" },
      cupCode: { label: "Codice CUP (Progetto)", placeholder: "E.g. G12345678901234" }
    },
    thing: {
      name: { label: "Nome Dispositivo", placeholder: "E.g. Sensore Temperatura A" },
      type: {
        label: "Tipo Dispositivo",
        options: [
          { value: "sensor", label: "Sensore" },
          { value: "camera", label: "Telecamera" },
          { value: "gateway", label: "Gateway" },
          { value: "controller", label: "Controller" }
        ]
      },
      status: { label: "Stato" },
      metadata: { label: "Metadati Hardware (JSON)", placeholder: 'e.g. {"firmware": "v1.2.0"}' }
    },
    apikey: {
      name: { label: "Nome Chiave", placeholder: "E.g. Integrazione CRM" },
      description: { label: "Descrizione", placeholder: "E.g. Usata per caricare le info sui sensori" },
      ipWhitelist: { label: "IP Whitelist (Separati da virgole)", placeholder: "E.g. 192.168.1.1, 93.40.10.99" },
      isTest: { label: "Sandbox Test Key" },
      permissions: { label: "Permessi (Array JSON Scopes)", placeholder: 'e.g. [{"moduleId": "thing", "canCreate": true}]' }
    }
  },
  en: {
    user: {
      fullName: { label: "Full Name", placeholder: "E.g. John Doe" },
      email: { label: "Email (Read Only)", placeholder: "E.g. john@example.com" },
      mobile: { label: "Mobile Phone", placeholder: "E.g. +39 347 1234567" },
      locale: {
        label: "Interface Language",
        options: [
          { value: "it", label: "Italian (IT)" },
          { value: "en", label: "English (EN)" },
          { value: "es", label: "Spanish (ES)" }
        ]
      },
      theme: {
        label: "Graphic Theme",
        options: [
          { value: "light", label: "Light Theme" },
          { value: "dark", label: "Dark Theme" }
        ]
      },
      avatarUrl: { label: "Avatar URL", placeholder: "E.g. https://..." }
    },
    organization: {
      name: { label: "Organization Name", placeholder: "E.g. KALEX Ltd." },
      type: {
        label: "Organization Type",
        options: [
          { value: "personal", label: "Personal (B2C / Consumer)" },
          { value: "business", label: "Business / Freelancer (B2B)" },
          { value: "government", label: "Public Administration (B2G)" },
          { value: "education", label: "Educational Institution (B2E)" }
        ]
      },
      country: { label: "Country", placeholder: "E.g. IT" },
      vatNumber: { label: "VAT Number", placeholder: "E.g. IT01234567890" },
      fiscalCode: { label: "Tax Code", placeholder: "E.g. RSSMRA80A01H501U" },
      address: { label: "Registered Office Address", placeholder: "E.g. 1 Main St, London" },
      billingAddress: { label: "Billing Address", placeholder: "E.g. 1 Main St, London" },
      sdiCode: { label: "SDI Recipient Code", placeholder: "E.g. SUBM19N" },
      officeCode: { label: "iPA Office Code", placeholder: "E.g. UF23N9" },
      cigCode: { label: "CIG Code (Tender)", placeholder: "E.g. Z123456789" },
      cupCode: { label: "CUP Code (Project)", placeholder: "E.g. G12345678901234" }
    },
    thing: {
      name: { label: "Device Name", placeholder: "E.g. Temp Sensor A" },
      type: {
        label: "Device Type",
        options: [
          { value: "sensor", label: "Sensor" },
          { value: "camera", label: "Camera" },
          { value: "gateway", label: "Gateway" },
          { value: "controller", label: "Controller" }
        ]
      },
      status: { label: "Status" },
      metadata: { label: "Hardware Metadata (JSON)", placeholder: 'e.g. {"firmware": "v1.2.0"}' }
    },
    apikey: {
      name: { label: "Key Name", placeholder: "E.g. CRM Integration" },
      description: { label: "Description", placeholder: "E.g. Used for sensor APIs" },
      ipWhitelist: { label: "IP Whitelist (Comma separated)", placeholder: "E.g. 192.168.1.1, 93.40.10.99" },
      isTest: { label: "Sandbox Test Key" },
      permissions: { label: "Permissions (JSON Scopes Array)", placeholder: 'e.g. [{"moduleId": "thing", "canCreate": true}]' }
    }
  },
  es: {
    user: {
      fullName: { label: "Nombre y Apellido", placeholder: "Ej. Mario Rossi" },
      email: { label: "Correo Electrónico (Solo Lectura)", placeholder: "Ej. mario@example.com" },
      mobile: { label: "Teléfono Móvil", placeholder: "Ej. +39 347 1234567" },
      locale: {
        label: "Idioma de la Interfaz",
        options: [
          { value: "it", label: "Italiano (IT)" },
          { value: "en", label: "Inglés (EN)" },
          { value: "es", label: "Español (ES)" }
        ]
      },
      theme: {
        label: "Tema Gráfico",
        options: [
          { value: "light", label: "Tema Claro" },
          { value: "dark", label: "Tema Oscuro" }
        ]
      },
      avatarUrl: { label: "URL del Avatar", placeholder: "Ej. https://..." }
    },
    organization: {
      name: { label: "Razón Social / Nombre", placeholder: "Ej. KALEX S.r.l." },
      type: {
        label: "Tipo de Organización",
        options: [
          { value: "personal", label: "Personal (B2C / Consumidor)" },
          { value: "business", label: "Empresa / Profesional (B2B)" },
          { value: "government", label: "Administración Pública (B2G)" },
          { value: "education", label: "Institución Educativa (B2E)" }
        ]
      },
      country: { label: "País", placeholder: "Ej. IT" },
      vatNumber: { label: "Número de IVA", placeholder: "Ej. IT01234567890" },
      fiscalCode: { label: "Código Fiscal", placeholder: "Ej. RSSMRA80A01H501U" },
      address: { label: "Dirección de la Sede", placeholder: "Ej. Via Roma 1, Roma" },
      billingAddress: { label: "Dirección de Facturación", placeholder: "Ej. Via Roma 1, Roma" },
      sdiCode: { label: "Código SDI", placeholder: "Ej. SUBM19N" },
      officeCode: { label: "Código iPA", placeholder: "Ej. UF23N9" },
      cigCode: { label: "Código CIG", placeholder: "Ej. Z123456789" },
      cupCode: { label: "Código CUP", placeholder: "Ej. G12345678901234" }
    },
    thing: {
      name: { label: "Nombre del Dispositivo", placeholder: "Ej. Sensor de Temp" },
      type: {
        label: "Tipo de Dispositivo",
        options: [
          { value: "sensor", label: "Sensor" },
          { value: "camera", label: "Cámara" },
          { value: "gateway", label: "Gateway" },
          { value: "controller", label: "Controlador" }
        ]
      },
      status: { label: "Estado" },
      metadata: { label: "Metadatos de Hardware (JSON)", placeholder: 'ej. {"firmware": "v1.2.0"}' }
    },
    apikey: {
      name: { label: "Nombre de la Clave", placeholder: "Ej. Integración de CRM" },
      description: { label: "Descripción", placeholder: "Ej. Usada para APIs de sensores" },
      ipWhitelist: { label: "Lista Blanca de IP (Separados por comas)", placeholder: "Ej. 192.168.1.1, 93.40.10.99" },
      isTest: { label: "Clave de Prueba de Sandbox" },
      permissions: { label: "Permisos (JSON Scopes Array)", placeholder: 'ej. [{"moduleId": "thing", "canCreate": true}]' }
    }
  }
};

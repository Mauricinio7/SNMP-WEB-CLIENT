export type SystemSnapshot = {
  ts: number;             // timestamp
  hostname: string;       // nombre del host
  description: string;    // descripción del SO
  uptimeSeconds: number;  // tiempo encendido
  contact?: string;       // contacto admin
  location?: string;      // ubicación
  temperatureC?: number;  // temperatura CPU (si está disponible)
};
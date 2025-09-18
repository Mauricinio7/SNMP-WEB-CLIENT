export type SystemSnapshot = {
  ts: number;             // timestamp
  hostname: string;       // nombre del host
  description: string;    // descripción del SO
  uptimeSeconds: number;  // tiempo encendido
  contact?: string;       // contacto admin
  location?: string;      // ubicación
  temperatureC?: number;  // temperatura CPU (si está disponible)
};

export async function fetchSystemSnapshot(pcId: number): Promise<SystemSnapshot> {
  // Simulación — luego aquí metes SNMP real
  await new Promise((r) => setTimeout(r, 300));
    return {
    ts: Date.now(),
    hostname: `pc-${pcId}`,
    description: "Ubuntu 22.04 LTS", // 👈 cumple el tipo
    uptimeSeconds: 123456,
    contact: "admin@example.com",
    location: "Data Center 1",
    temperatureC: 44.2, // si quieres simular
    };
}
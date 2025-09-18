export type SystemSnapshot = {
  ts: number;             // timestamp
  hostname: string;       // nombre del host
  osName: string;         // sistema operativo
  osVersion: string;      // versión del SO
  uptimeSeconds: number;  // tiempo encendido
  load1: number;          // load avg 1 min
  load5: number;          // load avg 5 min
  load15: number;         // load avg 15 min
};

export type MemoryHistoryPoint = { t: string; ramUsedPct: number; swapUsedPct: number };

export type MemorySeries = {
	now: SystemSnapshot;
	history: MemoryHistoryPoint[];
};
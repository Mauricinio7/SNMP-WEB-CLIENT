import { MemorySeries } from "./types";

export async function fetchMemorySNMP(pcId: number): Promise<MemorySeries> {
	await new Promise((r) => setTimeout(r, 300));

	const total = 8 * 1024 ** 3;
	const swapTotal = 2 * 1024 ** 3;

	const base = Date.now() - 5 * 60 * 1000;
	const history = Array.from({ length: 30 }, (_, i) => {
		const used = 0.4 + 0.1 * Math.sin(i / 5);
		const swap = 0.1 + 0.05 * Math.cos(i / 6);
		return {
			t: new Date(base + i * 10_000).toLocaleTimeString([], {
				hour12: false,
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			}),
			ramUsedPct: Math.round(used * 100),
			swapUsedPct: Math.max(0, Math.round(swap * 100)),
		};
	});

	const last = history[history.length - 1];

	return {
		now: {
			ts: Date.now(),
			totalBytes: total,
			usedBytes: Math.round((last.ramUsedPct / 100) * total),
			availBytes: Math.round(((100 - last.ramUsedPct) / 100) * total),
			buffersBytes: 256 * 1024 ** 2,
			cachedBytes: 1.2 * 1024 ** 3,
			swapTotalBytes: swapTotal,
			swapUsedBytes: Math.round((last.swapUsedPct / 100) * swapTotal),
		},
		history,
	};
}

/** Cuando tengas backend, crea memory.service.ts y exporta un fetch real con misma firma. */

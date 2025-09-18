export type CpuSnapshot = {
	ts: number;
	usagePct: number;
	cores: number;
	uptimeSec: number;
};

export async function fetchCpuSnapshot(pcId: number): Promise<CpuSnapshot> {
	await new Promise((r) => setTimeout(r, 300));

	const baseUsage = pcId % 2 ? 10 : 23;
	const jitter = Math.floor(Math.random() * 5);
	const usagePct = Math.min(100, Math.max(0, baseUsage + jitter));

	return {
		ts: Date.now(),
		usagePct,
		cores: pcId % 3 === 0 ? 8 : 6,
		uptimeSec: 5 * 3600 + pcId * 97,
	};
}

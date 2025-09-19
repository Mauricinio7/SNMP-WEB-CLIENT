import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

export type CpuSnapshot = {
	ts: number;
	cpu_cores: number;
	cpu_usage_per_core: number[];
	cpu_usage_avg: number;
	uptime_ticks: string | number;
	cpu_idle_percent: number;
	cpu_global_usage_percent: number;
};

export function useCpuInfo(pcId: number) {
	const [data, setData] = useState<CpuSnapshot | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let alive = true;
		setLoading(true);
		setError(null);

		fetch(`${API}/snmp/cpu/${pcId}`)
			.then(async (res) => {
				if (!res.ok) throw new Error(`Error ${res.status}`);
				return res.json();
			})
			.then((json) => {
				if (alive) setData({ ts: Date.now(), ...json });
			})
			.catch((e) => {
				if (alive) setError(e as Error);
			})
			.finally(() => {
				if (alive) setLoading(false);
			});

		return () => {
			alive = false;
		};
	}, [pcId]);

	function ticksToSeconds(ticks?: string | number): number {
		const n = Number(ticks);
		if (!Number.isFinite(n) || n < 0) return 0;
		return Math.floor(n / 100);
	}

	function formatUptime(sec?: number): string {
		if (!Number.isFinite(sec as number) || (sec as number) < 0) return "-";
		const s = Math.floor(sec as number);
		const d = Math.floor(s / 86400);
		const h = Math.floor((s % 86400) / 3600);
		const m = Math.floor((s % 3600) / 60);
		const r = s % 60;

		if (d > 0) return `${d}d ${h}h ${m}m ${r}s`;
		if (h > 0) return `${h}h ${m}m ${r}s`;
		if (m > 0) return `${m}m ${r}s`;
		return `${r}s`;
	}

	const uptimeSeconds = ticksToSeconds(data?.uptime_ticks);
	const uptimeLabel = formatUptime(uptimeSeconds);

	return { data, loading, error, uptimeSeconds, uptimeLabel, formatUptime, ticksToSeconds };
}

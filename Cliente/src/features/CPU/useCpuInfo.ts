import { useEffect, useState } from "react";

export type CpuSnapshot = {
	ts: number;
	cpu_cores: number;
	cpu_usage_per_core: number[];
	cpu_usage_avg: number;
	uptime_ticks: string;
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

		fetch(`http://127.0.0.1:8000/snmp/cpu/${pcId}`)
			.then(async (res) => {
				if (!res.ok) throw new Error(`Error ${res.status}`);
				return res.json();
			})
			.then((json) => {
				if (alive) {
					setData({ ts: Date.now(), ...json });
					setLoading(false);
				}
			})
			.catch((e) => {
				if (alive) {
					setError(e as Error);
					setLoading(false);
				}
			});

		return () => {
			alive = false;
		};
	}, [pcId]);

	return { data, loading, error };
}

export function formatUptime(sec?: number) {
	if (!sec || sec < 0) return "-";
	const d = Math.floor(sec / 86400);
	const h = Math.floor((sec % 86400) / 3600);
	const m = Math.floor((sec % 3600) / 60);

	if (d > 0) return `${d}d ${h}h`;
	if (h > 0) return `${h}h ${m}m`;
	return `${m}m`;
}

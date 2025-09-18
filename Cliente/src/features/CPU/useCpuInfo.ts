import { useEffect, useState } from "react";
import { fetchCpuSnapshot, type CpuSnapshot } from "./cpu.service.mock";

export function useCpuInfo(pcId: number) {
	const [data, setData] = useState<CpuSnapshot | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let alive = true;
		setLoading(true);
		setError(null);

		fetchCpuSnapshot(pcId)
			.then((d) => {
				if (alive) {
					setData(d);
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

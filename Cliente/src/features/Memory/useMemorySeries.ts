import { useEffect, useMemo, useState } from "react";
import { fetchMemorySnapshot, type MemorySnapshot } from "./memory.service.mock";

export function useMemorySeries(pcId: number) {
	const [data, setData] = useState<MemorySnapshot | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let alive = true;
		setLoading(true);
		setError(null);

		fetchMemorySnapshot(pcId)
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

	const pct = useMemo(() => {
		if (!data) return { ram: 0, swap: 0 };
		const ram = data.totalBytes ? Math.round((data.usedBytes / data.totalBytes) * 100) : 0;
		const swap = data.swapTotalBytes
			? Math.round(((data.swapUsedBytes ?? 0) / data.swapTotalBytes) * 100)
			: 0;
		return { ram, swap };
	}, [data]);

	return { data, loading, error, pct };
}

export function formatBytes(n?: number) {
	if (n == null) return "-";
	const units = ["B", "KB", "MB", "GB", "TB"];
	let i = 0;
	let v = n;
	while (v >= 1024 && i < units.length - 1) {
		v /= 1024;
		i++;
	}
	return `${v.toFixed(v >= 100 ? 0 : v >= 10 ? 1 : 2)} ${units[i]}`;
}

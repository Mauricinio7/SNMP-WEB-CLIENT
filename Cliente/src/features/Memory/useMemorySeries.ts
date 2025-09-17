import { useEffect, useMemo, useState } from "react";
import { fetchMemorySNMP } from "./memory.service.mock";
import { MemorySeries } from "./types";

export function useMemorySeries(pcId: number) {
	const [data, setData] = useState<MemorySeries | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let alive = true;
		setLoading(true);
		setError(null);

		fetchMemorySNMP(pcId)
			.then((d) => {
				if (!alive) return;
				setData(d);
				setLoading(false);
			})
			.catch((e) => {
				if (!alive) return;
				setError(e as Error);
				setLoading(false);
			});

		return () => {
			alive = false;
		};
	}, [pcId]);

	const pct = useMemo(() => {
		if (!data) return { ram: 0, swap: 0 };
		const { now } = data;
		const ram = now.totalBytes ? Math.round((now.usedBytes / now.totalBytes) * 100) : 0;
		const swap = now.swapTotalBytes
			? Math.round(((now.swapUsedBytes ?? 0) / now.swapTotalBytes) * 100)
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

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import style from "./DeviceComponentCard.module.css";
import {
	cpuPath,
	memoryPath,
	diskPath,
	systemPath,
	networkPath,
} from "../../app/routeManager/pages.paths";

import {
	fetchDeviceComponent,
	type DeviceComponentType,
	type DeviceComponentData,
} from "./deviceComponentsInfo";

import RadialGauge from "../../shared/ui/RadialGauge";
import BarGauge from "../../shared/ui/BarGauge";

const TITLE: Record<DeviceComponentType, string> = {
	cpu: "CPU",
	memory: "Memoria",
	disk: "Disco",
	system: "Sistema",
	network: "Red",
};

type Props = { id: number; type: DeviceComponentType };

export default function DeviceComponentCard({ id, type }: Props) {
	const [data, setData] = useState<DeviceComponentData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let alive = true;
		setLoading(true);
		fetchDeviceComponent(id, type)
			.then((d) => {
				if (alive) {
					setData(d);
					setLoading(false);
				}
			})
			.catch(() => {
				if (alive) setLoading(false);
			});
		return () => {
			alive = false;
		};
	}, [id, type]);

	const href = (() => {
		switch (type) {
			case "cpu":
				return cpuPath(id);
			case "memory":
				return memoryPath(id);
			case "disk":
				return diskPath(id);
			case "system":
				return systemPath(id);
			case "network":
				return networkPath(id);
		}
	})();

	const gauges = useMemo(() => {
		if (!data) return { show: false as const };
		if (data.type === "cpu") {
			const val = Number(data.data.usageAvg) || 0;
			return {
				show: true as const,
				kind: "radial" as const,
				value: val,
				unit: "%",
				label: "Uso promedio CPU",
			};
		}
		if (data.type === "memory") {
			const val = Number((data.data as any).percent) || 0;
			return {
				show: true as const,
				kind: "radial" as const,
				value: val,
				unit: "%",
				label: "Uso Memoria",
			};
		}

		if (data.type === "disk") {
			const val = Number(data.data.usedPct) || 0;
			return {
				show: true as const,
				kind: "radial" as const,
				value: val,
				unit: "%",
				label: "Uso Disco",
			};
		}
		if (data.type === "system") {
			const raw = (data.data as any).cpuTemp;
			const temp = typeof raw === "string" ? parseFloat(raw) : Number(raw);
			return {
				show: true as const,
				kind: "bar" as const,
				value: isNaN(temp) ? 0 : temp,
				unit: "°C",
				label: "Temperatura CPU",
			};
		}

		return { show: false as const };
	}, [data]);

	return (
		<Link to={href} className={style.card} aria-label={`Abrir ${TITLE[type]} de PC ${id}`}>
			<div className={style.header}>{TITLE[type]}</div>

			{loading ? (
				<p className={style.name}>Cargando…</p>
			) : data ? (
				<>
					{data.type === "cpu" && (
						<dl className={style.meta}>
							<div className={style.row}>
								<dt>Cores:</dt>
								<dd>{data.data.cores}</dd>
							</div>
							<div className={style.row}>
								<dt>Uso promedio:</dt>
								<dd>{data.data.usageAvg}%</dd>
							</div>
							<div className={style.row}>
								<dt>Uso global:</dt>
								<dd>{data.data.globalUsage}%</dd>
							</div>
							<div className={style.row}>
								<dt>Idle:</dt>
								<dd>{data.data.idlePercent}%</dd>
							</div>
						</dl>
					)}

					{data.type === "memory" && (
						<dl className={style.meta}>
							<div className={style.row}>
								<dt>Tamaño:</dt>
								<dd>{data.data.size}</dd>
							</div>
							<div className={style.row}>
								<dt>Uso:</dt>
								<dd>{data.data.used}</dd>
							</div>
							<div className={style.row}>
								<dt>Porcentaje:</dt>
								<dd>{(data.data as any).percent}%</dd>
							</div>
						</dl>
					)}

					{data.type === "disk" && (
						<dl className={style.meta}>
							<div className={style.row}>
								<dt>Particiones:</dt>
								<dd>{data.data.partitions.length}</dd>
							</div>
							<div className={style.row}>
								<dt>Tamaño total:</dt>
								<dd>{(data.data.totalKB / (1024 * 1024)).toFixed(2)} GB</dd>
							</div>
							<div className={style.row}>
								<dt>Usado total:</dt>
								<dd>
									{(data.data.usedTotalKB / (1024 * 1024)).toFixed(2)} GB ({data.data.usedPct}%)
								</dd>
							</div>
							{(() => {
								const { sizeKB, usedKB, partitions } = data.data;
								if (!sizeKB.length) return null;
								const idx = usedKB.indexOf(Math.max(...usedKB));
								const pUsedPct = sizeKB[idx] ? Math.round((usedKB[idx] / sizeKB[idx]) * 100) : 0;
								return (
									<>
										<div className={style.row}>
											<dt>Más usada (partición #{partitions[idx] ?? idx}):</dt>
											<dd>
												{(usedKB[idx] / (1024 * 1024)).toFixed(2)} GB /{" "}
												{(sizeKB[idx] / (1024 * 1024)).toFixed(2)} GB ({pUsedPct}%)
											</dd>
										</div>
									</>
								);
							})()}
						</dl>
					)}

					{data.type === "system" && (
						<dl className={style.meta}>
							<div className={style.row}>
								<dt>Nombre:</dt>
								<dd>{data.data.name}</dd>
							</div>
							<div className={style.row}>
								<dt>Uptime:</dt>
								<dd>{data.data.uptime}</dd>
							</div>
							<div className={style.row}>
								<dt>Temperatura CPU:</dt>
								<dd>{data.data.cpuTemp}</dd>
							</div>
						</dl>
					)}

					{data.type === "network" && (
						<dl className={style.meta}>
							<div className={style.row}>
								<dt>IPs:</dt>
								<dd>
									{(data.data as any).ipList?.length ? (data.data as any).ipList.join(", ") : "-"}
								</dd>
							</div>
							<div className={style.row}>
								<dt>Máscaras:</dt>
								<dd>
									{(data.data as any).maskList?.length
										? (data.data as any).maskList.join(", ")
										: "-"}
								</dd>
							</div>
							<div className={style.row}>
								<dt>Forwarding:</dt>
								<dd>{(data.data as any).forwarding ? "Sí" : "No"}</dd>
							</div>
							<div className={style.row}>
								<dt>TCP:</dt>
								<dd>{(data.data as any).tcpEnabled ? "Activo" : "Inactivo"}</dd>
							</div>
						</dl>
					)}
					<div className={style.chart}>
						{gauges.show && gauges.kind === "radial" && (
							<RadialGauge value={gauges.value} unit={gauges.unit} label={gauges.label} />
						)}
						{gauges.show && gauges.kind === "bar" && (
							<BarGauge value={gauges.value} unit={gauges.unit} label={gauges.label} />
						)}
					</div>
				</>
			) : (
				<p style={{ color: "red" }}>Error al cargar datos</p>
			)}
		</Link>
	);
}

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
			const val = Number(data.data.globalUsage) || 0;
			return {
				show: true as const,
				kind: "radial" as const,
				value: val,
				unit: "%",
				label: "Uso CPU",
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
			const raw = (data.data as any).used;
			const val = typeof raw === "string" ? parseFloat(raw) : Number(raw);
			return {
				show: true as const,
				kind: "radial" as const,
				value: isNaN(val) ? 0 : val,
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
								<dt>Tamaño:</dt>
								<dd>{data.data.size}</dd>
							</div>
							<div className={style.row}>
								<dt>Usado:</dt>
								<dd>{data.data.used}</dd>
							</div>
							<div className={style.row}>
								<dt>Escritura:</dt>
								<dd>{data.data.write}</dd>
							</div>
							<div className={style.row}>
								<dt>Lectura:</dt>
								<dd>{data.data.read}</dd>
							</div>
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
								<dt>Interfaz:</dt>
								<dd>{data.data.iface}</dd>
							</div>
							<div className={style.row}>
								<dt>Link:</dt>
								<dd>{data.data.linkSpeedMbps} Mb/s</dd>
							</div>
							<div className={style.row}>
								<dt>Subida:</dt>
								<dd>{data.data.upMbps} Mb/s</dd>
							</div>
							<div className={style.row}>
								<dt>Bajada:</dt>
								<dd>{data.data.downMbps} Mb/s</dd>
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

						{data.type === "network" && (
							<div
								style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%" }}
							>
								<BarGauge
									value={data.data.upMbps}
									max={data.data.linkSpeedMbps}
									unit=" Mb/s"
									label="Subida"
									warnAt={Math.round(data.data.linkSpeedMbps * 0.6)}
									dangerAt={Math.round(data.data.linkSpeedMbps * 0.85)}
								/>
								<BarGauge
									value={data.data.downMbps}
									max={data.data.linkSpeedMbps}
									unit=" Mb/s"
									label="Bajada"
									warnAt={Math.round(data.data.linkSpeedMbps * 0.6)}
									dangerAt={Math.round(data.data.linkSpeedMbps * 0.85)}
								/>
							</div>
						)}
					</div>
				</>
			) : (
				<p style={{ color: "red" }}>Error al cargar datos</p>
			)}
		</Link>
	);
}

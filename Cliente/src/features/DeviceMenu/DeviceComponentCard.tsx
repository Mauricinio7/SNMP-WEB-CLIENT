// src/features/MainMenu/DeviceComponentCard.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "./DeviceComponentCard.module.css";
import { cpuPath, memoryPath, diskPath, systemPath } from "../../app/routeManager/pages.paths";

import {
	fetchDeviceComponent,
	type DeviceComponentType,
	type DeviceComponentData,
} from "./mockDevice";

const TITLE: Record<DeviceComponentType, string> = {
	cpu: "CPU",
	memory: "Memoria",
	disk: "Disco",
	system: "Sistema",
};

type Props = {
	id: number;
	type: DeviceComponentType;
};

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
		}
	})();

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
								<dt>Modelo:</dt>
								<dd>{data.data.model}</dd>
							</div>
							<div className={style.row}>
								<dt>Uso:</dt>
								<dd>{data.data.usage}%</dd>
							</div>
							<div className={style.row}>
								<dt>Cores:</dt>
								<dd>{data.data.cores}</dd>
							</div>
							<div className={style.row}>
								<dt>Tiempo:</dt>
								<dd>{data.data.uptime}</dd>
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
								<dd>{data.data.percent}%</dd>
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
							<div className={style.row}>
								<dt>Temperatura GPU:</dt>
								<dd>{data.data.gpuTemp}</dd>
							</div>
						</dl>
					)}
				</>
			) : (
				<p style={{ color: "red" }}>Error al cargar datos</p>
			)}
		</Link>
	);
}

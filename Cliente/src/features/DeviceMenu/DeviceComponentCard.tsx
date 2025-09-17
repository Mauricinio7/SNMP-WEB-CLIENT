import { Link } from "react-router-dom";
import style from "./DeviceComponentCard.module.css";
import { pcComponentPath } from "../../app/routeManager/pages.paths";
import { useEffect, useState } from "react";

export type DeviceComponentType = "cpu" | "memory" | "disk" | "system";

// TODO: Replace with real fetch from server
async function fetchMock(id: number, type: DeviceComponentType) {
	await new Promise((r) => setTimeout(r, 250));
	switch (type) {
		case "cpu":
			return {
				model: "Intel Core i7 8750H",
				usage: "10%",
				cores: "6, 12 hilos",
				uptime: "12 horas",
			};
		case "memory":
			return { size: "8 gb", used: "4 gb", percent: "50%" };
		case "disk":
			return { size: "2 tb", used: "50%", write: "500 mb/s", read: "0 mb/s" };
		case "system":
			return { name: "AN-515-52STMP1", uptime: "15 horas", cpuTemp: "50°", gpuTemp: "47°" };
	}
}

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
	const [data, setData] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let alive = true;
		setLoading(true);
		fetchMock(id, type).then((d) => {
			if (alive) {
				setData(d);
				setLoading(false);
			}
		});
		return () => {
			alive = false;
		};
	}, [id, type]);

	return (
		<Link
			to={pcComponentPath(id, type)}
			className={style.card}
			aria-label={`Abrir ${TITLE[type]} de PC ${id}`}
		>
			<div className={style.header}>{TITLE[type]}</div>

			{loading ? (
				<p className={style.name}>Cargando…</p>
			) : (
				<>
					{type === "cpu" && (
						<dl className={style.meta}>
							<div className={style.row}>
								<dt>Modelo:</dt>
								<dd>{data.model}</dd>
							</div>
							<div className={style.row}>
								<dt>Uso:</dt>
								<dd>{data.usage}</dd>
							</div>
							<div className={style.row}>
								<dt>Cores:</dt>
								<dd>{data.cores}</dd>
							</div>
							<div className={style.row}>
								<dt>Tiempo:</dt>
								<dd>{data.uptime}</dd>
							</div>
						</dl>
					)}

					{type === "memory" && (
						<dl className={style.meta}>
							<div className={style.row}>
								<dt>Tamaño:</dt>
								<dd>{data.size}</dd>
							</div>
							<div className={style.row}>
								<dt>Uso:</dt>
								<dd>{data.used}</dd>
							</div>
							<div className={style.row}>
								<dt>Porcentaje:</dt>
								<dd>{data.percent}</dd>
							</div>
						</dl>
					)}

					{type === "disk" && (
						<dl className={style.meta}>
							<div className={style.row}>
								<dt>Tamaño:</dt>
								<dd>{data.size}</dd>
							</div>
							<div className={style.row}>
								<dt>Usado:</dt>
								<dd>{data.used}</dd>
							</div>
							<div className={style.row}>
								<dt>Escritura:</dt>
								<dd>{data.write}</dd>
							</div>
							<div className={style.row}>
								<dt>Lectura:</dt>
								<dd>{data.read}</dd>
							</div>
						</dl>
					)}

					{type === "system" && (
						<dl className={style.meta}>
							<div className={style.row}>
								<dt>Nombre:</dt>
								<dd>{data.name}</dd>
							</div>
							<div className={style.row}>
								<dt>Uptime:</dt>
								<dd>{data.uptime}</dd>
							</div>
							<div className={style.row}>
								<dt>Temperatura CPU:</dt>
								<dd>{data.cpuTemp}</dd>
							</div>
							<div className={style.row}>
								<dt>Temperatura GPU:</dt>
								<dd>{data.gpuTemp}</dd>
							</div>
						</dl>
					)}
				</>
			)}
		</Link>
	);
}

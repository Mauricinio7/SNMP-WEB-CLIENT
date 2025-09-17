import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "./DeviceCard.module.css";
import { OsLogo } from "../../shared/ui/OsLogo";
import { pcPath } from "../../app/routeManager/pages.paths";
import { fetchDeviceById, type Device } from "./mockDevices";

type Props = { id: number; to?: string };

export default function DeviceCard({ id, to }: Props) {
	const [data, setData] = useState<Device | null>(null);
	const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

	useEffect(() => {
		let alive = true;
		setStatus("loading");
		fetchDeviceById(id)
			.then((d) => {
				if (alive) {
					setData(d);
					setStatus("ready");
				}
			})
			.catch(() => {
				if (alive) setStatus("error");
			});
		return () => {
			alive = false;
		};
	}, [id]);

	const href = to ?? pcPath(id);

	const name = status === "ready" ? data?.name ?? "Desconocido" : "Cargando …";
	const os = status === "ready" ? data?.os ?? "Desconocido" : "Cargando …";
	const cpu = status === "ready" ? data?.cpu ?? "Desconocido" : "Cargando …";
	const memory = status === "ready" ? data?.memory ?? "Desconocido" : "Cargando …";

	return (
		<Link to={href} className={style.card} aria-label={`Abrir detalles de PC ${id}`}>
			<div className={style.header}>PC {id}:</div>

			{status === "error" ? (
				<p style={{ color: "#b91c1c", fontWeight: 600, margin: 0 }}>
					No fue posible cargar los datos.
				</p>
			) : (
				<dl className={style.meta}>
					<h3 className={style.name}>Nombre: {name}</h3>
					<div className={style.row}>
						<dt>OS:</dt>
						<dd>{os}</dd>
					</div>
					<div className={style.row}>
						<dt>CPU:</dt>
						<dd>{cpu}</dd>
					</div>
					<div className={style.row}>
						<dt>Memoria:</dt>
						<dd>{memory}</dd>
					</div>
					<div className={style.logoWrapper}>
						{status === "ready" && data?.os && <OsLogo os={data.os} />}
					</div>
				</dl>
			)}
		</Link>
	);
}

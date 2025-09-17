import { Link } from "react-router-dom";
import style from "./DeviceCard.module.css";
import { OsLogo } from "../../shared/ui/OsLogo";
import { pcPath } from "../../app/routeManager/pages.paths";

export type DeviceCardProps = {
	id: number;
	name?: string;
	os?: string;
	cpu?: string;
	memory?: string;
	to?: string;
};

export function DeviceCard({ id, name, os, cpu, memory, to }: DeviceCardProps) {
	name = name ?? "Cargando ...";
	os = os ?? "Cargando ...";
	cpu = cpu ?? "Cargando ...";
	memory = memory ?? "Cargando ...";
	name = name ?? "Cargando ...";

	if (true) {
		//TODO: Try to load from the server the real data
	} else {
		name = "Desconocido";
		os = "Desconocido";
		cpu = "Desconocido";
		memory = "Desconocido";
		name = "Desconocido";
	}

	return (
		<Link to={pcPath(id)} className={style.card} aria-label={`Abrir detalles de PC ${id}`}>
			<div className={style.header}>PC {id}:</div>
			<h3 className={style.name}>Nombre: {name}</h3>

			<dl className={style.meta}>
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
					<OsLogo os={os} />
				</div>
			</dl>
		</Link>
	);
}

export default DeviceCard;

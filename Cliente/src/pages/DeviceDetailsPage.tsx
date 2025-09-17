import { useParams, Navigate } from "react-router-dom";
import DeviceComponentCard from "../features/DeviceMenu/DeviceComponentCard";
import s from "./styles/deviceDetailsPage.module.css";

export default function DeviceDetailsPage() {
	const { id } = useParams<{ id?: string }>();
	const idNum = Number(id);
	if (!id || !Number.isInteger(idNum) || idNum <= 0) {
		return <Navigate to="/not-found" replace />;
	}

	return (
		<section className={s.wrapper}>
			<h2 className={s.title}>Recursos disponibles de PC {idNum}</h2>

			<div className={s.grid}>
				<DeviceComponentCard id={idNum} type="cpu" />
				<DeviceComponentCard id={idNum} type="memory" />
				<DeviceComponentCard id={idNum} type="disk" />
				<DeviceComponentCard id={idNum} type="system" />
				<DeviceComponentCard id={idNum} type="network" />
			</div>
		</section>
	);
}

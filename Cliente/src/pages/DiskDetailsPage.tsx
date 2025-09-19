import { useParams, Navigate } from "react-router-dom";
import DiskCard from "../features/DiskMenu/DiskCard";
import s from "./styles/diskDetailsPage.module.css";

export default function DiskDetailsPage() {
	const { id } = useParams<{ id?: string }>();
	const idNum = Number(id);

	if (!id || !Number.isInteger(idNum) || idNum <= 0) {
		return <Navigate to="/not-found" replace />;
	}

	return (
		<section className={s.wrapper}>
			<h2 className={s.title}>Detalles del Disco {idNum}</h2>

			<div className={s.grid}>
				<DiskCard id={idNum} />
			</div>
		</section>
	);
}

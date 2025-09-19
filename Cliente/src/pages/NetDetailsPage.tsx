import { useParams, Navigate } from "react-router-dom";
import NetCard from "../features/Net/NetCard";
import s from "./styles/netDetailsPage.module.css";

export default function NetDetailsPage() {
	const { id } = useParams<{ id?: string }>();
	const idNum = Number(id);

	if (!id || !Number.isInteger(idNum) || idNum <= 0) {
		return <Navigate to="/not-found" replace />;
	}

	return (
		<section className={s.wrapper}>
			<h2 className={s.title}>Detalles de Red de PC {idNum}</h2>

			<div className={s.grid}>
				<NetCard id={idNum} />
			</div>
		</section>
	);
}

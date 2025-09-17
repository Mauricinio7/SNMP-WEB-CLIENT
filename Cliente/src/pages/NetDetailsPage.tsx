import { useParams, Navigate } from "react-router-dom";

export default function NetDetailsPage() {
	const { id } = useParams<{ id?: string }>();
	const n = Number(id);
	if (!id || !Number.isInteger(n) || n <= 0) return <Navigate to="/not-found" replace />;

	return (
		<section>
			<h2 style={{ textAlign: "center" }}>Red — Detalle de PC {n}</h2>
			{/* contenido específico de Red */}
		</section>
	);
}

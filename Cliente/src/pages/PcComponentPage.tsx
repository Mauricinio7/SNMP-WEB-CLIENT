import { useParams } from "react-router-dom";

export default function PcComponentPage() {
	const { id, component } = useParams<{ id: string; component: string }>();
	return (
		<section>
			<h2 style={{ textAlign: "center" }}>
				Detalle de {component?.toUpperCase()} de PC {id}
			</h2>
			<p style={{ textAlign: "center", opacity: 0.8 }}>
				Aquí pondremos gráfica/metrics en tiempo real para {component}.
			</p>
		</section>
	);
}

import DeviceCard from "../features/MainMenu/DeviceCard";
import s from "./styles/MainPage.module.css";

export default function MainPage() {
	const deviceIds = [1, 2, 3, 4];

	return (
		<section>
			<h1 className="sr-only">Administración de dispositivos disponibles</h1>
			<div className={s.grid}>
				{deviceIds.map((id) => (
					<DeviceCard key={id} id={id} />
				))}
			</div>
		</section>
	);
}

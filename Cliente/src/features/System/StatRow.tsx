import style from "./StatRow.module.css";

type Props = { label: string; value: string };

export default function StatRow({ label, value }: Props) {
	return (
		<div className={style.row}>
			<dt className={style.label}>{label}:</dt>
			<dd className={style.value}>{value}</dd>
		</div>
	);
}
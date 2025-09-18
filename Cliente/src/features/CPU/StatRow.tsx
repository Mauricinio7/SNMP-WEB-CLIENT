import s from "./StatRow.module.css";

type Props = { label: string; value: string };

export default function StatRow({ label, value }: Props) {
	return (
		<div className={s.row}>
			<dt className={s.label}>{label}:</dt>
			<dd className={s.value}>{value}</dd>
		</div>
	);
}

export default function Meter({
	value,
	low = 40,
	high = 85,
	optimum = 30,
}: {
	value: number;
	low?: number;
	high?: number;
	optimum?: number;
}) {
	return (
		<div style={{ marginTop: 12 }}>
			<meter
				value={value}
				min={0}
				max={100}
				low={low}
				high={high}
				optimum={optimum}
				style={{ width: "100%" }}
			/>
			<div style={{ textAlign: "right", fontSize: 12, opacity: 0.8 }}>{value}%</div>
		</div>
	);
}

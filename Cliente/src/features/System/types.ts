export type SystemSnapshot = {
	ts: number;
	hostname: string;
	description: string;
	uptimeSeconds: number;
	contact?: string;
	location?: string;
	temperatureC?: number;
};

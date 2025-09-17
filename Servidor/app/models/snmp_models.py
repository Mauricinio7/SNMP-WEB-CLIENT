from pydantic import BaseModel

class SNMPMetrics(BaseModel):
    device_name: str          # Nombre del dispositivo
    cpu_load: float           # Carga del CPU (%)
    ram_usage: float          # Uso de memoria RAM (%)
    disk_usage: float         # Uso de disco (%)
    temperature: float        # Temperatura del dispositivo (°C)
    bandwidth_usage: float    # Uso del ancho de banda (Mbps)
    tasks_count: int          # Número de tareas/procesos

class MemoryInfo(BaseModel):
    total_kb: int
    used_kb: int
    used_pct: float
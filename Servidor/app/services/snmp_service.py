from app.core.config import TEAM_MEMBERS
from app.utils.oids import OIDS, GENERAL_DEVICE_OIDS
from app.utils.snmp_helper import snmp_get
from app.models.snmp_models import SNMPMetrics

def get_snmp_metrics(member_id: int) -> SNMPMetrics:
    member = TEAM_MEMBERS.get(member_id)
    if not member:
        return SNMPMetrics(
            device_name="Desconocido", cpu_load=0, ram_usage=0,
            disk_usage=0, temperature=0, bandwidth_usage=0, tasks_count=0
        )

    ip = member["ip"]
    community = member["community"]

    return SNMPMetrics(
        device_name=snmp_get(ip, community, OIDS["device_name"]),
        cpu_load=float(snmp_get(ip, community, OIDS["cpu_load"])),
        ram_usage=float(snmp_get(ip, community, OIDS["ram_usage"])),
        disk_usage=float(snmp_get(ip, community, OIDS["disk_usage"])),
        temperature=float(snmp_get(ip, community, OIDS["temperature"])),
        bandwidth_usage=float(snmp_get(ip, community, OIDS["bandwidth_usage"])),
        tasks_count=int(snmp_get(ip, community, OIDS["tasks_count"]))
    )

def get_general_device_info(member_id: int) -> dict:
    member = TEAM_MEMBERS.get(member_id)
    if not member:
        return {
            "device_name": "Desconocido",
            "os_description": "Desconocido",
            "ram_size": "0"
        }

    ip = member["ip"]
    community = member["community"]

    return {
        "device_name": snmp_get(ip, community, GENERAL_DEVICE_OIDS["device_name"]),
        "os_description": snmp_get(ip, community, GENERAL_DEVICE_OIDS["os_description"]),
        "ram_size": snmp_get(ip, community, GENERAL_DEVICE_OIDS["ram_size"]),
    }
from app.core.config import TEAM_MEMBERS
from app.utils.oids import OIDS, GENERAL_DEVICE_OIDS, CPU_OIDS, SISTEM_DATA_OIDS, NET_PREVIEW_DATA_OIDS, NET_DATA_OIDS, DISK_PREVIEW_DATA_OIDS, DISK_DATA_OIDS
from app.utils.snmp_helper import snmp_get, snmp_walk
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

def get_cpu_info(device_id: int):
    device = TEAM_MEMBERS.get(device_id)
    if not device:
        return {"error": "Dispositivo no encontrado"}

    ip = device["ip"]
    community = device["community"]

    cpu_loads = snmp_walk(ip, community, CPU_OIDS["cpu_load"])
    cpu_loads = [int(val) for val in cpu_loads if val.isdigit()]
    cpu_avg = sum(cpu_loads) / len(cpu_loads) if cpu_loads else 0

    uptime_ticks = snmp_get(ip, community, CPU_OIDS["uptime"])

    cpu_idle = snmp_get(ip, community, CPU_OIDS["cpu_idle"])
    try:
        cpu_idle = int(cpu_idle)
        cpu_global_usage = 100 - cpu_idle 
    except (ValueError, TypeError):
        cpu_idle = None
        cpu_global_usage = None

    return {
        "cpu_cores": len(cpu_loads),
        "cpu_usage_per_core": cpu_loads,
        "cpu_usage_avg": cpu_avg,
        "uptime_ticks": uptime_ticks,
        "cpu_idle_percent": cpu_idle,
        "cpu_global_usage_percent": cpu_global_usage
    }

def get_system_data(member_id: int) -> dict:
    member = TEAM_MEMBERS.get(member_id)
    if not member:
        return {
            "operation_system": "Desconocido",
            "operation_uptime": "0",
            "contact": "Desconocido",
            "device_name": "Desconocido",
            "location": "Desconocido"
        }
    
    ip = member["ip"]
    community = member["community"]

    return {
        "operation_system": snmp_get(ip, community, SISTEM_DATA_OIDS["operation_system"]),
        "operation_uptime": snmp_get(ip, community, SISTEM_DATA_OIDS["operation_uptime"]),
        "contact": snmp_get(ip, community, SISTEM_DATA_OIDS["contact"]),
        "device_name": snmp_get(ip, community, SISTEM_DATA_OIDS["device_name"]),
        "location": snmp_get(ip, community, SISTEM_DATA_OIDS["location"]),
    }

def get_network_preview_data(member_id: int) -> dict:
    member = TEAM_MEMBERS.get(member_id)
    if not member:
        return {
            "web_type": "Desconocido",
            "subnet_mask": "Desconocido",
            "ip_address": "Desconocido",
            "forwarding": "Desconocido",
            "tcp_protocol": "Desconocido",
        }
    
    ip = member["ip"]
    community = member["community"]

    return {
        "web_type": snmp_walk(ip, community, NET_PREVIEW_DATA_OIDS["web_type"]),
        "subnet_mask": snmp_walk(ip, community, NET_PREVIEW_DATA_OIDS["subnet_mask"]),  # 👈 tabla
        "ip_address": snmp_walk(ip, community, NET_PREVIEW_DATA_OIDS["ip_address"]),    # 👈 tabla
        "forwarding": snmp_walk(ip, community, NET_PREVIEW_DATA_OIDS["forwarding"]),
        "tcp_protocol": snmp_get(ip, community, NET_PREVIEW_DATA_OIDS["tcp_protocol"]),
    }

def get_network_data(member_id: int) -> dict:
    member = TEAM_MEMBERS.get(member_id)
    if not member:
        return {
            "recieved_packets": "0",
            "header_errored_packets": "0",
            "address_errored_packets": "0",
            "sent_packets": "0",
            "minimun_retransmissions_time": "0",
            "maximum_retransmissions_time": "0",
            "maximun_tcp_connections": "0",
            "tcp_conections_made": "0",
            "active_tcp_connections": "0",
            "udp_packets_received": "0",
            "udp_receive_errors": "0",
        }
    
    ip = member["ip"]
    community = member["community"]

    return {
        "recieved_packets": snmp_walk(ip, community, NET_DATA_OIDS["recieved_packets"]),
        "header_errored_packets": snmp_walk(ip, community, NET_DATA_OIDS["header_errored_packets"]),
        "address_errored_packets": snmp_walk(ip, community, NET_DATA_OIDS["address_errored_packets"]),
        "sent_packets": snmp_walk(ip, community, NET_DATA_OIDS["sent_packets"]),
        "minimun_retransmissions_time": snmp_get(ip, community, NET_DATA_OIDS["minimun_retransmissions_time"]),
        "maximum_retransmissions_time": snmp_get(ip, community, NET_DATA_OIDS["maximum_retransmissions_time"]),
        "maximun_tcp_connections": snmp_get(ip, community, NET_DATA_OIDS["maximun_tcp_connections"]),
        "tcp_conections_made": snmp_get(ip, community, NET_DATA_OIDS["tcp_conections_made"]),
        "active_tcp_connections": snmp_get(ip, community, NET_DATA_OIDS["active_tcp_connections"]),
        "udp_packets_received": snmp_walk(ip, community, NET_DATA_OIDS["udp_packets_received"]),
        "udp_receive_errors": snmp_walk(ip, community, NET_DATA_OIDS["udp_receive_errors"]),
    }

def get_disk_preview_data(member_id: int) -> dict:
    member = TEAM_MEMBERS.get(member_id)
    if not member:
        return {
            "disk_partitions": "0",
            "disk_partitions_size": "0",
            "disk_partitions_used": "0",
            "disk_partitions_free": "0",
        }
    
    ip = member["ip"]
    community = member["community"]

    return {
        "disk_partitions": snmp_walk(ip, community, DISK_PREVIEW_DATA_OIDS["disk_partitions"]),
        "disk_partitions_size": snmp_walk(ip, community, DISK_PREVIEW_DATA_OIDS["disk_partitions_size"]),
        "disk_partitions_used": snmp_walk(ip, community, DISK_PREVIEW_DATA_OIDS["disk_partitions_used"]),
        "disk_partitions_free": snmp_walk(ip, community, DISK_PREVIEW_DATA_OIDS["disk_partitions_free"]),
    }

def get_disk_data(member_id: int) -> dict:
    member = TEAM_MEMBERS.get(member_id)
    if not member:
        return {
            "disk_partitions_address": "Desconocido",
            "disk_partitions_devices": "Desconocido",
            "disk_partitions_errors": "0",
        }
    
    ip = member["ip"]
    community = member["community"]

    return {
        "disk_partitions_address": snmp_walk(ip, community, DISK_DATA_OIDS["disk_partitions_address"]),
        "disk_partitions_devices": snmp_walk(ip, community, DISK_DATA_OIDS["disk_partitions_devices"]),
        "disk_partitions_errors": snmp_walk(ip, community, DISK_DATA_OIDS["disk_partitions_errors"]),
    }
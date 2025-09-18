OIDS = {
    "device_name": "1.3.6.1.2.1.1.5.0",       # sysName
    "cpu_load": "1.3.6.1.4.1.2021.11.9.0",    # laLoad
    "ram_usage": "1.3.6.1.4.1.2021.4.6.0",    # memUsed
    "disk_usage": "1.3.6.1.4.1.2021.9.1.9.1", # dskPercent
    "temperature": "1.3.6.1.4.1.2021.13.16.2.1.3.1",
    "bandwidth_usage": "1.3.6.1.2.1.2.2.1.10.2",
    "tasks_count": "1.3.6.1.4.1.2021.11.50.0"
}

GENERAL_DEVICE_OIDS = {
    "device_name": "1.3.6.1.2.1.1.5.0",
    "os_description": "1.3.6.1.2.1.1.1.0",
    "ram_size": "1.3.6.1.4.1.2021.4.3.0",
}

CPU_OIDS = {
    "cpu_load": "1.3.6.1.2.1.25.3.3.1.2", 
    "uptime": "1.3.6.1.2.1.1.3.0",
    "cpu_idle": "1.3.6.1.4.1.2021.11.9.0" 
}

SISTEM_DATA_OIDS = {
    "operation_system": "1.3.6.1.2.1.1.1.0",
    "operation_uptime": "1.3.6.1.2.1.1.3.0",
    "contact": "1.3.6.1.2.1.1.4.0",
    "device_name": "1.3.6.1.2.1.1.5.0",
    "location": "1.3.6.1.2.1.1.6.0",
}

NET_PREVIEW_DATA_OIDS = {
    "web_type": "1.3.6.1.2.1.3.1.1.1",
    "subnet_mask": "1.3.6.1.2.1.3.1.1.2",
    "ip_address": "1.3.6.1.2.1.3.1.1.3",
    "forwarding": "1.3.6.1.2.1.5.1",
    "tcp_protocol": "1.3.6.1.2.1.6.1.0",
}

NET_DATA_OIDS = {
    "recieved_packets": "1.3.6.1.2.1.5.3",
    "header_errored_packets": "1.3.6.1.2.1.5.4",
    "address_errored_packets": "1.3.6.1.2.1.5.5",
    "sent_packets": "1.3.6.1.2.1.5.14",
    "minimun_retransmissions_time": "1.3.6.1.2.1.6.2.0",  
    "maximum_retransmissions_time": "1.3.6.1.2.1.6.3.0",  
    "maximun_tcp_connections": "1.3.6.1.2.1.6.4.0",       
    "tcp_conections_made": "1.3.6.1.2.1.6.5.0",           
    "active_tcp_connections": "1.3.6.1.2.1.6.9.0",
    "udp_packets_received": "1.3.6.1.2.1.7.1",
    "udp_receive_errors": "1.3.6.1.2.1.7.3",
}

DISK_PREVIEW_DATA_OIDS = {
    "disk_partitions": "1.3.6.1.4.1.2021.9.1.1",
    "disk_partitions_size": "1.3.6.1.4.1.2021.9.1.6",
    "disk_partitions_used": "1.3.6.1.4.1.2021.9.1.7",
    "disk_partitions_free": "1.3.6.1.4.1.2021.9.1.8",
}

DISK_DATA_OIDS = {
    "disk_partitions_address": "1.3.6.1.4.1.2021.9.1.2",
    "disk_partitions_devices": "1.3.6.1.4.1.2021.9.1.3",
    "disk_partitions_errors": "1.3.6.1.4.1.2021.9.1.4",
}
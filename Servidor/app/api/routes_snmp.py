from fastapi import APIRouter
from app.models.snmp_models import SNMPMetrics
from app.services.snmp_service import get_snmp_metrics

router = APIRouter()

@router.get("/{member_id}", response_model=SNMPMetrics)
async def get_member_metrics(member_id: int):
    return get_snmp_metrics(member_id)

@router.get("/general/{member_id}")
async def get_general_member_info(member_id: int):
    from app.services.snmp_service import get_general_device_info
    return get_general_device_info(member_id)

@router.get("/cpu/{member_id}")
async def get_cpu_member_info(member_id: int):
    from app.services.snmp_service import get_cpu_info
    return get_cpu_info(member_id)

@router.get("/system/{member_id}")
async def get_system_member_info(member_id: int):
    from app.services.snmp_service import get_system_data
    return get_system_data(member_id)

@router.get("/network/preview/{member_id}")
async def get_network_preview(member_id: int):
    from app.services.snmp_service import get_network_preview_data
    return get_network_preview_data(member_id)

@router.get("/network/data/{member_id}")
async def get_network_data(member_id: int):
    from app.services.snmp_service import get_network_data
    return get_network_data(member_id)

@router.get("/disk/preview/{member_id}")
async def get_disk_preview(member_id: int):
    from app.services.snmp_service import get_disk_preview_data
    return get_disk_preview_data(member_id)

@router.get("/disk/data/{member_id}")
async def get_disk_data(member_id: int):
    from app.services.snmp_service import get_disk_data
    return get_disk_data(member_id)
from fastapi import APIRouter
from app.models.snmp_models import SNMPMetrics, MemoryInfo
from app.services.snmp_service import get_snmp_metrics, get_memory_info

router = APIRouter()

@router.get("/{member_id}", response_model=SNMPMetrics)
async def get_member_metrics(member_id: int):
    return get_snmp_metrics(member_id)

@router.get("/general/{member_id}")
async def get_general_member_info(member_id: int):
    from app.services.snmp_service import get_general_device_info
    return get_general_device_info(member_id)

@router.get("/memory/{member_id}", response_model=MemoryInfo)
async def get_member_memory(member_id: int):
    return get_memory_info(member_id)

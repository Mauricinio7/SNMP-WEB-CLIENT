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

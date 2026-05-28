from pydantic import BaseModel
from typing import List, Optional
from app.schemas.cliente_schema import ClienteResponse
from app.schemas.quarto_schema import QuartoResponse

class ReservaCreate(BaseModel):
    data_inicio: str
    hora_checkin: str
    data_fim: str
    hora_checkout: str
    cama_extra: Optional[float] = 0.0
    status: str = "expected"
    cliente_id: int
    quarto_ids: List[int] # Lista de IDs dos quartos que quer reservar

class ReservaResponse(BaseModel):
    id: int
    data_inicio: str
    hora_checkin: str   
    data_fim: str
    hora_checkout: str  
    preco_total: float
    cama_extra: Optional[float]
    status: str    
    cliente_id: int
    
    # Anexa os dados completos do Cliente e dos Quartos puxados do MySQL
    cliente: Optional[ClienteResponse] = None
    quartos: List[QuartoResponse] = []

    class Config:
        from_attributes = True
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
    
    cliente: Optional[ClienteResponse] = None
    quartos: List[QuartoResponse] = []
    
    class Config:
        from_attributes = True

class ReservaResponse(BaseModel):
    id: int
    data_inicio: str
    hora_checkin: str   
    data_fim: str
    hora_checkout: str  
    preco_total: float
    cama_extra: Optional[float]
    status: str    
    
    cliente_id: Optional[int] = None
    
    cliente: Optional[ClienteResponse] = None
    quartos: List[QuartoResponse] = []

    class Config:
        from_attributes = True
        
class ReservaUpdate(BaseModel):
    data_inicio: Optional[str] = None
    hora_checkin: Optional[str] = None
    data_fim: Optional[str] = None
    hora_checkout: Optional[str] = None
    cama_extra: Optional[float] = None
    status: Optional[str] = None
    cliente_id: Optional[int] = None
    
    quarto_ids: Optional[List[int]] = None 

    class Config:
        from_attributes = True
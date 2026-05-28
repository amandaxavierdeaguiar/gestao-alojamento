from pydantic import BaseModel, EmailStr
from typing import List, Optional

class ClienteCreate(BaseModel):
    nome: str
    email: EmailStr
    telefone: str
    endereco: str
    
class ClienteResponse(ClienteCreate):
    id: int
    class Config:
        from_attributes = True
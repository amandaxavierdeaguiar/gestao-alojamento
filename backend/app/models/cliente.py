from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.config.database import Base

class ClienteModel(Base):
    __tablename__ = "cliente"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    telefone = Column(String(255), nullable=False)
    endereco = Column(String(255), nullable=False)
    
    reservas = relationship("ReservaModel", back_populates="cliente")
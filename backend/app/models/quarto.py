from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.config.database import Base


class QuartoModel(Base):
    __tablename__ = "quarto"

    id = Column(Integer, primary_key=True, index=True)
    numero_quarto = Column(Integer, nullable=False)
    tipo = Column(String(50), nullable=False)
    preco = Column(Float, nullable=False)
    
    alojamento_id = Column(Integer, ForeignKey("alojamento.id"))
    reserva_id = Column(Integer, ForeignKey("reserva.id"), nullable=True)
    
    alojamento = relationship("AlojamentoModel", back_populates="quartos")
    reserva = relationship("ReservaModel", back_populates="quartos")
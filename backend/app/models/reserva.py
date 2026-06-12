from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base

class ReservaModel(Base):
    __tablename__ = "reserva"

    id = Column(Integer, primary_key=True, index=True)
    data_inicio = Column(String(255), nullable=False)
    hora_checkin = Column(String(255), nullable=False)
    data_fim = Column(String(255), nullable=False)
    hora_checkout = Column(String(255), nullable=False)
    preco_total = Column(Float, nullable=False)
    cama_extra = Column(Float, nullable=True, default=0.0)
    status = Column(String(50), nullable=False, default="expected")
    
    cliente_id = Column(Integer, ForeignKey("cliente.id"))
    
    cliente = relationship("ClienteModel", back_populates="reservas", lazy="joined")
    quartos = relationship("QuartoModel", back_populates="reserva", lazy="joined")
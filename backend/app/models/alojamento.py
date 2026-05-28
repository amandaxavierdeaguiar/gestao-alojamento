from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.config.database import Base

class AlojamentoModel(Base):
    __tablename__ = "alojamento"

    id = Column(Integer, primary_key=True, index=True)
    nome_alojamento = Column(String(255), nullable=False)
    descricao = Column(String(255), nullable=False)
    endereco = Column(String(255), nullable=False)
    pais = Column(String(255), nullable=False)

    quartos = relationship("QuartoModel", back_populates="alojamento")

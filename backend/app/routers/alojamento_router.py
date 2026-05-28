from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db

from app.models.alojamento import AlojamentoModel
from app.models.quarto import QuartoModel
from app.models.cliente import ClienteModel
from app.models.reserva import ReservaModel

from app.schemas.alojamento_schema import AlojamentoCreate, AlojamentoResponse
from app.schemas.quarto_schema import QuartoCreate, QuartoResponse
from app.schemas.cliente_schema import ClienteCreate, ClienteResponse
from app.schemas.reserva_schema import ReservaCreate, ReservaResponse

router = APIRouter(tags=["Gestão de Hotelaria"])

# ==========================================
# 1. ALOJAMENTO
# ==========================================
@router.post("/alojamentos", response_model=AlojamentoResponse, status_code=status.HTTP_201_CREATED)
def criar_alojamento(payload: AlojamentoCreate, db: Session = Depends(get_db)):
    novo_alojamento = AlojamentoModel(
        nome_alojamento=payload.nome_alojamento,
        descricao=payload.descricao,
        endereco=payload.endereco,
        pais=payload.pais
    )
    db.add(novo_alojamento)
    db.commit()
    db.refresh(novo_alojamento)
    return novo_alojamento

@router.get("/alojamentos", response_model=List[AlojamentoResponse])
def listar_alojamentos(db: Session = Depends(get_db)):
    return db.query(AlojamentoModel).all()

@router.get("/alojamentos/{alojamento_id}", response_model=AlojamentoResponse)
def obter_alojamento_por_id(alojamento_id: int, db: Session = Depends(get_db)):
    alojamento = db.query(AlojamentoModel).filter(AlojamentoModel.id == alojamento_id).first()
    if not alojamento:
        raise HTTPException(status_code=404, detail="Alojamento não encontrado.")
    return alojamento

# ==========================================
# 2. CLIENTE
# ==========================================
@router.post("/clientes", response_model=ClienteResponse, status_code=status.HTTP_201_CREATED)
def criar_cliente(payload: ClienteCreate, db: Session = Depends(get_db)):
    novo_cliente = ClienteModel(
        nome=payload.nome,
        email=payload.email,
        telefone=payload.telefone,
        endereco=payload.endereco
    )
    db.add(novo_cliente)
    db.commit()
    db.refresh(novo_cliente)
    return novo_cliente

@router.get("/clientes", response_model=List[ClienteResponse])
def listar_clientes(db: Session = Depends(get_db)):
    return db.query(ClienteModel).all()

@router.get("/clientes/{cliente_id}", response_model=ClienteResponse)
def obter_cliente_por_id(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(ClienteModel).filter(ClienteModel.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")
    return cliente

# ==========================================
# 3. QUARTO
# ==========================================
@router.post("/quartos", response_model=QuartoResponse, status_code=status.HTTP_201_CREATED)
def criar_quarto(payload: QuartoCreate, db: Session = Depends(get_db)):
    alojamento = db.query(AlojamentoModel).filter(AlojamentoModel.id == payload.alojamento_id).first()
    if not alojamento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Não é possível criar o quarto. O Alojamento com ID {payload.alojamento_id} não existe."
        )

    novo_quarto = QuartoModel(
        numero_quarto=payload.numero_quarto,
        tipo=payload.tipo,
        preco=payload.preco,
        alojamento_id=payload.alojamento_id
    )
    db.add(novo_quarto)
    db.commit()
    db.refresh(novo_quarto)
    return novo_quarto

@router.get("/quartos", response_model=List[QuartoResponse])
def listar_quartos(db: Session = Depends(get_db)):
    return db.query(QuartoModel).all()

@router.get("/quartos/{quarto_id}", response_model=QuartoResponse)
def obter_quarto_por_id(quarto_id: int, db: Session = Depends(get_db)):
    quarto = db.query(QuartoModel).filter(QuartoModel.id == quarto_id).first()
    if not quarto:
        raise HTTPException(status_code=404, detail="Quarto não encontrado.")
    return quarto

# ==========================================
# 4. RESERVA
# ==========================================
@router.post("/reservas", response_model=ReservaResponse, status_code=status.HTTP_201_CREATED)
def criar_reserva(payload: ReservaCreate, db: Session = Depends(get_db)):
    cliente = db.query(ClienteModel).filter(ClienteModel.id == payload.cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail=f"Cliente com ID {payload.cliente_id} não encontrado.")

    quartos = db.query(QuartoModel).filter(QuartoModel.id.in_(payload.quarto_ids)).all()
    if len(quartos) != len(payload.quarto_ids):
        raise HTTPException(status_code=404, detail="Um ou mais IDs de quartos não existem.")

    soma_precos_quartos = sum([quarto.preco for quarto in quartos])
    preco_final_calculado = soma_precos_quartos + (payload.cama_extra or 0.0)

    nova_reserva = ReservaModel(
        data_inicio=payload.data_inicio,
        hora_checkin=payload.hora_checkin,
        data_fim=payload.data_fim,
        hora_checkout=payload.hora_checkout,
        preco_total=preco_final_calculado,
        cama_extra=payload.cama_extra,
        status=payload.status,
        cliente_id=payload.cliente_id
    )
    
    db.add(nova_reserva)
    db.commit() 
    
    for quarto in quartos:
        quarto.reserva_id = nova_reserva.id
        
    db.commit() 
    db.refresh(nova_reserva)
    return nova_reserva

@router.get("/reservas", response_model=List[ReservaResponse])
def listar_reservas(db: Session = Depends(get_db)):
    return db.query(ReservaModel).all()

@router.get("/reservas/{reserva_id}", response_model=ReservaResponse)
def obter_reserva_por_id(reserva_id: int, db: Session = Depends(get_db)):
    reserva = db.query(ReservaModel).filter(ReservaModel.id == reserva_id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada.")
    return reserva
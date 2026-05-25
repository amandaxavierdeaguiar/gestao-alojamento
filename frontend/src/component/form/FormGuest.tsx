import { useState } from 'react';
import type { FormEvent } from 'react';
import './guest-form.css';

interface NewGuestData {
  id: number;
  guestName: string;
  room: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  status: 'checked-in' | 'expected' | 'checked-out';
  guestsCount: number;
}

interface GuestFormProps {
  onAddGuest: (guest: NewGuestData) => void;
}

export default function GuestForm({ onAddGuest }: GuestFormProps) {
  // Lista de quartos predefinidos
  const availableRooms = [
    "Quarto 101 - Standard",
    "Quarto 102 - Vista Mar",
    "Quarto 105 - Suite Premium",
    "Estúdio 04 - Familiar",
    "Estúdio 05 - Double"
  ];

  const [guestName, setGuestName] = useState('');
  
  // O estado do quarto agora inicia com o primeiro quarto da lista por padrão
  const [room, setRoom] = useState(availableRooms[0]);
  
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [status, setStatus] = useState<NewGuestData['status']>('expected');
  const [guestsCount, setGuestsCount] = useState(1);

  const convertDateToJsonFormat = (dateString: string): string => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })
      .replace('.', '');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newGuest: NewGuestData = {
      id: Date.now(),
      guestName,
      room, 
      checkInDate: convertDateToJsonFormat(checkInDate),
      checkInTime,
      checkOutDate: convertDateToJsonFormat(checkOutDate),
      checkOutTime,
      status,
      guestsCount: Number(guestsCount)
    };

    onAddGuest(newGuest);

    // Reseta os campos (o quarto volta para o primeiro da lista)
    setGuestName('');
    setRoom(availableRooms[0]);
    setCheckInDate('');
    setCheckInTime('');
    setCheckOutDate('');
    setCheckOutTime('');
    setStatus('expected');
    setGuestsCount(1);
  };

  return (
    <section className="guest-form-section">
      <div className="form-header">
        <h2>Registar Novo Hóspede</h2>
        <p>Preencha os dados e selecione o quarto disponível.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="guest-form">
        <div className="form-group full-width">
          <label>Nome do Hóspede</label>
          <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Ex: Maria Alice" required />
        </div>

        <div className="form-group">
          <label>Alojamento / Quarto</label>
          <select value={room} onChange={e => setRoom(e.target.value)} required>
            {availableRooms.map((roomName, index) => (
              <option key={index} value={roomName}>
                {roomName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Nº de Hóspedes</label>
          <input type="number" min="1" value={guestsCount} onChange={e => setGuestsCount(Number(e.target.value))} required />
        </div>

        <div className="form-group">
          <label>Data Check-in</label>
          <input type="date" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Hora Check-in</label>
          <input type="time" value={checkInTime} onChange={e => setCheckInTime(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Data Check-out</label>
          <input type="date" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Hora Check-out</label>
          <input type="time" value={checkOutTime} onChange={e => setCheckOutTime(e.target.value)} required />
        </div>

        <div className="form-group full-width">
          <label>Estado Inicial</label>
          <select value={status} onChange={e => setStatus(e.target.value as NewGuestData['status'])}>
            <option value="expected">Pendente (Expected)</option>
            <option value="checked-in">In-House (Checked-in)</option>
            <option value="checked-out">Check-out</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">Salvar no Sistema</button>
      </form>
    </section>
  );
}
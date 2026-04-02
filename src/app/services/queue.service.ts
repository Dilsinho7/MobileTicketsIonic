import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QueueService {
  private queues = { SP: [] as string[], SE: [] as string[], SG: [] as string[] };
  public lastCalled: string[] = [];
  private lastTypeCalled: 'SP' | 'OTHERS' = 'OTHERS';

  // --- NOVOS CAMPOS PARA O RELATÓRIO ---
  public stats = {
    emitidas: { SP: 0, SE: 0, SG: 0, total: 0 },
    atendidas: { SP: 0, SE: 0, SG: 0, total: 0 }
  };

  public isExpedienteAberto(): boolean {
    const hora = new Date().getHours();
    return hora >= 7 && hora < 17;
  }

  generateTicket(type: 'SP' | 'SE' | 'SG') {
    if (!this.isExpedienteAberto()) return 'FECHADO';

    const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const seq = (this.queues[type].length + 1).toString().padStart(2, '0');
    const ticket = `${date}-${type}${seq}`;

    this.queues[type].push(ticket);

    // Atualiza estatísticas de emissão
    this.stats.emitidas[type]++;
    this.stats.emitidas.total++;

    return ticket;
  }

  getNext() {
    let ticket: string | undefined;
    let typeFound: 'SP' | 'SE' | 'SG' | null = null;

    if (this.lastTypeCalled === 'OTHERS' && this.queues.SP.length > 0) {
      ticket = this.queues.SP.shift();
      typeFound = 'SP';
      this.lastTypeCalled = 'SP';
    } else {
      if (this.queues.SE.length > 0) {
        ticket = this.queues.SE.shift();
        typeFound = 'SE';
      } else if (this.queues.SG.length > 0) {
        ticket = this.queues.SG.shift();
        typeFound = 'SG';
      }
      this.lastTypeCalled = 'OTHERS';
    }

    if (ticket && typeFound) {
      this.lastCalled.unshift(ticket);
      if (this.lastCalled.length > 5) this.lastCalled.pop();

      // Atualiza estatísticas de atendimento
      this.stats.atendidas[typeFound]++;
      this.stats.atendidas.total++;
    }
    return ticket;
  }
}
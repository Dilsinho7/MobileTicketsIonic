import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { QueueService } from '../services/queue.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class Tab3Page {
  senhaAtual: string | undefined = '';

  constructor(private queueService: QueueService) {}

  proximo() {
  // Simulação de 5% de desistência conforme requisito 
  if (Math.random() < 0.05) {
    console.log("O cliente não compareceu. Descartando senha...");
    this.queueService.getNext(); // Pula uma senha
  }
  this.senhaAtual = this.queueService.getNext();
}
}
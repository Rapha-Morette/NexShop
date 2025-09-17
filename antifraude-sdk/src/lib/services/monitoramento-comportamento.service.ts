import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MonitoramentoComportamentoService {
  private cliques = 0;
  private tempoInicial = 0;
  private ultimoClique = 0;
  private monitorando = false;

  private mouseListener?: (e: MouseEvent) => void;
  private clickListener?: () => void;

  private suspeitaSubject = new BehaviorSubject<boolean>(false);
  public suspeita$ = this.suspeitaSubject.asObservable();

  iniciarMonitoramento(): void {
    if (this.monitorando) return;

    this.cliques = 0;
    this.tempoInicial = Date.now();
    this.ultimoClique = 0;

    this.monitorando = true;

    this.clickListener = () => {
      this.cliques++;
      const agora = Date.now();
      const intervalo = agora - this.ultimoClique;

      if (intervalo < 100) {
        this.emitirSuspeita('Clique muito rápido detectado.');
      }

      if (this.cliques > 20 && agora - this.tempoInicial < 10000) {
        this.emitirSuspeita('Muitos cliques em pouco tempo.');
      }

      this.ultimoClique = agora;
    };

    this.mouseListener = (e: MouseEvent) => {
      const velocidade = Math.sqrt(e.movementX ** 2 + e.movementY ** 2);
      if (velocidade > 1500) {
        this.emitirSuspeita('Movimento de mouse muito rápido.');
      }
    };

    document.addEventListener('click', this.clickListener);
    document.addEventListener('mousemove', this.mouseListener);
  }

  pararMonitoramento(): void {
    if (!this.monitorando) return;

    document.removeEventListener('click', this.clickListener!);
    document.removeEventListener('mousemove', this.mouseListener!);

    this.monitorando = false;
    this.suspeitaSubject.next(false); // Reset
  }

  private emitirSuspeita(motivo: string): void {
    console.warn(`⚠️ Comportamento suspeito detectado: ${motivo}`);
    this.suspeitaSubject.next(true);
  }
}

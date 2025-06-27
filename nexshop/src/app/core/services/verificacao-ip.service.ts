import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VerificacaoIpService {
  private apiUrl = 'http://localhost:3001/verificar-ip';

  constructor(private http: HttpClient) {}

  verificarIp(ip: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?ip=${ip}`);
  }

  isHorarioSuspeito(): boolean {
    const hora = new Date().getHours();
    return hora >= 0 && hora < 4;
  }

  isForaDoBrasil(ip: string): boolean {
    // Simulado para exemplo, você pode integrar ip-api.com/json/IP para real.
    return (
      !ip.startsWith('177.') && !ip.startsWith('189.') && !ip.startsWith('191.')
    );
  }
}

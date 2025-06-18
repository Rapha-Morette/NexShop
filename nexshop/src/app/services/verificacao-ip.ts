import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VerificacaoIpService {
  private apiUrl = 'http://localhost:3001/verificar-ip';

  constructor(private http: HttpClient) {}

  /**
   * Verifica a reputação do IP via backend (proxy para o AbuseIPDB).
   */
  verificarIp(ip: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?ip=${ip}`);
  }
}

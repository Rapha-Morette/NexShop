import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ResultadoVerificacaoIp {
  ipMalicioso: boolean;
  foraDoBrasil: boolean;
  abuseConfidenceScore: number;
  countryCode: string;
}

@Injectable({ providedIn: 'root' })
export class VerificacaoIpService {
  private apiUrl = 'http://localhost:3001/verificar-ip';

  constructor(private http: HttpClient) {}

  verificarIP(): Observable<{ nivel: 'baixo' | 'medio' | 'alto'; ip: string }> {
    return this.http.get<{ nivel: 'baixo' | 'medio' | 'alto'; ip: string }>(
      'http://localhost:3001/verificar-ip'
    );
  }

  // Método que já retorna resultado completo da verificação do IP
  verificarIpCompleto(ip: string): Observable<ResultadoVerificacaoIp> {
    return this.http.get<any>(`${this.apiUrl}?ip=${ip}`).pipe(
      map((response) => {
        const score = response.data.abuseConfidenceScore;
        const countryCode = response.data.countryCode;

        return {
          ipMalicioso: score >= 50,
          foraDoBrasil: this.isForaDoBrasil(countryCode),
          abuseConfidenceScore: score,
          countryCode: countryCode,
        };
      })
    );
  }

  isHorarioSuspeito(): boolean {
    const hora = new Date().getHours();
    return hora >= 0 && hora < 4;
  }

  isForaDoBrasil(countryCode: string): boolean {
    return countryCode !== 'BR';
  }
}

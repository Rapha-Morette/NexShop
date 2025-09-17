import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, catchError } from 'rxjs';
import { RegistroLogin } from '../models/registro-login.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private apiUrl = 'http://localhost:3000/logins';

  constructor(private http: HttpClient) {}

  obterLoginsPorUsuario(usuarioId: string): Observable<RegistroLogin[]> {
    return this.http.get<RegistroLogin[]>(`${this.apiUrl}?usuarioId=${usuarioId}`);
  }

  registrarLoginComLimite(registro: RegistroLogin): Observable<RegistroLogin> {
    return this.obterLoginsPorUsuario(registro.usuarioId).pipe(
      switchMap((logins) => {
        const mesmoIp = logins.find((l) => l.ip === registro.ip);
        const ordenados = [...logins].sort(
          (a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
        );

        if (mesmoIp) {
          const atualizado: RegistroLogin = {
            ...mesmoIp,
            dataHora: registro.dataHora,
            risco: registro.risco, // inclui o risco
          };
          return this.http.put<RegistroLogin>(`${this.apiUrl}/${mesmoIp.id}`, atualizado).pipe(
            catchError(() =>
              this.http.post<RegistroLogin>(this.apiUrl, {
                usuarioId: registro.usuarioId,
                ip: registro.ip,
                dataHora: registro.dataHora,
                risco: registro.risco,
              })
            )
          );
        }

        if (logins.length >= 5) {
          const maisAntigo = ordenados[0];
          return this.http.delete(`${this.apiUrl}/${maisAntigo.id}`).pipe(
            switchMap(() =>
              this.http.post<RegistroLogin>(this.apiUrl, {
                usuarioId: registro.usuarioId,
                ip: registro.ip,
                dataHora: registro.dataHora,
                risco: registro.risco,
              })
            )
          );
        }

        return this.http.post<RegistroLogin>(this.apiUrl, {
          usuarioId: registro.usuarioId,
          ip: registro.ip,
          dataHora: registro.dataHora,
          risco: registro.risco,
        });
      })
    );
  }
}

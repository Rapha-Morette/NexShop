import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { RegistroLogin } from '../models/registro-login.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private apiUrl = 'http://localhost:3000/logins';

  constructor(private http: HttpClient) {}

  registrarLoginComLimite(registro: RegistroLogin): Observable<RegistroLogin> {
    const usuarioId = Number(registro.usuarioId);

    return this.http
      .get<RegistroLogin[]>(`${this.apiUrl}?usuarioId=${usuarioId}`)
      .pipe(
        switchMap((logins) => {
          const mesmoIp = logins.find((l) => l.ip === registro.ip);
          const loginsOrdenados = logins.sort(
            (a, b) =>
              new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
          );

          return this.http
            .get<RegistroLogin[]>(`${this.apiUrl}?_sort=id&_order=desc`)
            .pipe(
              switchMap((todosLogins) => {
                const ultimoId = Number(todosLogins[0]?.id ?? 0);
                const novoId = ultimoId + 1;

                const novoRegistro: RegistroLogin = {
                  ...registro,
                  id: novoId,
                  usuarioId: usuarioId,
                };

                if (mesmoIp) {
                  const atualizado: RegistroLogin = {
                    ...mesmoIp,
                    id: Number(mesmoIp.id),
                    usuarioId: Number(mesmoIp.usuarioId),
                    dataHora: registro.dataHora,
                  };
                  return this.http.put<RegistroLogin>(
                    `${this.apiUrl}/${atualizado.id}`,
                    atualizado
                  );
                } else if (logins.length >= 5) {
                  const maisAntigo = loginsOrdenados[0];
                  return this.http
                    .delete(`${this.apiUrl}/${maisAntigo.id}`)
                    .pipe(
                      switchMap(() =>
                        this.http.post<RegistroLogin>(this.apiUrl, novoRegistro)
                      )
                    );
                } else {
                  return this.http.post<RegistroLogin>(
                    this.apiUrl,
                    novoRegistro
                  );
                }
              })
            );
        })
      );
  }
}

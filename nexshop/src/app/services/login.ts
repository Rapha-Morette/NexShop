import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

export interface RegistroLogin {
  id?: number;
  usuarioId: number;
  ip: string;
  dataHora: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/logins';

  constructor(private http: HttpClient) {}

  /**
   * Registra o login de um usuário, mantendo no máximo 5 IPs diferentes por usuário.
   * Se o IP já existir, atualiza a data/hora. Se for novo e o limite for atingido, substitui o mais antigo.
   */
  registrarLoginComLimite(registro: RegistroLogin): Observable<RegistroLogin> {
    return this.http
      .get<RegistroLogin[]>(`${this.apiUrl}?usuarioId=${registro.usuarioId}`)
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
                const ultimoId = todosLogins[0]?.id ?? 0;
                const novoId = typeof ultimoId === 'number' ? ultimoId + 1 : 1;

                // Garante que id e usuarioId sejam numéricos
                const novoRegistro: RegistroLogin = {
                  id: Number(novoId),
                  usuarioId: Number(registro.usuarioId),
                  ip: registro.ip,
                  dataHora: registro.dataHora,
                };

                if (mesmoIp) {
                  // Atualiza apenas a data/hora do IP já existente
                  const atualizado = {
                    ...mesmoIp,
                    dataHora: registro.dataHora,
                  };
                  return this.http.put<RegistroLogin>(
                    `${this.apiUrl}/${mesmoIp.id}`,
                    atualizado
                  );
                } else if (logins.length >= 5) {
                  // Remove o mais antigo e adiciona o novo
                  const maisAntigo = loginsOrdenados[0];
                  return this.http
                    .delete(`${this.apiUrl}/${maisAntigo.id}`)
                    .pipe(
                      switchMap(() =>
                        this.http.post<RegistroLogin>(this.apiUrl, novoRegistro)
                      )
                    );
                } else {
                  // Adiciona novo login normalmente
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
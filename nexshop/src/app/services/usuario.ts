import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  perfil: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  criarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?_sort=id&_order=desc`).pipe(
      switchMap((usuarios) => {
        const ultimoId = usuarios[0]?.id ?? 0;
        const novoId = typeof ultimoId === 'number' ? ultimoId + 1 : 1;
        const novoUsuario = { ...usuario, id: novoId };
        return this.http.post<Usuario>(this.apiUrl, novoUsuario);
      })
    );
  }

  login(identificador: string, senha: string): Observable<Usuario[]> {
    return this.http
      .get<Usuario[]>(`${this.apiUrl}?senha=${senha}`)
      .pipe(
        map((usuarios) =>
          usuarios.filter(
            (usuario) =>
              usuario.email === identificador || usuario.nome === identificador
          )
        )
      );
  }
}

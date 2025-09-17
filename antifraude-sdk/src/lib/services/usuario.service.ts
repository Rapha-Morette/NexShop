import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  criarUsuario(usuario: Usuario): Observable<Usuario> {
    const usuarioSemId = { ...usuario };
    delete (usuarioSemId as any).id; // remove id para json-server gerar

    return this.http.post<Usuario>(this.apiUrl, usuarioSemId);
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

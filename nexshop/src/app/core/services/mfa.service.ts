import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class MfaService {
  private codigoGerado = '';
  private emailDestinatario = '';

  enviarCodigo(email: string) {
    this.emailDestinatario = email;
    this.codigoGerado = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`MFA enviado para ${email}: ${this.codigoGerado}`);
    return this.codigoGerado;
  }

  validarCodigo(digitado: string) {
    return digitado === this.codigoGerado;
  }
}

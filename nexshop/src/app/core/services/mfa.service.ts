import { Injectable } from '@angular/core';
import { DadosMfa } from '../models/dados-mfa.model';

@Injectable({ providedIn: 'root' })
export class MfaService {
  private dadosMfa: DadosMfa | null = null;
  private codigoGerado: string = '';

  enviarCodigo(email: string): string {
    this.codigoGerado = this.gerarCodigo();
    console.log(`📧 Código MFA enviado para: ${email}`);
    console.log('🔐 Código MFA:', this.codigoGerado);
    return this.codigoGerado;
  }

  validarCodigo(codigo: string): boolean {
    return codigo === this.codigoGerado;
  }

  setDadosMfa(dados: DadosMfa): void {
    this.dadosMfa = dados;
  }

  getDadosMfa(): DadosMfa | null {
    return this.dadosMfa;
  }

  private gerarCodigo(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Gera número de 6 dígitos
  }
}

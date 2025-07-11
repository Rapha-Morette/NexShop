import { Injectable } from '@angular/core';
import { DadosMfa } from '../models/dados-mfa.model';

@Injectable({ providedIn: 'root' })
export class MfaService {
  private dadosMfa: DadosMfa | null = null;
  private codigoGerado: string = '';

  enviarCodigo(email: string): string {
    this.codigoGerado = this.gerarCodigo();

    fetch('http://localhost:3002/enviar-codigo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, codigo: this.codigoGerado }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('✅ Código enviado:', data);
        console.log(`📧 Código MFA enviado para: ${email}`);
        console.log('🔐 Código MFA:', this.codigoGerado);
      })
      .catch((err) => {
        console.error('❌ Erro ao enviar código:', err);
      });

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

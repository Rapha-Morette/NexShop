import { Injectable } from '@angular/core';
import { VerificacaoIpService } from './verificacao-ip.service';

@Injectable({ providedIn: 'root' })
export class VerificacaoSegurancaService {
  constructor(private ipService: VerificacaoIpService) {}

  async verificarRiscoCompra(ipDoLogin: string): Promise<'baixo' | 'alto'> {
    try {
      const info = await this.ipService
        .verificarIpCompleto(ipDoLogin)
        .toPromise();

      // Garante que info não é undefined antes de acessar
      if (!info) {
        console.warn('Verificação IP retornou vazio');
        return 'alto';
      }

      const { ipMalicioso, foraDoBrasil } = info;
      const horarioSuspeito = this.ipService.isHorarioSuspeito();

      if (ipMalicioso || foraDoBrasil || horarioSuspeito) {
        return 'alto';
      }

      return 'baixo';
    } catch (err) {
      console.error('Erro ao verificar segurança:', err);
      return 'alto'; // Segurança em primeiro lugar
    }
  }

  async precisaDeMfa(): Promise<boolean> {
    const nivel = localStorage.getItem('nivelRisco') as
      | 'baixo'
      | 'medio'
      | 'alto'
      | null;

    if (!nivel) return true; // por segurança

    return nivel !== 'baixo'; // se médio ou alto, precisa de MFA
  }

  async validarConsistenciaDeIp(): Promise<boolean> {
    const ipDoLogin = localStorage.getItem('ipLogin');
    if (!ipDoLogin) return false;

    const ipAtual = await fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => data.ip)
      .catch(() => '0.0.0.0');

    return ipAtual === ipDoLogin;
  }
}

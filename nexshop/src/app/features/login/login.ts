import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../core/services/usuario.service';
import { LoginService } from '../../core/services/login.service';
import { VerificacaoIpService } from '../../core/services/verificacao-ip.service';
import { MfaService } from '../../core/services/mfa.service';
import { Router } from '@angular/router';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, FormsModule]  // Corrige erro de ngModel, ngIf, ngForm
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';
  nivel: 'baixo' | 'medio' | 'alto' = 'baixo';
  mostrarMfa = false;
  codigoDigitado = '';
  usuarioLogado?: Usuario;
  ipUsuario = '';

  constructor(
    private usuarioService: UsuarioService,
    private loginService: LoginService,
    private verificacaoIpService: VerificacaoIpService,
    private mfaService: MfaService,
    private router: Router
  ) {}

  // Inicia o fluxo de login
  onSubmit(): void {
    this.usuarioService.login(this.username, this.password).subscribe((usuarios) => {
      if (!usuarios.length) {
        this.errorMessage = 'Credenciais inválidas';
        return;
      }

      this.usuarioLogado = usuarios[0];

      // Obtém IP do usuário
      this.obterIpUsuario().then((ip) => {
        this.ipUsuario = ip;

        // Verifica se o IP já foi usado antes por esse usuário
        this.loginService.obterLoginsPorUsuario(this.usuarioLogado!.id!).subscribe((logs) => {
          const ipJaUsado = logs.some((l) => l.ip === ip);

          // Consulta AbuseIPDB
          this.verificacaoIpService.verificarIp(ip).subscribe((info) => {
            const score = info.data.abuseConfidenceScore;
            const ipMalicioso = score >= 50;
            const horarioSuspeito = this.verificacaoIpService.isHorarioSuspeito();
            const foraDoBrasil = this.verificacaoIpService.isForaDoBrasil(ip);

            // Lógica de risco
            if (ipMalicioso || horarioSuspeito || foraDoBrasil) {
              this.nivel = 'alto';
            } else if (!ipJaUsado && score >= 10) {
              this.nivel = 'medio';
            } else {
              this.nivel = 'baixo';
            }

            // Define o que exibir conforme o risco
            if (this.nivel === 'baixo') {
              this.finalizarLogin();
            } else {
              this.mfaService.enviarCodigo(this.usuarioLogado!.email);
              this.mostrarMfa = true;
            }
          });
        });
      });
    });
  }

  // Finaliza o login e salva o acesso no db.json
  finalizarLogin(): void {
    const registro = {
      usuarioId: this.usuarioLogado!.id!,
      ip: this.ipUsuario,
      dataHora: new Date().toISOString(),
    };

    this.loginService.registrarLoginComLimite(registro).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  // Valida código MFA e simula biometria no nível alto
  verificarCodigoMfa(): void {
    if (!this.mfaService.validarCodigo(this.codigoDigitado)) {
      this.errorMessage = 'Código MFA inválido';
      return;
    }

    if (this.nivel === 'alto') {
      alert('Simulação: reconhecimento facial realizado!');
    }

    this.finalizarLogin();
  }

  // Obtém IP público do usuário
  obterIpUsuario(): Promise<string> {
    return fetch('https://api.ipify.org?format=json')
      .then((r) => r.json())
      .then((r) => r.ip)
      .catch(() => '0.0.0.0');
  }

  // Redireciona para a tela de cadastro
  irParaCadastro(): void {
    this.router.navigate(['/cadastro']);
  }
}

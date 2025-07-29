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
  imports: [CommonModule, FormsModule], // Corrige erro de ngModel, ngIf, ngForm
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';
  usuarioLogado?: Usuario;
  ipUsuario = '';
  nivel: 'baixo' | 'medio' | 'alto' = 'baixo';

  constructor(
    private usuarioService: UsuarioService,
    private loginService: LoginService,
    private verificacaoIpService: VerificacaoIpService,
    private mfaService: MfaService,
    private router: Router
  ) {}

  // Inicia o fluxo de login
  onSubmit(): void {
    this.usuarioService
      .login(this.username, this.password)
      .subscribe((usuarios) => {
        if (!usuarios.length) {
          this.errorMessage = 'Credenciais inválidas';
          return;
        }

        this.usuarioLogado = usuarios[0];

        // Obtém IP do usuário
        this.obterIpUsuario().then((ip) => {
          this.ipUsuario = ip;

          // Verifica se o IP já foi usado antes por esse usuário
          this.loginService
            .obterLoginsPorUsuario(this.usuarioLogado!.id!)
            .subscribe((logs) => {
              var ipJaUsado = logs.some((l) => l.ip === ip);

              // Serviço AbuseIPDB
              this.verificacaoIpService
                .verificarIpCompleto(ip)
                .subscribe((info) => {
                  var {
                    ipMalicioso,
                    foraDoBrasil,
                    abuseConfidenceScore,
                    countryCode,
                  } = info;
                  const horarioSuspeito =
                    this.verificacaoIpService.isHorarioSuspeito();

                  // logs
                  console.log('===== VERIFICAÇÃO DE LOGIN =====');
                  console.log('Usuário:', this.usuarioLogado?.email);
                  console.log('IP:', ip);
                  console.log('Score AbuseIPDB:', abuseConfidenceScore);
                  console.log('IP Malicioso:', ipMalicioso);
                  console.log('Horário suspeito:', horarioSuspeito);
                  console.log('Fora do Brasil:', foraDoBrasil);

                  // //teste alto 
                  // ipJaUsado = false
                  // ipMalicioso = true

                  // lógica de risco
                  if (!ipJaUsado || ipMalicioso) {
                    if (ipMalicioso || horarioSuspeito || foraDoBrasil) {
                      this.nivel = 'alto';
                    } else {
                      this.nivel = 'medio';
                    }
                  } else {
                    this.nivel = 'baixo';
                  }

                  console.log('Nível de risco calculado:', this.nivel); 

                  if (this.nivel === 'baixo') {
                    this.finalizarLogin();
                  } else {
                    this.mfaService.setDadosMfa({
                      usuarioId: this.usuarioLogado!.id!,
                      email: this.usuarioLogado!.email,
                      ip: this.ipUsuario,
                      nivel: this.nivel,
                    });
                    this.router.navigate(['/mfa']);
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
      risco: this.nivel,
    };

    this.loginService.registrarLoginComLimite(registro).subscribe(() => {
      this.router.navigate(['/home']);
    });
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

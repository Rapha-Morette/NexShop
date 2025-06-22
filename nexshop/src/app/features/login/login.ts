import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../core/services/usuario.service';
import { LoginService } from '../../core/services/login.service';
import { VerificacaoIpService } from '../../core/services/verificacao-ip.service';
import { Router } from '@angular/router';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private usuarioService: UsuarioService,
    private loginService: LoginService,
    private verificacaoIpService: VerificacaoIpService,
    private router: Router
  ) {}

  onSubmit() {
    this.usuarioService
      .login(this.username, this.password)
      .subscribe((usuarios: Usuario[]) => {
        if (usuarios.length > 0) {
          const usuario = usuarios[0];
          this.obterIpUsuario().then((ip) => {
            this.verificacaoIpService.verificarIp(ip).subscribe((resposta: any) => {
              const score = resposta.data.abuseConfidenceScore;
              //console.log(`IP logado: ${ip} (score: ${score})`);
              if (score >= 50) {
                this.errorMessage =
                  'Login bloqueado: IP com reputação suspeita.';
                console.warn(`IP bloqueado: ${ip} (score: ${score})`);
                return;
              }

              const registro = {
                usuarioId: usuario.id!,
                ip,
                dataHora: new Date().toISOString(),
              };

              this.loginService
                .registrarLoginComLimite(registro)
                .subscribe(() => {
                  console.log('Login registrado com sucesso.');
                  this.router.navigate(['/home']);
                });
            });
          });
        } else {
          this.errorMessage = 'Credenciais inválidas';
        }
      });
  }

  obterIpUsuario(): Promise<string> {
    return fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => data.ip)
      .catch(() => '0.0.0.0');
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }
}

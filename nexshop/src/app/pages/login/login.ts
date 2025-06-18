import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login';
import { VerificacaoIpService } from '../../services/verificacao-ip';

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

  /**
   * Autentica o usuário, valida a reputação do IP e registra o login.
   */
  onSubmit() {
    this.usuarioService
      .login(this.username, this.password)
      .subscribe((usuarios) => {
        if (usuarios.length > 0) {
          const usuario = usuarios[0];

          // Garante que o ID seja tratado como número (evita erros com json-server)
          const usuarioId = Number(usuario.id);

          this.obterIpUsuario().then((ip) => {
            this.verificacaoIpService.verificarIp(ip).subscribe((resposta) => {
              const score = resposta.data.abuseConfidenceScore;

              if (score >= 50) {
                this.errorMessage =
                  'Login bloqueado: IP com reputação suspeita.';
                console.warn(`IP bloqueado: ${ip} (score: ${score})`);
                return;
              }
              console.log(`IP limpo: ${ip} (score: ${score})`)
              const registro = {
                usuarioId: usuarioId, // forçado como number
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

  /**
   * Redireciona para a tela de cadastro.
   */
  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }

  /**
   * Obtém o IP público do usuário utilizando uma API externa.
   */
  obterIpUsuario(): Promise<string> {
    return fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => data.ip)
      .catch(() => '0.0.0.0'); // fallback
  }
}

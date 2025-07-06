import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MfaService } from '../../core/services/mfa.service';
import { LoginService } from '../../core/services/login.service';
import { RegistroLogin } from '../../core/models/registro-login.model';
import { Facial } from '../facial/facial';

@Component({
  selector: 'app-mfa',
  standalone: true,
  templateUrl: './mfa.html',
  styleUrls: ['./mfa.scss'],
  imports: [CommonModule, FormsModule, Facial]
})
export class Mfa implements OnInit {
  codigoDigitado = '';
  codigoEnviado = '';
  errorMessage = '';
  nivel: 'baixo' | 'medio' | 'alto' = 'medio';
  fotoCapturada = false;

  constructor(
    private mfaService: MfaService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const dados = this.mfaService.getDadosMfa();

    if (!dados) {
      this.router.navigate(['/login']);
      return;
    }

    this.nivel = dados.nivel;
    this.codigoEnviado = this.mfaService.enviarCodigo(dados.email);
  }

  verificarCodigo(): void {
    if (!this.mfaService.validarCodigo(this.codigoDigitado)) {
      this.errorMessage = 'Código MFA inválido. Tente novamente.';
      return;
    }

    const dados = this.mfaService.getDadosMfa();

    const registro: RegistroLogin = {
      usuarioId: dados!.usuarioId,
      ip: dados!.ip,
      dataHora: new Date().toISOString(),
      risco: this.nivel
    };

    this.loginService.registrarLoginComLimite(registro).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  onFotoCapturada(base64: string): void {
    this.fotoCapturada = true;
    console.log('📸 Foto facial capturada (login alto).');
  }
}

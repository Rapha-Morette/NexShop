import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MfaService } from '../../core/services/mfa.service';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mfa-compra',
  standalone: true,
  templateUrl: './mfa-compra.html',
  styleUrls: ['./mfa-compra.scss'],
  imports: [CommonModule, FormsModule]
})
export class MfaCompra implements OnInit {
  codigoDigitado = '';
  codigoEnviado = '';
  errorMessage = '';
  nivel: 'baixo' | 'medio' | 'alto' = 'medio';
  fotoCapturada = false;

  constructor(
    private mfaService: MfaService,
    private carrinhoService: CarrinhoService,
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

    // Finaliza compra e limpa carrinho
    this.carrinhoService.limparCarrinho();

    // Limpa nível de risco e navega
    localStorage.removeItem('nivelRisco');
    alert('✅ Compra finalizada com sucesso!');
    this.router.navigate(['/home']);
  }

  onFotoCapturada(base64: string): void {
    this.fotoCapturada = true;
    console.log('📸 Foto facial capturada para validação da compra.');
  }
}

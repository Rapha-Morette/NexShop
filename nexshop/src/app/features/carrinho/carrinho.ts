import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CarrinhoService,
  ProdutoCarrinho,
} from '../../core/services/carrinho.service';
import { Router } from '@angular/router';
import { VerificacaoSegurancaService } from '../../core/services/verificacao-seguranca.service';
import { MfaService } from '../../core/services/mfa.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  templateUrl: './carrinho.html',
  styleUrls: ['./carrinho.scss'],
  imports: [CommonModule],
})
export class Carrinho implements OnInit {
  produtos: ProdutoCarrinho[] = [];
  usuarioLogado: any = null;

  constructor(
    private carrinhoService: CarrinhoService,
    private verificacaoSeguranca: VerificacaoSegurancaService,
    private mfaService: MfaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carrinhoService.carrinho$.subscribe((itens) => {
      this.produtos = itens;
    });

    const user = localStorage.getItem('usuarioLogado');
    this.usuarioLogado = user ? JSON.parse(user) : null;
  }

  remover(id: number) {
    this.carrinhoService.removerProduto(id);
  }

  limpar() {
    this.carrinhoService.limparCarrinho();
  }

  finalizarCompra() {
    const ipDoLogin = localStorage.getItem('ipLogin');

    if (!ipDoLogin) {
      alert('❌ IP do login não encontrado. Sessão expirada.');
      this.encerrarSessao();
      return;
    }

    // Verifica se IP mudou
    this.verificacaoSeguranca.validarConsistenciaDeIp().then((ipOk) => {
      if (!ipOk) {
        alert('🚨 Seu IP mudou desde o login. Sessão encerrada.');
        this.encerrarSessao();
        return;
      }

      // Verifica risco atual do IP
      this.verificacaoSeguranca.verificarRiscoCompra(ipDoLogin).then((risco) => {
        if (risco === 'alto') {
          alert('🚨 Compra bloqueada por segurança.');
          return;
        }

        // Verifica se precisa de MFA baseado no risco do login salvo
        this.verificacaoSeguranca.precisaDeMfa().then((precisaMfa) => {
          if (precisaMfa) {
            const email = this.usuarioLogado?.email ?? '';
            const usuarioId = this.usuarioLogado?.id ?? 0;

            // Envia os dados para o serviço MFA (compra)
            this.mfaService.setDadosMfa({
              usuarioId,
              email,
              ip: ipDoLogin,
              nivel: localStorage.getItem('nivelRisco') as 'baixo' | 'medio' | 'alto',
            });

            this.router.navigate(['/mfa-compra']);
            return;
          }

          // Finaliza compra segura
          alert('✅ Compra finalizada com sucesso!');
          this.carrinhoService.limparCarrinho();
          this.router.navigate(['/home']);
        });
      });
    });
  }

  private encerrarSessao() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('ipLogin');
    localStorage.removeItem('nivelRisco');
    this.router.navigate(['/login']);
  }

  get total(): number {
    return this.produtos.reduce((t, p) => t + p.preco * p.quantidade, 0);
  }
}

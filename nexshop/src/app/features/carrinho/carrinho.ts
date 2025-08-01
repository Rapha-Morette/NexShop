import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CarrinhoService,
  ProdutoCarrinho,
} from '../../core/services/carrinho.service';
import { Router } from '@angular/router';
import { VerificacaoIpService } from '../../core/services/verificacao-ip.service';

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
    private verificacaoIpService: VerificacaoIpService,
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
    // 1. Verificar IP
    this.verificacaoIpService.verificarIP().subscribe((res) => {
      if (res.nivel === 'alto') {
        alert('🚨 IP suspeito detectado! Compra bloqueada por segurança.');
        return;
      }

      // 2. Confirmar e limpar
      alert('✅ Compra finalizada com sucesso!');
      //localStorage.removeItem('carrinho');
      this.carrinhoService.limparCarrinho();
      this.router.navigate(['/home']);
    });
  }
  get total(): number {
    return this.produtos.reduce((t, p) => t + p.preco * p.quantidade, 0);
  }
}

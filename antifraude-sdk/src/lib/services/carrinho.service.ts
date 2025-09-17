import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProdutoCarrinho {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private produtos: ProdutoCarrinho[] = [];
  private carrinhoSubject = new BehaviorSubject<ProdutoCarrinho[]>([]);

  carrinho$ = this.carrinhoSubject.asObservable();

  constructor() {
    this.carregarCarrinhoLocalStorage();
  }

  adicionarProduto(produto: ProdutoCarrinho): void {
    const existente = this.produtos.find((p) => p.id === produto.id);
    if (existente) {
      existente.quantidade++;
    } else {
      this.produtos.push({ ...produto, quantidade: 1 });
    }
    this.atualizar();
  }

  removerProduto(id: number): void {
    this.produtos = this.produtos.filter((p) => p.id !== id);
    this.atualizar();
  }

  limparCarrinho(): void {
    this.produtos = [];
    this.atualizar();
  }

  private atualizar() {
    // Atualiza stream e localStorage
    this.carrinhoSubject.next([...this.produtos]);
    localStorage.setItem('carrinho', JSON.stringify(this.produtos));
  }

  private carregarCarrinhoLocalStorage(): void {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    this.produtos = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    this.carrinhoSubject.next([...this.produtos]);
  }
}

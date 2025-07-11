import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [CommonModule],
})
export class Home {
  produtos: Produto[] = [
    {
      id: 1,
      nome: 'Notebook Gamer',
      preco: 4599.99,
      imagem: 'assets/produtos/notebook.jpg',
    },
    {
      id: 2,
      nome: 'Smartphone 5G',
      preco: 2999.0,
      imagem: 'assets/produtos/smartphone.jpg',
    },
    {
      id: 3,
      nome: 'Fone Bluetooth',
      preco: 349.9,
      imagem: 'assets/produtos/fone.jpg',
    },
  ];

  adicionarAoCarrinho(produto: Produto) {
    alert(`Produto adicionado ao carrinho: ${produto.nome}`);
    // Aqui no futuro você pode salvar no localStorage ou em um service real
  }

  irParaCarrinho() {
    alert('Redirecionar para o carrinho');
    // Ou use: this.router.navigate(['/carrinho']);
  }
}

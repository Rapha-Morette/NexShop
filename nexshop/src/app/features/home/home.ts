import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MonitoramentoComportamentoService } from '../../core/services/monitoramento-comportamento.service';

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
export class Home implements OnInit {
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

  constructor(
    private monitoramento: MonitoramentoComportamentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Começa o monitoramento de comportamento
    this.monitoramento.iniciarMonitoramento();

    // Observa o resultado de comportamento suspeito
    this.monitoramento.suspeita$.subscribe((suspeito) => {
      if (suspeito) {
        this.encerrarSessaoPorSeguranca();
      }
    });
  }

  adicionarAoCarrinho(produto: Produto) {
    alert(`Produto adicionado ao carrinho: ${produto.nome}`);
    // Futuro: salvar no localStorage ou serviço real
  }

  irParaCarrinho() {
    alert('Redirecionar para o carrinho');
    // Futuro: this.router.navigate(['/carrinho']);
  }

  private encerrarSessaoPorSeguranca(): void {
    alert('🚨 Atividade suspeita detectada. Sua sessão foi encerrada por segurança.');
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }

  // Opcional: interromper monitoramento ao sair da tela
  ngOnDestroy(): void {
    this.monitoramento.pararMonitoramento();
  }
}

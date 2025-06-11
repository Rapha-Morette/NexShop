import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, Usuario } from '../../services/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.scss']
})
export class Cadastro {
  usuario: Usuario = {
    nome: '',
    email: '',
    senha: '',
    perfil: ''
  };

  mensagem = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  onSubmit() {
    this.usuarioService.criarUsuario(this.usuario).subscribe(() => {
      this.mensagem = 'Usuário criado com sucesso!';
      this.router.navigate(['/login']); 
    });
  }
}

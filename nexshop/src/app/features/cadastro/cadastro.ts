import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.scss'],
})
export class Cadastro {
  usuario: Usuario = {
    nome: '',
    email: '',
    senha: '',
    perfil: 'usuario', // valor padrão
  };

  mensagem = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  onSubmit() {
    this.usuarioService.criarUsuario(this.usuario).subscribe(() => {
      this.mensagem = 'Usuário criado com sucesso!';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    });
  }
}

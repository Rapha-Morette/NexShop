import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';
import { Facial } from '../facial/facial';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.scss'],
  imports: [CommonModule, FormsModule, Facial]
})
export class Cadastro {
  usuario: Usuario = {
    nome: '',
    email: '',
    senha: '',
    perfil: 'usuario',
    fotoBase64: '' // <- inicializa como string vazia
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

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  onSubmit() {
    this.usuarioService
      .login(this.username, this.password)
      .subscribe((usuarios) => {
        if (usuarios.length > 0) {
          console.log('Login bem-sucedido:', usuarios[0]);
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Credenciais inválidas';
        }
      });
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }
}

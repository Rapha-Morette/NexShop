import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  onSubmit() {
    if (this.username === 'admin' && this.password === '1234') {
      console.log('Login bem-sucedido!');
      // Aqui futuramente vai a validação de IP/MFA/biometria
    } else {
      this.errorMessage = 'Usuário ou senha inválidos.';
    }
  }
}
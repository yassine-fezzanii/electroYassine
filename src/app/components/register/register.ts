import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './register.html'
})
export class RegisterComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  userData = { username: '', email: '', password: '', confirmPassword: '' };
  errorMessage = '';
  successMessage = '';

  onSubmit() {
    if (this.userData.password !== this.userData.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.userService.register(this.userData).subscribe({
      next: () => {
        this.successMessage = 'Compte créé avec succès ! Redirection vers la page de connexion...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Une erreur est survenue lors de l\'inscription.';
      }
    });
  }
}

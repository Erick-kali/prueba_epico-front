// src/app/auth/register/register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../pages/services/auth.service';
import { Usuarios } from '../../interfaces/usuarios.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombres: string = '';
  apellidos: string = '';
  email: string = '';
  cedula: string = '';
  contrasena: string = '';
  rol: number = 2; // Cliente por defecto

  constructor(private authService: AuthService, private router: Router) {}

  registrarUsuario() {
    const nuevoUsuario: Usuarios = {
      nombres: this.nombres,
      apellidos: this.apellidos,
      email: this.email,
      cedula: this.cedula,
      contrasena: this.contrasena,
      id_rol: this.rol
      // no es necesario incluir los campos opcionales como `status` o `numero_intento`
    };

    this.authService.crearUsuario(nuevoUsuario).subscribe({
      next: () => {
        alert('Usuario registrado correctamente');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        alert('Error al registrar usuario');
      }
    });
  }
}

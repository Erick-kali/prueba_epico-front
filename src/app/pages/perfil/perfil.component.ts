import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Usuarios } from '../../interfaces/usuarios.interface';
import { Rol } from '../../interfaces/rol.interface';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuarios | null = null;
  rolNombre: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.obtenerUsuarioActual().subscribe({
      next: storedUser => {
        if (storedUser) {
          this.fetchFreshUser(storedUser.id_usuario!);
        } else {
          // Fallback: tomo el primer usuario disponible
          this.authService.obtenerUsuarios().subscribe({
            next: users => {
              if (users.length > 0) {
                this.fetchFreshUser(users[0].id_usuario!);
              } else {
                this.usuario = null;
              }
            },
            error: () => {
              alert('Error al cargar usuarios para perfil.');
            }
          });
        }
      },
      error: () => {
        alert('Error al leer usuario actual.');
      }
    });
  }

  private fetchFreshUser(id: number): void {
    this.authService.obtenerUsuarioPorId(id).subscribe({
      next: freshUser => {
        this.usuario = freshUser;
        this.loadRol(freshUser.id_rol);
      },
      error: () => {
        alert('Error al obtener datos de perfil desde el servidor.');
      }
    });
  }

  obtenerIniciales(): string {
    if (!this.usuario) return '';
    return (
      this.usuario.nombres.charAt(0) +
      this.usuario.apellidos.charAt(0)
    ).toUpperCase();
  }

  private loadRol(idRol: number): void {
    this.authService.obtenerRoles().subscribe({
      next: (roles: Rol[]) => {
        const rol = roles.find(r => r.id_rol === idRol);
        this.rolNombre = rol ? rol.nombre_rol : 'Rol desconocido';
      },
      error: () => {
        this.rolNombre = 'Error al obtener rol';
      }
    });
  }
}

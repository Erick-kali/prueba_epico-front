import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

interface BloqueoUsuario {
  tiempoRestante: number;
  intervalo?: any;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = '';
  pass = '';
  private bloqueosUsuarios: Map<string, BloqueoUsuario> = new Map();
  private intervaloAlerta: any;
  showPassword: any;

  constructor(private authService: AuthService) {}
  
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    const bloqueoActual = this.bloqueosUsuarios.get(this.usuario);
    
    if (bloqueoActual && bloqueoActual.tiempoRestante > 0) {
      this.mostrarTiempoRestante(this.usuario);
      return;
    }

    this.authService.login(this.usuario, this.pass).subscribe(
      (response: any) => {
        if (response.message === 'Inicio de sesión exitoso') {
          // Limpiar el bloqueo si existía
          this.limpiarBloqueoUsuario(this.usuario);
          
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'Inicio de sesión exitoso.',
            confirmButtonText: 'Continuar'
          });
          localStorage.setItem('usuario', 'true');
          localStorage.setItem('nombre', response.usuario.email);
          location.href = 'dashboard';
        } else {
          this.manejarRespuestaFallida(response);
        }
      },
      (error) => {
        if (error.status === 403 && error.error.tiempo_restante) {
          this.iniciarBloqueoUsuario(this.usuario, error.error.tiempo_restante * 60);
          this.mostrarTiempoRestante(this.usuario);
        } else if (error.status === 404) {
          Swal.fire({
            icon: 'error',
            title: 'Usuario no encontrado',
            text: 'El email ingresado no corresponde a ningún usuario.',
            confirmButtonText: 'Entendido'
          });
        } else if (error.status === 422) {
          this.manejarRespuestaFallida(error.error);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: 'Ocurrió un error al intentar iniciar sesión. Por favor, intente nuevamente.',
            confirmButtonText: 'Entendido'
          });
        }
      }
    );
  }

  private iniciarBloqueoUsuario(email: string, tiempoInicial: number) {
    // Limpiar bloqueo existente si hay uno
    this.limpiarBloqueoUsuario(email);

    // Crear nuevo bloqueo
    const bloqueo: BloqueoUsuario = {
      tiempoRestante: tiempoInicial
    };

    // Iniciar la cuenta regresiva para este usuario
    bloqueo.intervalo = setInterval(() => {
      if (bloqueo.tiempoRestante > 0) {
        bloqueo.tiempoRestante--;
      } else {
        this.limpiarBloqueoUsuario(email);
      }
    }, 1000);

    this.bloqueosUsuarios.set(email, bloqueo);
  }

  private limpiarBloqueoUsuario(email: string) {
    const bloqueo = this.bloqueosUsuarios.get(email);
    if (bloqueo) {
      if (bloqueo.intervalo) {
        clearInterval(bloqueo.intervalo);
      }
      this.bloqueosUsuarios.delete(email);
    }
  }

  manejarRespuestaFallida(response: any) {
    if (response.message.includes('Intento')) {
      Swal.fire({
        icon: 'warning',
        title: 'Credenciales incorrectas',
        text: response.message,
        confirmButtonText: 'Entendido'
      });
    } else if (response.message.includes('bloqueado')) {
      Swal.fire({
        icon: 'error',
        title: 'Cuenta bloqueada',
        text: response.message,
        confirmButtonText: 'Entendido'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.message,
        confirmButtonText: 'Entendido'
      });
    }
  }

  mostrarTiempoRestante(email: string) {
    const bloqueo = this.bloqueosUsuarios.get(email);
    if (!bloqueo) return;

    // Limpiar cualquier intervalo de alerta existente
    if (this.intervaloAlerta) {
      clearInterval(this.intervaloAlerta);
    }

    // Crear elementos HTML para el tiempo
    const tiempoHTML = document.createElement('div');
    tiempoHTML.id = 'tiempo-restante';

    // Mostrar la alerta con HTML personalizado
    Swal.fire({
      icon: 'info',
      title: 'Cuenta bloqueada',
      html: tiempoHTML,
      confirmButtonText: 'Entendido',
      willClose: () => {
        if (this.intervaloAlerta) {
          clearInterval(this.intervaloAlerta);
        }
      }
    });

    // Función para actualizar el texto del tiempo
    const actualizarTextoTiempo = () => {
      const minutos = Math.floor(bloqueo.tiempoRestante / 60);
      const segundos = bloqueo.tiempoRestante % 60;
      tiempoHTML.textContent = `La cuenta está bloqueada. Intente nuevamente en ${minutos}m ${segundos}s.`;
    };

    // Actualizar el tiempo inmediatamente
    actualizarTextoTiempo();

    // Crear un intervalo para actualizar el tiempo cada segundo mientras la alerta está visible
    this.intervaloAlerta = setInterval(() => {
      actualizarTextoTiempo();
    }, 1000);
  }

  ngOnDestroy() {
    // Limpiar todos los intervalos al destruir el componente
    for (const [email, bloqueo] of this.bloqueosUsuarios) {
      this.limpiarBloqueoUsuario(email);
    }
    if (this.intervaloAlerta) {
      clearInterval(this.intervaloAlerta);
    }
  }
}
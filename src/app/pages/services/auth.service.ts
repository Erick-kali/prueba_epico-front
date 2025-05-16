import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuarios } from '../../interfaces/usuarios.interface';
import { Rol } from '../../interfaces/rol.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/usuarios'; // URL para el endpoint de usuarios
  private baseUrl = 'http://127.0.0.1:8000/api';         // URL base para todos los endpoints  
  private rolesUrl = `${this.baseUrl}/roles`;            // URL para el endpoint de roles

  // Usuario actual en memoria (observable)
  private usuarioActualSubject = new BehaviorSubject<Usuarios | null>(this.obtenerUsuarioDesdeStorage());

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de usuarios desde el backend.
   */
  obtenerUsuarios(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(this.apiUrl).pipe(
      catchError(this.handleError<Usuarios[]>('obtenerUsuarios', []))
    );
  }

  /**
   * Obtiene un usuario por su ID desde el backend.
   */
  obtenerUsuarioPorId(id: number): Observable<Usuarios> {
    return this.http.get<Usuarios>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<Usuarios>('obtenerUsuarioPorId'))
    );
  }

  /**
   * Obtiene la lista de roles desde el backend.
   */
  obtenerRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.rolesUrl).pipe(
      catchError(this.handleError<Rol[]>('obtenerRoles', []))
    );
  }

  /**
   * Crea un nuevo usuario en el backend.
   */
  crearUsuario(usuario: Usuarios): Observable<Usuarios> {
    return this.http.post<Usuarios>(this.apiUrl, usuario);
  }

  /**
   * Actualiza los datos de un usuario en el backend.
   */
  actualizarUsuario(usuario: Usuarios): Observable<Usuarios> {
    return this.http.put<Usuarios>(`${this.apiUrl}/${usuario.id_usuario}`, usuario);
  }

  /**
   * Elimina un usuario del backend.
   */
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<void>('eliminarUsuario'))
    );
  }

  /**
   * Establece el usuario actual (ej. después del login).
   */
  establecerUsuarioActual(usuario: Usuarios): void {
    this.usuarioActualSubject.next(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  /**
   * Retorna un observable con el usuario actual.
   */
  obtenerUsuarioActual(): Observable<Usuarios | null> {
    return this.usuarioActualSubject.asObservable();
  }

  /**
   * Limpia el usuario actual (ej. al cerrar sesión).
   */
  limpiarUsuarioActual(): void {
    this.usuarioActualSubject.next(null);
    localStorage.removeItem('usuario');
  }

  /**
   * Lee el usuario desde localStorage al iniciar la app.
   */
  private obtenerUsuarioDesdeStorage(): Usuarios | null {
    const usuarioJson = localStorage.getItem('usuario');
    return usuarioJson ? JSON.parse(usuarioJson) : null;
  }

  /**
   * Manejo de errores comunes.
   */
  private handleError<T>(operation = 'operación', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló: ${error.message}`);
      return of(result as T);
    };
  }
}

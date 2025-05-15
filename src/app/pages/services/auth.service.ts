// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuarios } from '../../interfaces/usuarios.interface';
import { Rol } from '../../interfaces/rol.interface';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/usuarios'; // URL para el endpoint de usuarios

  private baseUrl = 'http://127.0.0.1:8000/api';  // URL base para todos los endpoints  
  private rolesUrl = `${this.baseUrl}/roles`;  // URL para el endpoint de roles

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de usuarios desde el backend.
   * @returns Observable<Usuarios[]>
   */
  obtenerUsuarios(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(this.apiUrl).pipe(
      catchError(this.handleError<Usuarios[]>('obtenerUsuarios', []))  // Manejo de error
    );
  }

  /**
   * Obtiene un usuario por su ID desde el backend.
   * @param id El ID del usuario.
   * @returns Observable<Usuarios>
   */
  obtenerUsuarioPorId(id: number): Observable<Usuarios> {
    return this.http.get<Usuarios>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<Usuarios>('obtenerUsuarioPorId'))
    );
  }

  /**
   * Obtiene la lista de roles desde el backend.
   * @returns Observable<Rol[]>
   */
  obtenerRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.rolesUrl).pipe(
      catchError(this.handleError<Rol[]>('obtenerRoles', []))  // Manejo de error
    );
  }


  /**
   * Crea un nuevo usuario en el backend.
   * @param usuario El objeto usuario a crear.
   * @returns Observable<Usuarios>
   */
  crearUsuario(usuario: Usuarios): Observable<Usuarios> {
    return this.http.post<Usuarios>(this.apiUrl, usuario);
  }

  /**
   * Actualiza los datos de un usuario en el backend.
   * @param usuario El objeto usuario con los datos a actualizar.
   * @returns Observable<Usuarios>
   */
  actualizarUsuario(usuario: Usuarios): Observable<Usuarios> {
    return this.http.put<Usuarios>(`${this.apiUrl}/${usuario.id_usuario}`, usuario);
  }


  /**
   * Elimina un usuario del backend.
   * @param id El ID del usuario a eliminar.
   * @returns Observable<void>
   */
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<void>('eliminarUsuario'))  // Manejo de error
    );
  }

  /**
   * Maneja los errores de las peticiones HTTP.
   * @param operation El nombre de la operación que falló.
   * @param result El valor predeterminado que se retornará en caso de error.
   * @returns Observable Típico de cualquier observable.
   */
  private handleError<T>(operation = 'operación', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló: ${error.message}`);
      return of(result as T);
    };
  }
}

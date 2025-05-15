import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { Usuarios } from '../../interfaces/usuarios.interface';
import { Rol } from '../../interfaces/rol.interface';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('modalUsuario') modalUsuario!: TemplateRef<any>;

  usuarios: Usuarios[] = [];
  dataSource!: MatTableDataSource<Usuarios>;
  form!: FormGroup;
  editMode = false;
  dialogRef: MatDialogRef<any> | null = null;

  roles: Rol[] = [];

  displayedColumns: string[] = [
    'id_usuario',
    'nombres',
    'apellidos',
    'email',
    'cedula',
    'id_rol',
    'status', // 'status' en lugar de 'id_estado'
    'numero_intento',
    'acciones'
  ];

  intentosList: number[] = Array.from({ length: 10 }, (_, i) => i + 1);

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  private initForm(): void {
    this.form = this.fb.group({
      id_usuario: [null],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      id_rol: [1, Validators.required],
      status: ['activo', Validators.required], // 'status' en lugar de 'id_estado'
      numero_intento: [1, Validators.required],
    });
  }

  cargarUsuarios(): void {
    this.authService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.dataSource = new MatTableDataSource(this.usuarios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data, filter) =>
          (data.nombres + ' ' + data.apellidos).toLowerCase().includes(filter.toLowerCase());
      },
      error: () => alert('Error al cargar usuarios.')
    });
  }

    // Cargar roles
    cargarRoles(): void {
      this.authService.obtenerRoles().subscribe({
        next: (roles) => {
          this.roles = roles;
          // Cargar los usuarios después de que los roles están disponibles
          this.cargarUsuarios();
        },
        error: () => alert('Error al cargar roles.')
      });
    }
  
    // Obtener el nombre del rol según el id_rol
    getNombreRol(id_rol: number): string {
      const rol = this.roles.find(role => role.id_rol === id_rol);
      return rol ? rol.nombre_rol : 'Rol no encontrado';
    }
  

  abrirModal(usuario?: Usuarios): void {
    this.editMode = !!usuario;

    if (usuario) {
      this.form.patchValue(usuario);
      if (this.editMode) {
        this.form.get('contrasena')?.clearValidators();
        this.form.get('contrasena')?.updateValueAndValidity();
      }
    } else {
      this.initForm();
    }

    this.dialogRef = this.dialog.open(this.modalUsuario, {
      width: '600px',
      disableClose: true
    });
  }

  cerrarModal(): void {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.editMode = false;
    this.form.reset({
      id_rol: 1,
      status: 'activo', // Asignar el valor por defecto del estado
      numero_intento: 1
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  guardarUsuario(): void {
    if (this.form.valid) {
      const usuario = { ...this.form.value };

      if (this.editMode) {
        usuario.usuario_modificacion = 'admin';
        usuario.fecha_modificacion = new Date().toISOString();

        this.authService.actualizarUsuario(usuario).subscribe({
          next: () => {
            this.cargarUsuarios();
            this.cerrarModal();
          },
          error: () => alert('Error al actualizar el usuario.')
        });
      } else {
        delete usuario.id_usuario;
        usuario.usuario_creacion = 'admin';
        usuario.fecha_creacion = new Date().toISOString();

        this.authService.crearUsuario(usuario).subscribe({
          next: () => {
            this.cargarUsuarios();
            this.cerrarModal();
          },
          error: () => alert('Error al crear el usuario.')
        });
      }
    }
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.authService.eliminarUsuario(id).subscribe({
        next: () => this.cargarUsuarios(),
        error: () => alert('Error al eliminar el usuario.')
      });
    }
  }
}

import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RolService } from '../services/rol.service';
import { Rol } from '../../interfaces/rol.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('modalRol') modalRol!: TemplateRef<any>;
  
  roles: Rol[] = [];
  dataSource!: MatTableDataSource<Rol>;
  form!: FormGroup;
  editMode: boolean = false;
  dialogRef: MatDialogRef<any> | null = null;

  displayedColumns: string[] = ['id_rol', 'nombre_rol', 'acciones'];

  constructor(
    private rolService: RolService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      id_rol: [null],
      nombre_rol: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarRoles();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      if (this.paginator) {
        this.paginator.pageSize = 5;
        this.paginator.firstPage();
      }
    });
  }

  cargarRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (response: Rol[]) => {
        this.roles = response;
        this.dataSource = new MatTableDataSource(this.roles);
        setTimeout(() => {
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
            this.paginator.firstPage();
          }
        });
      },
      error: (err: any) => console.error('Error al cargar roles:', err)
    });
  }

  abrirModal(rol?: Rol): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.editMode = !!rol;

    if (rol) {
      this.form.patchValue(rol);
    } else {
      this.initForm();
    }

    this.dialogRef = this.dialog.open(this.modalRol, {
      width: '400px',
      disableClose: true
    });
  }

  cerrarModal(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
      this.editMode = false;
      this.form.reset();
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  guardarRol(): void {
    if (this.form.valid) {
      const rol = { ...this.form.value };

      if (this.editMode) {
        this.rolService.updateRol(rol.id_rol, rol).subscribe({
          next: () => {
            this.cargarRoles();
            this.cerrarModal();
          },
          error: (err: any) => {
            console.error('Error al actualizar rol:', err);
            alert('Hubo un error al actualizar el rol.');
          }
        });
      } else {
        delete rol.id_rol;
        this.rolService.createRol(rol).subscribe({
          next: () => {
            this.cargarRoles();
            this.cerrarModal();
          },
          error: (err: any) => {
            console.error('Error al crear rol:', err);
            alert('Hubo un error al crear el rol.');
          }
        });
      }
    }
  }

  eliminarRol(id_rol: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este rol?')) {
      this.rolService.deleteRol(id_rol).subscribe({
        next: () => {
          this.cargarRoles();
        },
        error: (err: any) => {
          console.error('Error al eliminar rol:', err);
          alert('Hubo un error al eliminar el rol.');
        }
      });
    }
  }
}

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { VentasService } from '../services/ventas.service';
import { ProductosService } from '../services/producto.service';
import { AuthService } from '../services/auth.service';

import { Venta } from '../../interfaces/ventas.interface';
import { Productos } from '../../interfaces/producto.interface';
import { Usuarios } from '../../interfaces/usuarios.interface';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('modalVenta') modalVenta!: TemplateRef<any>;

  ventas: Venta[] = [];
  clientes: Usuarios[] = [];
  productos: Productos[] = [];

  dataSource!: MatTableDataSource<Venta>;
  form!: FormGroup;
  editMode = false;
  dialogRef: MatDialogRef<any> | null = null;

  displayedColumns: string[] = [
    'id_venta',
    'cliente',
    'producto',
    'cantidad',
    'precio_unitario',
    'total',
    'acciones'
  ];

  constructor(
    private ventasService: VentasService,
    private productosService: ProductosService,
    private authService: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  private initForm(): void {
    this.form = this.fb.group({
      id_venta: [null],
      id_cliente: [null, Validators.required],
      id_producto: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio_unitario: [{ value: 0, disabled: true }, Validators.required],
      total: [{ value: 0, disabled: true }]
    });

    // Público para el template
    this.form.get('id_producto')!.valueChanges.subscribe(() => this.actualizarPrecio());
    this.form.get('cantidad')!.valueChanges.subscribe(() => this.actualizarTotal());
  }

  private loadAll(): void {
    this.authService.obtenerUsuarios().subscribe({
      next: users => {
        this.clientes = users;
        this.productosService.getProductos().subscribe({
          next: prods => {
            this.productos = prods;
            this.ventasService.getVentas().subscribe({
              next: vts => {
                this.ventas = vts;
                this.setupTable();
              },
              error: () => alert('Error al cargar ventas.')
            });
          },
          error: () => alert('Error al cargar productos.')
        });
      },
      error: () => alert('Error al cargar clientes.')
    });
  }

  private setupTable(): void {
    this.dataSource = new MatTableDataSource(this.ventas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (row: Venta, filter: string) => {
      const f = filter.trim().toLowerCase();
      return (
        row.id_venta?.toString().includes(f) ||
        this.getNombreCliente(row.id_usuario).toLowerCase().includes(f) ||
        this.getNombreProducto(row.id_producto).toLowerCase().includes(f)
      );
    };
  }

  applyFilter(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.dataSource.filter = val;
    this.dataSource.paginator?.firstPage();
  }

  abrirModal(venta?: Venta): void {
    this.editMode = !!venta;
    if (venta) {
      this.form.patchValue({
        id_venta: venta.id_venta,
        id_cliente: venta.id_usuario,
        id_producto: venta.id_producto,
        cantidad: venta.cantidad,
        precio_unitario: venta.precio_unitario,
        total: venta.subtotal
      });
    } else {
      this.form.reset({ cantidad: 1, precio_unitario: 0, total: 0 });
    }
    this.dialogRef = this.dialog.open(this.modalVenta, {
      width: '600px',
      disableClose: true
    });
  }

  cerrarModal(): void {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.editMode = false;
    this.form.reset({ cantidad: 1, precio_unitario: 0, total: 0 });
  }

  // Métodos públicos para el template
  actualizarPrecio(): void {
    const id = this.form.get('id_producto')!.value;
    const prod = this.productos.find(p => p.id_producto === id);
    const precio = prod?.precio ?? 0;
    this.form.get('precio_unitario')!.setValue(precio);
    this.actualizarTotal();
  }

  actualizarTotal(): void {
    const cant = this.form.get('cantidad')!.value || 0;
    const precio = this.form.get('precio_unitario')!.value || 0;
    this.form.get('total')!.setValue(cant * precio);
  }

  guardarVenta(): void {
    if (this.form.invalid) return;
    const venta: Venta = {
      id_venta: this.form.get('id_venta')!.value,
      id_usuario: this.form.get('id_cliente')!.value,
      id_producto: this.form.get('id_producto')!.value,
      cantidad: this.form.get('cantidad')!.value,
      precio_unitario: this.form.get('precio_unitario')!.value,
      subtotal: this.form.get('total')!.value,
      fecha_venta: new Date().toISOString()
    };
    const op = this.editMode
      ? this.ventasService.updateVenta(venta.id_venta!, venta)
      : this.ventasService.addVenta(venta);
    op.subscribe({
      next: () => {
        this.loadAll();
        this.cerrarModal();
      },
      error: () => alert(this.editMode ? 'Error al actualizar venta.' : 'Error al crear venta.')
    });
  }

  eliminarVenta(id: number): void {
    if (!confirm('¿Eliminar esta venta?')) return;
    this.ventasService.deleteVenta(id).subscribe({
      next: () => this.loadAll(),
      error: () => alert('Error al eliminar venta.')
    });
  }

  getNombreCliente(id: number): string {
    const c = this.clientes.find(u => u.id_usuario === id);
    return c ? `${c.nombres} ${c.apellidos}` : '—';
  }

  getNombreProducto(id: number): string {
    const p = this.productos.find(x => x.id_producto === id);
    return p ? p.nombre_producto : '—';
  }
}

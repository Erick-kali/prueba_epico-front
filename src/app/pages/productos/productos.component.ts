import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Productos } from '../../interfaces/producto.interface';
import { ProductosService } from '../services/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'id_producto', 'nombre_producto', 'descripcion', 'precio', 'stock',
    'categoria', 'proveedor', 'estado', 'acciones'
  ];
  dataSource = new MatTableDataSource<Productos>([]);
  form!: FormGroup;
  editMode = false;
  productoSeleccionado!: Productos;
  categorias: string[] = ['Electrónica', 'Ropa', 'Hogar', 'Otros'];
  proveedores: string[] = ['Industriales', 'MercadoTecnia', 'Otros'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('modalProducto') modalProducto!: TemplateRef<any>;  // <--- Cambiado aquí

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private productosService: ProductosService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  cargarProductos(): void {
    this.productosService.getProductos().subscribe(productos => {
      this.dataSource.data = productos;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  abrirModal(producto?: Productos): void {
    this.editMode = !!producto;
    this.productoSeleccionado = producto ? { ...producto } : {} as Productos;

    this.form = this.fb.group({
      nombre_producto: [producto?.nombre_producto || '', Validators.required],
      descripcion: [producto?.descripcion || '', Validators.required],
      precio: [producto?.precio || 0, [Validators.required, Validators.min(0.01)]],
      stock: [producto?.stock || 0, [Validators.required, Validators.min(0)]],
      categoria: [producto?.categoria || '', Validators.required],
      proveedor: [producto?.proveedor || '', Validators.required],
      estado: [producto?.estado || 'disponible', Validators.required]
    });

    this.dialog.open(this.modalProducto);  // ✅ ahora sí funciona
  }

  cerrarModal(): void {
    this.dialog.closeAll();
  }

  guardarProducto(): void {
    if (this.form.invalid) return;

    const producto: Productos = this.form.value;

    if (this.editMode && this.productoSeleccionado.id_producto) {
      producto.id_producto = this.productoSeleccionado.id_producto;
      this.productosService.updateProducto(producto.id_producto, producto).subscribe(() => {
        this.cargarProductos();
        this.cerrarModal();
      });
    } else {
      this.productosService.addProducto(producto).subscribe(() => {
        this.cargarProductos();
        this.cerrarModal();
      });
    }
  }

  eliminarProducto(id_producto: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productosService.deleteProducto(id_producto).subscribe(() => {
        this.cargarProductos();
      });
    }
  }
}

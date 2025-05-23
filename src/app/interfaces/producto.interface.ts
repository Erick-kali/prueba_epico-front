// Generated by https://quicktype.io

export interface Productos {
  id_producto?: number;         // <-- opcional al registrar
  nombre_producto: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  proveedor: string;
  estado?: 'disponible' | 'agotado';  // <-- opcional
  fecha_creacion?: string;      // <-- opcional
}

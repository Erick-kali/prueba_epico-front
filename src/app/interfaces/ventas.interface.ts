export interface Venta {
  id_venta?: number;
  id_usuario: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
  fecha_venta?: string;
  total?: number; // <-- Añade esto si lo usas en el formulario
}

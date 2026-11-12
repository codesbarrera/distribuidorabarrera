export interface Product {
  id?: string;
  nombre: string;
  equipo: string;
  tipo: string;
  genero?: string;
  calidad?: string;
  precio_detal: number;
  precio_mayorista?: number;
  imagen: string;
  tallas: string[];
  stock: number;
  descripcion?: string;
}

export interface CartItem {
  key: string;
  nombre: string;
  equipo: string;
  precio: number;
  imagen: string;
  talla: string;
  cantidad: number;
  personalizacion?: {
    nombre: string;
    numero: string;
  };
}

export interface CustomerData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  cedula: string;
  direccion: string;
  barrio: string;
  ciudad: string;
  notas: string;
}

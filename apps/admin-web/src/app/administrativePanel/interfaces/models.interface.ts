import { WritableSignal } from "@angular/core";

export interface MenuOption {
  label: string;
  route: string;
  icon: string;
  style?: string;
}

export interface Form {
  title: string;
  id: string,
  type: 'text' | 'number' | 'email' | 'password' | 'checkbox' |
  'time' | 'tel' | 'date';
  value: WritableSignal<string>;
  validation?: (value: string) => string | null;
  error?: WritableSignal<string | null>;
  step?: string;
}

export interface Neighborhood {
  id: string;
  name: string;
}

export interface Stops {
  id?: string;
  name: string;
  description: string;
  neighborhoodId: string;
  latitude: number;
  longitude: number;
}

export interface Location{
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Routes {
  id?: string; // <-- Cambiar number por string
  name: string;
  description: string;
  startTime: string,
  endTime: string,
  neighborhoods: string[]; // <-- Asegúrate de que los arreglos reciban strings
  stops: string[];
}

export interface SearchType{
  name: string;
  type: 'ruta' | 'parada';
}


export interface LoginForm{
  email? : string;
  password?: string;
}


export interface User{
  id?: string; // <-- Cambia number por string, y ponle el ? por si es opcional al crearlo
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

export interface AssignDriver{
  id? : string;
  driverId: string;
  routeId: string;
}

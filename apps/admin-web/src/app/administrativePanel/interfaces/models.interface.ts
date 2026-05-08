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
}

export interface Neighborhood {
  id: number;
  name: string;
}

export interface Stops {
  id?: number;
  name: string;
  description: string;
  neighborhoodId: number;
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
  id?: number;
  name: string;
  description: string;
  startTime: string,
  endTime: string,
  neighborhoods: number[];
  stops: number[];

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
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

export interface AssignDriver{
  id? : number;
  driverId: number;
  routeId: number;
}



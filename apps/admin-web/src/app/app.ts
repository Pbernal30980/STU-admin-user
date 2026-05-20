import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { environment } from '../environments/environment';
import { apiKey } from '../environments/apikey';

@Component({
  imports: [RouterModule], // Eliminamos NxWelcome de aquí
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'admin-web';

  ngOnInit(): void {
    initFlowbite();
    this.loadGoogleMaps();
  }

  private loadGoogleMaps(): void {
    if (typeof window === 'undefined') return;

    const b = window as any;
    if (b.google && b.google.maps) {
      return;
    }

    let key = apiKey.key;
    if (!key || key === 'TU_API_KEY_DE_GOOGLE_MAPS') {
      key = environment.firebase.apiKey;
    }

    if (!key) {
      console.warn('Google Maps API key no configurada.');
      return;
    }

    const g: Record<string, string> = {
      v: 'weekly',
      key: key,
    };

    b.google = b.google || {};
    const d = b.google.maps = b.google.maps || {};
    const r = new Set<string>();
    const e = new URLSearchParams();

    let h: Promise<any> | null = null;
    const u = () => h || (h = new Promise(async (f, n) => {
      const a = document.createElement('script');
      e.set('libraries', [...r] + '');
      for (const [k, val] of Object.entries(g)) {
        e.set(k.replace(/[A-Z]/g, t => '_' + t[0].toLowerCase()), val);
      }
      e.set('callback', 'google.maps.__ib__');
      a.src = `https://maps.googleapis.com/maps/api/js?` + e.toString();
      d.__ib__ = f;
      a.onerror = () => { h = null; n(Error('The Google Maps JavaScript API could not load.')); };
      const nonce = document.querySelector('script[nonce]') as any;
      a.nonce = nonce?.nonce || '';
      document.head.append(a);
    }));

    if (!d.importLibrary) {
      d.importLibrary = (f: string, ...n: any[]) => r.add(f) && u().then(() => d.importLibrary(f, ...n));
    }
  }
}
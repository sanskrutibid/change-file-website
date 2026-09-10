import 'zone.js/node';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { renderApplication } from '@angular/platform-server';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

export { renderApplication, AppComponent };

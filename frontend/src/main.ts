import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
// import {  } from './app/app.component';
import { AppComponent } from './app/app.component';
// 🔥 THIS ONE LINE AUTO-REGISTERS EVERYTHING
import 'chart.js/auto';
import { Chart,registerables } from 'chart.js/auto';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));

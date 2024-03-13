import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { NotificationModule } from "@modules/notification";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(NotificationModule.forRoot())]
};

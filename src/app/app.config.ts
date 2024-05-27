import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';
import { INTL_LOCALES } from "angular-ecmascript-intl";

export const appConfig: ApplicationConfig = {

  providers: [provideRouter(routes), provideAnimations(), provideAnimations(), provideHttpClient(), provideMarkdown(), {
      provide: INTL_LOCALES,
      // useValue: navigator.language,
      useValue: 'en-us',
    }]

};

import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeServiceService {
  emitter: EventEmitter<boolean> = new EventEmitter();
 toggleThemeClick() {
   this.darkMode = !this.darkMode;
   this.emitter.emit(this.darkMode);
    if (this.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  darkMode = false

  constructor() { }
}

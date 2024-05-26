import { EventEmitter, Injectable } from '@angular/core';
const DARK_THEME = 'dark-theme';
@Injectable({
  providedIn: 'root'
})
export class ThemeServiceService {
  emitter: EventEmitter<boolean> = new EventEmitter();
 toggleThemeClick() {
   this.darkMode = !this.darkMode;
   this.emitter.emit(this.darkMode);
    if (this.darkMode) {
      document.body.classList.add(DARK_THEME);
      window.localStorage.setItem(DARK_THEME, 'true');
    } else {
      window.localStorage.removeItem(DARK_THEME);
      document.body.classList.remove(DARK_THEME);
    }
  }

  darkMode = false

  constructor() {
    if (window.localStorage.getItem(DARK_THEME) != null) {
      this.toggleThemeClick();
    }
   }
}

import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MathfieldElement, renderMathInDocument, renderMathInElement } from 'mathlive';

import { ThemeServiceService } from '../theme-service.service';

MathfieldElement.fontsDirectory = 'assets/mathlive/fonts';  // https://cortexjs.io/mathlive/guides/integration/#fonts-folder
MathfieldElement.soundsDirectory = 'assets/mathlive/sounds';  // fonts and sounds are stored in /assets/mathlive/ through angular.json.

@Component({
  selector: 'app-math-input',
  standalone: true,
  imports: [],
  templateUrl: './math-input.component.html',
  styleUrl: './math-input.component.css',
  encapsulation: ViewEncapsulation.None
  // styleUrl: '/node_modules/mathlive/dist/mathlive-fonts.css'
})




export class MathInputComponent implements AfterViewInit {
  @ViewChild('mathField', { static: true })
  mathFieldContainer!: ElementRef<HTMLDivElement>;
  @Output() expressionChange = new EventEmitter<string>();
  @Input() placeholder = 'x';
  @Input() value_latex = '';
  mathField!: MathfieldElement;

  constructor(themeService: ThemeServiceService, private element: ElementRef) {
    // themeService.emitter.subscribe(s => {
    //   renderMathInElement(this.mathField)
    // })
  }

  ngAfterViewInit() {

    
    
    console.log('MathLive version', MathfieldElement.version);
    this.mathField = new MathfieldElement({
      // smartFence: true
      defaultMode: 'math',
      contentPlaceholder: this.placeholder
    })
    this.mathField.menuItems = [];
    this.mathField.setValue(this.value_latex);
    this.mathFieldContainer.nativeElement.appendChild(this.mathField);
    
    this.mathField.addEventListener("input", (ev) => {
      let val = (ev.target as any).value;
      this.expressionChange.emit(this.getValue())
      this.mathField.setValue(
        val,
        { silenceNotifications: true }
      )
    });
    
  }

  getValue(): string {
    return this.mathField.getValue('latex');
  }

}

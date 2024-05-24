import * as wasm from "algebrars";
import { Component, ElementRef, OnChanges, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { KatexOptions, MarkdownModule, MarkdownService } from 'ngx-markdown';
import { i } from "mathjs";

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [MarkdownModule, FormsModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
})
export class TreeComponent {
  onLatexError(err: any) {

    if (this.last_valid_latex) {
      this.latex_expression = this.last_valid_latex;
    }
  }
  latex_expression: string = '';
  last_valid_latex?: string;
  expression_error?: string;
  entered_expression = new FormControl('', {
    validators:
      [this.expressionValidator.bind(this)],
    nonNullable: true
  });

  expressionValidator(control: AbstractControl<any, any>): ValidationErrors | null {
    let expr = control.value;
    console.log({ expr })
    if (!expr) {
      this.latex_expression = "";
      return null
    };

    try {
      const tree = wasm.MathTree.parse(expr);
      const latex = tree.to_latex();
      this.latex_expression = '$' + latex + '$';
      this.last_valid_latex = this.latex_expression;

      return null;
    } catch (e) {
      this.latex_expression = '$' + expr + '$';
      // console.log('Invalid expression: ', this.expression_error)
      // this.last_valid_latex = undefined;
    }

    return { invalidExpression: true };
  }

  @ViewChild('exprInput', { static: true })
  input!: ElementRef<HTMLSpanElement>;

  public options: KatexOptions = {
    displayMode: true,
    throwOnError: true,
    errorCallback: this.onLatexError.bind(this)
  };
  constructor(

  ) { }

  onChange(val: string) {
    if (val.length == 0) return;
    // this.entered_expression = val;
    // this.markdownService.render(this.input.nativeElement, { katexOptions: this.options }, this.viewContainerRef);
    // val.replace('pi', '\\pi');

    try {

      const tree = wasm.MathTree.parse(val);
      const latex = tree.to_latex();
      this.latex_expression = '$' + latex + '$';
    } catch (e) {
      this.latex_expression = '$' + val + '$';
      this.expression_error = "Invalid expression";
      console.log('Invalid expression: ', this.expression_error)
    }

    console.log(this.latex_expression)
  }
  //   public options: KatexOptions = {
  //     displayMode: true,
  //     throwOnError: false,
  //     errorColor: '#cc0000',
  //     delimiters: [...],
  //     ...
  // };
}

// MATHQUILL
// MATHLIVE - for react
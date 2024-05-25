import * as wasm from "algebrars";
import { AfterContentInit, AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MathInputComponent } from "../math-input/math-input.component";
import { ThemeServiceService } from "../theme-service.service";
import { MarkdownComponent, MermaidAPI } from "ngx-markdown";

// credit https://github.com/syedabdulaala/mathlive-ng-sample
@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MathInputComponent, MarkdownComponent],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
})
export class TreeComponent {

  @ViewChild('tree', { static: true }) treeElement!: ElementRef<HTMLDivElement>;
  latex_expression: string = '';
  last_valid_latex?: string;
  expression_error?: string;
  data: string = '```mermaid\ngraph TB\n    a-->b\n```';
  mermaidOptions: MermaidAPI.Config = {
    fontFamily: '"trebuchet ms", verdana, arial, sans-serif',
    logLevel: MermaidAPI.LogLevel.Warn,
    theme: MermaidAPI.Theme.Dark,
  };

  expressionChange(expr: string) {
    try {
      const tree = wasm.MathTree.parse(expr);
      const latex = tree.to_latex();
      this.latex_expression = '$' + latex + '$';
      this.last_valid_latex = this.latex_expression;

      // return null;
    } catch (e) {
      this.latex_expression = '$' + expr + '$';
      // console.log('Invalid expression: ', this.expression_error)
      // this.last_valid_latex = undefined;
    }
  }


  onLatexError(err: any) {

    if (this.last_valid_latex) {
      this.latex_expression = this.last_valid_latex;
    }
  }
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

  // public options: KatexOptions = {
  //   displayMode: true,
  //   throwOnError: true,
  //   errorCallback: this.onLatexError.bind(this)
  // };


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
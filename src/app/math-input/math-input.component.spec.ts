import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathInputComponent } from './math-input.component';

describe('MathInputComponent', () => {
  let component: MathInputComponent;
  let fixture: ComponentFixture<MathInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MathInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MathInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

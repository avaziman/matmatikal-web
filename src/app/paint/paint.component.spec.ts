import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintComponent } from './paint.component';

describe('PaintComponent', () => {
  let component: PaintComponent;
  let fixture: ComponentFixture<PaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

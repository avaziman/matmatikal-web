import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SketcherComponent } from './sketcher.component';

describe('SketcherComponent', () => {
  let component: SketcherComponent;
  let fixture: ComponentFixture<SketcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SketcherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SketcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

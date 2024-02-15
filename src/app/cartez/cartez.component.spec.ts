import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartezComponent } from './cartez.component';

describe('CartezComponent', () => {
  let component: CartezComponent;
  let fixture: ComponentFixture<CartezComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartezComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CartezComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

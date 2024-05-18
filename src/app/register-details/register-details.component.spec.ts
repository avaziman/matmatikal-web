import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDetailsComponent } from './register-details.component';

describe('RegisterDetailsComponent', () => {
  let component: RegisterDetailsComponent;
  let fixture: ComponentFixture<RegisterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

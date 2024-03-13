import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSelectOptionComponent } from './form-select-option.component';

describe('FormSelectOptionComponent', () => {
  let component: FormSelectOptionComponent;
  let fixture: ComponentFixture<FormSelectOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSelectOptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormSelectOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

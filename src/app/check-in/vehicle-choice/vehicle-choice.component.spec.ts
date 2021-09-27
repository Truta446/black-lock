import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleChoiceComponent } from './vehicle-choice.component';

describe('VehicleChoiceComponent', () => {
  let component: VehicleChoiceComponent;
  let fixture: ComponentFixture<VehicleChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleChoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

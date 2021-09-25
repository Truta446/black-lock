import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursChoiceComponent } from './hours-choice.component';

describe('HoursChoiceComponent', () => {
  let component: HoursChoiceComponent;
  let fixture: ComponentFixture<HoursChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoursChoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoursChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

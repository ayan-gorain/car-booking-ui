import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Drivercreatebooking } from './drivercreatebooking';

describe('Drivercreatebooking', () => {
  let component: Drivercreatebooking;
  let fixture: ComponentFixture<Drivercreatebooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Drivercreatebooking],
    }).compileComponents();

    fixture = TestBed.createComponent(Drivercreatebooking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

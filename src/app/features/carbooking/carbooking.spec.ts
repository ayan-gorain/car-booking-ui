import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carbooking } from './carbooking';

describe('Carbooking', () => {
  let component: Carbooking;
  let fixture: ComponentFixture<Carbooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carbooking],
    }).compileComponents();

    fixture = TestBed.createComponent(Carbooking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

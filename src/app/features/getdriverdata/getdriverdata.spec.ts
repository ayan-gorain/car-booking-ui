import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Getdriverdata } from './getdriverdata';

describe('Getdriverdata', () => {
  let component: Getdriverdata;
  let fixture: ComponentFixture<Getdriverdata>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Getdriverdata],
    }).compileComponents();

    fixture = TestBed.createComponent(Getdriverdata);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tripbookingdriver } from './tripbookingdriver';

describe('Tripbookingdriver', () => {
  let component: Tripbookingdriver;
  let fixture: ComponentFixture<Tripbookingdriver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tripbookingdriver],
    }).compileComponents();

    fixture = TestBed.createComponent(Tripbookingdriver);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

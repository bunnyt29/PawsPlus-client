import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BecomeSitterComponent} from './become-sitter.component';

describe('BecomeSitterComponent', () => {
  let component: BecomeSitterComponent;
  let fixture: ComponentFixture<BecomeSitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeSitterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BecomeSitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

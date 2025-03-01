import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WrapperModalComponent} from './wrapper-modal.component';

describe('WrapperModalComponent', () => {
  let component: WrapperModalComponent;
  let fixture: ComponentFixture<WrapperModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WrapperModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WrapperModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

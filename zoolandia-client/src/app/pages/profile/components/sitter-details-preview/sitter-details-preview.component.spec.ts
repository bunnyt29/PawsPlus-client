import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SitterDetailsPreviewComponent} from './sitter-details-preview.component';

describe('SitterDetailsPreviewComponent', () => {
  let component: SitterDetailsPreviewComponent;
  let fixture: ComponentFixture<SitterDetailsPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SitterDetailsPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SitterDetailsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

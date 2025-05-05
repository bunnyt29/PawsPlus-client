import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerDetailsPreviewComponent } from './owner-details-preview.component';

describe('OwnerDetailsPreviewComponent', () => {
  let component: OwnerDetailsPreviewComponent;
  let fixture: ComponentFixture<OwnerDetailsPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerDetailsPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerDetailsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

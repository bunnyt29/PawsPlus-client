import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPetComponent } from './my-pet.component';

describe('MyPetsComponent', () => {
  let component: MyPetComponent;
  let fixture: ComponentFixture<MyPetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MyProfileLayoutComponent} from './my-profile-layout.component';

describe('SidebarComponent', () => {
  let component: MyProfileLayoutComponent;
  let fixture: ComponentFixture<MyProfileLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyProfileLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

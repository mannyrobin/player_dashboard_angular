import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupHeadComponent } from './group-head.component';

describe('GroupHeadComponent', () => {
  let component: GroupHeadComponent;
  let fixture: ComponentFixture<GroupHeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupHeadComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

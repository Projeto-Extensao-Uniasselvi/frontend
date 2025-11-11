/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LeiHenryBorelComponent } from './leiHenryBorel.component';

describe('LeiHenryBorelComponent', () => {
  let component: LeiHenryBorelComponent;
  let fixture: ComponentFixture<LeiHenryBorelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeiHenryBorelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeiHenryBorelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

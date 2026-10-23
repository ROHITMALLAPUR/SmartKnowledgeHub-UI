import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentEdit } from './document-edit';

describe('DocumentEdit', () => {
  let component: DocumentEdit;
  let fixture: ComponentFixture<DocumentEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

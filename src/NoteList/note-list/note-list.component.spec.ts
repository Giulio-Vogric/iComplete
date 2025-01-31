import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteListComponent } from './note-list.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {v4 as uuid} from 'uuid';

describe('NoteListComponent', () => {
  let component: NoteListComponent;
  let fixture: ComponentFixture<NoteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteListComponent, BrowserAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteListComponent);
    component = fixture.componentInstance;

    component.notes = [ {id: uuid(), description: "hp-note-1", completed: false, date: new Date, priority: 2},
      {id: uuid(), description: "hp-note-2", completed: false, date: new Date, priority: 2},
      {id: uuid(), description: "hp-note-3", completed: false, date: new Date, priority: 2},
      {id: uuid(), description: "hp-note-4", completed: false, date: new Date, priority: 2},
      {id: uuid(), description: "mp-note-1", completed: false, date: new Date, priority: 1},
      {id: uuid(), description: "mp-note-2", completed: false, date: new Date, priority: 1},
      {id: uuid(), description: "lp-note-1", completed: false, date: new Date, priority: 0},
      {id: uuid(), description: "lp-note-2", completed: false, date: new Date, priority: 0},
    ]
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('firstNoteWithPriority', () => {
    it('should return the first index of the note with set priority', () => {
      expect(component.firstNoteWithPriority(0)).toBe(6);
      expect(component.firstNoteWithPriority(1)).toBe(4);
      expect(component.firstNoteWithPriority(2)).toBe(0);

    })
  })

  describe('updateListPriorities', () => {
    it('should move low priority notes to high priority if there are less than 5 notes with hp', () => {

      expect(component.priorityNotesCount(2)).toBe(4)
      let NumOfHPNotes = component.updateListPriorities(4)
      expect(component.priorityNotesCount(2)).toBe(NumOfHPNotes)

      //re-run doesn't add more notes since 5 are already present
      component.updateListPriorities(NumOfHPNotes)
      expect(component.priorityNotesCount(2)).toBe(NumOfHPNotes)
    })
  })


});

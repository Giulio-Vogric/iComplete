import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,} from '@angular/forms';
import {Note} from '../../models/note';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import{v4 as uuid} from 'uuid';
import { MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgClass, TitleCasePipe} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonToggle, MatButtonToggleModule} from '@angular/material/button-toggle';
import {Subject} from 'rxjs';




@Component({
  selector: 'app-note-list',
  imports: [FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    NgClass,
    MatListModule,
    MatIconModule,
    MatButtonToggleModule,
    TitleCasePipe],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css'
})
export class NoteListComponent {

  @ViewChild('buttonToggle', {static: true})
  buttonToggle!: MatButtonToggle;

  notes: Note[] = [];
  maxPrioritizedNotes = 5;
  prioritizedNotes = new Subject<number>;
  newNote: Note = this.initNote()
  advancedMenuIsHidden = true;
  otherNotesAreHidden = true;


  ngOnInit() {

    this.prioritizedNotes.subscribe({
      next: data => {
        if(data > 0 && data < 5) {

          this.updateListPriorities()

        if (this.priorityNotesCount(2) < 5) {
          this.buttonToggle.disabled = false;
        }
        } else {

          this.buttonToggle.disabled = true;
        }
      }
    })
  }


  addNote() {
    /***
     *** Adds a new note to the note list
     ***/
    if (this.newNote.description !== '') {

      const note = {...this.newNote};
      this.notes.push(note);

      this.newNote = this.initNote()
    }
  }


  initNote() {
    const numOfPrioritizedNotes = this.priorityNotesCount(2)
    this.prioritizedNotes.next(numOfPrioritizedNotes)

    const priority = numOfPrioritizedNotes < this.maxPrioritizedNotes-1 ? 2 : 0;

    return {id: uuid(), description: "", completed: false, date: new Date, priority: priority};
  }

  removeNote(id: string) {

    this.notes = this.notes.filter(note => note.id !== id);


    const numOfPrioritizedNotes = this.priorityNotesCount(2)
    this.prioritizedNotes.next(numOfPrioritizedNotes)
  }


  showAdvancedMenu() {
    this.advancedMenuIsHidden = !this.advancedMenuIsHidden
  }

  toggleOtherNotes() {
    this.otherNotesAreHidden = !this.otherNotesAreHidden;
  }

  toggleCompleted(note: Note) {
    note.completed = !note.completed
  }

  isLowPriority(note: Note) {
    return note.priority < 2;
  }

  updateListPriorities() {
    /***
     * Check if there is any note with priority under high (0 and 1) and updates it to high
     * This function is called whenever an item is removed from the priority list and
     * there are less than 5 high priority items
     ***/
    let nextPrioritizeNoteIndex = this.firstNoteWithPriority(1)
    if (nextPrioritizeNoteIndex == -1) {
      nextPrioritizeNoteIndex = this.firstNoteWithPriority(0)
    }
    if (nextPrioritizeNoteIndex != -1) {

      this.notes[nextPrioritizeNoteIndex].priority = 2;
    }

  }

  priorityNotesCount(priority: number) {
    return this.notes.filter(note => note.priority == priority).length;
  }

  firstNoteWithPriority(priority: number) {
    return this.notes.findIndex(note => note.priority == priority);
  }


}

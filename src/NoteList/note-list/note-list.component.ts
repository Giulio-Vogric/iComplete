import { Component } from '@angular/core';
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
import {MatButtonToggleModule} from '@angular/material/button-toggle';




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

  notes: Note[] = [];
  maxPrioritizedNotes = 5;
  newNote: Note = this.initNote()
  advancedMenuIsHidden = true;
  otherNotesAreHidden = true;


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
    const numOfPrioritizedNotes = this.notes.filter(note => note.priority == 2).length;

    const priority = numOfPrioritizedNotes < this.maxPrioritizedNotes ? 2 : 0;

    return {id: uuid(), description: "", completed: false, date: new Date, priority: priority};
  }

  removeNote(id: string) {

    this.notes = this.notes.filter(note => note.id !== id);
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

  checkPriority(note: Note) {
    return note.priority < 2;
  }

}

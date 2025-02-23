import {Component, OnInit, ViewChild} from '@angular/core';
import {ENTER, COMMA} from '@angular/cdk/keycodes'
import {
  FormsModule,
  ReactiveFormsModule,} from '@angular/forms';
import {Note} from '../../models/note';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import{v4 as uuid} from 'uuid';
import { MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {JsonPipe, NgClass, TitleCasePipe} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonToggle, MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips'
import {Subject} from 'rxjs';

import {NoteService} from '../../services/note.service';




@Component({
  selector: 'app-note-list',
  imports: [
    JsonPipe,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    NgClass,
    MatListModule,
    MatIconModule,
    MatButtonToggleModule,
    MatChipsModule,
    TitleCasePipe],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css'
})
export class NoteListComponent implements OnInit{

  @ViewChild('buttonToggle', {static: true})
  buttonToggle!: MatButtonToggle;

  notes: Note[] = [];
  maxPrioritizedNotes = 5;
  prioritizedNotes = new Subject<number>;
  newNote: Note = this.initNote()
  tags = new Set<string>();
  advancedMenuIsHidden = true;
  otherNotesAreHidden = true;
  readonly addOnBlur = true;
  readonly separatorKeyCodes = [ENTER, COMMA] as const;

  constructor(private noteService: NoteService) {
  }


  ngOnInit() {

    this.noteService.getNotes().subscribe((data: Note[]) => {
      data.forEach(element => {
        console.log(element.tags);
      });
      this.notes = data;
    })

    this.prioritizedNotes.subscribe({
      next: data => {

        const NumOfHPNotes = this.updateListPriorities(data)

        this.toggleHighPriorityOption(NumOfHPNotes)
      }
    })
  }


  addNote() {
    /***
     *** Adds a new note to the note list
     ***/
    if (this.newNote.description !== '') {

      this.newNote.tags = JSON.stringify([...this.tags]);
      this.noteService.addNote(this.newNote).subscribe((note) => {

        this.notes.push({...note});
        this.tags.clear();
      });

      this.newNote = this.initNote()
    }
  }


  initNote() {
    const numOfPrioritizedNotes = this.priorityNotesCount(2)
    this.prioritizedNotes.next(numOfPrioritizedNotes)

    const priority = numOfPrioritizedNotes < this.maxPrioritizedNotes-1 ? 2 : 0;

    return {id: uuid(), description: "", completed: false, date: new Date, priority: priority, tags: ''};
  }

  removeNote(id: string) {

    this.noteService.removeNote(id).subscribe((note) => {

      this.notes = this.notes.filter(note => note.id !== id);


      const numOfPrioritizedNotes = this.priorityNotesCount(2)
      this.prioritizedNotes.next(numOfPrioritizedNotes)
    });

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

  updateListPriorities(numOfHP: number): number {
    /***
     * Check if there is any note with priority under high (0 and 1) and updates it to high
     * This function is called whenever an item is removed from the priority list and
     * there are less than 5 high priority items
     ***/
    let NumOfHPNotes = numOfHP;

    while (NumOfHPNotes < 5) {
      let nextPrioritizeNoteIndex = this.firstNoteWithPriority(1)
      if (nextPrioritizeNoteIndex == -1) {``
        nextPrioritizeNoteIndex = this.firstNoteWithPriority(0)
      }
      if (nextPrioritizeNoteIndex != -1) {

        this.notes[nextPrioritizeNoteIndex].priority = 2;
      }
      else {
        return NumOfHPNotes;
      }

      NumOfHPNotes = this.priorityNotesCount(2);
    }
    return NumOfHPNotes;

  }

  priorityNotesCount(priority: number) {
    return this.notes.filter(note => note.priority == priority).length;
  }

  firstNoteWithPriority(priority: number) {
    return this.notes.findIndex(note => note.priority == priority);
  }

  toggleHighPriorityOption(NumOfHPNotes: number) {
    if (NumOfHPNotes < 5) {
      this.buttonToggle.disabled = false;
    } else {

      this.buttonToggle.disabled = true;
    }
  }

  addTag(event: MatChipInputEvent){
    const value = (event.value || '').trim();

    if (value) {
      this.tags.add(value);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string){

    if (this.tags.has(tag)) {
      this.tags.delete(tag)
    }
    return [...this.newNote.tags];
  }

  editTag(tag: string, event: MatChipEditedEvent) {
    const value = (event.value || '').trim();

    this.removeTag(tag);

    if (value) {
      this.tags.add(value)
      return [...this.tags];
    }
    return this.tags;
  }

  parseTags(tags: string) {
    return JSON.parse(tags);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Note} from '../models/note';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private apiUrl = 'http://localhost:8000/api/habits/';

  constructor(private http: HttpClient) {}

  getHabits(): Observable<Habit[]> {
    return this.http.get<Habit[]>(this.apiUrl);
  }

  addHabit(note: Note): Observable<Habit> {
    return this.http.post<Note>(this.apiUrl, note);
  }

  removeHabit(id: string): Observable<Habit> {
    return this.http.delete<Note>(this.apiUrl  + id + '/');
  }
}

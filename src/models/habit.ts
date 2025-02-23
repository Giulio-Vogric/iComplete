export interface Habit {

  id: string;
  creation_date: Date;
  description: string;
  desidered_pomodoro: number;
  time_spent_today: number;
  total_time_spent: number;
  schedule: string;
}

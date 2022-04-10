import { WeekDays } from "../enums/week-days.enum";

export default interface Subject {
  id?: string,
  description: string,
  weekDay: WeekDays,
  absentCount?: number,
}

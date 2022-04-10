import { WeekDays } from "../enums/week-days.enum";
import Subject from "./subject";

export default interface WeekDay {
  subjects: Subject[],
  description: string,
  dayNumber: WeekDays
}

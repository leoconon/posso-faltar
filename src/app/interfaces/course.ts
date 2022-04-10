import { Period } from "../enums/period.enum";
import Subject from "./subject";

export default interface Course {
  id: string,
  name: string,
  period: Period,
  startDate: Date,
  endDate: Date,
  subjects: Subject[]
}

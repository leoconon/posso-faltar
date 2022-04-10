import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import Course from '../interfaces/course';
import Subject from '../interfaces/subject';
import { v4 as uuidv4 } from 'uuid';
import { ReplaySubject, Subject as RxjsSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public courses: Course[] = [];
  public subjects: Subject[] = [];
  public absents: Absent[] = [];

  private loadSubject = new ReplaySubject<void>(1);

  constructor() {}

  public async loadAll() {
    const keys = (await Storage.keys()).keys;

    for (const key of keys) {
      if (key.startsWith('COURSE+')) {
        const course = await Storage.get({ key: key });
        this.courses.push(JSON.parse(course.value));
        console.log('bbbbb');
      }
      if (key.startsWith('ABSENT+')) {
        const absent = await Storage.get({ key: key })
        this.absents.push(JSON.parse(absent.value));
        console.log('ccccc');
      }
    };

    console.log('aaaa');

    this.courses.forEach(course => {
      course.subjects.forEach(subject => {
        subject.absentCount = this.absents.filter(a => a.subjectId === subject.id).length;
      })
    });

    this.subjects = this.courses.reduce((prev, curr) => prev.concat(curr), []);
    this.loadSubject.next();
  }

  public awaitLoadAll(afterLoad: () => void) {
    this.loadSubject.subscribe({
      next: afterLoad
    });
  }

  public saveCourse(course: Course): Promise<any> {
    this.courses = this.courses.filter(c => c.id !== course.id);
    this.courses.push(course);
    return Storage.set({ key: `COURSE+${course.id}`, value: JSON.stringify(course) });
  }

  public deleteCourse(id: string): Promise<any> {
    const removed = this.courses.find(c => c.id === id);
    this.courses = this.courses.filter(c => c !== removed);

    const subjectIds = removed.subjects.map(s => s.id);
    const absentIds = this.absents.filter(a => subjectIds.includes(a.subjectId)).map(a => a.id);

    subjectIds.forEach(id => {
      this.subjects.filter(s => s.id !== id);
      Storage.remove({ key: 'SUBJECT+' + id });
    });

    absentIds.forEach(id => {
      this.absents.filter(a => a.id !== id);
      Storage.remove({ key: 'ABSENT+' + id })
    });

    return Storage.remove({ key: 'COURSE+' + id });
  }

  public saveAbsent(subject: Subject, date: Date): Promise<string> {
    const uuid = uuidv4();
    const absent: Absent = {
      id: uuid,
      subjectId: subject.id,
      date: date
    }
    this.absents.push(absent);
    subject.absentCount++;
    return Storage.set({ key: `ABSENT+${uuid}`, value: JSON.stringify(absent) }).then(() => {
      return uuid;
    });
  }

  public removeAbsent(subject: Subject, absentId: string): Promise<any> {
    console.log(absentId);
    this.absents = this.absents.filter(a => a.id !== absentId);
    subject.absentCount--;
    return Storage.remove({ key: `ABSENT+${absentId}` });
  }

}

interface Absent {
  id: string,
  subjectId: string,
  date: Date
}

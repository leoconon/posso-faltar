import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import Subject from 'src/app/interfaces/subject';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-week-detailing',
  templateUrl: './week-detailing.page.html',
  styleUrls: ['./week-detailing.page.scss'],
})
export class WeekDetailingPage implements OnInit {

  public today: Date;
  public firstDayWeek: Date;
  public lastDayWeek: Date;
  public weekDays: WeekDay[];

  constructor(public storage: DatabaseService) { }

  ngOnInit() {
    const now = moment();
    this.today = now.toDate();
    this.storage.awaitLoadAll(() => this.processDay(now));
  }

  public backWeek() {
    const lessOneWeek = moment(this.firstDayWeek).subtract(1, 'week');
    this.processDay(lessOneWeek);
  }

  public nextkWeek() {
    const plusOneWeek = moment(this.firstDayWeek).add(1, 'week');
    this.processDay(plusOneWeek);
  }

  public getToday() {
    this.processDay(moment());
  }

  public markAbsent(event: any, card: SubjectCard) {
    const value: boolean = event.target.checked;
    if (value) {
      this.storage.saveAbsent(card.subject, card.date).then(uuid => {
        card.absentId = uuid;
        this.statusColorByAbsentCount(card);
      });
    } else {
      this.storage.removeAbsent(card.subject, card.absentId).then(() => {
        this.statusColorByAbsentCount(card);
      });
    }
  }

  private processDay(moment: moment.Moment) {
    this.firstDayWeek = moment.weekday(1).toDate();
    this.lastDayWeek = moment.weekday(6).toDate();
    this.clearWeek();
    this.storage.courses.forEach(c => {
      c.subjects.forEach(s => {
        const subjectDay = moment.weekday(s.weekDay + 1);
        if (subjectDay.isBetween(c.startDate, c.endDate)) {
          const card: SubjectCard = {
            subject: s,
            course: c.name,
            order: c.period,
            date: subjectDay.toDate(),
            absentId: this.storage.absents.filter(a => a.subjectId === s.id && subjectDay.isSame(a.date, 'day'))[0]?.id
          };
          this.statusColorByAbsentCount(card);
          this.weekDays[s.weekDay].cards.push(card);
          if (subjectDay.isSame(new Date(), 'day')) {
            this.weekDays[s.weekDay].isToday = true;
          }
        }
      });
    });
    this.weekDays.forEach(wd => {
      wd.cards = wd.cards.sort((a, b) => a.order - b.order);
    });
  }

  private statusColorByAbsentCount(card: SubjectCard) {
    if (card.subject.absentCount > 3) {
      card.statusColor = 'danger';
      return;
    }
    if (card.subject.absentCount > 2) {
      card.statusColor = 'warning';
      return;
    }
    card.statusColor = 'light';
  }

  private clearWeek() {
    this.weekDays = [{
      name: 'Segunda',
      cards: []
    }, {
      name: 'Terça',
      cards: []
    }, {
      name: 'Quarta',
      cards: []
    }, {
      name: 'Quinta',
      cards: []
    }, {
      name: 'Sexta',
      cards: []
    }, {
      name: 'Sábado',
      cards: []
    }];
  }

}

interface SubjectCard {
  subject: Subject,
  course: string,
  order: number,
  date: Date,
  absentId: string,
  statusColor?: string
}

interface WeekDay {
  name: string,
  cards?: SubjectCard[]
  isToday?: boolean
}

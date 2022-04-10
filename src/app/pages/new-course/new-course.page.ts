import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IonInput, IonModal, NavController } from '@ionic/angular';
import { WeekDays } from 'src/app/enums/week-days.enum';
import Course from 'src/app/interfaces/course';
import Subject from 'src/app/interfaces/subject';
import WeekDay from 'src/app/interfaces/week-day';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastService } from 'src/app/services/toast.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-new-course',
  templateUrl: './new-course.page.html',
  styleUrls: ['./new-course.page.scss'],
})
export class NewCoursePage implements OnInit {

  @ViewChild('modal')
  public modal: IonModal;

  @ViewChild('inputSubjectName')
  public inputSubjectName: IonInput;

  public formGroup: FormGroup;
  public weekDays: WeekDay[];
  public subjectInEdition: Subject;

  constructor(
    public formBuilder: FormBuilder,
    private toastService: ToastService,
    private databaseService: DatabaseService,
    private navController: NavController
  ) {
    this.weekDays = [{
      description: 'Segunda',
      subjects: [],
      dayNumber: WeekDays.SEGUNDA
    }, {
      description: 'Terça',
      subjects: [],
      dayNumber: WeekDays.TERCA
    }, {
      description: 'Quarta',
      subjects: [],
      dayNumber: WeekDays.QUARTA
    }, {
      description: 'Quinta',
      subjects: [],
      dayNumber: WeekDays.QUINTA
    }, {
      description: 'Sexta',
      subjects: [],
      dayNumber: WeekDays.SEXTA
    }, {
      description: 'Sábado',
      subjects: [],
      dayNumber: WeekDays.SABADO
    }]
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      period: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }

  public addSubject(weekDay: WeekDay) {
    var subject: Subject = {
      id: uuidv4(),
      description: 'Nova disciplina',
      weekDay: weekDay.dayNumber,
      absentCount: 0
    }
    weekDay.subjects.push(subject);
    this.subjectInEdition = subject;
    this.modal.present();
    setTimeout(() => {
      this.inputSubjectName.setFocus();
    }, 500);
  }

  public editSubject(subject: Subject) {
    this.subjectInEdition = subject;
    this.modal.present();
    setTimeout(() => {
      this.inputSubjectName.setFocus();
    }, 500);
  }

  public removeSubject(weekDay: WeekDay, subject: Subject) {
    weekDay.subjects = weekDay.subjects.filter(s => s.id !== subject.id);
  }

  public save() {
    const subjects = this.weekDays.reduce((prev, curr) => prev.concat(curr.subjects), []);

    if (!subjects.length) {
      this.toastService.showError('Nenhuma disciplina adicionada');
      return;
    }

    let course: Course = this.formGroup.value;

    if (course.startDate >= course.endDate) {
      this.toastService.showError('Data de início deve ser inferior a data final');
      return;
    }

    course.id = uuidv4();
    course.subjects = subjects;

    this.databaseService.saveCourse(course).then(() => {
      this.toastService.showSuccess('Salvo com sucesso');
      this.navController.back();
    });
  }

}

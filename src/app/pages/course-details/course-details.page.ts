import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import Course from 'src/app/interfaces/course';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.page.html',
  styleUrls: ['./course-details.page.scss'],
})
export class CourseDetailsPage implements OnInit {

  public course: Course;
  public days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  constructor(
    private activatedRoute: ActivatedRoute,
    private storage: DatabaseService,
    private alertController: AlertController,
    private toastService: ToastService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(data => {
      const id = data.get('id');
      this.course = this.storage.courses.find(c => c.id === id);
    });
  }

  public excluir() {
    this.alertController.create({
      header: 'Tem certeza?',
      message: 'Isso apagará todos os dados do curso. Deseja continuar?',
      buttons: [{
        text: 'Cancelar'
      }, {
        text: 'Continuar',
        handler: () => {
          this.storage.deleteCourse(this.course.id).then(() => {
            this.toastService.showSuccess('Excluído com sucesso');
            this.navController.back();
          });
        }
      }]
    }).then(a => a.present());
  }

}

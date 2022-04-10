import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './services/database.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  public appPages = [
    { title: 'Semana', url: '/week', icon: 'calendar-number' },
    { title: 'Cursos', url: '/courses', icon: 'school' },
  ];

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.databaseService.loadAll();
  }

}

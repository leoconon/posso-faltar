import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'week',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'week',
    loadChildren: () => import('./pages/week-detailing/week-detailing.module').then( m => m.WeekDetailingPageModule)
  },
  {
    path: 'courses',
    loadChildren: () => import('./pages/courses-list/courses-list.module').then( m => m.CoursesListPageModule)
  },
  {
    path: 'courses/new',
    loadChildren: () => import('./pages/new-course/new-course.module').then( m => m.NewCoursePageModule)
  },
  {
    path: 'courses/:id',
    loadChildren: () => import('./pages/course-details/course-details.module').then( m => m.CourseDetailsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

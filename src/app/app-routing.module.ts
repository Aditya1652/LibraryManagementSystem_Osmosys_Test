import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookFormComponent } from './components/book-form/book-form.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'books', component: BookListComponent, canActivate: [AuthGuard] },
  {
    path: 'book/add',
    component: BookFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Librarian' },
  },
  {
    path: 'book/edit/:id',
    component: BookFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Librarian' },
  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

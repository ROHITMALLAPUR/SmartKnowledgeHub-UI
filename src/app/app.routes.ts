import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './RouteGuard/auth.guard';
import { Documents } from './documents/documents';
import { DocumentDetails } from './document-details/document-details';
import { DocumentEdit } from './document-edit/document-edit';

export const routes: Routes = [

  {
    path: 'login',
    component: Login
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: 'documents',
    component: Documents,
    canActivate: [authGuard]
  },
  {
    path: 'documents/:id',
    component: DocumentDetails,
    canActivate: [authGuard]
  },
  {
    path: 'documents/edit/:id',
    component: DocumentEdit,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }

];

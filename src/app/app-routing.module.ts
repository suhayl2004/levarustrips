import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { AuthGuard } from '@core/guard/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard], // Protect all routes with AuthGuard
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'requirements',
        loadChildren: () =>
          import('./requirements/requirements.module').then(
            (m) => m.RequirementsModule
          ),
      },
      // {
      //   path: 'testcycles',
      //   loadChildren: () =>
      //     import('./test-cycle/test-cycle.module').then(
      //       (m) => m.TestCycleModule
      //     ),
      // },
      // {
      //   path: 'test-cycle-dc',
      //   loadChildren: () =>
      //     import('./test-cycle-dc/test-cycle-dc.module').then(
      //       (m) => m.TestCycleDcModule
      //     ),
      // },
      // {
      //   path: 'testscenarios',
      //   loadChildren: () =>
      //     import('./test-scenarios/test-scenarios.module').then(
      //       (m) => m.TestScenariosModule
      //     ),
      // },
      // {
      //   path: 'testcases',
      //   loadChildren: () =>
      //     import('./test-cases/test-cases.module').then(
      //       (m) => m.TestCasesModule
      //     ),
      // },
      {
        path: 'req-detail-screen',
        loadChildren: () =>
          import('./req-detail-screen/req-detail-screen.module').then(
            (m) => m.ReqDetailScreenModule
          ),
      },
      {
        path: 'bug-detail-screen',
        loadChildren: () =>
          import('./bug-detail-screen/bug-detail-screen.module').then(
            (m) => m.BugDetailScreenModule
          ),
      },
      // {
      //   path: 'test-scenarios-detail-screen',
      //   loadChildren: () =>
      //     import('./test-scenarios-detail-screen/test-scenarios-detail-screen.module').then(
      //       (m) => m.TestScenariosDetailScreenModule
      //     ),
      // },
      // {
      //   path: 'test-cases-detail-screen',
      //   loadChildren: () =>
      //     import('./test-cases-detail-screen/test-cases-detail-screen.module').then(
      //       (m) => m.TestCasesDetailScreenModule
      //     ),
      // },
      // {
      //   path: 'test-sd-screen',
      //   loadChildren: () =>
      //     import('./test-sd-screen/test-sd-screen.module').then(
      //       (m) => m.TestSdScreenModule
      //     ),
      // },
      {
        path: 'bugs',
        loadChildren: () =>
          import('./bugs/bugs.module').then(
            (m) => m.BugsModule
          ),
      },
      {
        path: 'usermanagement',
        loadChildren: () =>
          import('./settings/user-management/user-management.module').then((m) => m.UserManagementModule),
      },
      // {
      //   path: 'companymanagement',
      //   loadChildren: () =>
      //     import('./settings/company-management/company-management.module').then((m) => m.CompanyManagementModule),
      // },
      // {
      //   path: 'projects',
      //   loadChildren: () =>
      //     import('./settings/projects/projects.module').then((m) => m.ProjectsModule),
      // },
    ],
  },
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: '**',
    redirectTo: '/authentication/login',
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule { }

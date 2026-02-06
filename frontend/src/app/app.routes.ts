import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
// import { UserComponent } from './pages/user/user.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import {  BookingStatusComponent } from './pages/booking-status/booking-status.component';



import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { userGuard } from './guards/user.guard';
import { TenantProfileComponent } from './pages/tenant-profile/tenant-profile.component';
import { AdminLayoutComponent } from './pages/admin/layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { AdminTowersComponent } from './pages/admin/towers/admin-towers.component';
import { AdminUnitsComponent } from './pages/admin/units/admin-units.component';
import { AdminBookingsComponent } from './pages/admin/bookings/admin-bookings.component';
import { AdminTenantsComponent } from './pages/admin/tenants/admin-tenants.component';
import { AdminAmenitiesComponent } from './pages/admin/amenities/admin-amenities.component';
import { UserLayoutComponent } from './pages/user-layout/user-layout.component';
import { RegisterComponent } from './pages/register/register.component';
// import { AdminBookingComponent } from './pages/admin/bookings/admin-bookings.component';
// export const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   {
//     path:'admin',
//     component:AdminLayoutComponent,
//     canActivate:[authGuard,adminGuard]
//   },
//   {
//     path:'admin',
//     component:AdminDashboardComponent,
//     canActivate:[authGuard,adminGuard],
//     children:[
//         {
//             path:'dashboard', component:AdminDashboardComponent,canActivate:[authGuard,adminGuard]
//         },
        
//         {
//             path:'',redirectTo:'dashboard',pathMatch:'full'
//         }
//         // {
//         //   path:'units',component:AdminUnitsComponent
//         // }

//     ]
//   },
//   {
//     path:'user',component:UserDashboardComponent,
//     canActivate:[userGuard]
//   },
//   {
//     path:'user/bookings',
//     component:BookingStatusComponent,
//     canActivate:[userGuard]
//   },
//   {
//     path:'user/profile',
//     component:TenantProfileComponent,
//     canActivate:[userGuard]

//   },

//  {
//     path:'admin/towers',
//     component:AdminTowersComponent,
//     canActivate:[authGuard,adminGuard]
//   },
//   {
//   path: 'admin/units',
//   canActivate: [adminGuard,authGuard],
//   loadComponent: () =>
//     import('./pages/admin/units/admin-units.component')
//       .then(m => m.AdminUnitsComponent)
// },
// {
//   path: 'admin/bookings',
//   canActivate: [adminGuard,authGuard],
//   loadComponent: () =>
//     import('./pages/admin/bookings/admin-bookings.component')
//       .then(m => m.AdminBookingsComponent)
// },
// {
//   path: 'admin/amenities',
//   canActivate: [adminGuard,authGuard],
//   loadComponent: () =>
//     import('./pages/admin/amenities/admin-amenities.component')
//       .then(m => m.AdminAmenitiesComponent)
// },
// {
//   path: 'admin/tenants',
//   canActivate: [adminGuard],
//   loadComponent: () =>
//     import('./pages/admin/tenants/admin-tenants.component')
//       .then(m => m.AdminTenantsComponent)
// },

//   { path: '', redirectTo: 'login', pathMatch: 'full' },{
//     path:'**',redirectTo:'login'
//   }
// ];


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
{path:'register',component:RegisterComponent},
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'towers', component: AdminTowersComponent },
      { path: 'units', component: AdminUnitsComponent },
      { path: 'bookings', component: AdminBookingsComponent },
      { path: 'tenants', component: AdminTenantsComponent},
      { path:'amenities',component:AdminAmenitiesComponent},
      // { path: 'reports', component:  },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
 {
  path: 'user',
  component: UserLayoutComponent,
  canActivate: [ userGuard],
  children: [
    {path:'dashboard',component:UserDashboardComponent},
    { path: 'profile', component:TenantProfileComponent},
    { path: 'bookings', loadComponent: () => import('./pages/booking-status/booking-status.component').then(m => m.BookingStatusComponent) },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]
},


  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
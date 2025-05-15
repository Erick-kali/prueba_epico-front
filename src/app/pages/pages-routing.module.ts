import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './Usuarios/Usuarios.Component';
import { authGuard } from '../guards/auth.guard';
import { RolesComponent } from './roles/roles.component';
import { ProductosComponent } from './productos/productos.component';

const routes: Routes = [

  {path:'dashboard', component:PagesComponent, canActivate:[authGuard],

  children:[

    {path:'', component:DashboardComponent, data:{titulo:'Administracion'}},
    {path:'Usuarios', component:UsuariosComponent, data:{titulo:'Usuarios'}},
    { path: 'productos', component: ProductosComponent, data:{titulo:'Productos'} },

    {path:'roles', component:RolesComponent, data:{titulo:'Roles'}},
    


  ]
 }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }

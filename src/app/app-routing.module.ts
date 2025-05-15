import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NopageFoundComponent } from './nopage-found/nopage-found.component';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { PagesRoutingModule } from './pages/pages-routing.module';
import { RegisterComponent } from './auth/register/register.component';


const routes: Routes = [

 {path:'', redirectTo:'/login', pathMatch:'full' },
 { path: 'register', component: RegisterComponent },
 
 {path:'**', component:NopageFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    PagesRoutingModule,
    AuthRoutingModule

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

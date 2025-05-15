import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  nombreUsuario = localStorage.getItem('nombre');

  public menuItems: any[] = [
    {
      titulo: 'Administracion',
      icono: 'nav-icon fas fa-tachometer-alt',
      submenu: [
        { titulo: 'Usuarios', url: 'Usuarios', icon: 'far fa-circle' },
        
        { titulo: 'Roles', url: 'roles', icon: 'far fa-circle'},

        {titulo: 'Productos', url: 'productos', icon: 'far fa-circle'},
        
        
        {
          titulo: 'Settings avanzada',
          icon: 'far fa-circle',
          submenu: [ // Submenú dentro de otro submenú
            { titulo: 'Settings', url: 'advanced/settings', icon: 'far fa-dot-circle' },
            { titulo: 'Logs', url: 'advanced/logs', icon: 'far fa-dot-circle' },
          ]
        },
      ]
    },
    {
      titulo: 'Configuracion', // Menú adicional
      icono: 'nav-icon fas fa-cogs',
      submenu: [
        { titulo: 'Perfil', url: 'profile', icon: 'far fa-user' },
        { titulo: 'Privacidad', url: 'privacy', icon: 'fa fa-lock' },
      ]
    }
  ];

  logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('nombre');
    location.href = 'login';
  }
}

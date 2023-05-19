// Importaciones de Angular
import { Component, OnInit } from '@angular/core';

// Importaciones de servicios personalizados
import { AuthService } from 'src/app/auth/auth.service';

// Importaciones de servicios de la API
import { UsuarioService } from 'src/app/feature/personal/usuarios/usuario.service';

// Importaciones de interfaces
import { User } from 'src/app/auth/models/user.interface';

/**
 * Componente que maneja la lógica y la vista del dashboard.
 */
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  // Variables de instancia de clase
  user: User;

  loading: boolean = true;

  /**
   * Inyecta los servicios necesarios para el funcionamiento del componente.
   * @param authService Servicio de autenticación.
   * @param userService Servicio de usuarios.
   */
  constructor(
    public authService: AuthService,
    private userService: UsuarioService,
  ) {}

  /**
   * Inicialización del componente.
   */
  ngOnInit(): void {
    this.getCurrentUser();
  }

  /*
   * Este método se encarga de obtener el usuario actualmente logueado utilizando el servicio de autenticación.
   * Utiliza el método getUser() del servicio de autenticación y se suscribe al mismo para obtener el usuario y asignarlo a la variable "user" de la clase.
   */
  getCurrentUser() {
    this.authService.getUser().subscribe((user: User) => (this.user = user));
  }
}

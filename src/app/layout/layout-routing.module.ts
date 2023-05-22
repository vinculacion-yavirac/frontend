import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main/main.component';

import { UsuariosListComponent } from '../feature/personal/usuarios/list/usuario.list.component';
import { UsuariosArchivedComponent } from '../feature/personal/usuarios/archived/usuario.archived.component';
import { UsuariosFormComponent } from '../feature/personal/usuarios/form/usuario.form.component';
import { RolesListComponent } from '../feature/personal/roles/list/rol.list.component';
import { RolesFormComponent } from '../feature/personal/roles/form/rol.form.component';
import { RolesArchivedComponent } from '../feature/personal/roles/archived/rol.archived.component';

import { ProfilePersonalDataComponent } from '../auth/profile/general/general.component';
import { ProfileMainComponent } from '../auth/profile/main/main.component';

import { ProfileSecurityComponent } from '../auth/profile/seguridad/seguridad.component';
import { UploadComponent } from '../feature/upload/upload.component';

import { PortafolioFormComponent } from '../feature/portafolio/form/portafolio-form.component';
import { PortafolioListComponent } from '../feature/portafolio/list/portafolio-list.component';
import { PortafolioArchivedComponent } from '../feature/portafolio/archived/portafolio-archived.component';
import { SolicitudListComponent } from '../feature/docente-vinculacion/solicitud/list/solicitud-list.component';
import { SolicitudFormComponent } from '../feature/docente-vinculacion/solicitud/form/solicitud.form.component';
import { SolicitudArchivedComponent } from '../feature/docente-vinculacion/solicitud/archived/solicitud-archived.component';
import { AvanceCumplimientoComponent } from '../feature/docente-vinculacion/informe-control/avance-cumplimiento/avance-cumplimiento.component';
import { PortafolioVinculacionFormComponent } from '../feature/docente-vinculacion/informe-control/portafolio-vinculacion/portafolio-vinculacion-form/portafolio-vinculacion-form.component';
import { AvanceCumplimiento2Component } from '../feature/docente-vinculacion/informe-control/avance-cumplimiento2/avance-cumplimiento2.component';
import { InformeInicialComponent } from '../feature/docente-vinculacion/informe-inicial/informe-inicial/informe-inicial.component';
import { FormularioFinalTutorComponent } from '../feature/docente-vinculacion/formulario-final-tutor/formulario-final-tutor.component';
import { InformeFinalEstudianteComponent } from '../feature/estudiante/informe-final-estudiante/informe-final-estudiante.component';


const routes: Routes = [
  { path: 'upload', component: UploadComponent },
  {
    path: '',
    component: MainComponent,
    children: [
      {path:'avance', component:AvanceCumplimientoComponent},
      {path:'solicitud', component:SolicitudFormComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'solicitud-list', component: SolicitudListComponent },
      { path: 'oficios-list/archived', component: SolicitudArchivedComponent },
      {
        path: 'perfil',
        children: [
          {
            path: '',
            component: ProfileMainComponent,
            children: [
              { path: '', redirectTo: 'datos-personales', pathMatch: 'full' },
              {
                path: 'datos-personales',
                component: ProfilePersonalDataComponent,
              },

              { path: 'seguridad', component: ProfileSecurityComponent },
            ],
          },
        ],
      },




      {
        path: 'portafolio',
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
          {
            path: 'form',
            component: PortafolioFormComponent,
          },
          {
            path: 'form/:id',
            component: PortafolioFormComponent,
          },
          {
            path: 'list',
            children: [
              {
                path: '',
                component: PortafolioListComponent,
              },
              {
                path: 'archived',
                component: PortafolioArchivedComponent,
              },
            ],
          },
        ],
      },


      {
        path: 'personal',
        children: [
          { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
          {
            path: 'usuarios',
            children: [
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
              {
                path: 'form',
                component: UsuariosFormComponent,
              },
              {
                path: 'form/:id',
                component: UsuariosFormComponent,
              },
              {
                path: 'list',
                children: [
                  {
                    path: '',
                    component: UsuariosListComponent,
                  },
                  {
                    path: 'archived',
                    component: UsuariosArchivedComponent,
                  },
                ],
              },
            ],
          },
          {
            path: 'roles',
            children: [
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
              {
                path: 'form',
                component: RolesFormComponent,
              },
              {
                path: 'form/:id',
                component: RolesFormComponent,
              },
              {
                path: 'list',
                children: [
                  {
                    path: '',
                    component: RolesListComponent,
                  },
                  {
                    path: 'archived',
                    component: RolesArchivedComponent,
                  },
                ],
              },
            ],
          },
        ],
      },


      {
        path: 'docente-vinculacion',
        children: [
          { path: '', redirectTo: 'informe-control', pathMatch: 'full' },
          {
            path: 'informe-control',
            children: [
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
              {
                path: 'list',
                children: [
                  {
                    path: '',
                    component: PortafolioVinculacionFormComponent,
                  },
                  {
                    path: 'archived',
                    component: PortafolioVinculacionFormComponent,
                  },
                ],
              },
            ],
          },

          {
            path: 'informe-control/avance-cumplimiento',
            children: [
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
              {
                path: 'list',
                children: [
                  {
                    path: '',
                    component: AvanceCumplimientoComponent,
                  },
                  {
                    path: 'archived',
                    component: AvanceCumplimientoComponent,
                  },
                ],
              },
            ],
          },

          {
            path: 'informe-control/avance-cumplimiento2',
            children: [
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
              {
                path: 'list',
                children: [
                  {
                    path: '',
                    component: AvanceCumplimiento2Component,
                  },
                  {
                    path: 'archived',
                    component: AvanceCumplimiento2Component,
                  },
                ],
              },
            ],
          },

          {
            path: 'informe-inicial',
            children: [
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
              {
                path: 'list',
                children: [
                  {
                    path: '',
                    component: InformeInicialComponent,
                  },
                  {
                    path: 'archived',
                    component: InformeInicialComponent,
                  },
                ],
              },
            ],
          },


          {
            path: 'formulario-final-tutor',
            children: [
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
              {
                path: 'list',
                children: [
                  {
                    path: '',
                    component: FormularioFinalTutorComponent,
                  },
                  {
                    path: 'archived',
                    component: FormularioFinalTutorComponent,
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        path: 'estudiante',
        children: [
          { path: '', redirectTo: 'informe-final-estudiante', pathMatch: 'full' },
          {
            path: 'informe-final-estudiante',
            children: [
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
              {
                path: 'list',
                children: [
                  {
                    path: '',
                    component: InformeFinalEstudianteComponent,
                  },
                  {
                    path: 'archived',
                    component: InformeFinalEstudianteComponent,
                  },
                ],
              },
            ],
          },

        
        ],
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}

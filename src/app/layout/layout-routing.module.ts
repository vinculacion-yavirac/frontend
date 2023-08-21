import { NgModule } from '@angular/core';
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

import { PortafolioFormComponent } from '../feature/portafolio/form/portafolio-form.component';
import { PortafolioListComponent } from '../feature/portafolio/list/portafolio-list.component';
import { PortafolioArchivedComponent } from '../feature/portafolio/archived/portafolio-archived.component';

import { SolicitudListComponent } from '../feature/docente-vinculacion/solicitud/list/solicitud-list.component';
import { SolicitudFormComponent } from '../feature/docente-vinculacion/solicitud/form/solicitud.form.component';
import { SolicitudArchivedComponent } from '../feature/docente-vinculacion/solicitud/archived/solicitud-archived.component';

import { AvanceCumplimientoComponent } from '../feature/docente-vinculacion/informe-control/avance-cumplimiento/avance-cumplimiento.component';
import { ProyectoListComponent } from '../feature/proyecto/list/proyecto-list.component';

import { PortafolioVinculacionFormComponent } from '../feature/docente-vinculacion/informe-control/portafolio-vinculacion/portafolio-vinculacion-form/portafolio-vinculacion-form.component';
import { InformeInicialComponent } from '../feature/docente-vinculacion/informe-inicial/informe-inicial/informe-inicial.component';
import { AvanceCumplimiento2Component } from '../feature/docente-vinculacion/informe-control/avance-cumplimiento2/avance-cumplimiento2.component';
import { FormularioFinalTutorComponent } from '../feature/docente-vinculacion/formulario-final-tutor/formulario-final-tutor.component';
import { ProyectoArchivedComponent } from '../feature/proyecto/archived/proyecto-archived.component';
import { FormDatosGeneralesComponent } from '../feature/proyecto/form/datos-generales/form-datos-generales.component';
import { FormActividadesComponent } from '../feature/proyecto/form/actividades/form-actividades.component';
import { FormAnexosComponent } from '../feature/proyecto/form/anexos/form-anexos.component';
import { FormBibliografiaComponent } from '../feature/proyecto/form/bibliografia/form-bibliografia.component';
import { FormCertificadosComponent } from '../feature/proyecto/form/certificados/form-certificados.component';
import { FormDocumentosComponent } from '../feature/proyecto/form/documentos/form-documentos.component';
import { FormEmpresaComponent } from '../feature/proyecto/form/empresa/form-empresa.component';
import { FormFirmasComponent } from '../feature/proyecto/form/firmas/form-firmas.component';
import { FormIntegrantesComponent } from '../feature/proyecto/form/integrantes/form-integrantes.component';
import { FormObservacionesComponent } from '../feature/proyecto/form/observaciones/form-observaciones/form-observaciones.component';
import { FormPlanDeTrabajoComponent } from '../feature/proyecto/form/plan-de-trabajo/form-plan-de-trabajo/form-plan-de-trabajo.component';
import {
  ListInstitucionBeneficiariaComponent
} from "../feature/institucion-beneficiaria/list/list-institucion-beneficiaria.component";
import { ConfiguracionComponent } from '../feature/portafolio/configuracion/list/configuracion.component';
import { ConfiguracionArchivedComponent } from '../feature/portafolio/configuracion/configuracion-archived/configuracion-archived.component';
import { ListEstudianteComponent } from '../feature/estudiante/list-estudiante/list-estudiante.component';
import { FundacionTutorComponent } from '../feature/docente-tutor/fundacion-tutor/fundacion-tutor.component';
import { PortafolioTutorComponent } from '../feature/docente-tutor/portafolio-tutor/portafolio-tutor.component';
import { InformeFinalEstudianteComponent } from '../feature/estudiante/informe-final-estudiante/informe-final-estudiante.component';
import { AsignadoEstudianteComponent } from '../feature/estudiante/asignado-estudiante/asignado-estudiante.component';
import { ArchivedInstitucionComponent } from '../feature/institucion-beneficiaria/archived-institucion/archived-institucion.component';
import { SolicitudAprobadoComponent } from '../feature/docente-vinculacion/solicitud/aprobado/solicitud-aprobado.component';

const routes: Routes = [

  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'avance', component: AvanceCumplimientoComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
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
        path: 'portafolio-tutor',
        children: [
          {
            path:'',
            redirectTo: 'list',
            pathMatch: 'full'
          },
          {
            path: 'list',
            children:[
              {
                path: '',
                component: PortafolioTutorComponent
              }
            ]
          }
        ]
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
            path: 'configuracion',
            component: ConfiguracionComponent ,
          },
          {
            path: 'configuracion/archived',
            component: ConfiguracionArchivedComponent ,
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
                path: 'filter',
                children: [
                  {
                    path: 'Aprobado',
                    component: PortafolioListComponent,
                    data: {
                      filterAprobado: true
                    }
                  },
                  {
                    path: 'Pendiente',
                    component: PortafolioListComponent,
                    data: {
                      filterPendiente: false
                    }
                  },
                ]
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
        path: 'solicitud',
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
          {
            path: 'estudiante',
            children: [
              {
                path: '',
                component: ListEstudianteComponent,
              },
              {
                path: 'asignado',
                component: AsignadoEstudianteComponent,
              }
            ]
          },
          {
            path: 'form/estudiante',
            component: ListEstudianteComponent,
          },
          {
            path: 'form/estudiante:id',
            component: ListEstudianteComponent,
          },
          {
            path: 'form',
            component: SolicitudFormComponent,
          },
          {
            path: 'form/:id',
            component: SolicitudFormComponent,
          },
          {
            path: 'list',
            children: [
              {
                path: '',
                component: SolicitudListComponent,
              },
              {
                path: 'filter',
                children: [
                  {
                    path: 'certificado',
                    component: SolicitudListComponent,
                    data: {
                      filterCertificado: 'Certificado'
                    }
                  },
                  {
                    path: 'vinculacion',
                    component: SolicitudListComponent,
                    data: {
                      filterVinculacion: 'Vinculación'
                    }
                  },
                  {
                    path: 'pendiente',
                    component: SolicitudListComponent,
                    data: {
                      filterPendiente: 'Pendiente',
                    },
                  },
                  {
                    path: 'aprobado',
                    component: SolicitudListComponent,
                    data: {
                      filterAprobado: 'Aprobado',
                    },
                  },
                ]
              },
              {
                path: 'aprobados',
                component: SolicitudAprobadoComponent,
              },
              {
                path: 'archived',
                component: SolicitudArchivedComponent,
              },
            ],
          },
        ],
      },
      {
        path: 'proyecto',
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
          {
            path: 'form-datos-generales',
            component: FormDatosGeneralesComponent,
          },
          {
            path: 'form-datos-generales/:id',
            component: FormDatosGeneralesComponent,
          },
          {
            path: 'form-actividades',
            component: FormActividadesComponent,
          },
          {
            path: 'form-actividades/:id',
            component: FormActividadesComponent,
          },
          {
            path: 'form-anexos',
            component: FormAnexosComponent,
          },
          {
            path: 'form-anexos/:id',
            component: FormAnexosComponent,
          },
          {
            path: 'form-bibliografia',
            component: FormBibliografiaComponent,
          },
          {
            path: 'form-bibliografia/:id',
            component: FormBibliografiaComponent,
          },
          {
            path: 'form-certificados',
            component: FormCertificadosComponent,
          },
          {
            path: 'form-certificados/:id',
            component: FormCertificadosComponent,
          },
          {
            path: 'form-documentos',
            component: FormDocumentosComponent,
          },
          {
            path: 'form-documentos/:id',
            component: FormDocumentosComponent,
          },
          {
            path: 'form-empresa',
            component: FormEmpresaComponent,
          },
          {
            path: 'form-empresa/:id',
            component: FormEmpresaComponent,
          },
          {
            path: 'form-firmas',
            component: FormFirmasComponent,
          },
          {
            path: 'form-firmas/:id',
            component: FormFirmasComponent,
          },
          {
            path: 'form-integrantes',
            component: FormIntegrantesComponent,
          },
          {
            path: 'form-integrantes/:id',
            component: FormIntegrantesComponent,
          },
          {
            path: 'form-observaciones',
            component: FormObservacionesComponent,
          },
          {
            path: 'form-observaciones/:id',
            component: FormObservacionesComponent,
          },
          {
            path: 'form-plan-de-trabajo',
            component: FormPlanDeTrabajoComponent,
          },
          {
            path: 'form-plan-de-trabajo/:id',
            component: FormPlanDeTrabajoComponent,
          },
          {
            path: 'list',
            children: [
              {
                path: '',
                component: ProyectoListComponent,
              },
              {
                path: 'archived',
                component: ProyectoArchivedComponent,
              },
            ],
          },
        ],
      },
      {
        path: 'institutcion-beneficiaria-tutor',
        children:[
          {
            path:'',
            redirectTo:'list',
            pathMatch:'full'
          },
          {
            path: 'list',
            children: [
              {
                path:'',
                component: FundacionTutorComponent,
              }
            ]
          }
        ]
      },
      {
        path: 'institucion-beneficiaria',
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
          {
            path: 'form/:id',
            component: SolicitudFormComponent,
          },
          {
            path: 'list',
            children: [
              {
                path: '',
                component: ListInstitucionBeneficiariaComponent,
              },
              {
                path: 'filter',
                children: [
                  {
                    path: 'activa',
                    component: ListInstitucionBeneficiariaComponent,
                    data: {
                      filterActiva: true
                    }
                  },
                  {
                    path: 'inactiva',
                    component: ListInstitucionBeneficiariaComponent,
                    data: {
                      filterInactiva: false
                    }
                  },
                ]
              },
              {
                path: 'archived',
                component: ArchivedInstitucionComponent,
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
              {
                path: 'datos_pdf/:id',
                component: PortafolioVinculacionFormComponent,

              }
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
              {
                path: 'form/:id',
                component: AvanceCumplimientoComponent,
              },
              {
                path: 'datos_pdf/:id',
                component: AvanceCumplimientoComponent,

              }
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
              {
                path: 'datos_pdf/:id',
                component: FormularioFinalTutorComponent,

              }
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
export class LayoutRoutingModule { }

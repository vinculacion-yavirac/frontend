import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

/* import de rutas */
import { FeatureRoutingModule } from './feature-routing.module';

/* import de componentes shared */
import { ModuleHeaderComponent } from '../shared/header/module.header.component';
import { NoContentComponent } from '../shared/no-content/no-content.component';
import { SpinnerComponent } from '../shared/loader/spinner/spinner.component';
import { MaterialModule } from '../shared/material/material.module';
import { PaginationComponent } from '../shared/pagination/pagination.component';

/* import de componente perfil */
import { ProfileMainComponent } from '../auth/profile/main/main.component';
import { ProfileSidebarComponent } from '../auth/profile/sidebar/sidebar.component';
import { ProfileSecurityComponent } from '../auth/profile/seguridad/seguridad.component';
import { ProfilePersonalDataComponent } from '../auth/profile/general/general.component';
import { ProfileBreadcrumbsComponent } from '../auth/profile/breadcrumbs/breadcrumbs.component';

/* import de componentes de personal */
import { PersonalBreadcrumbsComponent } from './personal/header/breadcrumbs/personal.breadcrumbs.component';
import { PersonalTabsComponent } from './personal/header/tabs/personal.tabs.component';

/* import de componentes de reportl docentes */
import { DocenteVinculacionBreadcrumbsComponent } from './docente-vinculacion/header/breadcrumbs/docente_vinculacion.breadcrumbs.component';
import { DocenteVinculacionTabsComponent } from './docente-vinculacion/header/tabs/docente_vinculacion.tabs.component';


/* import de componentes de reportl docentes */
import { EstudianteBreadcrumbsComponent } from './estudiante/header/breadcrumbs/estudiante.breadcrumbs.component';
import { EstudianteTabsComponent } from './estudiante/header/tabs/estudiante.tabs.component';


/* import de componentes de usuarios */
import { UsuariosBreadcrumbsComponent } from './personal/usuarios/breadcrumbs/usuario.breadcrumbs.component';
import { UsuariosFormComponent } from './personal/usuarios/form/usuario.form.component';
import { UsuariosListComponent } from './personal/usuarios/list/usuario.list.component';
import { UsuariosArchivedComponent } from './personal/usuarios/archived/usuario.archived.component';

/* import de componentes de roles */
import { RolesBreadcrumbsComponent } from './personal/roles/breadcrumbs/rol.breadcrumbs.component';
import { RolesFormComponent } from './personal/roles/form/rol.form.component';
import { RolesListComponent } from './personal/roles/list/rol.list.component';
import { RolesArchivedComponent } from './personal/roles/archived/rol.archived.component';
import { RolesComboboxComponent } from './personal/roles/combobox/rol.combobox.component';

/* import de componentes de permisos */
import { PermisosListComponent } from './personal/roles/permisos/list/permiso.list.component';
import { PermisosListCheckboxComponent } from './personal/roles/permisos/list-checkbox/permiso.list.checkbox.component';

/* import de pipes */
import { FullNameFirstMiddlePipe } from '../shared/pipes/full-name-first-middle.pipe';
import { FullNameShortPipe } from '../shared/pipes/full-name-short.pipe';
import { NameInitialsPipe } from '../shared/pipes/name-initials.pipe';
import { NamesSurnamesCompletePipe } from '../shared/pipes/names-surnames-complete.pipe';
import { CapitalizePipe } from '../shared/pipes/capitalize.pipe';
import { TimeAgoPipe } from '../shared/pipes/time-ago.pipe';
import { AgePipe } from '../shared/pipes/age.pipe';

import { HasPermissionsDirective } from '../auth/has-permission.directive';

import { CantonsComboboxComponent } from '../shared/comboboxes/división-territorial/cantones/cantones.combobox.component';
import { ParishesComboboxComponent } from '../shared/comboboxes/división-territorial/parroquias/parroquias.combobox.component';
import { ProvincesComboboxComponent } from '../shared/comboboxes/división-territorial/provincias/provincias.combobox.component';
import { GendersComboboxComponent } from '../shared/comboboxes/generos/generos.combobox.component';
import { IdentificationTypesComboboxComponent } from '../shared/comboboxes/tipos-identificacion/tipos-identificacion.combobox.component';
import { UploadComponent } from './upload/upload.component';
import { PortafolioFormComponent } from './portafolio/form/portafolio-form.component';

import { OficialDocumentsStatesComboboxComponent } from '../shared/comboboxes/oficial-documents-state/oficial-documents-state.combobox.component';
import { SolicitudBreadcrumbsComponent } from './docente-vinculacion/solicitud/header/breadcrumbs/solicitud.breadcrumbs.component';
import { SolicitudArchivedComponent } from './docente-vinculacion/solicitud/archived/solicitud-archived.component';
import { SolicitudFormComponent } from './docente-vinculacion/solicitud/form/solicitud.form.component';
import { SolicitudTabsComponent } from './docente-vinculacion/solicitud/header/tabs/solicitud.tabs.component';
import { SolicitudListComponent } from './docente-vinculacion/solicitud/list/solicitud-list.component';
import { ProyectoBreadcrumbsComponent } from './proyecto/header/breadcrumbs/proyecto-breadcrumbs.component';
import { ProyectoTabsComponent } from './proyecto/header/tabs/proyecto-tabs.component';
import { AvanceCumplimientoComponent } from './docente-vinculacion/informe-control/avance-cumplimiento/avance-cumplimiento.component';
import { EncuestaComponent } from './estudiante/encuenta/encuesta.component';
import { PortafolioVinculacionFormComponent } from './docente-vinculacion/informe-control/portafolio-vinculacion/portafolio-vinculacion-form/portafolio-vinculacion-form.component';
import { PortafolioVinculacionEstudianteFormComponent } from './docente-vinculacion/informe-control/portafolio-vinculacion/portafolio-vinculacion-estudiante-form/portafolio-vinculacion-estudiante-form.component';
import { PortafolioVinculacionTutorFormComponent } from './docente-vinculacion/informe-control/portafolio-vinculacion/portafolio-vinculacion-tutor-form/portafolio-vinculacion-tutor-form.component';
import { AvanceCumplimiento2Component } from './docente-vinculacion/informe-control/avance-cumplimiento2/avance-cumplimiento2.component';
import { InformeInicialComponent } from './docente-vinculacion/informe-inicial/informe-inicial/informe-inicial.component';
import { FormularioFinalTutorComponent } from './docente-vinculacion/formulario-final-tutor/formulario-final-tutor.component';
import { InformeFinalEstudianteComponent } from './estudiante/informe-final-estudiante/informe-final-estudiante.component';
import { ProyectoArchivedComponent } from './proyecto/archived/proyecto-archived.component';
import { FormActividadesComponent } from './proyecto/form/actividades/form-actividades.component';
import { FormAnexosComponent } from './proyecto/form/anexos/form-anexos.component';
import { FormBibliografiaComponent } from './proyecto/form/bibliografia/form-bibliografia.component';
import { FormCertificadosComponent } from './proyecto/form/certificados/form-certificados.component';
import { FormDatosGeneralesComponent } from './proyecto/form/datos-generales/form-datos-generales.component';
import { FormDocumentosComponent } from './proyecto/form/documentos/form-documentos.component';
import { FormEmpresaComponent } from './proyecto/form/empresa/form-empresa.component';
import { FormFirmasComponent } from './proyecto/form/firmas/form-firmas.component';
import { FormIntegrantesComponent } from './proyecto/form/integrantes/form-integrantes.component';
import { FormObservacionesComponent } from './proyecto/form/observaciones/form-observaciones/form-observaciones.component';
import { FormPlanDeTrabajoComponent } from './proyecto/form/plan-de-trabajo/form-plan-de-trabajo/form-plan-de-trabajo.component';
import {
  TipoSolicitudesComboboxComponent
} from "../shared/comboboxes/tipos-solicitudes/tipo-solicitudes-combobox.component";
import {
  EstadosSolicitudComboboxComponent
} from "../shared/comboboxes/estados-solicitud/estados-solicitud-combobox.component";
import {ProyectoComboboxComponent} from "../shared/comboboxes/proyecto/proyecto-combobox.component";
import { ProyectoInfoComponent } from './docente-vinculacion/solicitud/proyect-info/proyecto-info.component';
import {
  ProyectosComboboxComponent
} from "../shared/comboboxes/proyecto-fundacion/proyecto/proyectos-combobox.component";
import {PortafolioArchivedComponent} from "./portafolio/archived/portafolio-archived.component";
import {PortafolioBreadcrumbsComponent} from "./portafolio/header/breadcrumbs/portafolio-breadcrumbs.component";
import {PortafolioTabsComponent} from "./portafolio/header/tabs/portafolio-tabs.component";
import {
  ListInstitucionBeneficiariaComponent
} from "./institucion-beneficiaria/list/list-institucion-beneficiaria.component";
import {
  BreadcrumbsInstitucionBeneficiariaComponent
} from "./institucion-beneficiaria/header/breadcrumbs/breadcrumbs-institucion-beneficiaria.component";
import {
  TabsInstitucionBeneficiariaComponent
} from "./institucion-beneficiaria/header/tabs/tabs-institucion-beneficiaria.component";
import {AsignarComponent} from "./institucion-beneficiaria/asignar/asignar.component";
import {PortafolioListComponent} from "./portafolio/list/portafolio-list.component";
import {ProyectoListComponent} from "./proyecto/list/proyecto-list.component";
import { ConfiguracionComponent } from './portafolio/configuracion/configuracion.component';
import { ModalSolicitudesComponent } from './institucion-beneficiaria/modal-solicitudes/modal-solicitudes.component';
import { ModalConfiguracionComponent } from './portafolio/modal-configuracion/modal-configuracion.component';
import { AsignarModalComponent } from './institucion-beneficiaria/asignar-modal/asignar-modal.component';

@NgModule({
  declarations: [
    OficialDocumentsStatesComboboxComponent,
    AgePipe,
    TimeAgoPipe,
    CapitalizePipe,
    NameInitialsPipe,
    FullNameShortPipe,
    FullNameFirstMiddlePipe,
    NamesSurnamesCompletePipe,

    UploadComponent,
    InformeInicialComponent,
    FormularioFinalTutorComponent,
    InformeFinalEstudianteComponent,
    HasPermissionsDirective,
    ModuleHeaderComponent,
    SpinnerComponent,
    NoContentComponent,

    ProfileMainComponent,
    ProfileSidebarComponent,
    ProfileBreadcrumbsComponent,
    ProfileSecurityComponent,
    ProfilePersonalDataComponent,
    DocenteVinculacionBreadcrumbsComponent,
    EstudianteBreadcrumbsComponent,
    EstudianteTabsComponent,
    PersonalBreadcrumbsComponent,
    PersonalTabsComponent,
    DocenteVinculacionTabsComponent,
    UsuariosBreadcrumbsComponent,
    UsuariosFormComponent,
    UsuariosListComponent,
    UsuariosArchivedComponent,
    RolesBreadcrumbsComponent,
    RolesFormComponent,
    RolesListComponent,
    RolesArchivedComponent,
    RolesComboboxComponent,
    PermisosListComponent,
    PermisosListCheckboxComponent,
    PortafolioVinculacionFormComponent,
    PortafolioVinculacionEstudianteFormComponent,
    PortafolioVinculacionTutorFormComponent,
    IdentificationTypesComboboxComponent,
    GendersComboboxComponent,
    ProvincesComboboxComponent,
    CantonsComboboxComponent,
    ParishesComboboxComponent,


    SolicitudBreadcrumbsComponent,
    SolicitudTabsComponent,
    PaginationComponent,
    SolicitudListComponent,
    SolicitudArchivedComponent,
    SolicitudFormComponent,

    PortafolioFormComponent,
    PortafolioArchivedComponent,
    PortafolioListComponent,
    PortafolioBreadcrumbsComponent,
    PortafolioTabsComponent,


    ProyectoBreadcrumbsComponent,
    ProyectoTabsComponent,
    ProyectoListComponent,


    AvanceCumplimientoComponent,
    AvanceCumplimiento2Component,

    EncuestaComponent,
    ProyectoArchivedComponent,
    FormDatosGeneralesComponent,
    FormAnexosComponent,
    FormBibliografiaComponent,
    FormCertificadosComponent,
    FormActividadesComponent,
    FormDocumentosComponent,
    FormEmpresaComponent,
    FormFirmasComponent,
    FormIntegrantesComponent,
    FormObservacionesComponent,
    FormPlanDeTrabajoComponent,

    AsignarComponent,
    TabsInstitucionBeneficiariaComponent,
    BreadcrumbsInstitucionBeneficiariaComponent,
    ListInstitucionBeneficiariaComponent,

    TipoSolicitudesComboboxComponent,
    EstadosSolicitudComboboxComponent,
    ProyectoComboboxComponent,
    ProyectoInfoComponent,
    ProyectosComboboxComponent,
    ConfiguracionComponent,
    ModalSolicitudesComponent,
    ModalConfiguracionComponent,
    AsignarModalComponent,
  ],
  imports: [
    CommonModule,
    FeatureRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxPaginationModule,
  ],

  exports: [
    AgePipe,
    TimeAgoPipe,
    CapitalizePipe,
    SpinnerComponent,
    NameInitialsPipe,
    FullNameShortPipe,
    NoContentComponent,
    NgxPaginationModule,
    PaginationComponent,
    FullNameFirstMiddlePipe,
    HasPermissionsDirective,
  ],
})
export class FeatureModule {}

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

import { PortafolioListComponent } from './portafolio/list/portafolio-list.component';
import { PortafolioBreadcrumbsComponent } from './portafolio/header/breadcrumbs/portafolio-breadcrumbs.component';
import { PortafolioTabsComponent } from './portafolio/header/tabs/portafolio-tabs.component';
import { PortafolioFormComponent } from './portafolio/form/portafolio-form.component';
import { PortafolioArchivedComponent } from './portafolio/archived/portafolio-archived.component';
import { OficialDocumentsStatesComboboxComponent } from '../shared/comboboxes/oficial-documents-state/oficial-documents-state.combobox.component';
import { SolicitudBreadcrumbsComponent } from './docente-vinculacion/solicitud/header/breadcrumbs/solicitud.breadcrumbs.component';
import { SolicitudArchivedComponent } from './docente-vinculacion/solicitud/archived/solicitud-archived.component';
import { SolicitudFormComponent } from './docente-vinculacion/solicitud/form/solicitud.form.component';
import { SolicitudTabsComponent } from './docente-vinculacion/solicitud/header/tabs/solicitud.tabs.component';
import { SolicitudListComponent } from './docente-vinculacion/solicitud/list/solicitud-list.component';
import { AvanceCumplimientoComponent } from './docente-vinculacion/informe-control/avance-cumplimiento/avance-cumplimiento.component';
import { EncuestaComponent } from './estudiante/encuenta/encuesta.component';
import { PortafolioVinculacionFormComponent } from './docente-vinculacion/informe-control/portafolio-vinculacion/portafolio-vinculacion-form/portafolio-vinculacion-form.component';
import { PortafolioVinculacionEstudianteFormComponent } from './docente-vinculacion/informe-control/portafolio-vinculacion/portafolio-vinculacion-estudiante-form/portafolio-vinculacion-estudiante-form.component';
import { PortafolioVinculacionTutorFormComponent } from './docente-vinculacion/informe-control/portafolio-vinculacion/portafolio-vinculacion-tutor-form/portafolio-vinculacion-tutor-form.component';
import { AvanceCumplimiento2Component } from './docente-vinculacion/informe-control/avance-cumplimiento2/avance-cumplimiento2.component';
import { InformeInicialComponent } from './docente-vinculacion/informe-inicial/informe-inicial/informe-inicial.component';
import { FormularioFinalTutorComponent } from './docente-vinculacion/formulario-final-tutor/formulario-final-tutor.component';
import { InformeFinalEstudianteComponent } from './estudiante/informe-final-estudiante/informe-final-estudiante.component';




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
    PortafolioListComponent,
    PortafolioBreadcrumbsComponent,
    PortafolioTabsComponent,
    PortafolioFormComponent,
    PortafolioArchivedComponent,
    AvanceCumplimientoComponent,
    AvanceCumplimiento2Component,

    EncuestaComponent,
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

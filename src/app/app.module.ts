import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './auth/login/login.component';
import { MaterialModule } from './shared/material/material.module';
import { AuthInterceptor } from './auth/auth.interceptor';
import { NotFoundComponent } from './errors/404/404.component';
import { FeatureModule } from './feature/feature.module';
import { LayoutModule } from './layout/layout.module';
import { NotificationInterceptor } from './shared/notification/notification.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { ProyectoComboboxComponent } from './shared/comboboxes/proyecto/proyecto-combobox.component';
import { ProyectosComboboxComponent } from './shared/comboboxes/proyecto-fundacion/proyecto/proyectos-combobox.component';
import { ExporterService } from './service/portafolio/exportar/exporter.service';
import { MatSelectModule } from '@angular/material/select';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
    declarations: [AppComponent, LoginComponent, NotFoundComponent],
    providers: [

        ExporterService,
        CookieService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        FeatureModule,
        LayoutModule,
        MatSelectModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        })
    ],
    exports: [

    ]
})
export class AppModule {}

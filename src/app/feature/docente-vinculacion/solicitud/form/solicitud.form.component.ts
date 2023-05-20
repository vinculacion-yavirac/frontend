// importaciones de @angular
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

// importaciones de angular material
import { MatDialog } from '@angular/material/dialog';

// importaciones de los servicios y modelos


// importaciones de los validadores
import { MyErrorStateMatcher } from '../../../../../app/shared/matcher/error-state-matcher';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PortafolioHttpService } from '../../../../../app/service/portafolio/portafolio-http.service';
import { PortafoliosModels } from '../../../../../app/models/portafolio/portafolio.models';
import { User } from '../../../../../app/models/auth/user.interface';
import { AuthHttpService } from '../../../../../app/service/auth/auth-http.service';
import { FileIconsModels } from '../../../../../app/models/portafolio/files/fileIcons.models';

//import { OficioService } from '../oficio.service';

@Component({
  selector: 'app-solicitud-form',
  templateUrl: './solicitud.form.component.html',
  styleUrls: ['./solicitud.form.component.css'],
})
export class SolicitudFormComponent implements OnInit {
  fileIcons: FileIconsModels = {
    pdf: 'far fa-file-pdf',
    doc: 'far fa-file-word',
    docx: 'far fa-file-word',
    xls: 'far fa-file-excel',
    xlsx: 'far fa-file-excel',
    ppt: 'far fa-file-powerpoint',
    pptx: 'far fa-file-powerpoint',
    jpg: 'far fa-file-image',
    jpeg: 'far fa-file-image',
    png: 'far fa-file-image',
    gif: 'far fa-file-image',
    txt: 'far fa-file-alt',
    default: 'far fa-file',
  };

  // Variables de clase que son inyectadas
  currentOficio = {} as PortafoliosModels;

  title = 'Nuevo Oficio';
  paramsSubscription: Subscription;

  loading: boolean = true;

  // Variables de clase que son inyectadas por referencia
  matcher = new MyErrorStateMatcher();

  // Variables de clase que son inyectadas por referencia
  formGroup: FormGroup;

  files: File[] = [];

  currentUser = {} as User;
  currentDate = new Date();

  comments: Comment[] = [];

  constructor(
    private portafolioHttpService: PortafolioHttpService,
    private authHttpService: AuthHttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
  }

  /**
   * Inicializa el formulario de oficios con los validadores y los valores por defecto.
   * Suscribe al formulario para detectar los cambios en los valores de los campos.
   */
  initForm() {
    this.formGroup = this.formBuilder.group({
      subject: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(25),
            Validators.maxLength(100),
          ],
        },
      ],
      description: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(80),
            Validators.maxLength(300),
          ],
        },
      ],
      files: [
        [],
        {
          validators: [Validators.required, Validators.maxLength(3)],
        },
      ],
      comment: [
        '',
        {
          validators: [Validators.minLength(30), Validators.maxLength(200)],
        },
      ],
    });

    this.formGroup.valueChanges.subscribe((values) => {
      this.currentOficio = values;
      console.log(this.currentOficio);
    });
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.title = 'Editar oficio';
          // this.getOficio(params['id']);
        } else {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        }
      }
    );
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      console.log('success');
      this.createOficio();
    }
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  getCurrentUser() {
    this.authHttpService.getUser().subscribe((user: User) => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  getComments() {
    this.portafolioHttpService
      .getComments(this.currentOficio.id)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.comments = res.data.comments;
        }
      });
  }

  //método para crear un oficio nuevo
  createOficio() {
    this.portafolioHttpService.addPortafolios(this.currentOficio).subscribe((res: any) => {
      if (res.status === 'success') {
        this.uploadFiles(res.data.official_document.id, this.files);
        this.router.navigate(['/system/oficios-list']);
      }
    });
  }

  /**
   * Metodos para el drang and drop del input de archivos.
   */

  getFileIcon(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    return this.fileIcons[extension] || this.fileIcons['default'];
  }

  onFileSelected(event: any): void {
    this.files = Array.from(event.target.files);
    this.updateSelectedFilesList();
  }

  updateSelectedFilesList(): void {
    this.cdr.detectChanges();
  }

  /*   uploadFiles(id:number): void {
    const formData = new FormData();
    this.files.forEach((file: File) => {
      formData.append('archivo', file, file.name);
    });
    this.http
      .post(
        `http://127.0.0.1:8000/api/files/upload/${id}`,
        formData
      )
      .subscribe();
  } */

  uploadFiles(id: number, files: File[]): void {
    const formData = new FormData();
    files.forEach((file: File) => {
      formData.append('archivos[]', file, file.name);
    });
    this.http
      .post(`http://127.0.0.1:8000/api/files/upload/${id}`, formData)
      .subscribe();
  }
}

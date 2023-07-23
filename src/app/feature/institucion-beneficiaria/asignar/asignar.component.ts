import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/models/auth/user.interface';
import { InstitucionBeneficiariaDetalleModels } from 'src/app/models/institucion-beneficiaria/institucion-beneficiaria-detalle.models';
import { FileIconsModels } from 'src/app/models/portafolio/files/fileIcons.models';
import { PortafoliosModels } from 'src/app/models/portafolio/portafolio.models';
import { AuthHttpService } from 'src/app/service/auth/auth-http.service';
import { InstitucionBeneficiariaDetalleHttpService } from 'src/app/service/institucion-beneficiaria/institucion-beneficiaria-detalle-http.service';
import { PortafolioHttpService } from 'src/app/service/portafolio/portafolio-http.service';
import { MyErrorStateMatcher } from 'src/app/shared/matcher/error-state-matcher';

@Component({
  selector: 'app-asignar',
  templateUrl: './asignar.component.html',
  styleUrls: ['./asignar.component.css']
})
export class AsignarComponent implements OnInit {
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

  currentUser = {} as UserAuth;
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
    this.authHttpService.getUser().subscribe((user: UserAuth) => {
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
    
  }

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

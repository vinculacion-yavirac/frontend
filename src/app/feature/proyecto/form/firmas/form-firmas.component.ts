import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firmas } from 'src/app/models/proyecto/firmas.models';
import { ProyectoService } from 'src/app/service/proyecto/proyecto.service';

@Component({
  selector: 'app-form-firmas',
  templateUrl: './form-firmas.component.html',
  styleUrls: ['./form-firmas.component.css']
})
export class FormFirmasComponent implements OnInit {
  public selectedFile: File;
  public updatedatos: any;
  projectId: number;
  public archivoCronograma = {
    nombreArchivo: "",
    base64textString: ""
  };
  public archivoFinanciamiento = {
    nombreArchivo: "",
    base64textString: ""
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private proyectoService: ProyectoService,
    private route: ActivatedRoute,
    private router: Router,

  ) { }

  currentEntity: Firmas =
    {
      firmasId: 0,
      numero: "",
      cargo: "",
      nombre: "",
      cedula: ""
    };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params); // { orderby: "price" }
      this.projectId = params['id_proyecto'];
      if (this.projectId) { }
      console.log(this.projectId);
  });
  }

  cargarImagen(event: any) {
    this.selectedFile = <File>event.target.files[0]
  }

  seleccionarCronograma(event: any) {
    var files = event.target.files;
    var file = files[0];
    this.archivoCronograma.nombreArchivo = file.name;
    if (file && files) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoader.bind(this);
      reader.readAsBinaryString(file);
    }
  }
  _handleReaderLoader(readerEvent: any) {
    var binaryString = readerEvent.target.result;
    this.archivoCronograma.base64textString = btoa(binaryString);
  }

  seleccionarFinanciamiento(event: any) {
    var files = event.target.files;
    var file = files[0];
    this.archivoFinanciamiento.nombreArchivo = file.name;
    if (file && files) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaderFinanciamiento.bind(this);
      reader.readAsBinaryString(file);
    }
  }
  _handleReaderLoaderFinanciamiento(readerEvent: any) {
    var binaryString = readerEvent.target.result;
    this.archivoFinanciamiento.base64textString = btoa(binaryString);
  }

  enviarImagen() {
    console.log(this.archivoCronograma);
    console.log(this.archivoFinanciamiento);

    this.updatedatos = {
      'schedule_crono': JSON.stringify(this.archivoCronograma),
      'financing': JSON.stringify(this.archivoFinanciamiento),



  };


  this.proyectoService.updateProyectCronoFinan(this.projectId, this.updatedatos).subscribe(async (data: any) => {
    console.log(data);

    if (data.data.proyect != null && data.data.proyect != null) {
        if (data.status === 'success') {
            setTimeout(() => {
                var resultData = data.data.proyect;
                console.log(resultData);

                this.router.navigate(['/system/proyecto']);

            }, 500);
        }
    }
}, async (error) => {
    console.log(error.message);

    // setTimeout(() => {
    // this.router.navigate(['/Home']);
    // }, 500);
});

    //  this._procedimientosService.onUpload(this.selectedFile).subscribe(
    //    response=>{
    //       if(response.status=='success'){
    //         console.log(response);
    //       }
    //    },
    //    error=>{
    //      console.log(<any>error);
    //    }
    //  );

  }
}



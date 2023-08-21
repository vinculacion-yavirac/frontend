import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalAlertComponent} from '../../../../../app/shared/material/modal-alert/modal-alert.component';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ActividadesModels} from 'src/app/models/actividades/actividades';
import {ActividadesService} from 'src/app/service/actividades/actividades.service';
import {jsPDF} from "jspdf";
import 'jspdf-autotable';
import {ImageConstants} from 'src/app/constanst/ImageConstants';
import {DatePipe} from '@angular/common';
@Component({selector: 'app-avance-cumplimiento2', templateUrl: './avance-cumplimiento2.component.html', styleUrls: ['./avance-cumplimiento2.component.css']})
export class AvanceCumplimiento2Component implements OnInit {
    form !: FormGroup;
    id?: string;
    title !: string;
    projectId : number;

    loading = false;
    submitting = false;
    submitted = false;
    addActividadesForm : actividadesForm = new actividadesForm();
    avanceList : any = [];
    idTodelete : number = 0;
    idToupdate : number = 0;
    @ViewChild("actividadesForm")
    public proyectData : any = [];
    public doc : any;

    actividadesForm !: NgForm;


    isSubmitted : boolean = false;
    post : ActividadesModels = {
        id: 0,
        actividades: '',
        avance: '',
        observacion: ''

    };
    constructor(private formBuilder : FormBuilder, private route : ActivatedRoute, private router : Router, private httpProvider : ActividadesService, private miDatePipe : DatePipe) {}

    ngOnInit(): void {

        this.route.queryParams.subscribe(params => {
            console.log(params); // { orderby: "price" }
            this.projectId = params['id_proyecto'];
            console.log(this.projectId);

            if (this.projectId) { // this.getAllProyectoById(this.projectId);
                console.log(this.projectId);
            }
        });
        this.getAllActividades();
        this.getAllProyectoByid();
    }
    /*añadir actividades*/
    public addActividades(isValid : any) {
        this.isSubmitted = true;
        if (isValid) {
            this.httpProvider.addActividades(this.addActividadesForm).subscribe(async data => {
                console.log(data);

                if (data.data.avanze != null && data.data.avanze != null) {
                    if (data.status === 'success') {
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    }
                }

            }, async error => {
                console.log(error.message);

                // setTimeout(() => {
                // this.router.navigate(['/Home']);
                // }, 500);
            });
        }
    }


    public getAllProyectoByid() {
        this.httpProvider.getProyectoById(this.projectId).subscribe((data : any) => {

            console.log(data);


            if (data.data.projects != null && data.data.projects != null) {
                var resultData = data.data.projects;
                if (resultData) {
                    console.log(resultData);
                    console.log(resultData);


                    this.proyectData = resultData;
                }
            }
        }, (error : any) => {
            if (error) {
                if (error.status == 404) {
                    if (error.error && error.error.message) {
                        this.proyectData = [];
                    }
                }
            }
        });
    }
    /*obtener todas las actividades*/
    public getAllActividades() {
        this.httpProvider.getActividades().subscribe((data : any) => {
            console.log(data);

            if (data.data.avanzes != null && data.data.avanzes != null) {
                var resultData = data.data.avanzes;
                if (resultData) {
                    console.log(resultData);

                    this.avanceList = resultData;
                }
            }
        }, (error : any) => {
            if (error) {
                if (error.status == 404) {
                    if (error.error && error.error.message) {
                        this.avanceList = [];
                    }
                }
            }
        });
    }

    /*Eliminar actividades*/
    public openDeleteModal(id : number) {

        this.idTodelete = id;
    }

    public openUpdateModal(id : number) {
        this.idToupdate = id;

        this.getById(id);

    }
    public getById(id : number) {
        this.httpProvider.getActividadesById(id).subscribe((data) => {
            console.log(data);
            this.post = data.data.avanze[0];


        });
    }
    /*Actualizar actividades*/
    public update() {
        this.httpProvider.updateActividades(this.idToupdate, this.post).subscribe({
            next: (data) => {
                console.log(data);

                window.location.reload();
            },
            error: (err) => {
                console.log(err);
            }
        })
    }
    /*confirmar eliminacion de registro*/
    public delete() {
        this.httpProvider.deleteActividadesById(this.idTodelete).subscribe((data : any) => {
            console.log(data);
            if (data.status === 'success') {
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        }, (error : any) => {});
    }


    /* pdf proyecto*/
    // public pdf() {
    //     console.log(this.proyectData);

    //     var d = new Date();
    //     var s = new Date();
    //     var dia = s.getUTCDate();
    //     var ed = this.id
    //     const month_value = d.getMonth();

    //     var months = new Array(12);
    //     months[0] = "Enero";
    //     months[1] = "Febrero";
    //     months[2] = "Marzo";
    //     months[3] = "Abril";
    //     months[4] = "Mayo";
    //     months[5] = "Junio";
    //     months[6] = "Julio";
    //     months[7] = "Agosto";
    //     months[8] = "Septiembre";
    //     months[9] = "Octubre";
    //     months[10] = "Noviembre";
    //     months[11] = "Diciembre";

    //     // var fir =this.reportReport[0].nombres.charAt(0);
    //     // var ult =this.reportReport[0].nombres.charAt(this.reportReport[0].nombres.length - 1);

    //     // numeros aleatorios//
    //     var data = []

    //     this.doc = new jsPDF('p', 'pt');
    //     let rows: never[] = [];

    //     const pageContent = (data : any) => { // HEADER
    //         this.doc.setFontSize(16);
    //         // this.doc.setFontStyle('bold');
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.text('INSTITUTO SUPERIOR TECNOLÓGICO', 175, 85);
    //         this.doc.text('D E   T U R I S M O   Y	P A T R I M O N I O', 155, 115);
    //         this.doc.text('“Y A V I R A C”', 255, 145);

    //         // this.doc.setFontSize(7);
    //         // this.doc.text('Quito- Ecuador', 215, 165);

    //         this.doc.setFontSize(11);
    //         // this.doc.setFontStyle('bold');
    //         this.doc.text('DEPARTAMENTO DE VINCULACIÓN CON LA  SOCIEDAD ', 155, 210);
    //         // this.doc.setFontSize(11);
    //         // this.doc.setFontStyle('normal');
    //         // this.doc.text('VINCULACIÓN CON LA  SOCIEDAD', 280, 210);

    //         this.doc.setFontSize(11);
    //         this.doc.text('CARRERA:', 155, 230);
    //         this.doc.setFontSize(10);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.text(this.proyectData.career_id.name, 215, 230);

    //         this.doc.setFontSize(11);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.text('NOMBRE DEL PROYECTO:', 115, 255);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.text(this.proyectData.name, 260, 255, {
    //             maxWidth: 250,
    //             align: 'justify'
    //         });

    //         this.doc.setFontSize(11);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.text('COORDINADOR DE CARRERA:', 45, 355);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.text('ING. DIEGO YANEZ', 215, 355);
    //         this.doc.setFontSize(10);

    //         this.doc.setFontSize(11);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.text('ACTORES:/TUTORES:', 45, 380);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.text('BYRON MORENO / YOGLEDIS HERRERA', 170, 380);
    //         this.doc.setFontSize(10);


    //         this.doc.setFontSize(11);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.text('INSTITUCIÓN BENEFICIARIA:', 45, 405);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.text(this.proyectData.beneficiary_institution_id.name, 210, 405);


    //         this.doc.setFontSize(11);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.text('COORDINADOR(ES) INSTITUCIÓN BENEFICIARIA:', 45, 435);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.text('DIEGO YANEZ', 320, 435);


    //         this.doc.setFontSize(11);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.text('CODIGO DEL PROYECTO:', 45, 465);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.text(this.proyectData.code, 190, 465);


    //         this.doc.setFontSize(16);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.text('Quito-Ecuador', 255, 575);
    //         this.doc.setFontSize(16);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.text('MAYO - 2023', 255, 600);

    //     }
    //     this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);

    //     const pageContent2 = (data : any) => { // HEADER
    //         this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
    //         this.doc.line(40, 150, 550, 150);
    //         this.doc.line(40, 150, 40, 650);
    //         this.doc.line(550, 150, 550, 650);

    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.text('1. PROYECTO/ACTIVIDAD', 45, 165);
    //         this.doc.line(40, 170, 550, 170);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.text('TITULO:', 45, 185);
    //         this.doc.setFontSize(6);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.text('Debe responder a estas tres preguntas: ¿Qué se va a hacer? ¿Sobre qué? ¿Dónde?', 85, 185);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.text(this.proyectData.name, 45, 200, {
    //             maxWidth: 350,
    //             align: 'justify'
    //         });
    //         this.doc.line(40, 230, 550, 230);

    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.setFontSize(9);
    //         this.doc.text('CARRERA:', 45, 240);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.text(this.proyectData.career_id.name, 95, 240);
    //         this.doc.line(40, 250, 550, 250);

    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.setFontSize(9);
    //         this.doc.text('CICLO:', 45, 260);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.text(this.proyectData.cicle, 85, 260, {
    //             maxWidth: 250,
    //             align: 'justify'
    //         });
    //         this.doc.line(40, 275, 550, 275);


    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.setFontSize(9);
    //         this.doc.text('COBERTURA Y LOCALIZACION:', 45, 295);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.text(this.proyectData.address, 200, 285, {
    //             maxWidth: 500,
    //             align: 'justify'
    //         });
    //         this.doc.line(40, 315, 550, 315);

    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.setFontSize(9);
    //         this.doc.text('PLAZO DE EJECUCION:', 45, 340);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.text('3 años', 200, 340, {
    //             maxWidth: 345,
    //             align: 'justify'
    //         });
    //         this.doc.line(40, 355, 550, 355);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.setFontSize(9);
    //         this.doc.text('FECHA PRESENTACIÓN:', 45, 375);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.text(this.miDatePipe.transform(this.proyectData.date_presentation, 'dd/MM/yyyy'), 200, 375, {
    //             maxWidth: 345,
    //             align: 'justify'
    //         });

    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.setFontSize(9);
    //         this.doc.text('FECHA INICIO:', 250, 375);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.text(this.miDatePipe.transform(this.proyectData.start_date, 'dd/MM/yyyy'), 325, 375, {
    //             maxWidth: 345,
    //             align: 'justify'
    //         });

    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.setFontSize(9);
    //         this.doc.text('FECHA FIN:', 385, 375);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.text(this.miDatePipe.transform(this.proyectData.end_date, 'dd/MM/yyyy'), 450, 375, {
    //             maxWidth: 345,
    //             align: 'justify'
    //         });

    //         this.doc.line(40, 390, 550, 390);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.setFontSize(9);
    //         this.doc.text('FRECUENCIA ACTIVIDADES:', 240, 410);
    //         this.doc.line(40, 420, 550, 420);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('DIARIA', 80, 440);
    //         this.doc.text('SEMANAL', 195, 440);
    //         this.doc.text('QUINCENAL', 320, 440);
    //         this.doc.text('MENSUAL', 440, 440);
    //         this.doc.line(140, 420, 140, 510);
    //         this.doc.line(260, 420, 260, 510);
    //         this.doc.line(400, 420, 400, 510);
    //         var actividades = JSON.parse(this.proyectData.frequency_activity);

    //         this.doc.line(40, 460, 550, 460);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         for (let i = 0; i < actividades.length; i++) {
    //             const element = actividades[i];
    //             console.log(element);
    //             if (element === 'diaria') {
    //                 this.doc.text('X', 95, 480);
    //             } else if (element === 'semanal') {
    //                 this.doc.text('X', 210, 480);
    //             } else if (element === 'quincenal') {
    //                 this.doc.text('X', 340, 480);
    //             } else if (element === 'mensual') {
    //                 this.doc.text('X', 450, 480);
    //             }

    //         }

    //         this.doc.line(40, 510, 550, 510);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('ACTIVIDADE DE VINCULACIÓN', 55, 530);
    //         this.doc.line(170, 550, 170, 650);
    //         this.doc.line(210, 510, 210, 650);
    //         this.doc.text('SECTORES DE INTERVENCIÓN', 230, 530);
    //         this.doc.line(345, 550, 345, 650);
    //         this.doc.line(385, 510, 385, 650);
    //         this.doc.text('EJES ESTRATEGICOS DE VINCULACION CON LA COLECTIVIDAD', 475, 525, {
    //             maxWidth: 120,
    //             align: 'center'
    //         });

    //         var secor_actividades = JSON.parse(this.proyectData.intervention_sectors);
    //         for (let i = 0; i < secor_actividades.length; i++) {
    //             const element = secor_actividades[i];
    //             if (element === 'educacion') {
    //                 this.doc.text('X', 365, 570);
    //             } else if (element === 'salud') {
    //                 this.doc.text('X', 365, 605);
    //             } else if (element === 'sa') {
    //                 this.doc.text('X', 365, 635);
    //             }
    //         }

    //         var actividades_vincu = JSON.parse(this.proyectData.activity_vinculation);
    //         for (let i = 0; i < actividades_vincu.length; i++) {
    //             const element = actividades_vincu[i];
    //             if (element === 'correos') {
    //                 this.doc.text('X', 190, 570);
    //             } else if (element === 'acuerdo') {
    //                 this.doc.text('X', 190, 605);
    //             } else if (element === 'pvpij') {
    //                 this.doc.text('X', 190, 635);
    //             }
    //         }
    //         this.doc.line(40, 550, 550, 550);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Convenios institucionales', 42, 570);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Educación', 270, 570);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Ambiental', 395, 570);
    //         this.doc.text('', 510, 570);

    //         this.doc.line(40, 585, 550, 585);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Acuerdo', 80, 605);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Salud', 260, 605);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Interculturalidad/género', 395, 605);
    //         this.doc.text('', 510, 605);


    //         this.doc.line(40, 620, 550, 620);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Proyecto de vinculación propio  IST JME', 42, 635, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Saneamiento Ambiental', 240, 635, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Investigativo Académico', 395, 635, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 510, 635);
    //         this.doc.line(40, 650, 555, 650);

    //     }


    //     const pageContent3 = (data : any) => { // HEADER

    //         this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
    //         this.doc.line(40, 150, 555, 150);
    //         this.doc.line(40, 150, 40, 750);
    //         this.doc.line(555, 150, 555, 750);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text(' Programa de capacitación a la  comunidad', 42, 165, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.line(170, 150, 170, 510);
    //         this.doc.line(210, 150, 210, 510);

    //         var secor_actividades = JSON.parse(this.proyectData.intervention_sectors);
    //         for (let i = 0; i < secor_actividades.length; i++) {
    //             const element = secor_actividades[i];
    //             console.log(element);

    //             if (element === 'ds') {
    //                 this.doc.text('X', 365, 165);
    //             } else if (element === 'ap') {
    //                 this.doc.text('X', 365, 170);

    //             } else if (element === 'agyp') {
    //                 this.doc.text('X', 365, 195);

    //             } else if (element === 'vivienda') {
    //                 this.doc.text('X', 365, 220);

    //             } else if (element === 'pma') {
    //                 this.doc.text('X', 365, 250);

    //             } else if (element === 'rne') {
    //                 this.doc.text('X', 365, 280);

    //             } else if (element === 'tcv') {
    //                 this.doc.text('X', 365, 310);

    //             } else if (element === 'desarrolloU') {
    //                 this.doc.text('X', 365, 340);

    //             } else if (element === 'turismo') {
    //                 this.doc.text('X', 365, 370);

    //             } else if (element === 'cultura') {
    //                 this.doc.text('X', 365, 400);

    //             } else if (element === 'dic') {
    //                 this.doc.text('X', 365, 430);

    //             } else if (element === 'deportes') {
    //                 this.doc.text('X', 365, 460);

    //             } else if (element === 'jys') {
    //                 this.doc.text('X', 365, 490);

    //             }
    //         }


    //         var actividades_vincu = JSON.parse(this.proyectData.activity_vinculation);
    //         for (let i = 0; i < actividades_vincu.length; i++) {
    //             const element = actividades_vincu[i];
    //             if (element === 'pcc') {
    //                 this.doc.text('X', 190, 165);

    //             } else if (element === 'pvc') {
    //                 this.doc.text('X', 190, 195);

    //             } else if (element === 'pvpij') {
    //                 this.doc.text('X', 365, 635);
    //             }
    //         }
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Desarrollo Social', 240, 165, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.line(345, 150, 345, 510);
    //         this.doc.line(385, 150, 385, 510);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text(' Desarrollo social, comunitario', 395, 165, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 525, 165);
    //         this.doc.line(510, 150, 510, 510);

    //         this.doc.line(40, 185, 555, 185);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Practicas Vinculación con la comunidad', 42, 195, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Apoyo Productivo', 240, 195, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Desarrollo local', 395, 195, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 525, 195);


    //         this.doc.line(40, 210, 555, 210);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 42, 220, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 190, 220);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Vivienda', 240, 220, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Desarrollo técnico y tecnológico', 395, 220, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 525, 220);

    //         this.doc.line(40, 240, 555, 240);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 42, 250, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 190, 250);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Protección del medio ambiente y desastres naturales', 270, 250, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Innovación', 395, 250, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 525, 250);


    //         this.doc.line(40, 270, 555, 270);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 42, 280, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 190, 280);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Recursos naturales y energía', 270, 280, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Responsabilidad social  universitaria', 440, 280, {
    //             maxWidth: 120,
    //             align: 'center'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 525, 280);

    //         this.doc.line(40, 300, 555, 300);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 42, 310, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 190, 310);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Transporte, comunicación y viabilidad', 270, 310, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Matriz productiva.', 395, 310, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 525, 310);


    //         this.doc.line(40, 330, 555, 330);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 42, 340, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 190, 340);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text(' Desarrollo Urbano', 240, 340, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 395, 340, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 525, 340);

    //         this.doc.line(40, 360, 555, 360);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 42, 370, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 190, 370);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Turismo', 240, 370, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 395, 370, {
    //             maxWidth: 120,
    //             align: 'justify'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 525, 370);


    //         this.doc.line(40, 390, 555, 390);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 42, 400, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 190, 400);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Cultura', 260, 400, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 395, 400, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 525, 400);

    //         this.doc.line(40, 420, 555, 420);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 42, 430, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 190, 430);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Desarrollo de investigación científica', 270, 430, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 395, 430, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 525, 430);

    //         this.doc.line(40, 450, 555, 450);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 42, 460, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 190, 460);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Deportes', 260, 460, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 395, 460, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 525, 460);

    //         this.doc.line(40, 480, 555, 480);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Otros', 55, 490, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 190, 490);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Justicia y Seguridad', 270, 490, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Otros', 395, 490, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('', 525, 490);

    //         this.doc.line(40, 510, 555, 510);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.text('2.-DESCRIPCION GENERAL  DEL PROYECTO', 45, 530, {
    //             maxWidth: 400,
    //             align: 'justify'
    //         });
    //         this.doc.line(40, 540, 555, 540);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(11);
    //         this.doc.text(this.proyectData.description, 45, 555, {
    //             maxWidth: 500,
    //             align: 'justify'
    //         });
    //         this.doc.line(40, 750, 555, 750);

    //     }
    //     const pageContent4 = (data : any) => { // HEADER
    //         this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


    //         this.doc.line(40, 150, 555, 150);
    //         this.doc.line(40, 150, 40, 730);
    //         this.doc.line(555, 150, 555, 730);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.text('4.-DESCRIPCIÓN GENERAL  DE LA REALIZACION DEL PROYECTO POR PARTE DEL TUTOR ACADEMICO', 45, 165);
    //         this.doc.line(40, 170, 550, 170);

    //         this.doc.line(40, 540, 555, 540);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.text('5.-PARTICIPANTES', 45, 555);
    //         this.doc.line(40, 570, 555, 570);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);

    //         /*liena vertical */
    //         this.doc.line(150, 570, 150, 730);
    //         this.doc.line(265, 570, 265, 730);
    //         this.doc.line(395, 570, 395, 730);
    //         // this.doc.line(440, 570, 440, 730);

    //         /*--------------*/
    //         this.doc.text('Docentes', 80, 585);
    //         this.doc.text('Nombre y título profesional ', 195, 585, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('Horario de trabajo para el proyecto.', 320, 585, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('Funciones asignadas', 440, 585, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.line(40, 600, 555, 600);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Coordinador del proyecto', 50, 615);
    //         this.doc.text('$F{campo_dato}', 195, 615, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 320, 615, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 440, 615, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.line(40, 630, 555, 630);
    //         this.doc.text('$F{campo_dato}', 195, 650, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 320, 650, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 440, 650, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });

    //         this.doc.line(150, 660, 555, 660);
    //         this.doc.text('$F{campo_dato}', 195, 680, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 320, 680, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 440, 680, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });

    //         this.doc.line(150, 690, 555, 690);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('Docentes miembros del equipo de trabajo', 90, 690, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 195, 710, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 320, 710, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 440, 710, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });

    //         this.doc.line(40, 730, 555, 730);
    //     }
    //     const pageContent5 = (data : any) => { // HEADER
    //         this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


    //         this.doc.line(40, 150, 555, 150);
    //         this.doc.line(40, 150, 40, 730);
    //         this.doc.line(555, 150, 555, 730);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('$F{campo_dato}', 195, 160, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 320, 160, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 460, 160, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });

    //         // this.doc.setFontSize(9);
    //         // this.doc.setFont("Roboto", 'bold');
    //         // this.doc.text('4.-DESCRIPCIÓN GENERAL  DE LA REALIZACION DEL PROYECTO POR PARTE DEL TUTOR ACADEMICO', 45, 165);
    //         this.doc.line(150, 170, 555, 170);
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('$F{campo_dato}', 195, 180, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 320, 180, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 460, 180, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });

    //         /*participantes*/
    //         /*liena vertical */
    //         this.doc.line(150, 150, 150, 230);
    //         this.doc.line(270, 150, 270, 230);
    //         this.doc.line(420, 150, 420, 230);

    //         /*lienas horizontales*/
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.line(150, 190, 555, 190);

    //         this.doc.text('$F{campo_dato}', 195, 200, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 320, 200, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 460, 200, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });

    //         this.doc.line(150, 210, 555, 210);
    //         this.doc.text('$F{campo_dato}', 195, 220, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 320, 220, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 460, 220, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });

    //         /*Estudiantes*/
    //         this.doc.line(40, 230, 555, 230);

    //         this.doc.line(40, 250, 555, 250);
    //         this.doc.text('Estudiantes ', 45, 260,);
    //         /*titulo*/
    //         this.doc.line(40, 270, 555, 270);
    //         this.doc.text('Datos Personales ', 110, 280,);

    //         this.doc.line(40, 290, 270, 290);
    //         this.doc.text('$F{campo_dato}', 45, 300,);
    //         this.doc.text('$F{campo_dato}', 195, 300,);

    //         /*titulo otra tabla*/
    //         this.doc.text('Especialidad', 320, 290,);
    //         this.doc.text('Funciones asignadas/con horas de trabajo', 485, 290, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });


    //         /*liena vertical */
    //         this.doc.line(150, 290, 150, 460);
    //         this.doc.line(270, 270, 270, 460);
    //         this.doc.line(420, 270, 420, 460);
    //         /*Especialidad*/
    //         this.doc.line(40, 320, 555, 320);
    //         this.doc.text('$F{campo_dato}', 45, 330,);
    //         this.doc.text('$F{campo_dato}', 195, 330,);
    //         this.doc.text('$F{campo_dato}', 320, 330,);
    //         this.doc.text('$F{campo_dato}', 460, 330,);

    //         this.doc.line(40, 340, 555, 340);
    //         this.doc.text('$F{campo_dato}', 45, 350,);
    //         this.doc.text('$F{campo_dato}', 195, 350,);
    //         this.doc.text('$F{campo_dato}', 320, 350,);
    //         this.doc.text('$F{campo_dato}', 460, 350,);

    //         this.doc.line(40, 360, 555, 360);
    //         this.doc.text('$F{campo_dato}', 45, 370,);
    //         this.doc.text('$F{campo_dato}', 195, 370,);
    //         this.doc.text('$F{campo_dato}', 320, 370,);
    //         this.doc.text('$F{campo_dato}', 460, 370,);

    //         this.doc.line(40, 380, 555, 380);
    //         this.doc.text('$F{campo_dato}', 45, 390,);
    //         this.doc.text('$F{campo_dato}', 195, 390,);
    //         this.doc.text('$F{campo_dato}', 320, 390,);
    //         this.doc.text('$F{campo_dato}', 460, 390,);

    //         this.doc.line(40, 400, 555, 400);
    //         this.doc.text('$F{campo_dato}', 45, 410,);
    //         this.doc.text('$F{campo_dato}', 195, 410,);
    //         this.doc.text('$F{campo_dato}', 320, 410,);
    //         this.doc.text('$F{campo_dato}', 460, 410,);

    //         this.doc.line(40, 420, 555, 420);
    //         this.doc.text('$F{campo_dato}', 45, 430,);
    //         this.doc.text('$F{campo_dato}', 195, 430,);
    //         this.doc.text('$F{campo_dato}', 320, 430,);
    //         this.doc.text('$F{campo_dato}', 460, 430,);

    //         this.doc.line(40, 440, 555, 440);
    //         this.doc.text('$F{campo_dato}', 45, 450,);
    //         this.doc.text('$F{campo_dato}', 195, 450,);
    //         this.doc.text('$F{campo_dato}', 320, 450,);
    //         this.doc.text('$F{campo_dato}', 460, 450,);

    //         /*liena vertical */
    //         this.doc.line(220, 480, 220, 730);
    //         this.doc.line(320, 480, 320, 540);
    //         this.doc.line(380, 540, 380, 730);
    //         this.doc.line(420, 480, 420, 540);

    //         this.doc.line(40, 460, 555, 460);
    //         /* 6.-ORGANIZACIÓN/ INSTITUCIÓN BENEFICIARIA*/
    //         this.doc.text('6.-ORGANIZACIÓN/ INSTITUCIÓN BENEFICIARIA', 45, 475,);
    //         this.doc.line(40, 480, 555, 480);
    //         this.doc.text('Nombre completo organización/institución beneficiaria', 120, 490, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });
    //         this.doc.text('Provincia', 275, 490, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });
    //         this.doc.text('Cantón', 375, 490, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });
    //         this.doc.text('Parroquia', 475, 490, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });

    //         this.doc.line(40, 515, 555, 515);
    //         this.doc.text('$F{campo_dato}', 120, 525, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 275, 525, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 375, 525, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 475, 525, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });

    //         this.doc.line(40, 540, 555, 540);
    //         this.doc.text('Lugar de ubicación', 110, 560, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });
    //         this.doc.text('Beneficiarios Directos', 300, 560, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });
    //         this.doc.text('Beneficiarios Indirectos', 460, 560, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });

    //         this.doc.line(40, 580, 555, 580);
    //         this.doc.text('$F{campo_dato}', 80, 610, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 260, 610, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 410, 610, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });


    //         this.doc.line(40, 650, 555, 650);
    //         this.doc.setFontSize(9);
    //         this.doc.text('NOMBRES Y APELLIDOS DE COORDINADOR(ES) DE INSTITUCIÓN BENEFICIARIA: ', 110, 660, {
    //             maxWidth: 150,
    //             align: 'center'
    //         });
    //         this.doc.text('CARGO O FUNCIÓN EN LA INSTITUCIÓN BENEFICIARIA', 300, 660, {
    //             maxWidth: 150,
    //             align: 'center'
    //         });
    //         this.doc.text('FUNCIÓN QUE CUMPLE EN EL PROYECTO DE VINCULACIÓN CON LA COMUNIDAD.', 460, 660, {
    //             maxWidth: 150,
    //             align: 'center'
    //         });
    //         this.doc.line(40, 685, 555, 685);
    //         this.doc.text('$F{campo_dato}', 80, 710, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 260, 710, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });
    //         this.doc.text('$F{campo_dato}', 410, 710, {
    //             maxWidth: 175,
    //             align: 'center'
    //         });


    //         this.doc.line(40, 730, 555, 730);
    //     }
    //     const pageContent6 = (data : any) => { // HEADER
    //         this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


    //         this.doc.line(40, 150, 555, 150);
    //         this.doc.line(40, 150, 40, 730);
    //         this.doc.line(555, 150, 555, 730);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.text('7.DESCRIPCIÓN GENERAL  DE LA REALIZACION DEL PROYECTO POR PARTE DEL TUTOR ENTIDAD BENEFICIARIA', 45, 165);
    //         this.doc.line(40, 170, 555, 170);

    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('$F{descripcion_general}', 45, 180, {
    //             maxWidth: 550,
    //             align: 'justify'
    //         });


    //         /*liena vertical */
    //         this.doc.line(225, 320, 225, 730);
    //         this.doc.line(395, 320, 395, 730);
    //         /*Especialidad*/
    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.line(40, 320, 555, 320);
    //         this.doc.text('COMPONENTES: (Objetivos Específicos)', 45, 330,);
    //         this.doc.text('$F{campo_dato}', 230, 330,);
    //         this.doc.text('$F{campo_dato}', 400, 330,);
    //         this.doc.line(40, 460, 555, 460);
    //         this.doc.text('ACTIVIDADES', 45, 475,);
    //         this.doc.text('AVANCE Y CUMPLIMIENTO', 235, 475,);
    //         this.doc.text('OBSERVACIONES ', 440, 475,);

    //         this.doc.line(40, 485, 555, 485);
    //         this.doc.text('$F{actividad}', 45, 500);
    //         this.doc.text('$F{avance}', 230, 500);
    //         this.doc.text('$F{observaciones}', 420, 500);

    //         this.doc.line(40, 515, 555, 515);
    //         this.doc.text('$F{actividad}', 45, 530);
    //         this.doc.line(40, 540, 555, 540);
    //         this.doc.text('$F{actividad}', 45, 555);
    //         this.doc.line(40, 570, 555, 570);
    //         this.doc.text('$F{actividad}', 45, 580);
    //         this.doc.line(40, 600, 555, 600);
    //         this.doc.text('$F{actividad}', 45, 620);
    //         this.doc.line(40, 630, 555, 630);
    //         this.doc.text('$F{actividad}', 45, 650);
    //         this.doc.line(40, 660, 555, 660);
    //         this.doc.text('$F{actividad}', 45, 680);
    //         this.doc.line(40, 690, 555, 690);
    //         this.doc.text('$F{actividad}', 45, 715);
    //         this.doc.line(40, 730, 555, 730);
    //     }
    //     const pageContent7 = (data : any) => { // HEADER
    //         this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


    //         this.doc.line(40, 150, 555, 150);
    //         this.doc.line(40, 150, 40, 550);
    //         this.doc.line(555, 150, 555, 550);
    //         this.doc.setFontSize(9);
    //         this.doc.setFont("Roboto", 'bold');
    //         this.doc.text('Evidencia del producto final:', 45, 165);
    //         this.doc.line(40, 170, 555, 170);

    //         this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
    //         this.doc.setFontSize(9);
    //         this.doc.text('$F{evidencia_producto}', 45, 180, {
    //             maxWidth: 550,
    //             align: 'justify'
    //         });

    //         this.doc.line(40, 550, 555, 550);

    //         this.doc.line(150, 680, 250, 680);
    //         this.doc.text('FIRMA TUTOR DEL PROYECTO', 195, 695, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });

    //         this.doc.line(350, 680, 450, 680);
    //         this.doc.text('FIRMA RESPONSABLE DE VINCULACION ', 400, 695, {
    //             maxWidth: 100,
    //             align: 'center'
    //         });


    //     }
    //     this.doc.autoTable({addPageContent: pageContent})


    //     this.doc.autoTable({
    //         addPageContent: pageContent2,

    //         head: [
    //             ['Name', 'Email', 'Country']
    //         ],

    //         body: [
    //             [
    //                 'David', 'david@example.com', 'Sweden'
    //             ],
    //             [
    //                 'Castille', 'castille@example.com', 'Spain'
    //             ],
    //             // ...
    //         ],
    //         startY: 1100,
    //         // Default for all columns
    //         styles: {
    //             overflow: 'ellipsize',
    //             cellWidth: 'wrap'
    //         },
    //         // Override the default above for the text column
    //         columnStyles: {
    //             text: {
    //                 cellWidth: 'auto'
    //             }
    //         }

    //     })

    //     this.doc.autoTable({addPageContent: pageContent3, startY: 2100})
    //     this.doc.autoTable({addPageContent: pageContent4, startY: 3100})

    //     this.doc.autoTable({addPageContent: pageContent5, startY: 4100})
    //     this.doc.autoTable({addPageContent: pageContent6, startY: 5100})
    //     this.doc.autoTable({addPageContent: pageContent7, startY: 6100})
    //     this.doc.save("Reportes.pdf");


    // }

    /* pdf proyecto*/
    public pdf() {

        this.doc = new jsPDF('p', 'pt');
        let rows: never[] = [];

        const pageContent = (data : any) => { // HEADER
            this.doc.setFontSize(16);
            /*Tamaño de la letra*/
            // this.doc.setFontStyle('bold');
            this.doc.setFont("Roboto", 'bold'); /*Tipo de letra*/
            this.doc.text('INSTITUTO SUPERIOR TECNOLÓGICO', 175, 85); /*Coordenadas que para estilo saltos de liena , espacios*/
            this.doc.text('D E   T U R I S M O   Y	P A T R I M O N I O', 155, 115);
            this.doc.text('“Y A V I R A C”', 255, 145);

            // this.doc.setFontSize(7);
            // this.doc.text('Quito- Ecuador', 215, 165);

            this.doc.setFontSize(11);
            // this.doc.setFontStyle('bold');
            this.doc.text('DEPARTAMENTO DE VINCULACIÓN CON LA  SOCIEDAD ', 155, 210);
            // this.doc.setFontSize(11);
            // this.doc.setFontStyle('normal');
            // this.doc.text('VINCULACIÓN CON LA  SOCIEDAD', 280, 210);

            this.doc.setFontSize(11);
            this.doc.text('CARRERA:', 155, 230); /*155 el espacio  del borde izquierdo al borde derecho  230 este margen top y marget bot */
            this.doc.setFontSize(10);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.text(this.proyectData.career_id.name, 215, 230);

            this.doc.setFontSize(11);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text('NOMBRE DEL PROYECTO:', 115, 255);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.text(this.proyectData.name, 260, 255, {
                maxWidth: 250,
                align: 'justify'
            });

            this.doc.setFontSize(11);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text('COORDINADOR DE CARRERA:', 45, 355);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.text('ING. DIEGO YANEZ', 215, 355);
            this.doc.setFontSize(10);

            this.doc.setFontSize(11);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text('ACTORES:/TUTORES:', 45, 380);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.text('BYRON MORENO / YOGLEDIS HERRERA', 170, 380);
            this.doc.setFontSize(10);


            this.doc.setFontSize(11);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text('INSTITUCIÓN BENEFICIARIA:', 45, 405);
            this.doc.setFontSize(11);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.text(this.proyectData.beneficiary_institution_id.name, 210, 405);


            this.doc.setFontSize(11);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text('COORDINADOR(ES) INSTITUCIÓN BENEFICIARIA:', 45, 435);
            this.doc.setFontSize(11);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.text(this.proyectData.beneficiary_institution_id.name_autorize_by, 320, 435);


            this.doc.setFontSize(11);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text('CODIGO DEL PROYECTO:', 45, 465);
            this.doc.setFontSize(11);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.text(this.proyectData.code, 190, 465);


            var d = new Date();
            var s = new Date();
            var dia = s.getUTCDate();
            var ed = this.id
            const month_value = d.getMonth();
            var months = new Array(12);
            months[0] = "Enero";
            months[1] = "Febrero";
            months[2] = "Marzo";
            months[3] = "Abril";
            months[4] = "Mayo";
            months[5] = "Junio";
            months[6] = "Julio";
            months[7] = "Agosto";
            months[8] = "Septiembre";
            months[9] = "Octubre";
            months[10] = "Noviembre";
            months[11] = "Diciembre";
            this.doc.setFontSize(16);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text('Quito-Ecuador', 255, 575);
            this.doc.setFontSize(16);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text(months[month_value] + '- 2023', 255, 600);

        }
        this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842); /*Linea para agregar imagen de contorno del pdf*/

        const pageContent2 = (data : any) => { // HEADER
            this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
            this.doc.line(40, 150, 550, 150);
            this.doc.line(40, 150, 40, 650);
            this.doc.line(550, 150, 550, 650);

            this.doc.setFontSize(9);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text('1. PROYECTO/ACTIVIDAD', 45, 165);
            this.doc.line(40, 170, 550, 170);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text('TITULO:', 45, 185);
            this.doc.setFontSize(6);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.text('Debe responder a estas tres preguntas: ¿Qué se va a hacer? ¿Sobre qué? ¿Dónde?', 85, 185);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.text(this.proyectData.name, 45, 200, {
                maxWidth: 350,
                align: 'justify'
            });
            this.doc.line(40, 230, 550, 230);

            this.doc.setFont("Roboto", 'bold');
            this.doc.setFontSize(9);
            this.doc.text('CARRERA:', 45, 240);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.text(this.proyectData.career_id.name, 95, 240);
            this.doc.line(40, 250, 550, 250);

            this.doc.setFont("Roboto", 'bold');
            this.doc.setFontSize(9);
            this.doc.text('CICLO:', 45, 260);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.text(this.proyectData.cicle, 85, 260, {
                maxWidth: 250,
                align: 'justify'
            });
            this.doc.line(40, 275, 550, 275);


            this.doc.setFont("Roboto", 'bold');
            this.doc.setFontSize(9);
            this.doc.text('COBERTURA Y LOCALIZACION:', 45, 295);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.text(this.proyectData.address, 200, 285, {
                maxWidth: 500,
                align: 'justify'
            });
            this.doc.line(40, 315, 550, 315);

            this.doc.setFont("Roboto", 'bold');
            this.doc.setFontSize(9);
            this.doc.text('PLAZO DE EJECUCION:', 45, 340);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.text('3 años', 200, 340, {
                maxWidth: 345,
                align: 'justify'
            });
            this.doc.line(40, 355, 550, 355);
            this.doc.setFont("Roboto", 'bold');
            this.doc.setFontSize(9);
            this.doc.text('FECHA PRESENTACIÓN:', 45, 375);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.text(this.miDatePipe.transform(this.proyectData.date_presentation, 'dd/MM/yyyy'), 200, 375, {
                maxWidth: 345,
                align: 'justify'
            });

            this.doc.setFont("Roboto", 'bold');
            this.doc.setFontSize(9);
            this.doc.text('FECHA INICIO:', 250, 375);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.text(this.miDatePipe.transform(this.proyectData.start_date, 'dd/MM/yyyy'), 325, 375, {
                maxWidth: 345,
                align: 'justify'
            });

            this.doc.setFont("Roboto", 'bold');
            this.doc.setFontSize(9);
            this.doc.text('FECHA FIN:', 385, 375);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.text(this.miDatePipe.transform(this.proyectData.end_date, 'dd/MM/yyyy'), 450, 375, {
                maxWidth: 345,
                align: 'justify'
            });

            this.doc.line(40, 390, 550, 390);
            this.doc.setFont("Roboto", 'bold');
            this.doc.setFontSize(9);
            this.doc.text('FRECUENCIA ACTIVIDADES:', 240, 410);
            this.doc.line(40, 420, 550, 420);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('DIARIA', 80, 440);
            this.doc.text('SEMANAL', 195, 440);
            this.doc.text('QUINCENAL', 320, 440);
            this.doc.text('MENSUAL', 440, 440);
            this.doc.line(140, 420, 140, 510);
            this.doc.line(260, 420, 260, 510);
            this.doc.line(400, 420, 400, 510);
            var actividades = JSON.parse(this.proyectData.frequency_activity);

            this.doc.line(40, 460, 550, 460);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            for (let i = 0; i < actividades.length; i++) {
                const element = actividades[i];
                console.log(element);
                if (element === 'diaria') {
                    this.doc.text('X', 95, 480);
                } else if (element === 'semanal') {
                    this.doc.text('X', 210, 480);
                } else if (element === 'quincenal') {
                    this.doc.text('X', 340, 480);
                } else if (element === 'mensual') {
                    this.doc.text('X', 450, 480);
                }

            }

            this.doc.line(40, 510, 550, 510);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('ACTIVIDADE DE VINCULACIÓN', 55, 530);
            this.doc.line(170, 550, 170, 650);
            this.doc.line(210, 510, 210, 650);
            this.doc.text('SECTORES DE INTERVENCIÓN', 230, 530);
            this.doc.line(345, 550, 345, 650);
            this.doc.line(385, 510, 385, 650);
            this.doc.text('EJES ESTRATEGICOS DE VINCULACION CON LA COLECTIVIDAD', 475, 525, {
                maxWidth: 120,
                align: 'center'
            });

            var secor_actividades = JSON.parse(this.proyectData.intervention_sectors);
            for (let i = 0; i < secor_actividades.length; i++) {
                const element = secor_actividades[i];
                if (element === 'educacion') {
                    this.doc.text('X', 365, 570);
                } else if (element === 'salud') {
                    this.doc.text('X', 365, 605);
                } else if (element === 'sa') {
                    this.doc.text('X', 365, 635);
                }
            }

            var actividades_vincu = JSON.parse(this.proyectData.activity_vinculation);
            for (let i = 0; i < actividades_vincu.length; i++) {
                const element = actividades_vincu[i];
                if (element === 'correos') {
                    this.doc.text('X', 190, 570);
                } else if (element === 'acuerdo') {
                    this.doc.text('X', 190, 605);
                } else if (element === 'pvpij') {
                    this.doc.text('X', 190, 635);
                }
            }
            this.doc.line(40, 550, 550, 550);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Convenios institucionales', 42, 570);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Educación', 270, 570);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Ambiental', 395, 570);
            this.doc.text('', 510, 570);

            this.doc.line(40, 585, 550, 585);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Acuerdo', 80, 605);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Salud', 260, 605);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Interculturalidad/género', 395, 605);
            this.doc.text('', 510, 605);


            this.doc.line(40, 620, 550, 620);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Proyecto de vinculación propio  IST JME', 42, 635, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Saneamiento Ambiental', 240, 635, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Investigativo Académico', 395, 635, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 510, 635);
            this.doc.line(40, 650, 555, 650);

        }


        const pageContent3 = (data : any) => { // HEADER

            this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
            this.doc.line(40, 150, 555, 150);
            this.doc.line(40, 150, 40, 750);
            this.doc.line(555, 150, 555, 750);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text(' Programa de capacitación a la  comunidad', 42, 165, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.line(170, 150, 170, 510);
            this.doc.line(210, 150, 210, 510);

            var secor_actividades = JSON.parse(this.proyectData.intervention_sectors);
            for (let i = 0; i < secor_actividades.length; i++) {
                const element = secor_actividades[i];
                console.log(element);

                if (element === 'ds') {
                    this.doc.text('X', 365, 165);
                } else if (element === 'ap') {
                    this.doc.text('X', 365, 170);

                } else if (element === 'agyp') {
                    this.doc.text('X', 365, 195);

                } else if (element === 'vivienda') {
                    this.doc.text('X', 365, 220);

                } else if (element === 'pma') {
                    this.doc.text('X', 365, 250);

                } else if (element === 'rne') {
                    this.doc.text('X', 365, 280);

                } else if (element === 'tcv') {
                    this.doc.text('X', 365, 310);

                } else if (element === 'desarrolloU') {
                    this.doc.text('X', 365, 340);

                } else if (element === 'turismo') {
                    this.doc.text('X', 365, 370);

                } else if (element === 'cultura') {
                    this.doc.text('X', 365, 400);

                } else if (element === 'dic') {
                    this.doc.text('X', 365, 430);

                } else if (element === 'deportes') {
                    this.doc.text('X', 365, 460);

                } else if (element === 'jys') {
                    this.doc.text('X', 365, 490);

                }
            }


            var actividades_vincu = JSON.parse(this.proyectData.activity_vinculation);
            for (let i = 0; i < actividades_vincu.length; i++) {
                const element = actividades_vincu[i];
                if (element === 'pcc') {
                    this.doc.text('X', 190, 165);

                } else if (element === 'pvc') {
                    this.doc.text('X', 190, 195);

                } else if (element === 'pvpij') {
                    this.doc.text('X', 365, 635);
                }
            }
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Desarrollo Social', 240, 165, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.line(345, 150, 345, 510);
            this.doc.line(385, 150, 385, 510);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text(' Desarrollo social, comunitario', 395, 165, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 525, 165);
            this.doc.line(510, 150, 510, 510);

            this.doc.line(40, 185, 555, 185);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Practicas Vinculación con la comunidad', 42, 195, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Apoyo Productivo', 240, 195, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Desarrollo local', 395, 195, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 525, 195);


            this.doc.line(40, 210, 555, 210);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 42, 220, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 190, 220);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Vivienda', 240, 220, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Desarrollo técnico y tecnológico', 395, 220, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 525, 220);

            this.doc.line(40, 240, 555, 240);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 42, 250, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 190, 250);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Protección del medio ambiente y desastres naturales', 270, 250, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Innovación', 395, 250, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 525, 250);


            this.doc.line(40, 270, 555, 270);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 42, 280, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 190, 280);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Recursos naturales y energía', 270, 280, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Responsabilidad social  universitaria', 440, 280, {
                maxWidth: 120,
                align: 'center'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 525, 280);

            this.doc.line(40, 300, 555, 300);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 42, 310, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 190, 310);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Transporte, comunicación y viabilidad', 270, 310, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Matriz productiva.', 395, 310, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 525, 310);


            this.doc.line(40, 330, 555, 330);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 42, 340, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 190, 340);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text(' Desarrollo Urbano', 240, 340, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 395, 340, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 525, 340);

            this.doc.line(40, 360, 555, 360);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 42, 370, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 190, 370);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Turismo', 240, 370, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 395, 370, {
                maxWidth: 120,
                align: 'justify'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 525, 370);


            this.doc.line(40, 390, 555, 390);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 42, 400, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 190, 400);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Cultura', 260, 400, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 395, 400, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 525, 400);

            this.doc.line(40, 420, 555, 420);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 42, 430, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 190, 430);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Desarrollo de investigación científica', 270, 430, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 395, 430, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 525, 430);

            this.doc.line(40, 450, 555, 450);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 42, 460, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 190, 460);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Deportes', 260, 460, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 395, 460, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 525, 460);

            this.doc.line(40, 480, 555, 480);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Otros', 55, 490, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 190, 490);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Justicia y Seguridad', 270, 490, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Otros', 395, 490, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 525, 490);

            this.doc.line(40, 510, 555, 510);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text('2.-DESCRIPCION GENERAL  DEL PROYECTO', 45, 530, {
                maxWidth: 400,
                align: 'justify'
            });
            this.doc.line(40, 540, 555, 540);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(11);
            this.doc.text(this.proyectData.description, 45, 555, {
                maxWidth: 500,
                align: 'justify'
            });
            this.doc.line(40, 750, 555, 750);

        }
        const pageContent4 = (data : any) => { // HEADER
            this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


            this.doc.line(40, 150, 555, 150);
            this.doc.line(40, 150, 40, 730);
            this.doc.line(555, 150, 555, 730);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text('3.-ANALISIS SITUACIONAL (DIAGNOSTICO)', 45, 165);
            this.doc.line(40, 170, 550, 170);
            this.doc.text(this.proyectData.situational_analysis, 95, 180, {
                maxWidth: 550,
                align: 'center'
            });

            this.doc.line(40, 430, 555, 430);
            this.doc.text('4.-JUSTIFICACIÓN ', 45, 445);
            this.doc.line(40, 450, 555, 450);
            this.doc.text(this.proyectData.justification, 95, 460, {
                maxWidth: 550,
                align: 'center'
            });


            this.doc.line(40, 540, 555, 540);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text('5.-PARTICIPANTES', 45, 555);
            this.doc.line(40, 570, 555, 570);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);

            /*liena vertical */
            this.doc.line(150, 570, 150, 730);
            this.doc.line(265, 570, 265, 730);
            this.doc.line(395, 570, 395, 730);
            // this.doc.line(440, 570, 440, 730);

            /*--------------*/
            this.doc.text('Docentes', 80, 585);
            this.doc.text('Nombre y título profesional ', 195, 585, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('Horario de trabajo para el proyecto.', 320, 585, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('Funciones asignadas', 440, 585, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.line(40, 600, 555, 600);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Coordinador del proyecto', 50, 615);
            this.doc.text(this.proyectData.authorized_by.user_id.person.names, 195, 615, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('Durante la carga horaria del docente', 320, 615, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('Coordinador del proyecto', 440, 615, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.line(40, 630, 555, 630);
            this.doc.text('Ing. Byron Moreno', 195, 650, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('Durante la carga horaria del docente', 320, 650, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('Tutor 1', 440, 650, {
                maxWidth: 100,
                align: 'center'
            });

            this.doc.line(150, 660, 555, 660);
            this.doc.text('', 195, 680, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('', 320, 680, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('', 440, 680, {
                maxWidth: 100,
                align: 'center'
            });

            this.doc.line(150, 690, 555, 690);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Docentes miembros del equipo de trabajo', 90, 690, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('', 195, 710, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('', 320, 710, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('', 440, 710, {
                maxWidth: 100,
                align: 'center'
            });

            this.doc.line(40, 730, 555, 730);
        }
        const pageContent5 = (data : any) => { // HEADER
            this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


            this.doc.line(40, 150, 555, 150);
            this.doc.line(40, 150, 40, 730);
            this.doc.line(555, 150, 555, 730);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 195, 160, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('', 320, 160, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('', 460, 160, {
                maxWidth: 100,
                align: 'center'
            });

            // this.doc.setFontSize(9);
            // this.doc.setFont("Roboto", 'bold');
            // this.doc.text('4.-DESCRIPCIÓN GENERAL  DE LA REALIZACION DEL PROYECTO POR PARTE DEL TUTOR ACADEMICO', 45, 165);
            this.doc.line(150, 170, 555, 170);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('', 195, 180, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('', 320, 180, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('', 460, 180, {
                maxWidth: 100,
                align: 'center'
            });

            /*participantes*/
            /*liena vertical */
            this.doc.line(150, 150, 150, 230);
            this.doc.line(270, 150, 270, 230);
            this.doc.line(420, 150, 420, 230);

            /*lienas horizontales*/
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.line(150, 190, 555, 190);

            this.doc.text('', 195, 200, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('', 320, 200, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('', 460, 200, {
                maxWidth: 100,
                align: 'center'
            });

            this.doc.line(150, 210, 555, 210);
            this.doc.text('', 195, 220, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('', 320, 220, {
                maxWidth: 100,
                align: 'center'
            });
            this.doc.text('', 460, 220, {
                maxWidth: 100,
                align: 'center'
            });

            /*Estudiantes*/
            this.doc.line(40, 230, 555, 230);

            this.doc.line(40, 250, 555, 250);
            this.doc.text('Estudiantes ', 45, 260,);
            /*titulo*/
            this.doc.line(40, 270, 555, 270);
            this.doc.text('Datos Personales ', 110, 280,);

            this.doc.line(40, 290, 270, 290);
            this.doc.text('Nombres Apellidos', 45, 300,);
            this.doc.text('CI', 220, 300,);

            /*titulo otra tabla*/
            this.doc.text('Especialidad', 320, 290,);
            this.doc.text('Funciones asignadas/con horas de trabajo', 485, 290, {
                maxWidth: 100,
                align: 'center'
            });


            /*liena vertical */
            this.doc.line(150, 290, 150, 460);
            this.doc.line(270, 270, 270, 460);
            this.doc.line(420, 270, 420, 460);
            /*Especialidad*/
            this.doc.line(40, 320, 555, 320);
            this.doc.text('Luis Cunalata', 45, 330,);
            this.doc.text('120329894', 195, 330,);
            this.doc.text('programador', 320, 330,);
            this.doc.text('lider proyecto', 460, 330,);

            this.doc.line(40, 340, 555, 340);
            this.doc.text('Gustavo moran', 45, 350,);
            this.doc.text('1865852847', 195, 350,);
            this.doc.text('programador', 320, 350,);
            this.doc.text('pasante', 460, 350,);

            this.doc.line(40, 360, 555, 360);
            this.doc.text('Javier Sandobal', 45, 370,);
            this.doc.text('1875155524', 195, 370,);
            this.doc.text('programador', 320, 370,);
            this.doc.text('pasante', 460, 370,);

            this.doc.line(40, 380, 555, 380);
            this.doc.text('Enrique Velez', 45, 390,);
            this.doc.text('1002656884', 195, 390,);
            this.doc.text('programador', 320, 390,);
            this.doc.text('DB', 460, 390,);

            this.doc.line(40, 400, 555, 400);
            this.doc.text('Joaquin Castillo', 45, 410,);
            this.doc.text('0444872488', 195, 410,);
            this.doc.text('programador', 320, 410,);
            this.doc.text('Desarrollo', 460, 410,);

            this.doc.line(40, 420, 555, 420);
            this.doc.text('', 45, 430,);
            this.doc.text('', 195, 430,);
            this.doc.text('', 320, 430,);
            this.doc.text('', 460, 430,);

            this.doc.line(40, 440, 555, 440);
            this.doc.text('', 45, 450,);
            this.doc.text('', 195, 450,);
            this.doc.text('', 320, 450,);
            this.doc.text('', 460, 450,);

            /*liena vertical */
            this.doc.line(220, 480, 220, 730);
            this.doc.line(320, 480, 320, 540);
            this.doc.line(380, 540, 380, 730);
            this.doc.line(420, 480, 420, 540);

            this.doc.line(40, 460, 555, 460);
            /* 6.-ORGANIZACIÓN/ INSTITUCIÓN BENEFICIARIA*/
            this.doc.text('6.-ORGANIZACIÓN/ INSTITUCIÓN BENEFICIARIA', 45, 475,);
            this.doc.line(40, 480, 555, 480);
            this.doc.text('Nombre completo organización/institución beneficiaria', 120, 490, {
                maxWidth: 175,
                align: 'center'
            });
            this.doc.text('Provincia', 275, 490, {
                maxWidth: 175,
                align: 'center'
            });
            this.doc.text('Cantón', 375, 490, {
                maxWidth: 175,
                align: 'center'
            });
            this.doc.text('Parroquia', 475, 490, {
                maxWidth: 175,
                align: 'center'
            });

            this.doc.line(40, 515, 555, 515);
            this.doc.text(this.proyectData.beneficiary_institution_id.name, 120, 525, {
                maxWidth: 175,
                align: 'center'
            });
            this.doc.text('PICHINCHA', 275, 525, {
                maxWidth: 175,
                align: 'center'
            });
            this.doc.text('QUITO', 375, 525, {
                maxWidth: 175,
                align: 'center'
            });
            this.doc.text('LOS VALLES', 475, 525, {
                maxWidth: 175,
                align: 'center'
            });

            this.doc.line(40, 540, 555, 540);
            this.doc.text('Lugar de ubicación', 110, 560, {
                maxWidth: 175,
                align: 'center'
            });
            this.doc.text('Beneficiarios Directos', 300, 560, {
                maxWidth: 175,
                align: 'center'
            });
            this.doc.text('Beneficiarios Indirectos', 460, 560, {
                maxWidth: 175,
                align: 'center'
            });

            this.doc.line(40, 580, 555, 580);
            this.doc.text('LOS VALLES', 80, 610, {
                maxWidth: 175,
                align: 'center'
            });
            this.doc.text(this.proyectData.beneficiary_institution_id["Direct beneficiaries"], 260, 610, {
                maxWidth: 175,
                align: 'center'
            });
            this.doc.text(this.proyectData.beneficiary_institution_id["Indirect beneficiaries"], 410, 610, {
                maxWidth: 175,
                align: 'center'
            });


            this.doc.line(40, 650, 555, 650);
            this.doc.setFontSize(9);
            this.doc.text('NOMBRES Y APELLIDOS DE COORDINADOR(ES) DE INSTITUCIÓN BENEFICIARIA: ', 110, 660, {
                maxWidth: 150,
                align: 'center'
            });
            this.doc.text('CARGO O FUNCIÓN EN LA INSTITUCIÓN BENEFICIARIA', 300, 660, {
                maxWidth: 150,
                align: 'center'
            });
            this.doc.text('FUNCIÓN QUE CUMPLE EN EL PROYECTO DE VINCULACIÓN CON LA COMUNIDAD.', 460, 660, {
                maxWidth: 150,
                align: 'center'
            });
            this.doc.line(40, 685, 555, 685);
            this.doc.text(this.proyectData.beneficiary_institution_id.name_autorize_by, 80, 710, {
                maxWidth: 175,
                align: 'center'
            });
            this.doc.text('COORDINADOR', 280, 710, {
                maxWidth: 175,
                align: 'center'
            });
            this.doc.text('TUTOR', 410, 710, {
                maxWidth: 175,
                align: 'center'
            });


            this.doc.line(40, 730, 555, 730);
        }
        const pageContent6 = (data : any) => { // HEADER
            this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


            this.doc.line(40, 150, 555, 150);
            this.doc.line(40, 150, 40, 730);
            this.doc.line(555, 150, 555, 730);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text('7.-MATRIZ DE MARCO LÓGICO (PLAN DE TRABAJO)', 45, 165);
            this.doc.line(40, 170, 555, 170);
            /*liena vertical */
            this.doc.line(225, 170, 225, 730);
            this.doc.line(395, 170, 395, 730);

            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('RESUMEN NARRATIVO DE OBJETIVOS', 50, 185, {
                maxWidth: 200,
                align: 'justify'
            });
            this.doc.text('INDICADORES VERIFICABLES', 230, 185, {
                maxWidth: 150,
                align: 'justify'
            });
            this.doc.text('MEDIOS DE VERIFICACIÓN', 400, 185, {
                maxWidth: 150,
                align: 'justify'
            });
            this.doc.line(40, 190, 555, 190);
            this.doc.text('Proposito:$F{obj_general}', 50, 200, {
                maxWidth: 200,
                align: 'justify'
            });
            this.doc.text('$F{ind_verificables}', 230, 200, {
                maxWidth: 150,
                align: 'justify'
            });
            this.doc.text('$F{medios_verificacion}', 400, 200, {
                maxWidth: 150,
                align: 'justify'
            });

            /*Especialidad*/
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.line(40, 320, 555, 320);
            this.doc.text('COMPONENTES: (Objetivos Específicos)', 45, 330,);
            this.doc.text('Desarrollar e implementar un sistema web que permita dar a  conocer los servicios y productos que ofrece la Fundación ', 230, 330, {
                maxWidth: 100,
                align: 'justify'
            });
            this.doc.text('Verificar la disponibilidad tecnológica de equipos informáticos para el alojamiento y programación del sistema web ', 400, 330, {
                maxWidth: 100,
                align: 'justify'
            });
            this.doc.line(40, 460, 555, 460);
            this.doc.text('ACTIVIDADES', 45, 475,);
            this.doc.text('AVANCE Y CUMPLIMIENTO', 235, 475,);
            this.doc.text('OBSERVACIONES ', 440, 475,);

            this.doc.line(40, 485, 555, 485);
            this.doc.text(' Realización un cronograma de actividades', 45, 500);
            this.doc.text('', 230, 500);
            this.doc.text('', 420, 500);

            this.doc.line(40, 515, 555, 515);
            this.doc.text(' Reunión de levantamiento de requerimientos ', 45, 530);
            this.doc.line(40, 540, 555, 540);
            this.doc.text(' Análisis de los requerimientos ', 45, 555);
            this.doc.line(40, 570, 555, 570);
            this.doc.text('', 45, 580);
            this.doc.line(40, 600, 555, 600);
            this.doc.text('', 45, 620);
            this.doc.line(40, 630, 555, 630);
            this.doc.text('', 45, 650);
            this.doc.line(40, 660, 555, 660);
            this.doc.text('', 45, 680);
            this.doc.line(40, 690, 555, 690);
            this.doc.text('', 45, 715);
            this.doc.line(40, 730, 555, 730);
        }
        // const pageContent7 = (data : any) => { // HEADER
        //     this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


        //     this.doc.line(40, 150, 555, 150);
        //     this.doc.line(40, 150, 40, 550);
        //     this.doc.line(555, 150, 555, 550);
        //     this.doc.setFontSize(9);
        //     this.doc.setFont("Roboto", 'bold');
        //     this.doc.text('8.-CRONOGRAMA', 45, 165);
        //     this.doc.line(40, 170, 555, 170);

        //     var cronograma = JSON.parse(this.proyectData.schedule_crono);
        //     console.log(cronograma.base64textString);

        //     if (cronograma.base64textString === undefined) {} else {
        //         const img_cronograma = "data:image/png;base64," + cronograma.base64textString;
        //         console.log(img_cronograma);
        //         this.doc.addImage(img_cronograma, 'JPG', 45, 180, 450, 350);

        //     }

        //     this.doc.line(40, 550, 555, 550);


        // }
        const pageContent8 = (data : any) => { // HEADER
            this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


            this.doc.line(40, 150, 555, 150);
            this.doc.line(40, 150, 40, 550);
            this.doc.line(555, 150, 555, 550);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text('9.-FINANCIAMIENTO', 45, 165);
            this.doc.line(40, 170, 555, 170);
            var financiamiento = JSON.parse(this.proyectData.financing);
            if (financiamiento.base64textString === undefined) {} else {
                const img_cronograma = "data:image/png;base64," + financiamiento.base64textString;
                console.log(img_cronograma);
                this.doc.addImage(img_cronograma, 'JPG', 45, 180, 450, 350);

            }
            this.doc.line(40, 550, 555, 550);

            this.doc.line(150, 680, 250, 680);
            this.doc.text('FIRMA TUTOR DEL PROYECTO', 195, 695, {
                maxWidth: 100,
                align: 'center'
            });

            this.doc.line(350, 680, 450, 680);
            this.doc.text('FIRMA RESPONSABLE DE VINCULACION ', 400, 695, {
                maxWidth: 100,
                align: 'center'
            });


        }
        const pageContent9 = (data : any) => { // HEADER
            this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


            this.doc.line(40, 150, 555, 150);
            this.doc.line(40, 150, 40, 550);
            this.doc.line(555, 150, 555, 550);
            this.doc.setFontSize(9);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text('10.-Estrategia de Seguimiento y Evaluación', 45, 165);
            this.doc.line(40, 170, 555, 170);

            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text('Registros de asistencia y cumplimiento de objetivos acorde a la planeación del proyecto , Informes de seguimiento y cumplimiento mensuales en los cuales se especificará el cumplimiento de los requerimiento', 45, 180, {
                maxWidth: 500,
                align: 'justify'
            });
            this.doc.line(40, 550, 555, 550);

            this.doc.line(40, 350, 555, 350);
            this.doc.setFont("Roboto", 'bold');
            this.doc.text('11.-Bibliografía', 45, 365);
            this.doc.line(40, 370, 555, 370);
            this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
            this.doc.setFontSize(9);
            this.doc.text(this.proyectData.bibliographies, 45, 385, {
                maxWidth: 500,
                align: 'justify'
            });


            this.doc.line(45, 620, 200, 620);
            this.doc.text('RECTOR IST', 75, 630);
            this.doc.text('IVAN OSCAR CARRERA', 100, 645, {
                maxWidth: 100,
                align: 'center'
            });

            this.doc.line(250, 620, 375, 620);
            this.doc.text('COORDINADORA DE VINCULACIÓN', 240, 630,);
            this.doc.text(this.proyectData.beneficiary_institution_id.name_autorize_by, 290, 645, {
                maxWidth: 100,
                align: 'center'
            });

            this.doc.line(450, 620, 550, 620);
            this.doc.text('COORDINADOR DE CARRERA', 440, 630,);
            this.doc.text('CARLA GONZALEZ LOPEZ', 495, 645, {
                maxWidth: 100,
                align: 'center'
            });

            // this.doc.line(480, 620, 200, 620);


            this.doc.line(45, 700, 200, 700);
            this.doc.text('DOCENTE SUPERVISOR', 65, 710);
            this.doc.text('DIEGO YANEZ', 100, 725, {
                maxWidth: 100,
                align: 'center'
            });

            this.doc.line(250, 700, 375, 700);
            this.doc.text('REPRESENTANTE LEGAL INSTITUCIONAL', 240, 710);
            this.doc.text('BYRON MORENO', 285, 725, {
                maxWidth: 100,
                align: 'center'
            });

            this.doc.line(450, 700, 550, 700);
            this.doc.text('ESTUDIANTE', 470, 710,);
            this.doc.text('TIPAN CHILLAGANA JUAN FERNANDO', 495, 725, {
                maxWidth: 100,
                align: 'center'
            });


        }
        this.doc.autoTable({addPageContent: pageContent})


        this.doc.autoTable({
            addPageContent: pageContent2,

            head: [
                ['Name', 'Email', 'Country']
            ],

            body: [
                [
                    'David', 'david@example.com', 'Sweden'
                ],
                [
                    'Castille', 'castille@example.com', 'Spain'
                ],
                // ...
            ],
            startY: 1100,
            // Default for all columns
            styles: {
                overflow: 'ellipsize',
                cellWidth: 'wrap'
            },
            // Override the default above for the text column
            columnStyles: {
                text: {
                    cellWidth: 'auto'
                }
            }

        })

        this.doc.autoTable({addPageContent: pageContent3, startY: 2100})
        this.doc.autoTable({addPageContent: pageContent4, startY: 3100})

        this.doc.autoTable({addPageContent: pageContent5, startY: 4100})
        this.doc.autoTable({addPageContent: pageContent6, startY: 5100})
        // this.doc.autoTable({addPageContent: pageContent7, startY: 6100})
        this.doc.autoTable({addPageContent: pageContent8, startY: 7100})
        this.doc.autoTable({addPageContent: pageContent9, startY: 8100})
        this.doc.save("Reportes.pdf");


    }
}

export class actividadesForm {
    actividades : string = "";
    avance : string = "";
    observacion : string = "";
}

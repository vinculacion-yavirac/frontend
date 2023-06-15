import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AvanceCumplimientoService } from 'src/app/service/avanze_cumplimiento/avance-cumplimiento.service';
import { AvanzeCumplimientoModels } from 'src/app/models/avanze/avanze_cumplimiento/avanze_cumplimiento';
import { ImageConstants } from 'src/app/constanst/ImageConstants';

@Component({
  selector: 'app-avance-cumplimiento',
  templateUrl: './avance-cumplimiento.component.html',
  styleUrls: ['./avance-cumplimiento.component.css']
})
export class AvanceCumplimientoComponent implements OnInit, OnDestroy, AfterViewInit {
  form!: FormGroup;
  id?: string;
  title!: string;
  loading = false;
  submitting = false;
  submitted = false;
  addAvanzeForm: avanzeForm = new avanzeForm();
  avanzeList: any = [];
  idTodelete: number = 0;
  idToupdate: number = 0;
  public doc: any;
  public doc2: any;
  public first: any;

  @ViewChild("avanzeForm")

  avanzeForm!: NgForm;

  isSubmitted: boolean = false;
  post: AvanzeCumplimientoModels = {
    id: 0,
    resumen: '',
    indicadores: '',
    medios: '',
    observacion: '',

  };
  constructor(
    // private avanceCumplimientoHttpService:AvanceCumplimientoHttpService
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private httpProvider: AvanceCumplimientoService
    // private alertService: AlertService
  ) { }





  // avance: AvanceCumplimiento = [4];


  esvacio: Boolean = false;


  ngOnInit(): void {


    this.getAllAvanze();


  }
  ngAfterViewInit() {
    // aqui
  }
  ngOnDestroy() {

  }

  public pdf() {
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

    // var fir =this.reportReport[0].nombres.charAt(0);
    // var ult =this.reportReport[0].nombres.charAt(this.reportReport[0].nombres.length - 1);

    //numeros aleatorios//
    var data = []

    this.doc = new jsPDF('p', 'pt');
    let rows: never[] = [];

    const pageContent = (data: any) => {
      // HEADER
      this.doc.setFontSize(16);
      // this.doc.setFontStyle('bold');
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('INSTITUTO SUPERIOR TECNOLÓGICO', 175, 85);
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
      this.doc.text('CARRERA:', 155, 230);
      this.doc.setFontSize(10);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('TECNOLOGÍA EN DESARROLLO DE SOFTWARE', 215, 230);

      this.doc.setFontSize(11);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('NOMBRE DEL PROYECTO:', 115, 255);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('IMPLEMENTACIÓN DE UN SISTEMA WEB QUE PERMITA DAR A CONOCER LOS SERVICIOS Y PRODUCTOS QUE OFRECE LA FUNDACIÓN NACIONAL DE PARÁLISIS CEREBRAL “FUNAPACE”', 260, 255, { maxWidth: 250, align: 'justify' });

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
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('FUNDACIÓN NACIONAL DE PARÁLISIS CEREBRAL FUNAPACE', 210, 405);


      this.doc.setFontSize(11);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('COORDINADOR(ES) INSTITUCIÓN BENEFICIARIA:', 45, 435);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('DIEGO YANEZ', 320, 435);


      this.doc.setFontSize(11);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('CODIGO DEL PROYECTO:', 45, 465);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('IST Yavirac-VC-DS-002-2023', 190, 465);




      this.doc.setFontSize(16);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Quito-Ecuador', 255, 575);
      this.doc.setFontSize(16);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('MAYO - 2023', 255, 600);

    }
    this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);

    const pageContent2 = (data: any) => {
      // HEADER
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
      this.doc.text('IMPLEMENTACIÓN DE UN SISTEMA WEB QUE PERMITA DAR A CONOCER LOS SERVICIOS Y PRODUCTOS QUE OFRECE LA FUNDACIÓN NACIONAL DE PARÁLISIS CEREBRAL “FUNAPACE”', 45, 200, { maxWidth: 350, align: 'justify' });
      this.doc.line(40, 230, 550, 230);

      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(9);
      this.doc.text('CARRERA:', 45, 240);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('TECNOLOGÍA EN DESARROLLO DE SOFTWARE', 95, 240);
      this.doc.line(40, 250, 550, 250);

      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(9);
      this.doc.text('CICLO:', 45, 260);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Estudiantes de la carrera de Desarrollo de Software de 4to Y 5to semestre y egresados', 75, 260, { maxWidth: 250, align: 'justify' });
      this.doc.line(40, 275, 550, 275);


      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(9);
      this.doc.text('COBERTURA Y LOCALIZACION:', 45, 295);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Barrio: LA MOYA Calle: JOSE PLACIDO CAAMAÑO Número: S7-136 Intersección: ESPEJO Número de oficina: PB Número de piso: 0 Referencia: JUNTO AL HOGAR DE TRÁNSITO DE MUJERES', 200, 285, { maxWidth: 345, align: 'justify' });
      this.doc.line(40, 315, 550, 315);

      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(9);
      this.doc.text('PLAZO DE EJECUCION:', 45, 340);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('3 años', 200, 340, { maxWidth: 345, align: 'justify' });
      this.doc.line(40, 355, 550, 355);


      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(9);
      this.doc.text('PLAZO DE EJECUCION:', 45, 340);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('3 años', 200, 340, { maxWidth: 345, align: 'justify' });
      this.doc.line(40, 355, 550, 355);
      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(9);
      this.doc.text('FECHA PRESENTACIÓN:', 45, 375);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('05/10/2023', 200, 375, { maxWidth: 345, align: 'justify' });

      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(9);
      this.doc.text('FECHA INICIO:', 250, 375);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('05/10/2023', 325, 375, { maxWidth: 345, align: 'justify' });

      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(9);
      this.doc.text('FECHA FIN:', 385, 375);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('05/10/2023', 450, 375, { maxWidth: 345, align: 'justify' });

      this.doc.line(40, 390, 550, 390);

    }




    this.doc.autoTable({
      addPageContent: pageContent,

    })


    this.doc.autoTable({
      addPageContent: pageContent2,

      head: [['Name', 'Email', 'Country']],

      body: [
        ['David', 'david@example.com', 'Sweden'],
        ['Castille', 'castille@example.com', 'Spain'],
        // ...
      ],
      startY: 1100,
      // Default for all columns
      styles: { overflow: 'ellipsize', cellWidth: 'wrap' },
      // Override the default above for the text column
      columnStyles: { text: { cellWidth: 'auto' } },

    })
    var requiredPages = 4
    for (var i = 0; i < requiredPages; i++) {
      this.doc.addPage();
      //doc.text(20, 100, 'Some Text.');
    }
    this.doc.save("table.pdf");




  }



  public pdf_convenio() {
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

    // var fir =this.reportReport[0].nombres.charAt(0);
    // var ult =this.reportReport[0].nombres.charAt(this.reportReport[0].nombres.length - 1);

    //numeros aleatorios//
    var data = []

    this.doc2 = new jsPDF('p', 'pt');
    let rows: never[] = [];

    const pageContent = (data: any) => {
      // HEADER
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.setFontSize(9);
      this.doc2.text('VC-ISTBJ-2020-002', 250, 165);

      this.doc2.setFont("Roboto", 'bold');
      this.doc2.setFontSize(11);
      this.doc2.text('CONVENIO DE VINCULACIÓN CON LA SOCIEDAD ENTRE EL   ', 155, 210);

      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('INSTITUTO TECNOLOGICO SUPERIOR YAVIRAC', 175, 230);


      this.doc2.setFontSize(11);
      this.doc2.text('Y', 275, 245);
      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('UNIVERSIDAD DE LAS FUERZAS ARMADAS ESPEF ', 155, 255);

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Comparecen a la celebración del presente Convenio, por una parte el INSTITUTO TECNOLÓGICO SUPERIOR XXXXXXXXX, legalmente representado por el XXXXXXXXXXXXX, en su calidad de Rector, de conformidad con lo establecido en la Resolución No. XXXXX y Acción de Personal No. Xxx de xx de xxx de xxx; delegado del Secretario de Educación Superior, Ciencia, Tecnología e Innovación, para suscribir el presente instrumento conforme al Acuerdo No. 2020-048 de 15 de mayo de 2020, , a quien en adelante para los efectos del presente instrumento se denominará “INSTITUTO”; y, por otra parte la empresa XXXXXXXXXXXXXXXXXXX con RUC No. XXXXXXXXXXX, representada legalmente por XXXXXXXXX en calidad de Gerente General a quien en adelante y para los efectos del presente instrumento se denominará “ENTIDAD RECEPTORA”', 110, 285, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Las partes libre y voluntariamente, acuerdan celebrar el presente convenio al tenor de las siguientes cláusulas: ', 110, 425, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('CLÁUSULA PRIMERA.- ANTECEDENTES:', 110, 450);

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('1.  El artículo 26 de la Constitución de la República del Ecuador determina: “La educación es un derecho de las personas a lo largo de la vida y un deber ineludible e inexcusable del Estado. Constituye un área prioritaria de la política pública y de la inversión estatal, garantía de la igualdad e inclusión social y condición indispensable para el buen vivir; las personas, la familia y la sociedad tienen el derecho y la responsabilidad de participar en el proceso educativo”;', 115, 470, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('2.  El artículo 28 de la Carta Suprema establece: “La educación responderá al interés público y no estará al servicio de intereses individuales y corporativos. Se garantizará el acceso universal, permanencia, movilidad y egreso sin discriminación alguna y la obligatoriedad en el nivel inicial, básico y bachillerato o su equivalente. Es derecho de toda persona y comunidad interactuar entre culturas y participar en una sociedad que aprende. El Estado promoverá el diálogo intercultural en sus múltiples dimensiones. El aprendizaje se desarrollará de forma escolarizada y no escolarizada. La educación pública será universal y laica en todos sus niveles, y gratuita hasta el tercer nivel de educación superior inclusive”;', 115, 550, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('3.  El artículo 350 de la Constitución establece que: “El sistema de educación superior tiene como finalidad la formación académica y profesional con visión científica y humanista; la investigación científica y tecnológica; la innovación, promoción, desarrollo y difusión de los saberes y las culturas; la construcción de soluciones para los problemas del país, en relación con los objetivos del régimen de desarrollo”;', 115, 670, { maxWidth: 400, align: 'justify' });

    }
    this.doc2.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);

    const pageContent2 = (data: any) => {
      // HEADER
      this.doc2.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
      // this.doc2.line(40, 150, 550, 150);
      // this.doc2.line(40, 150, 40, 650);
      // this.doc2.line(550, 150, 550, 650);
      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('4.  El artículo 352 de la Carta Suprema dispone que: “El sistema de educación superior estará integrado por universidades y escuelas politécnicas; institutos superiores técnicos, tecnológicos y pedagógicos; y, conservatorios de música y artes, debidamente acreditados y evaluados. / Estas instituciones, sean públicas o particulares, no tendrán fines de lucro”;', 115, 150, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('5.  El artículo 13 de la Ley Orgánica de Educación Superior determina como una de las funciones del Sistema de Educación Superior es: “a) Garantizar el derecho a la educación superior mediante la docencia, la investigación y su vinculación con la sociedad, y asegurar crecientes niveles de calidad, excelencia académica y pertinencia;”', 115, 210, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('6.  El artículo 125 de la Ley Orgánica de Educación Superior establece que: “Las instituciones del Sistema de Educación Superior realizarán programas y cursos de vinculación  con las sociedad guiados por el personal académico”.', 115, 265, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('7.  El artículo 182 de la Ley Orgánica Educación Superior dispone que: “La Secretaría de Educación Superior, Ciencia, Tecnología e Innovación, es el órgano que tiene por objeto ejercer la rectoría de la política pública de educación superior y coordinar acciones entre la Función Ejecutiva y las instituciones del Sistema de Educación Superior. Estará dirigida por el Secretario Nacional de Educación Superior, Ciencia, Tecnología e Innovación de Educación Superior, designado por el Presidente de la República. Esta Secretaría Nacional contará con el personal necesario para su funcionamiento”;', 115, 315, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('8.  Artículo 40 del Reglamento de Régimen Académico expedido por el Consejo de Educación Superior mediante Resolución RPC-SE-08-No.023-2022 de 27 de julio de 2022 manifiesta que:” La vinculación con la sociedad hace referencia a la planificación, ejecución y difusión de actividades que garantizan la participación efectiva en la sociedad y la responsabilidad social de las instituciones del Sistema de Educación Superior con el fin de contribuir a la satisfacción de necesidades y la solución de problemáticas del entorno, desde el ámbito académico e investigativo. La vinculación con la sociedad deberá articularse al resto de funciones sustantivas, oferta académica, dominios académicos, investigación, formación y extensión de las IES en cumplimiento del principio de pertinencia. En el marco del desarrollo de la investigación científica o artística de las IES, se considerará como vinculación con la' +
        'sociedad a las actividades de divulgación científica, a los aportes a la mejora y actualización de los planes de desarrollo local, regional y nacional, y a la transferencia de conocimiento y tecnología. La divulgación científica o artística consiste en transmitir resultados, avances, ideas, hipótesis, teorías, conceptos, productos artísticos y en general cualquier actividad científica, artística, tecnológica a la sociedad; utilizando los canales, recursos y lenguajes adecuados para que ésta los pueda comprender y asimilar la sociedad”.', 115, 410, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('9.  El artículo 41 del Reglamento de Régimen Académico establece en lo referente a la “Planificación de la vinculación con la sociedad.- “La planificación de la función de vinculación con la sociedad, podrá estar determinada en las siguientes líneas operativas: a) Educación continua. b) Prácticas preprofesionales; c) Proyectos y servicios especializados; d) Investigación; e) Divulgación y resultados de aplicación de conocimientos científicos o artísticos; f) Ejecución de proyectos de innovación; g) Ejecución de proyectos de servicios comunitarios o sociales; y h) Otras determinadas por la IES en correspondencia con su naturaleza y en ejercicio de su autonomía responsable. Las IES podrán crear instancias institucionales específicas, incorporar personal académico y establecer alianzas estratégicas de cooperación interinstitucional para gestionar la vinculación con la sociedad”.', 115, 630, { maxWidth: 400, align: 'justify' });



    }



    const pageContent3 = (data: any) => {
      // HEADER
      this.doc2.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
      // this.doc2.line(40, 150, 550, 150);
      // this.doc2.line(40, 150, 40, 650);
      // this.doc2.line(550, 150, 550, 650);
      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('10. A través de Acuerdo No. 2012-065, publicado en el Registro Oficial No. 834, de 20 de noviembre de 2012, el Secretario de Educación Superior, Ciencia, Tecnología e Innovación, declaró a: “(…) los institutos superiores técnicos, tecnológicos, pedagógicos, de artes y conservatorios superiores de música públicos, como entidades operativas desconcentradas de la Secretaría de Educación Superior, Ciencia,Tecnología e Innovación (…)”; entre los cuales consta el Instituto Tecnológico Superior de Patrimonio y Turismo Yavirac.', 115, 150, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('11.  A través de Acuerdo No. 2016-118, de 25 de julio de 2016, con su posterior reforma, el Secretario de Educación Superior, Ciencia, Tecnología e Innovación, determinó a favor de los rectores y rectoras de los Institutos Superiores Técnicos, Tecnológicos, Pedagógicos, de Artes y los Conservatorios Superiores Públicos; entre otras atribuciones y obligaciones las siguientes: “Artículo 1.- (…) la suscripción, modificación y extinción de los convenios que tengan por objeto la realización de programas de pasantías y/o prácticas pre profesionales; implementación de carreras de modalidad dual que garanticen la gestión del aprendizaje práctico con tutorías' +
        'profesionales y académicas integrales in situ; uso gratuito de instalaciones para beneficio de institutos públicos; y la implementación de proyectos de vinculación con la sociedad, y/o convenios de cooperación a celebrarse entre los mencionados institutos y las diferentes personas naturales y jurídicas nacionales, con la finalidad fortalecer la educación técnica y tecnológica pública del Ecuador. (…) Artículo 6.- Los rectores y rectoras de los institutos superiores técnicos, tecnológicos, pedagógicos, de artes y conservatorios superiores públicos, usarán obligatoriamente las plantillas de convenios autorizadas por la Coordinación General de Asesoría Jurídica de esta Cartera de Estado para la suscripción de los actos jurídicos mencionados en el artículo 1 del' +
        'presente Acuerdo”;', 115, 250, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('12.  El Instituto Tecnológico Superior de Patrimonio y Turismo Yavirac, ubicado en la provincia de Pichincha es una Institución de Educación Superior Pública con licencia de funcionamiento otorgada mediante Acuerdo No. XXX de fecha xx de xx de xx, conferido por xxxxxxxxxxxxx, que se dedica a la formación de profesionales de nivel tecnológico;', 115, 485, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('13. Mediante acción de personal No. XXXXXXXX, de fecha XX de XXXX, la Secretaría de Educación Superior, Ciencia, Tecnología e Innovación, otorgó el nombramiento al XXXXXXXXXXXXX, portador de la cédula de ciudadanía No. XXXXXXXXXXX en calidad de Rector del Instituto Tecnológico Superior XXXXXXXXXXXX posesionado en sus funciones mediante acto administrativo por el periodo comprendido entre el 20XX y el 20XX.', 115, 550, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('14. El XXXXXXXXXXXXXXXXX, ubicado en la ciudad de xxxxxxxxx, provincia de xxxxxxx, es una Institución de Educación Superior Pública, con licencia de funcionamiento otorgada mediante Acuerdo Nro. Xxx y registro institucionalNro.Xxxxx conferido por el Consejo de Educación Superior CONESUP, que se dedica a la formación de profesionales de nivel tecnológico.;', 115, 650, { maxWidth: 400, align: 'justify' });



    }

    const pageContent4 = (data: any) => {
      // HEADER
      this.doc2.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
      // this.doc2.line(40, 150, 550, 150);
      // this.doc2.line(40, 150, 40, 650);
      // this.doc2.line(550, 150, 550, 650);
      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('15.   Mediante Informe Técnico Académico de Viabilidad para la firma de Convenio No. Xxxxxx de fecha xx de xxxxxxxx de 202x, se concluye que: “Conclusiones y Recomendaciones:”.', 115, 150, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('16.  Mediante memorando No. SENESCYT-xx-2020-xxxxx-M del fecha xx de xxxxxxxxx del 202x8, el xxxxxxxxxx, Coordinador/a Zonal (zonas 1,2,4,5,6,7,8)/ Subsecretario de Formación Técnica y Tecnológica (en el caso de zona 3 y 9), aprueba el Informe Técnico Nro. XXXXXXXXXXXXXX de xx de xxxxxxxxx de 202x, para la suscripción del Convenio entre el XXXXXXXXXXXXXXX y el Instituto Tecnológico Superior XXXXXXXXXXX.', 115, 195, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('17.  Con los antecedentes expuestos, el Instituto Tecnológico Superior xxxxxx y el xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx, acuerdan suscribir el presente convenio referente'+
      'a la implementación de un programa de vinculación con la colectividad que versará'+
      'sobre el proyecto que tiene como objetivo:”xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx”, por parte de las carreras de xxxxxxxxxxxxxxxxxxxxxx.', 115, 290, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('CLÁUSULA SEGUNDA.- OBJETO::', 110, 360);


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Por medio del presente convenio, las partes, en el ámbito de sus competencias, se comprometen a realizar la implementación del proyecto de vinculación con la colectividad'
      +'propuesto por el INSTITUTO, referente a (NOMBRE DEL PROYECTO).', 115,385, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('14. El XXXXXXXXXXXXXXXXX, ubicado en la ciudad de xxxxxxxxx, provincia de xxxxxxx, es una Institución de Educación Superior Pública, con licencia de funcionamiento otorgada mediante Acuerdo Nro. Xxx y registro institucionalNro.Xxxxx conferido por el Consejo de Educación Superior CONESUP, que se dedica a la formación de profesionales de nivel tecnológico.;', 115, 650, { maxWidth: 400, align: 'justify' });



    }

    this.doc2.autoTable({
      addPageContent: pageContent,

    })


    this.doc2.autoTable({
      addPageContent: pageContent2,

      head: [['Name', 'Email', 'Country']],

      body: [
        ['David', 'david@example.com', 'Sweden'],
        ['Castille', 'castille@example.com', 'Spain'],
        // ...
      ],
      startY: 1100,
      // Default for all columns
      styles: { overflow: 'ellipsize', cellWidth: 'wrap' },
      // Override the default above for the text column
      columnStyles: { text: { cellWidth: 'auto' } },

    })
    this.doc2.autoTable({
      addPageContent: pageContent3,
      startY: 2100,

    })


    this.doc2.autoTable({
      addPageContent: pageContent4,
      startY: 3100,

    })
    var requiredPages = 4
    for (var i = 0; i < requiredPages; i++) {
      this.doc2.addPage();
      //doc.text(20, 100, 'Some Text.');
    }
    this.doc2.save("table.pdf");




  }
  public bodyRows(rowCount: any) {
    rowCount = rowCount || 10
    var body = []
    for (var j = 1; j <= rowCount; j++) {
      body.push({
        id: j,
        name: 'jose',
        email: 'joseostaiza  ',
        city: 'quito',
        expenses: 'd',
      })
    }
    return body
  }
  public addAvanze(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      this.httpProvider.addAvanze(this.addAvanzeForm).subscribe(async data => {

        if (data.data.avanze != null && data.data.avanze != null) {
          if (data.status === 'success') {
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        }

      },
        async error => {
          console.log(error.message);

          // setTimeout(() => {
          //   this.router.navigate(['/Home']);
          // }, 500);
        });
    }
  }

  public getAllAvanze() {
    this.httpProvider.getAvanze().subscribe((data: any) => {



      if (data.data.avanzes != null && data.data.avanzes != null) {
        var resultData = data.data.avanzes;
        if (resultData) {
          console.log(resultData);

          this.avanzeList = resultData;
        }
      }
    },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.avanzeList = [];
            }
          }
        }
      });
  }

  public openDeleteModal(id: number) {

    this.idTodelete = id;
  }

  public openUpdateModal(id: number) {
    this.idToupdate = id;

    this.getById(id);

  }
  public getById(id: number) {
    this.httpProvider.getAvanzeById(id).subscribe((data) => {
      console.log(data);

      this.post = data.data.avanze[0];


    });
  }

  public update() {
    this.httpProvider.updateAvanze(this.idToupdate, this.post)
      .subscribe({
        next: (data) => {
          console.log(data);

          window.location.reload();
        },
        error: (err) => {
          console.log(err);
        }
      })
  }
  public delete() {
    this.httpProvider.deleteAvanzeById(this.idTodelete).subscribe((data: any) => {
      console.log(data);
      if (data.status === 'success') {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    },
      (error: any) => { });
  }

}
export class avanzeForm {
  resumen: string = "";
  indicadores: string = "";
  medios: string = "";
  observacion: string = "";
}
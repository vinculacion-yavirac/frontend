import { Component, OnInit } from '@angular/core';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { ImageConstants } from 'src/app/constanst/ImageConstants';
@Component({
  selector: 'app-formulario-final-tutor',
  templateUrl: './formulario-final-tutor.component.html',
  styleUrls: ['./formulario-final-tutor.component.css']
})
export class FormularioFinalTutorComponent implements OnInit {

  public doc: any;


  ngOnInit() {

  }

  /* pdf proyecto*/
  public Generar_Solicitud() {
    this.doc = new jsPDF('p', 'pt');
    this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
    this.doc.setFontSize(14);
    // this.doc.setFontStyle('bold');
    this.doc.setFont("Roboto", 'bold');
    this.doc.text('INSTITUTO SUPERIOR TECNOLÓGICO', 175, 140);
    this.doc.text('D E  T U R I S M O   Y  P A T R I M O N I O', 155, 160);
    this.doc.text('“Y A V I R A C”', 250, 175);
    this.doc.setFontSize(12);
    this.doc.text('Informe de seguimiento y/o final de actividades de vinculación con la comunidad', 95, 210);


    this.doc.setFontSize(9);
    this.doc.line(45, 700, 200, 700);
    this.doc.text('TUTOR PROYECTO', 65, 710);
    this.doc.text('$F{Tutor}', 75, 725, { maxWidth: 100, align: 'center' });

    this.doc.line(250, 700, 375, 700);
    this.doc.text('TUTOR ENTIDAD BENEFICIARIA', 240, 710);
    this.doc.text('$F{rector}', 295, 725, { maxWidth: 100, align: 'center' });

    this.doc.line(450, 700, 550, 700);
    this.doc.text('ESTUDIANTE', 470, 710,);
    this.doc.text('$F{rector}', 475, 725, { maxWidth: 100, align: 'center' });
    this.doc.autoTable({
      html: '#table', startY: 255,
    })
    this.doc.autoTable({
      html: '#table2', startY: 355,
    })
    this.doc.save("Informae_final.pdf");
    // location.reload();
  }


}

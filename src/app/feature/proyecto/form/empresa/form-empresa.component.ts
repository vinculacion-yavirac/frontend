import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from 'src/app/models/proyecto/empresa.models';
import { AvanceCumplimientoService } from 'src/app/service/avanze_cumplimiento/avance-cumplimiento.service';
import { InstitucionBeneficiariaHttpService } from 'src/app/service/institucion-beneficiaria/institucion-beneficiaria-http.service';
import { ProyectoService } from 'src/app/service/proyecto/proyecto.service';

interface Parroquia {
    id: number;
    parroquia: string;
}
interface Canton {
    id: number;
    canton: string;
    parroquias: Parroquia[];
}

interface Provincia {
    id: number;
    provincia: string;
    cantones: Canton[];
}

@Component({ selector: 'app-form-empresa', templateUrl: './form-empresa.component.html', styleUrls: ['./form-empresa.component.css'] })
export class FormEmpresaComponent implements OnInit {
    projectId: number;
    public proyectData: any = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private institucionBeneficiariaHttpService: InstitucionBeneficiariaHttpService,
        private proyectoService: ProyectoService,
        private httpProvider: AvanceCumplimientoService,
        private router: Router,
    ) { }

    provincias = [];
    cantonesMa: Canton[] = [];
    parroquiasMa: Parroquia[] = [];
    cantonesSu: Canton[] = [];
    parroquiasSu: Parroquia[] = [];
    public datos: any;
    public updatedatos: any;

    provinciasMapping: Provincia[] = [
        {
            id: 1,
            provincia: 'AZUAY',
            cantones: [
                {
                    id: 101,
                    canton: 'CUENCA',
                    parroquias: [
                        {
                            id: 10101,
                            parroquia: 'BELLAVISTA'
                        }, {
                            id: 10102,
                            parroquia: 'CAÑARIBAMBA'
                        },
                    ]
                },
            ]
        }, {
            id: 9,
            provincia: 'GUAYAS',
            cantones: [
                {
                    id: 901,
                    canton: 'GUAYAQUIL',
                    parroquias: [
                        {
                            id: 90101,
                            parroquia: 'AYACUCHO'
                        }, {
                            id: 90102,
                            parroquia: 'BOLÍVAR (SAGRARIO)'
                        },
                    ]
                },
            ]
        }, {
            id: 17,
            provincia: 'PICHINCHA',
            cantones: [
                {
                    id: 1701,
                    canton: 'QUITO',
                    parroquias: [
                        {
                            id: 17010,
                            parroquia: 'BELISARIO QUEVEDO'
                        }, {
                            id: 170102,
                            parroquia: 'CARCELÉN'
                        },
                    ]
                },
            ]
        },
    ];

    getCantones(provId: number) {
        return this.provinciasMapping.filter((prov) => prov.id == provId).map((prov) => prov.cantones).flat();
    }

    getParroquias(cantonId: number) {
        return this.provinciasMapping.map((prov) => prov.cantones.filter((canton) => cantonId == canton.id)).flat().map((prov) => prov.parroquias).flat();
    }

    currentEntity: Empresa = {
        empresaId: 0,
        nombreE: '',
        entidadId: 1,
        personaAc: '',
        numRuc: '',
        actividadEc: '',
        correoE: '',
        telfCo: '',
        parroquiaMa: 1,
        provinciaMa: 1,
        cantonMa: 1,
        direccionMa: '',
        parroquiaSu: 1,
        provinciaSu: 1,
        cantonSu: 1,
        direccionSu: '',
        numEE: '',
        totalEE: '',
        lugarU: '',
        beneficiariosDi: '',
        beneficiariosIndi: ''
    };

    empresaForm = this.fb.group({
        nombreE: [
            this.currentEntity.nombreE,
            [Validators.required]
        ],
        personaAc: [
            this.currentEntity.personaAc,
            [Validators.required]
        ],
        naturaleza: this.fb.group(
            {
                naturalezaType: [
                    'publica',
                    [Validators.required]
                ]
            }
        ),
        numRuc: [
            this.currentEntity.numRuc,
            [Validators.required]
        ],
        actividadEc: [
            this.currentEntity.actividadEc,
            [Validators.required]
        ],
        correoE: [
            this.currentEntity.correoE,
            [Validators.required]
        ],
        telfCo: [
            this.currentEntity.telfCo,
            [Validators.required]
        ],
        parroquiaMa: [
            this.currentEntity.parroquiaMa,
            [Validators.required]
        ],
        provinciaMa: [
            this.currentEntity.provinciaMa,
            [Validators.required]
        ],
        cantonMa: [
            this.currentEntity.cantonMa,
            [Validators.required]
        ],
        direccionMa: [
            this.currentEntity.direccionMa,
            [Validators.required]
        ],
        parroquiaSu: [
            this.currentEntity.parroquiaSu,
            [Validators.required]
        ],
        provinciaSu: [
            this.currentEntity.provinciaSu,
            [Validators.required]
        ],
        cantonSu: [
            this.currentEntity.cantonSu,
            [Validators.required]
        ],
        direccionSu: [
            this.currentEntity.direccionSu,
            [Validators.required]
        ],
        numEE: [
            this.currentEntity.numEE,
            [Validators.required]
        ],
        totalEE: [
            this.currentEntity.totalEE,
            [Validators.required]
        ],
        lugarU: [
            this.currentEntity.lugarU,
            [Validators.required]
        ],
        beneficiariosDi: [
            this.currentEntity.beneficiariosDi,
            [Validators.required]
        ],
        beneficiariosIndi: [
            this.currentEntity.beneficiariosIndi,
            [Validators.required]
        ]
    });

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            console.log(params); // { orderby: "price" }
            this.projectId = params['id_proyecto'];
            if (this.projectId) { }
            console.log(this.projectId);
        });
    }

    onSubmit() {
        console.warn(this.empresaForm.value);
        this.datos = {
            'ruc': this.empresaForm.value.numRuc,
            'name': this.empresaForm.value.nombreE,
            'name_gestion': this.empresaForm.value.naturaleza?.naturalezaType,
            'name_autorize_by': this.empresaForm.value.personaAc,
            'activity_ruc': this.empresaForm.value.actividadEc,
            'email': this.empresaForm.value.correoE,
            'phone': this.empresaForm.value.telfCo,
            'address': this.empresaForm.value.correoE,
            'number_students_start': this.empresaForm.value.numEE,
            'number_students_ability': this.empresaForm.value.totalEE,
            'Direct beneficiaries': this.empresaForm.value.beneficiariosDi,
            'Indirect beneficiaries': this.empresaForm.value.beneficiariosIndi,
            'logo': 'logo1.png',
            'state': true,
            'place_location': this.empresaForm.value.lugarU,
            'postal_code': '12345',
            'parish_id': 1,
            'created_by': 5,
            'archived': false,
            'archived_at': '2023-06-09 02:38:10',
            'archived_by': 1
        };
        this.institucionBeneficiariaHttpService.createInstitucionesBeneficiariaBy(this.datos).subscribe(async (data: any) => {
            console.log(data);

            if (data.data.beneficiaryInstitution != null && data.data.beneficiaryInstitution != null) {
                if (data.status === 'success') {
                    setTimeout(() => {
                        var resultData = data.data.beneficiaryInstitution;
                        this.updatedatos = {
                            'beneficiary_institution_id': resultData.id
                        };
                        // this.router.navigate(['/system/proyecto/form-empresa'], { queryParams: { id_proyecto:resultData.id  } });
                        this.proyectoService.updateProyectBeneficiaryInstitution(this.projectId, this.updatedatos).subscribe(async (data: any) => {
                            console.log(data);

                            if (data.data.proyect != null && data.data.proyect != null) {
                                if (data.status === 'success') {
                                    setTimeout(() => {
                                        var resultData = data.data.proyect;
                                        console.log(resultData);

                                        this.router.navigate(['/system/proyecto/form-plan-de-trabajo'], { queryParams: { id_proyecto: resultData.id } });

                                    }, 500);
                                }
                            }
                        }, async (error) => {
                            console.log(error.message);

                            // setTimeout(() => {
                            // this.router.navigate(['/Home']);
                            // }, 500);
                        });
                    }, 500);
                }
            }
        }, async (error) => {
            console.log(error.message);

            // setTimeout(() => {
            // this.router.navigate(['/Home']);
            // }, 500);
        });


    }

    public getAllProyectoById(id: number): void {
        this.httpProvider.getProyectoById(id).subscribe((data: any) => {

            console.log(data);


            if (data.data.projects != null && data.data.projects != null) {
                var resultData = data.data.projects;
                if (resultData) {
                    console.log(resultData);
                    console.log(resultData);


                    this.proyectData = resultData;
                }
            }
        }, (error: any) => {
            if (error) {
                if (error.status == 404) {
                    if (error.error && error.error.message) {
                        this.proyectData = [];
                    }
                }
            }
        });
    }


    onChangeCantonMatriz(cantonId: any) {
        if (cantonId) {
            this.parroquiasMa = this.getParroquias(cantonId.value);
        } else {
            this.parroquiasMa = [];
        }
        this.parroquiaMa?.setValue(0);
    }

    onChangeProvinciaMatriz(provId: any) {
        if (provId) {
            this.cantonesMa = this.getCantones(provId.value);
            this.parroquiasMa = [];
        } else {
            this.cantonesMa = [];
            this.parroquiasMa = [];
        }
        this.cantonMa?.setValue(0);
        this.parroquiaMa?.setValue(0);
    }

    onChangeCantonSucursal(cantonId: any) {
        if (cantonId) {
            this.parroquiasSu = this.getParroquias(cantonId.value);
        } else {
            this.parroquiasSu = [];
        }
        this.parroquiaSu?.setValue(0);
    }

    onChangeProvinciaSucursal(provId: any) {
        if (provId) {
            this.cantonesSu = this.getCantones(provId.value);
            this.parroquiasSu = [];
        } else {
            this.cantonesSu = [];
            this.parroquiasSu = [];
        }
        this.cantonSu?.setValue(0);
        this.parroquiaSu?.setValue(0);
    }

    get nombreE() {
        return this.empresaForm.get('nombreE');
    }
    get personaAc() {
        return this.empresaForm.get('personaAc');
    }
    get naturaleza() {
        return this.empresaForm.get('naturaleza');
    }
    get naturalezaType() {
        return this.naturaleza?.get('naturalezaType');
    }
    get numRuc() {
        return this.empresaForm.get('numRuc');
    }
    get actividadEc() {
        return this.empresaForm.get('actividadEc');
    }
    get correoE() {
        return this.empresaForm.get('correoE');
    }
    get telfCo() {
        return this.empresaForm.get('telfCo');
    }
    get parroquiaMa() {
        return this.empresaForm.get('parroquiaMa');
    }
    get provinciaMa() {
        return this.empresaForm.get('provinciaMa');
    }
    get provincia() {
        return this.provinciaMa?.get('provincia');
    }
    get cantonMa() {
        return this.empresaForm.get('cantonMa');
    }
    get direccionMa() {
        return this.empresaForm.get('direccionMa');
    }
    get parroquiaSu() {
        return this.empresaForm.get('parroquiaSu');
    }
    get provinciaSu() {
        return this.empresaForm.get('provinciaSu');
    }
    get cantonSu() {
        return this.empresaForm.get('cantonSu');
    }
    get direccionSu() {
        return this.empresaForm.get('direccionSu');
    }
    get numEE() {
        return this.empresaForm.get('numEE');
    }
    get totalEE() {
        return this.empresaForm.get('totalEE');
    }
    get lugarU() {
        return this.empresaForm.get('lugarU');
    }
    get beneficiariosDi() {
        return this.empresaForm.get('beneficiariosDi');
    }
    get beneficiariosIndi() {
        return this.empresaForm.get('beneficiariosIndi');
    }
}

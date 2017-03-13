/**
 * Created by Carles on 22/02/2017.
 */
// Importar el núcleo de Angular
import {Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {RestauranteService} from '../services/restaurante.service';
import {Restaurante} from "../model/restaurante";

@Component({
    selector: 'restaurantes-detail',
    templateUrl: '../views/restaurante-detail.html',
    providers: [RestauranteService]
})

export class RestauranteDetailComponent implements OnInit{
    public  restaurante: Restaurante[];
    public status: string;
    public errorMessage: string;
    public loading;

    constructor(
        private _restauranteService: RestauranteService,
        private _route: ActivatedRoute,
        private _router: Router,
    ) { }

    ngOnInit(){
        this.loading ='show';
        this.getRestaurante();
    }

    getRestaurante() {
        this._route.params.forEach((params: Params) => {
            let id = params["id"];
            let random = params["random"];
            this._restauranteService.getRestaurante(id, random)
                .subscribe(                  //petición ajax
                response => {
                    this.restaurante = response.data;  //obtener los datos
                    this.status = response.status;     //los estados
                    if (this.status !== "success") {
                        //alert("error en el servidor");
                        // console.log(this.status);
                        this._router.navigate(["Home"]);
                    }

                    this.loading = 'hide';
                },
                error => {
                    this.errorMessage = <any>error;
                    if (this.errorMessage !== null) {
                        console.log(this.errorMessage);
                        alert("Error en la petición");
                    }
                }
                )
        });

    }
}

// Importar el núcleo de Angular
import {Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {RestauranteService} from '../services/restaurante.service';
import {Restaurante} from "../model/restaurante";

// Decorador components, indicamos en que etiqueta se va a cargar la plantilla
@Component({
    selector: 'restaurantes-list',
    templateUrl: '../views/restaurantes-list.html', //plantilla de inicio
    providers: [RestauranteService]
})

// Clase del componente donde iran los datos y funcionalidades
export class RestaurantesListComponent implements OnInit{
    public titulo = 'listado de restaurantes ';
    public restaurantes:Restaurante[];
    public status;
    public errorMessage;
    public loading;
    public confirmado;

    constructor(
        private _restauranteService: RestauranteService,
        private _route: ActivatedRoute,
        private _router: Router,
    ) { }

    ngOnInit(){
        this.loading ='show';
        this.getRestauntante();
    }

    getRestauntante(){
        this._restauranteService.getRestaurantes()
            .subscribe(                  //petición ajax
                result => {
                    this.restaurantes = result.data;  //obtener los datos
                    this.status = result.status;     //los estados
                    if (this.status !== "success"){
                        alert("error en el servidor");
                        console.log(this.status);
                    }
                    this.loading = 'hide';
                },
                error => {
                    this.errorMessage = <any>error;
                    if (this.errorMessage !== null){
                        console.log(this.errorMessage);
                        alert("Error en la peticion");
                    }
                }
            )
    }
    onBorrarConfirm(id){
        this.confirmado = id;
    }
    onCancelarConfirn(id){
        this.confirmado = null;
    }
    onBorrarRestaurante(id){
        this._restauranteService.deleteRestaurante(id)
            .subscribe(   //petición ajax
                result => {
                    this.status = result.status;     //los estados
                    if (this.status !== "success"){
                        alert("error en el servidor");
                        // console.log(this.status);
                    }
                    this.getRestauntante();
                    this.loading = 'hide';
                },
                error => {
                    this.errorMessage = <any>error;
                    if (this.errorMessage !== null){
                        console.log(this.errorMessage);
                        alert("Error en la peticion");
                    }
                }
            )
    }
}

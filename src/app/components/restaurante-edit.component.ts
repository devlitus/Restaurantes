/**
 * Created by Carles on 10/03/2017.
 */
import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import {RestauranteService} from  '../services/restaurante.service';
import { Restaurante } from '../model/restaurante';

@Component({
    selector: "restaurante-edit",
    templateUrl: '../views/restaurante-add.html',
    providers: [RestauranteService]
})
export  class RestauranteEditComponent implements OnInit{
    public titulo = "Editar restaurante";
    public restaurante : Restaurante;
    public errorMessage: string;
    public status: string;
    public filesToUpload: Array<File>;
    public resultUpload;

    constructor(
        private _restauranteService: RestauranteService,
        private _route: ActivatedRoute,
        private _router: Router,
    ) { }

    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        this.makeFileRerquest("http://localhost/proyectos/slim/restaurantes-api.php/upload-file", [], this.filesToUpload).then((result) => {
            this.resultUpload = result;
            this.restaurante.imagen = this.resultUpload.filename;
            console.log(this.resultUpload.filename);
        }, (error) => {
            console.log(error)
        });
    }

    makeFileRerquest(utl: string, params: Array<string>, files: Array<File>){
        return new Promise((resolve, reject) => {
            var  formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            for (var i = 0; i < files.length; i++){
                formData.append("uploads[]", files[i], files[i].name);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4){
                    if (xhr.status == 200){
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response);
                    }
                }
            }
            xhr.open("POST", utl, true);
            xhr.send(formData);
        });
    }

    onSubmit() {
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];
            this._restauranteService.editRestaurante(id, this.restaurante)
                .subscribe(
                response => {
                    this.status = response.status;
                    if (this.status !== "success") {
                        alert("Error en el servidor");
                    }
                },
                error => {
                    this.errorMessage = <any>error;
                    if (this.errorMessage !== null) {
                        console.log(this.errorMessage);
                        alert("Error en la petición");
                    }
                }
                );
            this._router.navigate(["/"]);
        });

    }
    ngOnInit() {
        this.restaurante = new Restaurante(0,"", "", "", "null", "");
        this.getRestaurante();
    }

    getRestaurante() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._restauranteService.getRestaurante(id)
                .subscribe(                  //petición ajax
                response => {
                    this.restaurante = response.data;  //obtener los datos
                    this.status = response.status;     //los estados
                    if (this.status !== "success") {
                        //alert("error en el servidor");
                        // console.log(this.status);
                        this._router.navigate(["/"]);
                    }

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

    callPrecio(value){
        this.restaurante.precio = value;
    }
}

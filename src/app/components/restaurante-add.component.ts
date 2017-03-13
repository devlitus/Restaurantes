/**
 * Created by Carles on 08/03/2017.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RestauranteService } from '../services/restaurante.service';
import { Restaurante } from '../model/restaurante';

@Component({
    selector: "restaurante-add",
    templateUrl: '../views/restaurante-add.html',
    providers: [RestauranteService]
})
export  class RestauranteAddComponent implements OnInit{
    public titulo = "Añadir restaurante";
    public restaurante : Restaurante;
    public errorMassage: string;
    public status: string;
    public filesToUpload: Array<File>;
    public resultUpload;

    constructor(
        private _restauranteService: RestauranteService,
        private _route: ActivatedRoute,
        private _router: Router
    ) { }

    onSubmit(){
        this._restauranteService.addRestaurante(this.restaurante)
            .subscribe(
                response => {
                    this.status = response.status;
                    if (this.status !== "success"){
                        alert("Error en el servidor");
                    }
                },
                error => {
                    this.errorMassage = <any>error;
                    if (this.errorMassage !== null){
                        console.log(this.errorMassage);
                        alert("Error en la petición");
                    }
                }
            );
        this._router.navigate(["/"]);
    }

    ngOnInit(){
        this.restaurante = new Restaurante(0, "", "", "", "null", "bajo");
        // console.log('Componente RestauranteAdd Cargado');
    }

    callPrecio(value){
        this.restaurante.precio = value;
    }

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
}

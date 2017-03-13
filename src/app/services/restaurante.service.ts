/**
 * Created by Carles on 06/03/2017.
 */
import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import {Restaurante} from '../model/restaurante'

@Injectable()
export class RestauranteService {
    constructor(private _http:Http){
    }
    getRestaurantes(){
    return this._http.get("http://localhost/proyectos/slim/restaurantes-api.php/restaurantes") //peticion json de la api-res
        .map(res => res.json()); //recoger los datos de la peticion con la funcion json()
    }
    getRestaurante(id: string, random = null){
        if (random == null){
            //acabado en el nombre de la url + el id pasado por parametro
            return this._http.get("http://localhost/proyectos/slim/restaurantes-api.php/restaurante/"+id) //peticion json de la api-res
                .map(res => res.json()); //recoger los datos de la peticion con la funcion json()
        }else{
            return this._http.get("http://localhost/proyectos/slim/restaurantes-api.php/random-restaurante") //peticion json de la api-res
                .map(res => res.json()); //recoger los datos de la peticion con la funcion json()
        }

    }
    addRestaurante(restaurante: Restaurante){
        let json = JSON.stringify(restaurante);
        let param = "json="+json;
        let headers = new Headers({"Content-type": "application/x-www-form-urlencoded"});
        return this._http.post("http://localhost/proyectos/slim/restaurantes-api.php/restaurantes", param, {headers:headers}).map(res => res.json());
    }
    editRestaurante(id:string, restaurante: Restaurante){
        let json = JSON.stringify(restaurante);
        let param = "json="+json;
        let headers = new Headers({"Content-type": "application/x-www-form-urlencoded"});
        return this._http.post("http://localhost/proyectos/slim/restaurantes-api.php/update-restaurante/"+id, param, {headers:headers}).map(res => res.json());
    }
    deleteRestaurante(id: string){
        return this._http.get("http://localhost/proyectos/slim/restaurantes-api.php/delete-restaurante/"+id)
            .map(res => res.json());
    }
}
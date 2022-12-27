import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpUtilService } from 'src/app/shared/services/http-util.service';
import { map, catchError, retryWhen, delay, take } from 'rxjs/operators';
import { Routes } from '../models/routes';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private API_URL = environment.URL;


  constructor(private http: HttpClient, private httpUtil: HttpUtilService) { }

  getRoutes() {
    return this.http.get(this.API_URL + 'route')
      .pipe(map(this.httpUtil.extrairDados))
      .pipe(
        retryWhen(errors => errors.pipe(delay(1000), take(10))),
        catchError(this.httpUtil.processarErros));
  }

  createRoutes(routes:Routes) {
    routes.numberOfStops = Number(routes.numberOfStops);
    return this.http.post(this.API_URL + `route`, routes)
      .pipe(map(this.httpUtil.extrairDados))
      .pipe(
        retryWhen(errors => errors.pipe(delay(1000), take(10))),
        catchError(this.httpUtil.processarErros));
  }

  updateRoutes(routes: Routes) {
    return this.http.put(this.API_URL + `route/${routes.id}`, routes)
      .pipe(map(this.httpUtil.extrairDados))
      .pipe(
        retryWhen(errors => errors.pipe(delay(1000), take(10))),
        catchError(this.httpUtil.processarErros));
  }

  deleteRoutes(id: Number) {
    return this.http.delete(this.API_URL + 'route/' + id)
      .pipe(map(this.httpUtil.extrairDados))
      .pipe(
        retryWhen(errors => errors.pipe(delay(1000), take(3))),
        catchError(this.httpUtil.processarErros));
  }

  getRoutesById(id: Number) {
    return this.http.get(this.API_URL + 'route/' + id)
      .pipe(map(this.httpUtil.extrairDados))
      .pipe(
        retryWhen(errors => errors.pipe(delay(1000), take(10))),
        catchError(this.httpUtil.processarErros));
  }
}

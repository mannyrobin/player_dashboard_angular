import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilService } from '../../../../../services/util/util.service';
import { IdentifiedObject } from '../../../base/identified-object';
import { DiscriminatorPageContainer } from '../../../bean/discriminator-page-container';
import { PageContainer } from '../../../bean/page-container';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly _restApiOptions = {
    headers: new HttpHeaders({Accept: 'application/json'}),
    withCredentials: true
  };

  constructor(private _httpClient: HttpClient,
              private _utilService: UtilService) {
  }

  public get<T = any>(url: string, params?: HttpParams): Observable<T> {
    const options = this._utilService.clone(this._restApiOptions);
    (options as any).params = params;
    return this._httpClient.get<T>(url, options);
  }

  public put<T = any>(url: string, body: any): Observable<T> {
    return this._httpClient.put<T>(url, body, this._restApiOptions);
  }

  public post<T = any>(url: string, body?: any): Observable<T> {
    return this._httpClient.post<T>(url, body, this._restApiOptions);
  }

  public delete<T = any>(url: string, params?: HttpParams): Observable<T> {
    const options = this._utilService.clone(this._restApiOptions);
    (options as any).params = params;
    return this._httpClient.delete<T>(url, options);
  }

  public getHttpParamsFromObject<T extends object>(obj: T): HttpParams | null {
    if (!obj) {
      return null;
    }
    let httpParams = new HttpParams();
    for (const item of Object.keys(obj)) {
      httpParams = httpParams.set(item, obj[item]);
    }
    return httpParams;
  }

  public mapObject<T>(classObj: Type<T>, obj: T): T {
    if (obj && (obj as any).discriminator) {
      return this._utilService.plainDiscriminatorObjectToClass(classObj, obj);
    }
    return plainToClass(classObj, obj);
  }

  //#region CRUD

  public getValue<T, Q extends object>(classObj: Type<T>, url: string, query?: Q): Observable<T> {
    return this.get(url, this.getHttpParamsFromObject(query)).pipe(
      map(x => this.mapObject(classObj, x))
    );
  }

  public getValues<T, Q extends object>(classObj: Type<T>, url: string, query?: Q): Observable<T[]> {
    return this.get(url, this.getHttpParamsFromObject(query)).pipe(
      map((values: T[]) => {
        const items: T[] = [];
        for (let i = 0; i < values.length; i++) {
          items.push(this.mapObject(classObj, values[i]));
        }
        return items;
      })
    );
  }

  public getPageContainer<T, Q extends object>(classObj: Type<T>, url: string, query?: Q): Observable<PageContainer<T>> {
    return this.get(url, this.getHttpParamsFromObject(this._utilService.clone(query, {excludeNullable: true}))).pipe(
      map((value: PageContainer<T>) => {
          let obj = new PageContainer<T>(classObj);
          if (value.list.length) {
            if ((value.list[0] as any).discriminator) {
              obj = new DiscriminatorPageContainer<T>(classObj) as any;
            }
          }
          return plainToClassFromExist(obj, value) as any;
        }
      ));
  }

  public createValue<T>(classObj: Type<T>, url: string, value?: T | any): Observable<T | T[]> {
    return this.post(url, value).pipe(
      map(x => this.mapObject(classObj, x))
    );
  }

  public updateValue<T>(classObj: Type<T>, url: string, value?: T | any): Observable<T | T[]> {
    return this.put(url, value).pipe(
      map(x => this.mapObject(classObj, x))
    );
  }

  public saveValue<T extends IdentifiedObject>(classObj: Type<T>, url: string, value: T): Observable<T> {
    if (value.id) {
      return this.updateValue(classObj, `${url}/${value.id}`, value) as Observable<T>;
    }
    return this.createValue(classObj, url, value) as Observable<T>;
  }

  public removeValue<T extends object>(classObj: Type<T>, url: string, query?: object, body?: object): Observable<T | T[]> {
    const options = this._utilService.clone(this._restApiOptions);
    (options as any).params = this.getHttpParamsFromObject(query);
    if (body) {
      (options as any).body = this._utilService.clone(body);
    }
    return this._httpClient.delete<T>(url, options).pipe(
      map(x => this.mapObject(classObj, x))
    );
  }

  //#endregion

}

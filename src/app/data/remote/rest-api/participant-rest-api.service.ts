import { Injectable } from '@angular/core';
import { IRestMethod, IRestMethodStrict, Rest, RestAction, RestHandler, RestParams, RestRequestMethod } from 'rest-core';
import { Session } from '../model/session';
import { Auth } from '../model/auth';
import { PageContainer } from '../bean/page-container';
import { Country } from '../model/country';
import { Region } from '../model/region';
import { City } from '../model/city';
import { User } from '../model/user';
import { VerificationRequest } from '../model/verification-request';
import { IdentifiedObject } from '../base/identified-object';
import { Person } from '../model/person';
import { QueryParams } from './query-params';
import { UserRole } from '../model/user-role';
import { ListRequest } from '../request/list-request';
import { SportType } from '../model/sport-type';
import { HttpClient } from '@angular/common/http';
import { Picture } from '../model/picture';
import { Address } from '../model/address';
import { PersonAnthropometry } from '../model/person-anthropometry';
import { EmailRequest } from '../request/email-request';
import { PageQuery } from './page-query';
import { environment } from '../../../../environments/environment';
import { AnthropometryRequest } from '../request/anthropometry-request';
import { GroupType } from '../model/group/base/group-type';
import { Group } from '../model/group/base/group';
import { GroupQuery } from './query/group-query';
import { ImageQuery } from './query/image-query';

export const RestUrl = environment.production ? 'http://80.93.49.48/sp/v2' : 'http://localhost:8082';

@Injectable()
@RestParams({
  url: RestUrl,
  withCredentials: true
})
export class ParticipantRestApiService extends Rest {

  //#region Auth

  @RestAction({
    method: RestRequestMethod.Post,
    path: '/auth'
  })
  login: IRestMethod<Auth, Session>;

  @RestAction({
    method: RestRequestMethod.Delete,
    path: '/auth'
  })
  logout: IRestMethod<void, void>;

  //#endregion

  //#region User

  //#region GET

  @RestAction({
    method: RestRequestMethod.Get,
    path: '/sporttype'
  })
  getSportTypes: IRestMethod<void, SportType[]>;

  @RestAction({
    method: RestRequestMethod.Get,
    path: '/user/{!id}'
  })
  getUser: IRestMethod<IdentifiedObject, User>;

  @RestAction({
    method: RestRequestMethod.Get,
    path: '/user/{!id}/role'
  })
  getUserRolesByUser: IRestMethod<QueryParams, UserRole[]>;

  @RestAction({
    method: RestRequestMethod.Get,
    path: '/userRole'
  })
  getUserRoles: IRestMethod<void, UserRole[]>;

  //#endregion

  //#region POST

  @RestAction({
    method: RestRequestMethod.Post,
    path: '/user'
  })
  createUser: IRestMethod<User, User>;

  @RestAction({
    method: RestRequestMethod.Post,
    path: '/user/verification'
  })
  verification: IRestMethod<VerificationRequest, void>;

  @RestAction({
    method: RestRequestMethod.Post,
    path: '/user/password/reset'
  })
  resetPassword: IRestMethod<EmailRequest, void>;

  @RestAction({
    method: RestRequestMethod.Post,
    path: '/user/role'
  })
  changeRoles: IRestMethod<ListRequest<IdentifiedObject>, UserRole[]>;

  //#endregion

  //#endregion

  //#region Person

  //#region GET

  @RestAction({
    method: RestRequestMethod.Get,
    path: '/person/filter?from={!from}&count={!count}'
  })
  getPersonsPage: IRestMethod<PageQuery, PageContainer<Person>>;

  @RestAction({
    method: RestRequestMethod.Get,
    path: '/person/{!id}/sporttype'
  })
  getPersonSportTypes: IRestMethod<QueryParams, SportType[]>;

  @RestAction({
    method: RestRequestMethod.Get,
    path: '/person/{!id}'
  })
  getPerson: IRestMethod<QueryParams, Person>;

  @RestAction({
    method: RestRequestMethod.Get,
    path: '/person/{!id}/address'
  })
  getPersonAddress: IRestMethod<QueryParams, Address>;

  @RestAction({
    method: RestRequestMethod.Get,
    path: '/person/{!id}/anthropometry'
  })
  getAnthropometry: IRestMethod<QueryParams, PersonAnthropometry[]>;

  //#endregion

  //#region POST

  @RestAction({
    method: RestRequestMethod.Post,
    path: '/person'
  })
  createPerson: IRestMethod<Person, Person>;

  @RestAction({
    method: RestRequestMethod.Post,
    path: '/person/sporttype'
  })
  changeSportTypes: IRestMethod<ListRequest<IdentifiedObject>, SportType[]>;

  @RestAction({
    method: RestRequestMethod.Post,
    path: '/person/anthropometry'
  })
  changeAnthropometry: IRestMethod<AnthropometryRequest, PersonAnthropometry[]>;

  //#endregion

  //#region PUT

  @RestAction({
    method: RestRequestMethod.Put,
    path: '/person/{!id}'
  })
  updatePerson: IRestMethodStrict<Person, QueryParams, void, Person>;

  //#endregion

  //#endregion

  //#region Country

  @RestAction({
    method: RestRequestMethod.Get,
    path: '/country/filter?from={!from}&count={!count}&name={!name}',
  })
  getCountries: IRestMethod<QueryParams, PageContainer<Country>>;

  @RestAction({
    method: RestRequestMethod.Get,
    path: '/region/filter?countryId={!countryId}&count={!count}'
  })
  getRegions: IRestMethod<QueryParams, PageContainer<Region>>;

  @RestAction({
    method: RestRequestMethod.Get,
    path: '/city/filter?from={!from}&count={!count}&regionId={!regionId}&name={!name}'
  })
  getCities: IRestMethod<QueryParams, PageContainer<City>>;

  //#endregion

  //#region Group

  @RestAction({
    method: RestRequestMethod.Get,
    path: '/groupType',
  })
  getGroupTypes: IRestMethod<void, GroupType[]>;

  @RestAction({
    method: RestRequestMethod.Get,
    path: '/group/filter',
  })
  getGroups: IRestMethod<GroupQuery, PageContainer<Group>>;

  @RestAction({
    method: RestRequestMethod.Post,
    path: '/group',
  })
  postGroup: IRestMethod<Group, Group>;

  //#endregion

  //#region Image

  getImageUrl(imageQuery: ImageQuery): string {
    let url = `${RestUrl}/picture/download?clazz=${imageQuery.clazz}&id=${imageQuery.id}&type=${imageQuery.type}`;
    if (imageQuery.full != null) {
      url += `&full=${imageQuery.full}`;
    }
    return url;
  }

  uploadPicture(file: File, picture: Picture): Promise<Picture> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('picture', new Blob([JSON.stringify(picture)], {type: 'application/json'}));
    return this.http.post<Picture>(`${RestUrl}/picture/upload`, formData, {withCredentials: true})
      .toPromise();
  }

  //#endregion

  constructor(restHandler: RestHandler,
              private http: HttpClient) {
    super(restHandler);
  }

}

import {ParticipantRestApiService} from '../../../remote/rest-api/participant-rest-api.service';
import {AppModule} from '../../../../app.module';
import {Input} from '@angular/core';

export class BaseViewModel<T> {

  participantRestApiService: ParticipantRestApiService;

  @Input()
  public data: T;
  public url: string;

  constructor(data: T) {
    this.participantRestApiService = AppModule.injector.get(ParticipantRestApiService);

    this.update(data);
  }

  public update(data: T) {
    this.data = data;
  }

  public initialize() {
  }

}

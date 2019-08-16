import {Exclude, Type} from 'class-transformer';
import {Event} from '../model/event/event';
import {EventType} from '../model/event/base/event-type';
import {Training} from '../model/event/training';
import {Testing} from '../model/event/testing';
import {Game} from '../model/event/game';
import {Competition} from '../model/event/competition';
import {Relaxation} from '../model/event/relaxation';
import {Diet} from '../model/event/diet';
import {Meeting} from '../model/event/meeting';
import {Education} from '../model/event/education';
import {GroupNotification} from '../model/notification/group/group-notification';
import {NotificationType} from '../model/notification/base/notification-type';
import {SubgroupNotification} from '../model/notification/subgroup/subgroup-notification';
import {GroupConnectionNotification} from '../model/notification/group/connection/group-connection-notification';
import {EventNotification} from '../model/notification/event/event-notification';
import {EventPollNotification} from '../model/notification/event/poll/event-poll-notification';
import {GroupContractService} from '../model/group/contract/group-contract-service';
import {GroupContractType} from '../model/group/contract/group-contract-type';
import {GroupContractJob} from '../model/group/contract/group-contract-job';


export class DiscriminatorObject {

  // TODO: Parsing by discriminator
  @Type(options => (options.newObject as DiscriminatorObject)._type, {
    discriminator: {
      property: 'discriminator',
      subTypes: [
        //region Event
        {value: Event, name: EventType.EVENT},
        {value: Training, name: EventType.TRAINING},
        {value: Testing, name: EventType.TESTING},
        {value: Game, name: EventType.GAME},
        {value: Competition, name: EventType.COMPETITION},
        {value: Relaxation, name: EventType.RELAXATION},
        {value: Diet, name: EventType.DIET},
        {value: Meeting, name: EventType.MEETING},
        {value: Education, name: EventType.EDUCATION},
        //endregion
        //region Notification
        {value: GroupNotification, name: NotificationType.GROUP},
        {value: SubgroupNotification, name: NotificationType.SUBGROUP},
        {value: GroupConnectionNotification, name: NotificationType.GROUP_CONNECTION},
        {value: EventNotification, name: NotificationType.EVENT},
        {value: EventPollNotification, name: NotificationType.EVENT_POLL},
        //endregion
        //region GroupContract
        {value: GroupContractService, name: GroupContractType.SERVICE},
        {value: GroupContractJob, name: GroupContractType.JOB}
        //endregion
      ],
    },
    keepDiscriminatorProperty: true
  })
  public obj: any;

  @Exclude()
  private readonly _type: Function;

  constructor(type: Function) {
    this._type = type;
  }

}

import {BaseEvent} from './base/base-event';
import {EventType} from './base/event-type';

export class Testing extends BaseEvent {
  constructor() {
    super();
    this.discriminator = EventType.TESTING;
  }
}

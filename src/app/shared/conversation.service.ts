import {Injectable, OnDestroy} from '@angular/core';
import {ParticipantStompService} from '../data/remote/web-socket/participant-stomp.service';
import {Subject} from 'rxjs/Subject';
import {ISubscription} from 'rxjs/Subscription';
import {MessageWrapper} from '../data/remote/bean/wrapper/message-wrapper';
import {IntegerWrapper} from '../data/remote/bean/wrapper/integer-wrapper';
import {Participant} from '../data/remote/model/chat/participant';
import {Message} from '../data/remote/model/chat/message/message';

@Injectable()
export class ConversationService implements OnDestroy {

  public readonly messageCreateHandle: Subject<MessageWrapper>;
  public readonly messageUpdateHandle: Subject<MessageWrapper>;
  public readonly messageDeleteHandle: Subject<MessageWrapper>;
  public readonly messageReadHandle: Subject<Message>;

  public readonly unreadTotalHandle: Subject<IntegerWrapper>;
  public readonly typingHandle: Subject<Participant>;

  public readonly errorHandle: Subject<any>;

  private _messageCreateSubscription: ISubscription;
  private _messageUpdateSubscription: ISubscription;
  private _messageDeleteSubscription: ISubscription;
  private _messageReadSubscription: ISubscription;

  private _unreadTotalSubscription: ISubscription;
  private _typingSubscription: ISubscription;
  private _errorSubscription: ISubscription;

  constructor(private _participantStompService: ParticipantStompService) {
    this.messageCreateHandle = new Subject<MessageWrapper>();
    this.messageUpdateHandle = new Subject<MessageWrapper>();
    this.messageDeleteHandle = new Subject<MessageWrapper>();
    this.messageReadHandle = new Subject<Message>();

    this.unreadTotalHandle = new Subject<IntegerWrapper>();
    this.typingHandle = new Subject<Participant>();
    this.errorHandle = new Subject<any>();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  //#region Create

  public messageCreateSubscribe() {
    if (this._messageCreateSubscription) {
      return;
    }

    try {
      this._messageCreateSubscription = this._participantStompService.subscribeConversationCreate()
        .map(message => this._participantStompService.messageToObject<MessageWrapper>(message))
        .subscribe(async message => {
          this.messageCreateHandle.next(message);
        });
    } catch (e) {
    }
  }

  public messageCreateUnsubscribe() {
    if (this._messageCreateSubscription) {
      this._messageCreateSubscription.unsubscribe();
      delete this._messageCreateSubscription;
    }
  }

  //#endregion

  //#region Update

  public messageUpdateSubscribe() {
    if (this._messageUpdateSubscription) {
      return;
    }

    try {
      this._messageUpdateSubscription = this._participantStompService.subscribeConversationUpdate()
        .map(message => this._participantStompService.messageToObject<MessageWrapper>(message))
        .subscribe(async message => {
          this.messageUpdateHandle.next(message);
        });
    } catch (e) {
    }
  }

  public messageUpdateUnsubscribe() {
    if (this._messageUpdateSubscription) {
      this._messageUpdateSubscription.unsubscribe();
      delete this._messageUpdateSubscription;
    }
  }

  //#endregion

  //#region Delete

  public messageDeleteSubscribe() {
    if (this._messageDeleteSubscription) {
      return;
    }

    try {
      this._messageDeleteSubscription = this._participantStompService.subscribeConversationDelete()
        .map(message => this._participantStompService.messageToObject<MessageWrapper>(message))
        .subscribe(async message => {
          this.messageDeleteHandle.next(message);
        });
    } catch (e) {
    }
  }

  public messageDeleteUnsubscribe() {
    if (this._messageDeleteSubscription) {
      this._messageDeleteSubscription.unsubscribe();
      delete this._messageDeleteSubscription;
    }
  }

  //#endregion

  //#region Read

  public messageReadSubscribe() {
    if (this._messageReadSubscription) {
      return;
    }

    try {
      this._messageReadSubscription = this._participantStompService.subscribeConversationRead()
        .map(message => this._participantStompService.messageToObject<Message>(message))
        .subscribe(async message => {
          this.messageReadHandle.next(message);
        });
    } catch (e) {
    }
  }

  public messageReadUnsubscribe() {
    if (this._messageReadSubscription) {
      this._messageReadSubscription.unsubscribe();
      delete this._messageReadSubscription;
    }
  }

  //#endregion

  //#region UnreadTotal

  private unreadTotalSubscribe() {
    if (this._unreadTotalSubscription) {
      return;
    }

    try {
      this._unreadTotalSubscription = this._participantStompService.subscribeConversationUnreadTotal()
        .map(message => this._participantStompService.messageToObject<IntegerWrapper>(message))
        .subscribe(async message => {
          this.unreadTotalHandle.next(message);
        });
    } catch (e) {
    }
  }

  private unreadTotalUnsubscribe() {
    if (this._unreadTotalSubscription) {
      this._unreadTotalSubscription.unsubscribe();
      delete this._unreadTotalSubscription;
    }
  }

  //#endregion

  //#region Typing

  private typingSubscribe() {
    if (this._typingSubscription) {
      return;
    }

    try {
      this._typingSubscription = this._participantStompService.subscribeConversationTyping()
        .map(message => this._participantStompService.messageToObject<Participant>(message))
        .subscribe(async message => {
          this.typingHandle.next(message);
        });
    } catch (e) {
    }
  }

  private typingUnsubscribe() {
    if (this._typingSubscription) {
      this._typingSubscription.unsubscribe();
      delete this._typingSubscription;
    }
  }

  //#endregion

  //#region Error

  private errorSubscribe() {
    if (this._errorSubscription) {
      return;
    }

    try {
      this._errorSubscription = this._participantStompService.subscribeError()
        .subscribe(async message => {
          this.errorHandle.next(message);
        });
    } catch (e) {
    }
  }

  private errorUnsubscribe() {
    if (this._errorSubscription) {
      this._errorSubscription.unsubscribe();
      delete this._errorSubscription;
    }
  }

  //#endregion

  public subscribe() {
    this.errorSubscribe();

    this.messageCreateSubscribe();
    this.messageUpdateSubscribe();
    this.messageDeleteSubscribe();
    this.messageReadSubscribe();
    this.unreadTotalSubscribe();
    this.typingSubscribe();
  }

  public unsubscribe() {
    this.messageCreateUnsubscribe();
    this.messageUpdateUnsubscribe();
    this.messageDeleteUnsubscribe();
    this.messageReadUnsubscribe();
    this.unreadTotalUnsubscribe();
    this.typingUnsubscribe();

    this.errorUnsubscribe();
  }

}

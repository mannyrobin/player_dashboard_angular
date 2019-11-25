import { EducationType } from 'app/data/remote/model/education-type';
import { GroupClaimJoinRequestStateEnum } from 'app/data/remote/model/group/group-claim-join-request-state-enum';
import { Type } from 'class-transformer';
import { BaseGroupPersonType, GroupPersonTypeEnum } from './';
import { GroupPersonTypeClaimState } from './group-person-type-claim-state';

// Член Федерации
export class GroupPersonTypeClaim extends BaseGroupPersonType {

  @Type(() => EducationType)
  public educationType?: EducationType;

  @Type(() => GroupPersonTypeClaimState)
  public claimState: GroupPersonTypeClaimState;

  public joinRequestStateEnum?: GroupClaimJoinRequestStateEnum;
  public email?: string;
  public phone?: string;
  public position?: string;

  // Дата выдачи билета
  @Type(() => Date)
  public ticketIssuedDate: Date;

  constructor() {
    super();
    this.discriminator = GroupPersonTypeEnum.TYPE_CLAIM;
  }

}

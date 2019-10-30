import { IdentifiedObject } from 'app/data/remote/base';
import { GroupPersonClaim } from 'app/data/remote/model/group/person';
import { GroupPersonClaimStateType } from 'app/data/remote/model/group/person/state/group-person-claim-state-type';
import { Type } from 'class-transformer';

export class BaseGroupPersonClaimState extends IdentifiedObject {

  public discriminator: GroupPersonClaimStateType;

  @Type(() => GroupPersonClaim)
  public groupPersonClaim: GroupPersonClaim;

}

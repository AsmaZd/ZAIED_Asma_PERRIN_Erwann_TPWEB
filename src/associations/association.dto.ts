import { ApiProperty } from '@nestjs/swagger';
import { Member } from './association.member';

export class AssociationDTO {
  
  @ApiProperty({
    description: "The ID of the association",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "The name of the association",
    example: "Assoc1",
  })
  name: string;


  @ApiProperty({
    description: "The list of members in the association",
    type: [Member],
  })
  members: Member[];

  /*
  constructor(id: number, name: string, members: Member[]) {
    this.id = id;
    this.name = name;
    this.members = members;
  }
    */
}

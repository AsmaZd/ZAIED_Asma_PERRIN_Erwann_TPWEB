import { ApiProperty } from '@nestjs/swagger';

export class Member {
  @ApiProperty({
    description: "The firstname of the user",
    example: "John",
  })
  firstname: string;

  @ApiProperty({
    description: "The lastname of the user",
    example: "Doe",
  })
  lastname: string;

  @ApiProperty({
    description: "The age of the user",
    example: 29,
  })
  age: number;

  @ApiProperty({
    description: "The role of the user in the association",
    example: "president",
  })
  role: string;

  /*
  constructor(id: number, firstname: string, lastname: string, role: string) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.role = role;
  }
    */
}

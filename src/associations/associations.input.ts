import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/user.entity";
import { arrayBuffer } from "stream/consumers";


export class AssociationInput {

    @ApiProperty({
        description: 'The name of the association',
        example: 'user1 is associated to user2',
        type: String,
    })
    public name: string;

    @ApiProperty({
        description: 'An array of the users that are associated',
        example: '[{id:0, firstname:John, lastname:Doe, age:23, password:motdepasse}, {id:1, firstname:Lena, lastname:Doe, age:21, password:motdepasse}]',
        type: User,
        isArray: true,
    })
    public users: User[];


}
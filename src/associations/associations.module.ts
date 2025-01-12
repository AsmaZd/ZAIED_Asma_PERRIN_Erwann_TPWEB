import { forwardRef, Module } from '@nestjs/common';
import { AssociationsController } from './associations.controller';
import { AssociationService } from './associations.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Association } from './association.entity';
import { Minute } from 'src/minutes/minute.entity';
import { Role } from 'src/roles/role.entity';
import { User } from 'src/users/user.entity';


@Module({
  controllers: [AssociationsController],
  providers: [AssociationService],
  imports: [forwardRef(() => UsersModule) , TypeOrmModule.forFeature([Association, Minute, Role, User])],
  exports: [AssociationService]
})
export class AssociationsModule {}
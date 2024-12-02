import { Module } from '@nestjs/common';
import { AssociationsController } from './associations.controller';
import { AssociationService } from './associations.service';
import { UsersModule } from 'src/users/users.module';


@Module({
  controllers: [AssociationsController],
  providers: [AssociationService],
  imports: [UsersModule]
})
export class AssociationsModule {}
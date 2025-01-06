import { forwardRef, Module } from '@nestjs/common';
import { AssociationsController } from './associations.controller';
import { AssociationService } from './associations.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Association } from './association.entity';
import { Minute } from 'src/minutes/minute.entity';


@Module({
  controllers: [AssociationsController],
  providers: [AssociationService],
  imports: [forwardRef(() => UsersModule) , TypeOrmModule.forFeature([Association, Minute])],
  exports: [AssociationService]
})
export class AssociationsModule {}
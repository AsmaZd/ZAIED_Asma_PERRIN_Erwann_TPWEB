import { Module } from '@nestjs/common';
import { AssociationsController } from './associations.controller';
import { AssociationService } from './associations.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Association } from './association.entity';


@Module({
  controllers: [AssociationsController],
  providers: [AssociationService],
  imports: [UsersModule, TypeOrmModule.forFeature([Association])]
})
export class AssociationsModule {}
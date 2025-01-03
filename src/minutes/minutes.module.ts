import { Module } from '@nestjs/common';
import { MinutesController } from './minutes.controller';
import { MinutesService } from './minutes.service';
import { UsersModule } from 'src/users/users.module';
import { AssociationsModule } from 'src/associations/associations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Minute } from './minute.entity';

@Module({
  controllers: [MinutesController],
  providers: [MinutesService],
  imports: [UsersModule, AssociationsModule, TypeOrmModule.forFeature([Minute])],
  exports: [MinutesService]
})
export class MinutesModule {}

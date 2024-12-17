import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { UsersModule } from 'src/users/users.module';
import { AssociationsModule } from 'src/associations/associations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [UsersModule, AssociationsModule, TypeOrmModule.forFeature([Role])],
  exports: [RolesService]
})
export class RolesModule {}

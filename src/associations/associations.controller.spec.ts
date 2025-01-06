import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Association } from './association.entity'
import { AssociationsController } from './associations.controller';
import { AssociationService } from './associations.service';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
}

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn(entity => entity),
}));

describe('AssociationsController', () => {
  let controller: AssociationsController;
  let service: AssociationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssociationsController],
        providers: [
          AssociationService,
          { provide: getRepositoryToken(Association), useFactory: repositoryMockFactory}
        ]
    }).compile();

      service = module.get<AssociationService>(AssociationService);
    controller = module.get<AssociationsController>(AssociationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  
  /*describe('getAll', () => {
    it('should return an array of associations', async () => {
      const expected = Promise.all([{ 
          id: 0, 
          users: [{id:0, firstname:'John', lastname:'Doe', age:23, password: 'motdepass'}, {id:1, firstname:'Lena', lastname:'Doe', age:21, password:'motpasse'}],
          name: 'user1 associeted user2',
      }]);
      jest.spyOn(service, 'getAllAssociations').mockImplementation(() => expected);
      expect(await controller.getAllAssociations()).toBe(await expected);
    });
  });

  describe('getById', () => {
    it('should return a single association, with the provided id', async () => {
      const expected = await Promise.all([{ 
          id: 0, 
          users: [{id:0, firstname:'John', lastname:'Doe', age:23, password:'motdepass'}, {id:1, firstname:'Lena', lastname:'Doe', age:21, password:'motpasse'}],
          name: 'user1 associeted user2',
      }]);
      jest.spyOn(service, 'getById').mockImplementation(id => {
        return Promise.resolve(expected[id]);
      });

      expect(await controller.getById({id: 0})).toBe(expected[0]);
    })
  });*/

});

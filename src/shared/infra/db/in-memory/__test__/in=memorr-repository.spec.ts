import { Entity } from "../../../../domain/entity";
import { NotFoundError } from "../../../../domain/errors/not-found.error";
import { ValueObject } from "../../../../domain/value-object";
import { Uuid } from "../../../../domain/value-object/uuid.vo";
import { InMemoryRepository } from "../in-memory-repository";

type StubEntityConstructor = {
  entity_id?: Uuid;
  name: string;
  price: number;
}


class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor(props: StubEntityConstructor){
    super();
    this.entity_id = props.entity_id || new Uuid();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      entity_id : this.entity_id.id,
      name: this.name,
      price: this.price,
    }
  }
}


class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...arg: any[]) => StubEntity {
    return StubEntity;
  }
}

describe('InMemoryRepository Unit test', () => {
  let repo: StubInMemoryRepository;

  beforeEach(() => {
    repo = new StubInMemoryRepository();
  });

  test('should insert a new Entity', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 10,
    });

    await repo.insert(entity);
    expect(repo.items).toHaveLength(1);
    expect(repo.items[0]).toBe(entity);
  });

  test('should bulk insert entities', async () => {
    const entities = [
      new StubEntity({
        entity_id: new Uuid(),
        name: 'Test',
        price: 10,
      }),
      new StubEntity({
        entity_id: new Uuid(),
        name: 'Test 2',
        price: 20,
      })
    ];

    await repo.bulkInsert(entities);
    expect(repo.items).toHaveLength(2);
    expect(repo.items[0]).toBe(entities[0]);
    expect(repo.items[1]).toBe(entities[1]);
  });

  test('should return all entities', async () => {
    const entities = [
      new StubEntity({
        entity_id: new Uuid(),
        name: 'Test',
        price: 10,
      }),
      new StubEntity({
        entity_id: new Uuid(),
        name: 'Test 2',
        price: 20,
      })
    ];

    await repo.bulkInsert(entities);

    const result = await repo.findAll();
    expect(result).toStrictEqual(entities);
  });

  test('should throws an error on update when entity not found', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 10,
    });
    expect(repo.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity)
    );
  });

  test('should update an Entity', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 10,
    });

    await repo.insert(entity);

    const entityUpdated = new StubEntity({
      entity_id: entity.entity_id,
      name: 'updated name',
      price: 10,
    });

    await repo.update(entityUpdated);

    expect(entityUpdated.toJSON()).toStrictEqual(repo.items[0].toJSON());
  });

  test('should throws an error on delete when entity not found', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 10,
    });
    expect(repo.delete(entity.entity_id)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity)
    );
  });

  test('should delete an Entity', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 10,
    });
    await repo.insert(entity);

    await repo.delete(entity.entity_id);
    expect(repo.items).toHaveLength(0);
  });
})

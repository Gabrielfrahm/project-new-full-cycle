import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategorySequelizeRepository } from "../category-sequelize.repository";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-object/uuid.vo";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";

describe("Category repository integration test", () => {
  let sequelize;
  let repository: CategorySequelizeRepository;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [CategoryModel]
    });
    await sequelize.sync({force: true});
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  test('should insert a new category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    const model = await CategoryModel.findByPk(category.category_id.id);
    expect(model.toJSON()).toMatchObject({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_activity: category.is_activity,
      created_at: category.created_at,
    });
  });


  test("should finds a category by id", async () => {
    let id = new Uuid();
    let found = await repository.findById(id);
    expect(found).toBeNull();
    const entity = Category.fake().aCategory().withCategoryId(id).build();
    await repository.insert(entity);
    found = await repository.findById(id);
    expect(found.toJSON()).toStrictEqual(entity.toJSON());
  });

  test('should find all categories', async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });

  test('should throw error on update when a entity not found', async () => {
    const entity = Category.fake().aCategory().build();
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.category_id.id, Category)
    );
  });

  test('should update a category', async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);

    entity.changeName('new name');
    await repository.update(entity);

    const entityFound = await repository.findById(entity.category_id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  test('should delete a category', async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);
    await repository.delete(entity.category_id);
    await expect(repository.findById(entity.category_id)).resolves.toBeNull();
  });
})

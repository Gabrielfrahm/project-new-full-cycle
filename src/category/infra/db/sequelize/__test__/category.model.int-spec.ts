import { DataType, Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-object/uuid.vo";

describe('CategoryModel integration test', () => {
  let sequelize;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [CategoryModel]
    });
    await sequelize.sync({force: true});
  });


  test('mapping props', async () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(CategoryModel.getAttributes());
    expect(attributes).toStrictEqual([
      "category_id",
      "name",
      "description",
      "is_activity",
      "created_at",
    ]);

    const categoryIdAttr = attributesMap.category_id;
    expect(categoryIdAttr).toMatchObject({
      field: "category_id",
      fieldName: "category_id",
      primaryKey: true,
      type: DataType.UUID(),
    });

    const categoryNameAttr = attributesMap.name;
    expect(categoryNameAttr).toMatchObject({
      field: "name",
      fieldName: "name",
      type: DataType.STRING(255),
    });

    const categoryDescriptionAttr = attributesMap.description;
    expect(categoryDescriptionAttr).toMatchObject({
      field: "description",
      fieldName: "description",
      type: DataType.TEXT(),
    });

    const categoryCreatedAtAttr = attributesMap.created_at;
    expect(categoryCreatedAtAttr).toMatchObject({
      field: "created_at",
      fieldName: "created_at",
      type: DataType.DATE(3),
    });
  });

  test("should create a category", async () => {
    const arrange = {
      category_id: new Uuid(),
      name: "test",
      description: "test",
      is_activity: true,
      created_at: new Date(),
    }

   const category = await CategoryModel.create(arrange);
   expect(category.toJSON()).toStrictEqual(arrange);
  });
})

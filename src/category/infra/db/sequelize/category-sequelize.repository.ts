import { Entity } from "../../../../shared/domain/entity";
import { SearchParams } from "../../../../shared/domain/repository/search-params";
import { SearchResult } from "../../../../shared/domain/repository/search-result";
import { Uuid } from "../../../../shared/domain/value-object/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { ICategoryRepository } from "../../../domain/category.repository";
import { CategoryModel } from "./category.model";



export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ["name", "created_at"];

  constructor(private categoryModel : typeof CategoryModel){}

  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_activity: entity.is_activity,
      created_at: entity.created_at,
    });
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(entities.map((category) => ({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_activity: category.is_activity,
      created_at: category.created_at,
    })));
  }

  update(entity: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }

  delete(entity_id: Uuid): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
   const model = await this.categoryModel.findByPk(entity_id.id);
   return new Category({
    category_id: new Uuid(model.category_id),
    name: model.name,
    description: model.description,
    is_activity: model.is_activity,
    created_at: model.created_at,
   });
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map((category) => {
      return new Category({
        category_id: new Uuid(category.category_id),
        name: category.name,
        description: category.description,
        is_activity: category.is_activity,
        created_at: category.created_at,
      })
    })
  }

  search(props: SearchParams<string>): Promise<SearchResult<Entity>> {
    throw new Error("Method not implemented.");
  }

  getEntity(): new (...arg: any[]) => Category {
    return Category;
  }

}

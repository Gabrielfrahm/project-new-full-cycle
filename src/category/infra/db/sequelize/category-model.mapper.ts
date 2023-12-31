import { Uuid } from "../../../../shared/domain/value-object/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryModel } from "./category.model";



export class CategoryModelMapper {
  static toModel(entity: Category): CategoryModel {
    return CategoryModel.build({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_activity: entity.is_activity,
      created_at: entity.created_at,
    });
  }

  static toEntity(model: CategoryModel): Category {
    const entity =  new Category({
      category_id: new Uuid(model.category_id),
      name: model.name,
      description: model.description,
      is_activity: model.is_activity,
      created_at: model.created_at,
    });
    Category.validate(entity);
    return entity;
  }
}

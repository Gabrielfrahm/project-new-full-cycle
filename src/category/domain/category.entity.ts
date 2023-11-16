import { Entity } from "../../shared/domain/entity";
import { EntityValidationError } from "../../shared/domain/validators/validation.error";
import { ValueObject } from "../../shared/domain/value-object";
import { Uuid } from "../../shared/domain/value-object/uuid.vo";
import { CategoryValidatorFactory } from "./category.validator";

export type CategoryConstructorProps = {
  category_id?: Uuid;
  name: string;
  description?: string | null;
  is_activity?: boolean;
  created_at?: Date;
}

export type CategoryCreateCommand = {
  name: string;
  description?: string | null;
  is_activity?: boolean;
}

export type CategoryUpdateCommand = {
  name?: string | null;
  description?: string | null;
}

export class Category extends Entity {


  category_id: Uuid;
  name: string;
  description: string | null;
  is_activity: boolean;
  created_at: Date;

  constructor(props :CategoryConstructorProps){
    super();
    this.category_id= props.category_id ?? new Uuid();
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_activity = props.is_activity ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  get entity_id(): ValueObject {
    return this.category_id;
  }


  static create(props: CategoryCreateCommand) : Category {
    const category =  new Category(props)
    this.validate(category);
    return category;
  }

  static validate(entity: Category){
    const validator = CategoryValidatorFactory.create();
    const isValid = validator.validate(entity);
    if(!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  update(props: Partial<CategoryUpdateCommand>): Category {
    const category =  new Category({...this, ...props})
    Category.validate(category);
    return category;
  }

  changeName(name: string):void {
    Category.validate(this)
    this.name = name;
  }

  changeDescription(description: string) : void {
    Category.validate(this)
    this.description = description;
  }

  activate(): void {
    this.is_activity = true;
  }

  deactivate(): void {
    this.is_activity = false;
  }

  toJSON(){
    return {
      category_id: this.category_id.id,
      name: this.name,
      description: this.description,
      is_activity: this.is_activity,
      created_at: this.created_at,
    }
  }
}

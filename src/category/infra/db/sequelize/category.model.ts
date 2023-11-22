import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

export interface CategoryProps {
  category_id: string;
  name: string;
  description: string;
  is_activity: boolean;
  created_at: Date;
}

@Table({tableName:'categories', timestamps: false})
export class CategoryModel extends Model<CategoryProps> {
  @PrimaryKey
  @Column({type: DataType.UUID})
  declare category_id: string;

  @Column({allowNull: false, type: DataType.STRING(255)})
  declare name: string;

  @Column({allowNull: true, type: DataType.TEXT})
  declare description: string | null;


  @Column({allowNull: false, type: DataType.BOOLEAN})
  declare is_activity: boolean;

  @Column({allowNull: false, type: DataType.DATE(3)})
  declare created_at: Date;
}

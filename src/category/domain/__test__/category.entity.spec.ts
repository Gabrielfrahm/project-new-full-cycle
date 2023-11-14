import { Uuid } from "../../../shared/domain/value-object/uuid.vo";
import { Category } from "../category.entity"

describe('Category Unit test', () => {
  let validateSpy : any ;

  beforeEach(() => {
    validateSpy = jest.spyOn(Category, 'validate');
  });

  test('Constructor', () => {
    let category = new Category({
      name: 'Movie',
    });
    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBeNull();
    expect(category.is_activity).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);

    let created_at = new Date();
    category = new Category({
      name: 'Movie',
      description: 'some description',
      is_activity: false,
      created_at
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('some description');
    expect(category.is_activity).toBeFalsy();
    expect(category.created_at).toBe(created_at);

    category = new Category({
      name: 'Movie',
      description: 'some description',
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('some description');
    expect(category.is_activity).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);
  });

  test('create command', () => {
    let category = Category.create({
      name: 'Movie',
    });
    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBeNull();
    expect(category.is_activity).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);
    expect(validateSpy).toHaveBeenCalledTimes(1);

    category = Category.create({
      name: 'Movie',
      description: 'some description',
      is_activity: false,
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('some description');
    expect(category.is_activity).toBeFalsy();
    expect(category.created_at).toBeInstanceOf(Date);
    expect(validateSpy).toHaveBeenCalledTimes(2);

    category = Category.create({
      name: 'Movie',
      description: 'some description',
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('some description');
    expect(category.is_activity).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);
    expect(validateSpy).toHaveBeenCalledTimes(3);
  });

  test('change category name', () => {
    const category = Category.create({name: 'Movie'});
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(category.name).toBe('Movie');
    category.changeName('Another name');
    expect(validateSpy).toHaveBeenCalledTimes(2);
    expect(category.name).toBe('Another name');
  });

  test('change category description', () => {
    const category = Category.create({name: 'Movie', description: 'some description'});
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(category.description).toBe('some description');
    category.changeDescription('Another description');
    expect(validateSpy).toHaveBeenCalledTimes(2);
    expect(category.description).toBe('Another description');
  });

  test('activate category', () => {
    const category = Category.create({name: 'Movie', description: 'some description', is_activity: false});
    expect(category.is_activity).toBeFalsy();
    category.activate();
    expect(category.is_activity).toBeTruthy();
  });

  test('deactivate category', () => {
    const category = Category.create({name: 'Movie', description: 'some description'});
    expect(category.is_activity).toBeTruthy();
    category.deactivate();
    expect(category.is_activity).toBeFalsy();
  });

  describe('category_id field', () => {
    const arrange = [
      {category_id: null},
      {category_id: undefined},
      {category_id: new Uuid()},
    ];

    test.each(arrange)("id = %j", ({category_id}) => {
      const category = new Category({
        name: 'Movie',
        category_id: category_id as any,
      })
      expect(category.category_id).toBeInstanceOf(Uuid);
      if(category_id instanceof Uuid){
        expect(category.category_id).toBe(category_id);
      }
    });

  })

  describe('Category Validator', () => {
    test('should an invalid category with name property', () => {
      expect(() => Category.create({
        name: null
      })).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters"
        ]
      });

      expect(() => Category.create({
        name: ""
      })).containsErrorMessages({
        name: [
          "name should not be empty"
        ]
      });

      expect(() => Category.create({
        name: 5 as any
      })).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters"
        ]
      });

      expect(() => Category.create({
        name: "t".repeat(256)
      })).containsErrorMessages({
        name: [
          "name must be shorter than or equal to 255 characters"
        ]
      });
    })

    test('should an invalid category with description property', () => {
      expect(() => Category.create({
        name: "Movie",
        description: 5 as any
      })).containsErrorMessages({
        description: [
          "description must be a string",
        ]
      });
    })
  })
})

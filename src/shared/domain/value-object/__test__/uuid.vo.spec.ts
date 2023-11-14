import { InvalidUuidError, Uuid } from "../uuid.vo"

describe('UUID vo unit test', () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any , 'validate');
  test('should throw error when uuid is invalid', () => {
    expect(() => {
      new Uuid('Invalid-UUID');
    }).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalled();
  });

  test('should create a valid uuid', () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeDefined();
    expect(validateSpy).toHaveBeenCalled();
  })

  test('should accept a valid uuid ', () => {
    const uuid = new Uuid('8f3cecb5-cf63-4ace-bbb2-f6f285ae0399');
    expect(uuid.id).toBe('8f3cecb5-cf63-4ace-bbb2-f6f285ae0399');
    expect(validateSpy).toHaveBeenCalled();
  })
})

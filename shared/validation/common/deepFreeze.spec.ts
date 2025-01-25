import { deepFreeze } from './deepFreeze';

describe('deepFreeze', () => {
  it('should deeply freeze an object', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
    };

    const frozenObj = deepFreeze(obj);

    expect(Object.isFrozen(frozenObj)).toBe(true);
    expect(Object.isFrozen(frozenObj.b)).toBe(true);
    expect(Object.isFrozen(frozenObj.b.d)).toBe(true);
  });

  it('should not allow modification of a deeply frozen object', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
    };

    const frozenObj = deepFreeze(obj);

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      frozenObj.a = 2;
    }).toThrow(TypeError);

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      frozenObj.b.c = 3;
    }).toThrow(TypeError);

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      frozenObj.b.d.e = 4;
    }).toThrow(TypeError);
  });

  it('should return the same object reference', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
    };

    const frozenObj = deepFreeze(obj);

    expect(frozenObj).toBe(obj);
  });
});

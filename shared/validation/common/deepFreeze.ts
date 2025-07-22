export const deepFreeze = <T extends { [key: string]: any }>(
  object: T,
): Readonly<T> => {
  const propNames = Object.getOwnPropertyNames(object);

  for (const name of propNames) {
    const value = object[name];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    object[name] =
      value && typeof value === 'object' ? deepFreeze(value) : value;
  }

  return Object.freeze(object);
};

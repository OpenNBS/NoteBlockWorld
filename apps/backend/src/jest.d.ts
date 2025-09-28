/// <reference types="jest" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeDefined(): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledWith(...args: any[]): R;
      toHaveBeenCalledTimes(times: number): R;
      toEqual(expected: any): R;
      toThrow(error?: any): R;
      toResolve(): R;
      toReject(): R;
    }
  }
}

export {};

// https://stackoverflow.com/a/21070876/9045426

export type RecordKey = string | number | symbol;

export class TwoWayMap<T extends RecordKey, U extends RecordKey> {
    private map       : Map<T, U>;
    private reverseMap: Map<U, T>;

    constructor(map: Map<T, U>) {
        this.map = map;
        this.reverseMap = new Map<U, T>();

        for (const [key, value] of map.entries()) {
            this.reverseMap.set(value, key);
        }
    }

    get(key: T): U | undefined {
        return this.map.get(key);
    }

    revGet(key: U): T | undefined {
        return this.reverseMap.get(key);
    }
}

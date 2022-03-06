export type Shape = number[];
export function computeSize(shape: Shape): number {
    let length: number = 1;
    for (let i of shape)
        length *= i;
    return length;
}
export function copyArray<T>(src: T[]): T[] {
    return src.map((x) => {return x;});
}
function computeIndex(shape: Shape, indexShape: Shape): number {
    let index: number = 0;
    for (let i = 0; i < indexShape.length; i ++) {
        if (i != shape.length - 1) {
            let amount: number = 0;
            for (let j = 0; j < shape.length - i - 1; j ++) {
                amount *= shape[i + j];
            }
            index += indexShape[i] * amount;
        }
        else {
            index += shape[shape.length - 1];
        }
    }
    return index;
}

export class Tensor {
    private _shape: Shape
    private _elements: number[]

    constructor(shape: Shape) {
        this._shape = copyArray<number>(shape);
        const size = this.size();
        this._elements = new Array(size);
        for (let i = 0; i < size; i ++)
            this._elements[i] = 0;
    }
    public get shape(): Shape {
        return copyArray<number>(this._shape);
    }
    public resize(shape: Shape): void {
        if (this.size() === computeSize(shape))
            this._shape = copyArray<number>(shape);
    }
    public size(): number {
        return computeSize(this._shape);
    }
    public get(shape: Shape): number | null {
        if (this.shape.length != shape.length) return null;
        return this._elements[computeIndex(this.shape, shape)];
    }
    public set(shape: Shape, value: number): void {
        if (this.shape.length != shape.length) return;
        this._elements[computeIndex(this.shape, shape)] = value;
    }


    public static random(shape: Shape): Tensor {
        const t: Tensor = new Tensor(shape);
        for (let i = 0; i < t.size(); i ++)
            t._elements[i] = Math.random();
        return t;
    }
    public static srandom(shape: Shape): Tensor {
        const t: Tensor = new Tensor(shape);
        for (let i = 0; i < t.size(); i ++) {
            if (Math.random() > .5)
                t._elements[i] = Math.random();
            else
                t._elements[i] = -Math.random();
        }
        return t;
    }
    //public static range(shape: Shape): Tensor {}
}




type Shape = number[];
function computeSize(shape: Shape): number {
    let length: number = 1;
    for (let i of shape)
        length *= i;
    return length;
}
function copyArray<T>(src: T[]): T[] {
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
    public resize(shape: Shape): Tensor {
        if (!(this.size() != computeSize(shape))) throw new Error("shape sizes must match");
        const ct: Tensor = Tensor.copy(this);
        ct._shape = shape;
        return ct;
    }
    public size(): number {
        return computeSize(this._shape);
    }
    public get(shape: Shape): number {
        if (this.shape.length != shape.length) throw new Error("invalid shape");
        return this._elements[computeIndex(this.shape, shape)];
    }
    public set(shape: Shape, value: number): void {
        if (this.shape.length != shape.length) return;
        this._elements[computeIndex(this.shape, shape)] = value;
    }
    public isMatrix() {return this.shape.length == 2;}
    public isRowVector() {return this.shape.length == 1;}
    public isColumnVector() {return this.shape.length == 2 && this.shape[0] == 1;}
    public isVector() {return this.isColumnVector() || this.isRowVector();}

    public getMagnitude(): number {
        if (!this.isVector()) throw new Error("tensor must be a vector to get magnitude");
        let sum: number = 0;
        for (let i of this._elements)
            sum += i*i;
        return Math.sqrt(sum);
    }
    public normalise(): Tensor {
        const magnitude: number = this.getMagnitude();
        return Tensor.divv(this, magnitude);
    }



    // static methods
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
    public static range(shape: Shape): Tensor {
        const t: Tensor = new Tensor(shape);
        for (let i = 0; i < t.size(); i ++)
            t._elements[i] = i;
        return t;
    }
    public static fill(shape: Shape, value: number): Tensor {
        const t: Tensor = new Tensor(shape);
        for (let i = 0; i < t.size(); i ++)
            t._elements[i] = value;
        return t;
    }
    public static ones(shape: Shape) {return Tensor.fill(shape, 1);}
    public static zeros(shape: Shape) {return Tensor.fill(shape, 0);}
    public static add(a: Tensor, b: Tensor): Tensor {
        if (a.size() != b.size()) throw new Error("tensor sizes must match");
        const t: Tensor = new Tensor(a.shape);
        for (let i = 0; i < a.size(); i ++)
            t._elements[i] = a._elements[i] + b._elements[i];
        return t;
    }
    public static sub(a: Tensor, b: Tensor): Tensor {
        if (a.size() != b.size()) throw new Error("tensor sizes must match");
        const t: Tensor = new Tensor(a.shape);
        for (let i = 0; i < a.size(); i ++)
            t._elements[i] = a._elements[i] - b._elements[i];
        return t;
    }
    public static mul(a: Tensor, b: Tensor): Tensor {
        if (a.size() != b.size()) throw new Error("tensor sizes must match");
        const t: Tensor = new Tensor(a.shape);
        for (let i = 0; i < a.size(); i ++)
            t._elements[i] = a._elements[i] * b._elements[i];
        return t;
    }
    public static div(a: Tensor, b: Tensor): Tensor {
        if (a.size() != b.size()) throw new Error("tensor sizes must match");
        const t: Tensor = new Tensor(a.shape);
        for (let i = 0; i < a.size(); i ++)
            t._elements[i] = a._elements[i] / b._elements[i];
        return t;
    }
    public static addv(a: Tensor, b: number): Tensor {
        const t: Tensor = new Tensor(a.shape);
        for (let i = 0; i < a.size(); i ++)
            t._elements[i] = a._elements[i] + b;
        return t;
    }
    public static subv(a: Tensor, b: number): Tensor {
        const t: Tensor = new Tensor(a.shape);
        for (let i = 0; i < a.size(); i ++)
            t._elements[i] = a._elements[i] - b;
        return t;
    }
    public static mulv(a: Tensor, b: number): Tensor {
        const t: Tensor = new Tensor(a.shape);
        for (let i = 0; i < a.size(); i ++)
            t._elements[i] = a._elements[i] * b;
        return t;
    }
    public static divv(a: Tensor, b: number): Tensor {
        const t: Tensor = new Tensor(a.shape);
        for (let i = 0; i < a.size(); i ++)
            t._elements[i] = a._elements[i] / b;
        return t;
    }
    public static dot(a: Tensor, b: Tensor): number {
        if (!(a.isVector() && b.isVector()) || a.size() != b.size()) throw new Error("both inputs must be vectors of the same size");
        let length: number = 0;
        for (let i = 0; i < a.size(); i ++)
            length += a._elements[i] * b._elements[i];
        return length;
    }
    public static copy(src: Tensor): Tensor {
        const dst: Tensor = new Tensor(src.shape);
        dst._elements = copyArray<number>(src._elements);
        return dst;
    }
//    public static matmulvec(matrix: Tensor, vec: Tensor): Tensor {
//        if (!matrix.isMatrix()) throw new Error("input1 must be a matrix");
//        if (!vec.isColumnVector()) throw new Error("input2 must be a column vector");
//    }
}






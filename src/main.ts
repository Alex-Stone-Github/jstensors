import * as lib from "./tensor"

const shape: number[] = [3];

const t1: lib.Tensor = lib.Tensor.srandom(shape);
console.log(t1);
const t2: lib.Tensor = lib.Tensor.range(shape).normalise();
console.log(t2);

console.log(lib.Tensor.dot(t1, t2));

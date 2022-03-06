import * as lib from "./tensor"

let t: lib.Tensor = lib.Tensor.random([3, 3]);
console.log(t);
t = lib.Tensor.srandom([3, 3]);
console.log(t);

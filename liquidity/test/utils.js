const BN = require("bn.js");

function cast(x) {
  if (x instanceof BN) {
    return x;
  }
  return new BN(x);
}

function pow(x, y) {
  x = cast(x);
  y = cast(y);
  return x.pow(y);
}


module.exports = {
  pow,
};
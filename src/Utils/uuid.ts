const uuid = function() {
  return ((new Date().getTime() + +Math.random * 30) >>> 0) + "";
};

export default uuid;

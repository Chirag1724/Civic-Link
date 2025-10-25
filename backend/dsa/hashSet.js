class HashSet {
  constructor() { this.set = new Set(); }
  makeKey(type, location){ return type+'::'+location.trim().toLowerCase(); }
  has(type, location){ return this.set.has(this.makeKey(type, location)); }
  add(type, location){ this.set.add(this.makeKey(type, location)); }
}
module.exports = HashSet;

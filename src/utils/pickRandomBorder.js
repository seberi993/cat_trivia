const pickRandomBorder = () => {
  const probs = {
    24: "border-trash",
    45:"border-common",
    79: "border-uncommon",
    89: "border-rare",
    99: "border-epic",
    100: "border-legendary",
  };
  const keys = Object.keys(probs).map(Number);
  const generate = () => {
    const rand = Math.floor(Math.random() * 100);
    const key = keys.find((key) => rand < key);
    return probs[key];
  };

  return generate();
};
export default pickRandomBorder;
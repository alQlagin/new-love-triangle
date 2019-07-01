/**
 * @param preferences - an array of integers. Indices of people, whom they love
 * @returns number of love triangles
 */
module.exports = function getLoveTrianglesCount(preferences = []) {
  const loopsMap = new Map();
  for (let i = 0; i < preferences.length; i++) {
    // for each value in preferences
    let currentIdx = i;
    // create chain
    const chain = [];
    let loopDetected = false;
    // chain building stops when duplicate found
    // currentIdx is found duplicate
    // it defines loop start in chain
    while (!chain.includes(currentIdx)) {
      // stop finding when found known loop root
      if (loopsMap.has(currentIdx)) {
        loopDetected = true;
        break;
      }
      let nextIdx = preferences[currentIdx] - 1;
      chain.push(currentIdx);
      currentIdx = nextIdx;
    }

    if (loopDetected) continue;

    // extract loop from current chain
    let loop = chain.slice(chain.indexOf(currentIdx));

    // to find loop with any length change condition to > 2
    if (loop.length === 3) {
      // normalize loop. this helps detect invariants: [1 -> 2 -> 3], [2 -> 3 -> 1], [3 -> 1 -> 2]
      // [ 1 -> 2 -> 3 ] and [ 1 -> 3 -> 2] are different love triangles 💘💖
      const normalizedLoop = normalizeLoop(loop);

      // add loop to store by loop root
      if (!loopsMap.has(normalizedLoop[0])) {
        loopsMap.set(normalizedLoop[0], normalizedLoop);
      }
    }
  }
  return loopsMap.size;
};

function normalizeLoop(loop = []) {
  const rootValue = Math.min(...loop);
  const rootIdx = loop.indexOf(rootValue);
  return rootIdx === 0 ? loop : [...loop.slice(rootIdx), ...loop.slice(0, rootIdx)];
}

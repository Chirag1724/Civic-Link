// Minimal graph/dijkstra mock for routing between string-labeled nodes.
function dijkstra(nodes, edges, source, target){
  const dist = {};
  const prev = {};
  nodes.forEach(n=>dist[n]=Infinity);
  dist[source]=0;
  const visited = new Set();
  while(true){
    let cur = null;
    let best = Infinity;
    for(const n of nodes){
      if(!visited.has(n) && dist[n]<best){ best = dist[n]; cur = n; }
    }
    if(cur===null) break;
    visited.add(cur);
    const neighbors = edges[cur] || {};
    for(const [nbr, w] of Object.entries(neighbors)){
      if(dist[cur]+w < dist[nbr]){
        dist[nbr] = dist[cur]+w;
        prev[nbr] = cur;
      }
    }
    if(cur===target) break;
  }
  const path = [];
  let cur = target;
  while(cur){
    path.unshift(cur);
    cur = prev[cur];
  }
  return { distance: dist[target], path };
}
module.exports = { dijkstra };

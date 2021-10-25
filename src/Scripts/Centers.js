function newCenter(centers, id) {
  let cen = centers.map((center) => {
    return center;
  });
  cen.push({
    key: id,
    tree: "",
    source: "",
    id: id,
  });
  return cen;
}

function updateCenter(centers, update) {
  return centers.map((center) => {
    if (update.id === center.id) {
      return update;
    }
    return center;
  });
}

function updateCenters(centers, updates) {
  const updateId = updates.map((update) => {
    return update.id;
  });
  let cen = centers.map((center) => {
    if (updateId.includes(center.id)) {
      return updates[updateId.indexOf(center.id)];
    }
    return center;
  });
  return cen;
}

function removeCenter(centers, id) {
  let cen = centers
    .filter((center) => {
      return center.id !== id;
    })
    .map((center) => {
      if (center.id > id) {
        return {
          key: centers.indexOf(center) - 1,
          tree: center.tree,
          source: center.source,
          id: centers.indexOf(center) - 1,
        };
      }
      return center;
    });
  return cen;
}

exports.newCenter = newCenter;
exports.updateCenter = updateCenter;
exports.updateCenters = updateCenters;
exports.removeCenter = removeCenter;

const cardItemRegex = /^item{\d}$/;

function getItemQuantityMap() {
  const itemIds = Object.keys(localStorage);
  const itemQuantityMap = [];

  for (let itemId of itemIds) {
    let item = localStorage.getItem(itemId);

    if (itemId.match(cardItemRegex)) {
      let itemQuantityRecord = {
        id: getItemIdByStrKey(itemId),
        quantity: parseInt(item)
      }
      itemQuantityMap.push(itemQuantityRecord);
    }
  }
  return itemQuantityMap;
}

function getItemIdByStrKey(strKey) {
  let startIndex = strKey.indexOf('{');
  let endIndex = strKey.indexOf('}');
  return parseInt(strKey.substring(startIndex + 1, endIndex));
}

$(document).ready( () => {
  const itemQuantityMap = getItemQuantityMap();

  if (itemQuantityMap.length === 0)
    return;

  const itemIds = [];
  itemQuantityMap.forEach(record => itemIds.push(record.id));

  fetch('/api/shopping-card-items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ ids: itemIds })
  })
    .then(res => { return res.json() })
    .then(menuItems => {
      const htmlItemsList = $('#card-items-list');
      for (let item of menuItems)
        htmlItemsList.append( $(`<li class="list-group-item" id=${item.id}>${item.title}</li>`) );
    });
});




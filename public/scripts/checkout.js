const cardItemRegex = /^item{\d}$/;

function getAllMenuItems() {
  const keys = Object.keys(localStorage);
  let values = [];

  for (let key of keys) {
    let item = localStorage.getItem(key);

    if (key.match(cardItemRegex)) {
      let menuItem = {
        id: getItemIdByStrKey(key),
        quantity: parseInt(item)
      }
      values.push(menuItem);
    }
  }
  return values;
}

function getItemIdByStrKey(localStorageKey) {
  let startIndex = localStorageKey.indexOf('{');
  let endIndex = localStorageKey.indexOf('}');
  let strKey = localStorageKey.substring(startIndex + 1, endIndex);

  return parseInt(strKey);
}

$(document).ready( () => {
  const menuItems = getAllMenuItems();

  let ids = [];
  menuItems.forEach(value => ids.push(value.id));
  const itemsList = $('#card-items-list');

  let itemsData;

  fetch('/api/shopping-card-items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ ids: ids })
    })
      .then(res => {
        return res.json()
    })
      .then(data => {
        for (let item of data) {
          itemsList.append(
              $(`<li class="list-group-item" id=${item.id}>${item.title}</li>`)
          );
        }
      });
  });




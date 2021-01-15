const cardItemRegex = /^item{\d}$/;

function getAllMenuItems() {
  const keys = Object.keys(localStorage);
  let values = [];

  for (let key in keys) {
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
  let strKey = localStorageKey.substring(startIndex + 1, endIndex - 1);

  return parseInt(strKey);
}

$(document).ready( () => {
  const menuItems = getAllMenuItems();
  const itemsList = $('#card-items-list');

  for (let item in menuItems) {
    itemsList.append(
        $(`<li class="list-group-item" id=${item.id}>`)
    );



    );
  }




});

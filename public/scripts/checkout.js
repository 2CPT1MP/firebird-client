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

function capitalize(string) {
   let result = string.trim();
   let firstLetter = result.substr(0,1);
   let remainingStr = result.substr(1);
   return `${firstLetter.toUpperCase() + remainingStr}`;
}


function changeItemQuantityBy(itemRecord, amount, min, max) {
  const itemIdKey = `item{${itemRecord.id}}`;
  let itemQuantity = parseInt(localStorage.getItem(itemIdKey));

  if (itemQuantity + amount >= min && itemQuantity + amount <= max) {
    itemQuantity += amount;
    localStorage.setItem(itemIdKey, itemQuantity.toString());

    let itemFields = {
      price: itemRecord.getElementsByClassName('item-price')[0],
      quantity: itemRecord.getElementsByClassName('item-quantity-span')[0],
      total: itemRecord.getElementsByClassName('item-total')[0]
    }

    itemFields.quantity.innerHTML = itemQuantity;
    itemFields.total.innerHTML = parseInt(itemFields.price.innerHTML) * parseInt(itemFields.quantity.innerHTML);
  }
}

function removeMenuItemById(id) {
  const itemIdKey = `item{${id}}`;

  if (localStorage.getItem(itemIdKey) !== null) {
    localStorage.removeItem(itemIdKey);
    document.getElementById(id).remove();
  }
}


function addButtonListeners() {
  $('.increment').click( function() {
    const itemRecord = this.parentNode.parentNode;
    changeItemQuantityBy(itemRecord, 1, 1, 9);
  });

  $('.decrement').click( function() {
    const itemRecord = this.parentNode.parentNode;
    changeItemQuantityBy(itemRecord, -1, 1, 9);
  });

  $('.remove').click( function() {
    const itemRecord = this.parentNode.parentNode;
    removeMenuItemById(itemRecord.id);
  }) ;
}

function renderCheckoutTable(menuItems) {
  const htmlItemsTable = $('#card-items-table').append(
      `<thead><tr>
            <th class="item-num-h">№</th>
            <th class="title-h"></th>
            <th class="item-price-h">Цена</th>
            <th class="quantity-h"></th>
            <th class="item-total-h"></th>
            <th></th>
          </tr></thead><tbody>
    `);

  let num = 1;
  for (let item of menuItems) {
    item.quantity = localStorage.getItem(`item{${item.id}}`);
    htmlItemsTable.append(
        `<tr id="${item.id}" class="col-1" >
              <td class="item-num">${num++}</td>
              <td>${capitalize(item.title)}</td>
              <td class="item-price">${item.price}</td>
              <td class="item-quantity-td">
                <button type="button" class="btn btn-warning decrement">-</button>
                <span class="item-quantity-span">${item.quantity}</span>
                <button type="button" class="btn btn-success increment">+</button>
              </td>
              <td class="item-total">${(item.price * item.quantity).toFixed(2)}</td>
              <td class="col-1">
                <button type="button" class="btn btn-danger remove">Удалить</button>
                <button type="button" class="btn btn-danger remove remove-sm">х</button>
              </td>
           </tr>
          `
    );
    htmlItemsTable.append('</tbody>')
  }
}

$(document).ready( () => {
  const itemQuantityMap = getItemQuantityMap();
  if (itemQuantityMap.length === 0) return;

  const itemIds = [];
  itemQuantityMap.forEach(record => itemIds.push(record.id));

  fetch('/api/shopping-card-items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ ids: itemIds })
  })
    .then(res => { return res.json() })
    .then(menuItems => {
      renderCheckoutTable(menuItems);
      addButtonListeners();
      $('#orderDataForm').submit( e => submitOrderData(e));
    });
});

async function submitOrderData(e) {
  e.preventDefault();
  let form = document.querySelector('form');
  let formData = new FormData(form);

  let jsonFormData = {};
  formData.forEach((value, key) => {
    jsonFormData[key] = value;
  });

  let response = await fetch('/orders', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({clientData: jsonFormData, itemQuantityMap: getItemQuantityMap()})
  });

  let result = await response.json();
}





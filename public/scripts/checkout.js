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
   result = string.trim();
   firstLetter = result.substr(0,1);
   remainingStr = result.substr(1);

   return `${firstLetter.toUpperCase() + remainingStr}`;
}

function addButtonListeners() {
  $('.increment').click( function() {
    const itemId = this.parentNode.parentNode.id;
    const itemIdKey = `item{${itemId}}`;
    let itemCount = parseInt(localStorage.getItem(itemIdKey));

    if (itemCount + 1 < 10) {
      localStorage.setItem(itemIdKey, (++itemCount).toString());

      const itemRecord = this.parentNode.parentNode;

      const itemPrice = itemRecord.getElementsByClassName('item-price')[0];
      const itemQuantity = this.parentNode.getElementsByClassName('item-quantity-span')[0];
      const itemTotal =  itemRecord.getElementsByClassName('item-total')[0];
      itemQuantity.innerHTML = itemCount;

      console.log(parseInt(itemPrice.innerHTML), parseInt(itemQuantity.innerHTML));
      console.log(itemPrice.innerHTML, );
      itemTotal.innerHTML = parseInt(itemPrice.innerHTML) * parseInt(itemQuantity.innerHTML);

    }
  });

  $('.decrement').click( function() {
    const itemId = this.parentNode.parentNode.id;
    const itemIdKey = `item{${itemId}}`;
    let itemCount = parseInt(localStorage.getItem(itemIdKey));


    if (itemCount - 1 > 0) {
      localStorage.setItem(itemIdKey, (--itemCount).toString());

      const itemRecord = this.parentNode.parentNode;

      const itemPrice = itemRecord.getElementsByClassName('item-price')[0];
      const itemQuantity = this.parentNode.getElementsByClassName('item-quantity-span')[0];
      const itemTotal =  itemRecord.getElementsByClassName('item-total')[0];
      itemQuantity.innerHTML = itemCount;

      console.log(parseInt(itemPrice.innerHTML), parseInt(itemQuantity.innerHTML));
      console.log(itemPrice.innerHTML, );
      itemTotal.innerHTML = parseInt(itemPrice.innerHTML) * parseInt(itemQuantity.innerHTML);

    }
  }) ;

  $('.remove').click( function() {
    const itemId = this.parentNode.parentNode.id;
    const itemIdKey = `item{${itemId}}`;

    if (localStorage.getItem(itemIdKey) !== null) {
      localStorage.removeItem(itemIdKey);
      this.parentNode.parentNode.remove();
    }
  }) ;
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
      const htmlItemsTable = $('#card-items-table');
      htmlItemsTable.append(
          '<tr><th class="item-num-h">№</th>' +
          '<th class="title-h"></th>' +
          '<th class="item-price-h">Цена</th>' +
          '<th class="quantity-h"></th>' +
          '<th class="item-total-h"></th>' +
          '<th></th>'
      );
      let num = 1;

      for (let item of menuItems) {
        item.quantity = localStorage.getItem(`item{${item.id}}`);

        htmlItemsTable.append(
            $(`<tr id="${item.id}">`).append(`
               <td class="item-num">${num++}</td>
               <td>${capitalize(item.title)}</td>
               <td class="item-price">${item.price}</td>
               <td>
                   <button class="btn btn-warning decrement">-</button>
                   <span class="item-quantity-span">${item.quantity}</span>
                   <button class="btn btn-success increment">+</button>
               </td>
               <td class="item-total">${(item.price * item.quantity).toFixed(2)}</td>
               <td>
                   <button class="btn btn-danger remove">Удалить</button>
                   <button class="btn btn-danger remove remove-sm">х</button>
               </td>
            `)
        );
      }
      addButtonListeners();

      $('#order-form').submit( (e) => {
        e.preventDefault();


        //get form data
        let clientInfo = {
          firstName: document.getElementById('firstNameInput').value,
          lastName: document.getElementById('lastNameInput').value,
          middleName: document.getElementById('middleNameInput').value
        }
        let deliveryInfo = {
          address: document.getElementById('addressInput').value,
          type: 'delivery'
        }


        fetch('/orders', {
          method: 'PUT',
          redirect: "follow",
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({ itemQuantityMap: getItemQuantityMap(), clientInfo: clientInfo, deliveryInfo: deliveryInfo})
        })
            .then(res => { return res.json() })
            .then(serverResponse => {
             if (serverResponse.redirected)
               console.log(serverResponse.redirected)
               window.location.href = serverResponse.url;
            });

      });
    });
});




$(document).ready(() => {
  $('.add-item').click(function() {

    const item = {
      id: `item{${this.id}}`,
      quantity: localStorage.getItem(`item{${this.id}}`)
    }

    if (item.quantity === null) {
      localStorage.setItem(item.id, '1');
    } else {
      item.quantity = parseInt(item.quantity) + 1;
      localStorage.setItem(item.id, item.quantity);
    }
  });
});
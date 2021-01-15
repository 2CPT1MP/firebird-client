
$(document).ready(() => {
  $('.add-item').click(function() {
    const id = this.id;
    const quantity = localStorage.getItem('item{' +id + '}');

    if (quantity === null) {
      localStorage.setItem('item{' +id + '}', '1');
    } else {
      const newQuantity = parseInt(quantity) + 1;
      localStorage.setItem('item{' +id +'}', newQuantity.toString())
    }
  });
});
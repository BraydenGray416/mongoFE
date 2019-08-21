let productList = $("#productList")
$.ajax({
  url: `http://localhost:3000/allProducts`,
  type: 'GET',
  dataType: 'json',
  success: function(allProducts){
    if (allProducts.length === 0) {
      productList.append(`There are no products`);
    } else {
      allProducts.map(function(products){
        productList.append(`<li class="list-group-item d-flex justify-content-between align-items-center">${products.name}<div class="row"><button type="button" class="btn btn-info mr-2">Edit</button><button type="button" class="btn btn-danger">Remove</button></div></li>`)
      })
    }
  },
  error: function(){
    console.log("something went wrong");
  }
})



$("#addProduct").click(function(){
  event.preventDefault();
  console.log("button click");
  let productName = $("#productName").val();
  let productPrice = $("#productPrice").val();
  if (productName.length === 0) {
    console.log("error you need to input a name");
  } else if (productPrice.length === 0) {
    console.log("error you need to input a price");
  } else {
    console.log(`${productName} costs $${productPrice}`);
    $.ajax({
      url: 'http://localhost:3000/product',
      type: 'POST',
      data: {
        name: productName,
        price: productPrice
      },
      success:function(result){

      },
      error: function(error){
        console.log(error);
        console.log("something went wrong with sending the data");
      }
    })
  }
});

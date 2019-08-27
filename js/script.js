let productList = $("#productList")
let serverURL;
let serverPort;
let editing = false;

$.ajax({
  url: 'config.json',
  type: 'GET',
  dataType: 'json',
  success: function(config){
    serverURL = config['SERVER_URL'];
    serverPort = config['SERVER_PORT'];
    getUrlAndPort();
  },
  error: function(){
    console.log("cannot find config.json file, cannot run application");
  }
})

getUrlAndPort = (products) => {
  $.ajax({
    url: `${serverURL}:${serverPort}/allProducts`,
    type: 'GET',
    dataType: 'json',
    success: function(allProducts){
      if (allProducts.length === 0) {
        productList.append(`There are no products`);
      } else {
        productList.html(null);
        allProducts.map(function(products){
          productList.append(`<li class="list-group-item d-flex justify-content-between align-items-center" data-id=${products._id}>${products.name}<div class="row"><button type="button" class="btn btn-info editBtn mr-2">Edit</button><button type="button" class="btn btn-danger">Remove</button></div></li>`)
        })
      }
    },
    error: function(){
      console.log("something went wrong");
    }
  })
}

$("#productList").on('click', '.editBtn', function() {
  event.preventDefault();
  const id = $(this).parent().parent().data('id');
  $.ajax({
    url: `${serverURL}:${serverPort}/product/${id}`,
    type: 'GET',
    dataType: 'json',
    success: function(product){
      console.log(product);
      $('#productName').val(product['name']);
      $('#productPrice').val(product['price']);
      $('#productID').val(product['_id']);
      $('#addProduct').text('Edit Product').addClass('btn-warning');
      $('#heading').text('Edit Product');
      editing = true;
    },
    error: function(err){
      console.log(err);
      console.log("something went wrong with getting the single product");
    }
  })
})

$("#addProduct").click(function(){
  event.preventDefault();
  console.log("button click");
  let productName = $("#productName").val();
  let productPrice = $("#productPrice").val();
  let id = $("#productID").val();
  if (productName.length === 0) {
    console.log("error you need to input a name");
  } else if (productPrice.length === 0) {
    console.log("error you need to input a price");
  } else {
    if (editing === true) {
      $.ajax({
        url: `${serverURL}:${serverPort}/editProduct/${id}`,
        type: 'PATCH',
        data: {
          name: productName,
          price: productPrice
        },
        success:function(result){
          // getUrlAndPort();
          $('#productName').val(null);
          $('#productPrice').val(null);
          $('#productID').val(null);
          $('#addProduct').text('Add New Product').removeClass('btn-warning');
          $('#heading').text('Add New Product');
          editing = false;
        },
        error: function(err){
          console.log(err);
          console.log("something went wrong with editing the product");
        }
      })



    } else {
      console.log(`${productName} costs $${productPrice}`);
      $.ajax({
        url: `${serverURL}:${serverPort}/product`,
        type: 'POST',
        data: {
          name: productName,
          price: productPrice
        },
        success:function(result){
          console.log(result);
          productList.append(`<li class="list-group-item d-flex justify-content-between align-items-center">${productName}<div class="row"><button type="button" class="btn btn-info editBtn mr-2">Edit</button><button type="button" class="btn btn-danger">Remove</button></div></li>`
        )
        $("#productName").val(null);
        $("#productPrice").val(null);
      },
        error: function(error){
          console.log(error);
          console.log("something went wrong with sending the data");
        }
      })
    }
  }
});

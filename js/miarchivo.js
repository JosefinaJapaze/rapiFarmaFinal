
(function ($) {
    "use strict"; 

    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').on('click', function () {
        if (
            location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length ?
                target :
                $("[name=" + this.hash.slice(1) + "]");
            if (target.length) {
                anime({
                    targets: 'html, body',
                    scrollTop: target.offset().top - 72,
                    duration: 1000,
                    easing: 'easeInOutExpo'
                });
                return false;
            }
        }
    });

    $(document).scroll(function () {
        var scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
            $('.scroll-to-top').fadeIn();
        } else {
            $('.scroll-to-top').fadeOut();
        }
    });

    $('.js-scroll-trigger').click(function () {
        $('.navbar-collapse').collapse('hide');
    });

    $('body').scrollspy({
        target: '#mainNav',
        offset: 80
    });

    //nav bar 

    var navbarCollapse = function () {
        if ($("#mainNav").offset().top > 100) {
            $("#mainNav").addClass("navbar-shrink");
        } else {
            $("#mainNav").removeClass("navbar-shrink");
        }
    };
    navbarCollapse();

    $(window).scroll(navbarCollapse);

    $(function () {
        $("body").on("input propertychange", ".floating-label-form-group", function (e) {
            $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
        }).on("focus", ".floating-label-form-group", function () {
            $(this).addClass("floating-label-form-group-with-focus");
        }).on("blur", ".floating-label-form-group", function () {
            $(this).removeClass("floating-label-form-group-with-focus");
        });
    });

})(jQuery);


//Javascript course solution

//PRODUCT

//Class for product, includes name and its price
class Product{
    constructor(name, price, description, image){
        this.price = price;
        this.name = name;
        this.description = description;
        this.image = image;
    }
}

//Loads products from a json file
function loadProductsData() {
    return new Promise((resolve, reject) => {
            $.getJSON("../data/products.json", json => {
                let productsListHtml = '';
                let productsModalHtml = '';
                json.forEach((product, index) => {
                    productsListHtml += buildProductItemHtml(product, index);
                    productsModalHtml += buildProductModalHtml(product, index);
                });
                const productsContainer = document.getElementById('products-list-container');
                const modalsContainer = document.getElementById('modals-container');
                productsContainer.innerHTML = productsListHtml;
                modalsContainer.innerHTML = productsModalHtml;
                resolve();
        });
    })
}


//Builds modals for every product on json
function buildProductModalHtml(product, index) {
    const modalId = 'portfolioModal' + index;
    return `
    <div
    class="portfolio-modal modal fade"
    id="${modalId}"
    tabindex="-1"
    role="dialog"
    aria-labelledby="${modalId}"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-body text-center">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-lg-12">
                <h2
                  class="
                    portfolio-modal-title
                    text-secondary text-uppercase
                    mb-0
                    name
                  "
                  id="${modalId}Label"
                >
                  ${product.productName}
                </h2>
                <!-- Icon Divider-->
                <div class="divider-custom">
                  <div class="divider-custom-line"></div>
                  <div class="divider-custom-icon">
                    <i class="fas fa-medkit"></i>
                  </div>
                  <div class="divider-custom-line"></div>
                </div>
                <!-- Store Modal - Image-->
                <img
                  class="img-fluid rounded mb-6"
                  src="${product.productImage}"
                  alt="..."
                />
                <!-- Store Modal - Text-->
                <p class="mb-12 text-justify">
                  ${product.productDescription}
                </p>
                <p class="mb-12 priceTitle text-left">
                  Precio: $<span id="price">${product.productPrice}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    `;
}

//Removes extra spaces on product name
function removeSpaces(someString) {
    return someString.replace(/\s+/g, " ");
}


//Builds the cart for the product
function buildProductItemHtml(product, index) {
    const modalId = 'portfolioModal' + index;
    return `
          <div
            class="
              col-md-3 col-lg-2
              mb-5
              border border-primary
              rounded
              prodItem
              p-5
              m-2
            "
          >
            <div class="row justify-content-center">
              <div
                class="portfolio-item"
                data-toggle="modal"
                data-target="#${modalId}"
              >
                <div
                  class="
                    portfolio-item-caption
                    d-flex
                    align-items-center
                    justify-content-center
                    h-100
                    w-100
                  "
                >
                  <div
                    class="
                      portfolio-item-caption-content
                      text-center text-white
                    "
                  >
                    <i class="fas fa-plus fa-3x"></i><br />Ver más...
                  </div>
                </div>
                <img
                  class="img-fluid"
                  src="${product.productImage}"
                  alt="..."
                />
              </div>
            </div>
            <div class="row justify-content-center text-center">
              <h3>${product.productName}</h3>
            </div>
            <div class="row justify-content-center">
              <button
                type="button"
                onClick="addToCart('${product.productName}', ${product.productPrice}, '${product.productDescription}','${product.productImage}')"
                class="btn btn-primary"
                data-dismiss="modal"
              >
                <i class="fas fa-check fa-fw pr"></i>
                Agregar
              </button>
            </div>
          </div>`;
}

//CART 

//Class for the cart that will include all products chosen by the client
class Cart{
    constructor(details){
        this.details = details? details: [];
    }
    calculateFinalPrice(){
        return this.details.reduce((a,b) => {
            return a + (b.product.price * b.amount);
        },0)
    }
    calculateAmount(){
        return this.details.reduce((a,b) => {
            return a+b.amount;
        },0)
    }
    addProduct(product) {
        let shouldCreateNew = true;
        this.details.forEach(detail => {
            if (detail.product.name === product.name) {
                detail.increaseAmount();
                shouldCreateNew = false;
            }
        });
        if (shouldCreateNew) {
            this.details.push(new CartDetail(product, 1));
        }
    }
}

//Defines a new instance of cart, that will be filed up with products
let cart = new Cart([]);

//Class for cart detail (for every product added to cart)
class CartDetail {
    constructor(product, amount) {
        this.product = product;
        this.amount = amount? amount : 0;
    }
    //amount of products of the same type
    increaseAmount() {
        this.amount += 1;
    }
}

//This function adds a product to the cart and also adds it to storage
const addToCart = (name, price, description, image) => {
    cart.addProduct(new Product(name, price, description, image));
    regenerateTable();
    saveToStorage();
}

// This function adds a new product to the cart
const regenerateTable = () => {
    let newRows = '';
    cart.details.forEach(detail => {
        newRows = newRows + `<tr><td data-th="Product">
        <div class="row">
          <div class="col-sm-4">
            <img style="width: 120px; height: 100px" src="${detail.product.image}" alt="..." />
          </div>
          <div class="col-sm-8">
            <h4><span id="firstProduct">${detail.product.name}</span></h4>
            <p><span id="firstProductDescription">${detail.product.description || 'Sin descripción'}</span></p>
          </div>
      </td>
      <td data-th="Price"><span id="firstProductPrice">$ ${detail.product.price}</span></td>
      <td style="max-width: 80data-th="Cantidad"><span id="firstProductCantidad">${detail.amount}</span></td>
      <td><input style="width: 50px" type="button" onClick="removeItemFromCart('${detail.product.name}')" value="X" /></td></tr>
      </div>`
    })
    const tableOfProducts = $('#tableBody')[0]; //changed to jQuery
    tableOfProducts.innerHTML = newRows;
    $('#finalPrice').html('Total: ' + cart.calculateFinalPrice()); //changed to jQuery
    $('#total-count').html(cart.calculateAmount()); //Changed to jQuery
}

//This function removes an item from the cart and regenerates the cart
function removeItemFromCart(pName){
    cart.details.forEach((detail, index) => {
        if(detail.product.name === pName){
            cart.details.splice(index,1);
        }
    })
    regenerateTable();
 }

//This function finalizes the purchase and empties the cart
$( ".finalizePurch" ).on( "click", function() { 
    if(cart.calculateFinalPrice() > 0){
    alert('Precio final: ' + cart.calculateFinalPrice());
    cart = new Cart();
    saveToStorage()
    regenerateTable();
    }
    else{
        alert('Carrito vacío');
    }

   });


//SESSIONSTORAGE for cart

function saveToStorage(){
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function loadFromStorage(){
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart){
        cart = new Cart(JSON.parse(savedCart).details);
    }
}

// END SESSION
//This function returns the user to the login tab
function closeSession(){
    localStorage.removeItem("session");
    window.location = "/login.html"
}


(function() {
    loadProductsData().then(() => {
        loadFromStorage();
        regenerateTable();
    });
 })()

 
 
 
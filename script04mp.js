let products = [];
let cart = [];

//* Selectors

const Selectors = {
    products: document.querySelector(".products"),
    cartBtn: document.querySelector(".cart-btn"),
    cartQty: document.querySelector(".cart-qtn"),
    cartClose: document.querySelector(".cart-close"),
    cart: document.querySelector(".cart"),
    cartOverlay: document.querySelector(".cart-overlay"),
    cartClear: document.querySelector(".cart-clear"),
    cartBody: document.querySelector(".cart-body"),
}


//* event listeners

const setupListerners = () => {
    document.addEventListener("DOMContentLoaded", initStore);

    // product event
    selectors.products.addEventListener('click', addToCart)

    // cart events
    selectors.cartBtn.addEventListener('click', showCart);
    selectors.cartOverlay.addEventListener('click', hideCart);
    selectors.cartClose.addEventListener('click', hideCart);
};

//* event handlers

const initStore = () => {
    /*fetch("https://faketoreapi.com/products/1")
    .then(renderProducts);*/
    loadProducts("https://faketoreapi.com/products")
    .then (renderProducts);
       /* .then((res) => res.json())
        .then((json) => console.log(json));*/
};

const showCart = () => {
    selectors.cart.classList.add("show");
    selectors.cartOverlay.classList.add("show");
};

const hideCart = () => {
    selectors.cart.classList.remove("show");
    selectors.cartOverlay.classList.remove("show");
};

const addToCart = (e) => {
    //console.log(e.target);
    if(e.target.hasAttribute('data-id')) {
        //console.log('add item');
        const id = parseInt(e.target.dataset.id);
        const inCart = cart.find((x) => x.id ===id);

        if (inCart){
            alert("Item is already in Cart.");
            return;
        }

        cart.push({id, qty: 1 });
        renderProducts();
        renderCart();
        showCart();
    }
};

//* render functions

const renderCart = () => {
    selectors.cartBody.innerHTML = cart.map(({ id, qty }) => {
        //const { id, qty } = item;
        
        // get item info
        const product = products.find((x) => x.id === id);
        const { title, image, price } = product;
        const amount = price * qty;

        return `
        <div class="cart-item" data-id="${id}">
        <img src="${image}" alt="${title}">
            <div class="cart-item-details">
                <h3>${title}</h3>
                <h5>${price}</h5>
                <div class="cart-item-amount">
                    <i class="bi bi-dash-lg"></i>
                    <span class="qty">${qty}</span>
                    <i class="bi bi-plus-lg"></i>

                    <span class="cart-item-price">${amount}</span>
                </div>
            </div>
        </div>
        `;
    }).join('')
}


const renderProducts = () => {
    selectors.products.innerHTML = products.map((product) => {
        const {id, title, image, price } = product;
        //console.log(title);
        // check if product is already in cart
        const inCart = cart.find((x) => x.id === id);
        // check the add to cart button if already in cart
        const disabled = inCart ? "disabled" : "";
        // change the text if alrady in cart
        const text = inCart ? "Added in Cart" : "Add to Cart";

        return `
        <div class="product">
            <img src="${image}" alt="${title}">
            <h3>${title}</h3>
            <h5>${price}</h5>
            <button ${disabled} data-id=${id}>${text}</button>
        </div>
        `;
    })
    .join("");
};


//* API Functions

const loadProducts = async (apiURL) => {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`http error! status=${response.status}`);
        }
        products = await response.json();
        console.log(products);
    } catch (error) {
        console.error("fetch error:", error);
    }
};

//* Helper Functions

//* Initialize

setupListerners();


//37:10
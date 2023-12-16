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

//* render functions
const renderProducts = () => {
    Selectors.products.innerHTML = products.map((product) => {
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
    });
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



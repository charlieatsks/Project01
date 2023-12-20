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
    cartTotal: document.querySelector(".cart-total"),
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
    selectors.cartBody.addEventListener('click', updateCart);
    selectors.cartClear.addEventListener('click', clearCart);
};

//* event handlers

const initStore = () => {
    /*fetch("https://faketoreapi.com/products/1")
    .then(renderProducts);*/
    loadCart();
    loadProducts("https://faketoreapi.com/products")
    .then (renderProducts).finally(renderCart);
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

const clearCart = () => {
    cart = [];
    saveCart();
    renderCart();
    renderProducts();
    setInterval(hideCart, 500);
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
        saveCart();
        renderProducts();
        renderCart();
        showCart();
    }
};

const removeFromCart = (id) => {
    cart = cart.filter((x) => x.id !== id);

    // if the last item is remove , close the cart 
    //cart.length === 0 && setTimeout(hideCart, 500);

    //renderCart();
    renderProducts();
}

const increaseQty = (id) => {
    const item = cart.find((x) => x.id === id);
    if (!item) return;

    item.qty++;
};

const decreaseQty = (id) => {
    const item = cart.find((x) => x.id === id);
    if (!item) return;

    item.qty--;

    if(item.qty === 0) removeFromCart(id);
};

const updateCart = (e) => {
    if(e.target.hasAttribute('data-btn')) {
        const cartItem = e.target.closest('.cart-item');
        const btn = e.target.dataset.btn;
        const id = parseInt(cartItem.dataset.id);

        btn === "incr" && increaseQty(id);
        btn === "decr" && decreaseQty(id);

        saveCart();
        renderCart();
    }
};

const saveCart = () => {
    localStorage.setItem('online-store', JSON.stringify(cart));
}

const loadCart = () => {
    cart = JSON.parse(localStorage.getItem('online-store')) || [];
};

//* render functions

const renderCart = () => {

    // show cart qty in navbar
    const cartQty = cart.reduce((sum, item) => {
        return sum + item.qty;
    }, 0);

    selectors.cartQty.textContent = cartQty;
    selectors.cartQty.classList.toggle("visible", cartQty);

    /*selectors.cartQty.textContent = cart.reduce((sum, item) => {
        return sum + item.qty;
    }, 0);*/
    
    // show cart total
    selectors.cartTotal.textContent = calculateTotal().format();

    // show empty cart
    if (cart.length === 0) {
        selectors.cartBody.innerHTML = '<div class="cart-empty">Your cart is empty. </div>';
        return;
    }

    // show cart items
    selectors.cartBody.innerHTML = cart.map(({ id, qty }) => {
        //const { id, qty } = item;
        // get product info of each cart item
        const product = products.find((x) => x.id === id);
        const { title, image, price } = product;
        const amount = price * qty;

        return `
        <div class="cart-item" data-id="${id}">
            <img src="${image}" alt="${title}">
            <div class="cart-item-details">
                <h3>${title}</h3>
                <h5>${price.format()}</h5>
                <div class="cart-item-amount">
                    <i class="bi bi-dash-lg" data-btn="decr"></i>
                    <span class="qty">${qty}</span>
                    <i class="bi bi-plus-lg" data-btn="incr"></i>

                    <span class="cart-item-price">${amount.format()}</span>
                </div>
            </div>
        </div>
        `;
    }).join('');
};


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
            <h5>${price.format()}</h5>
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

const calculateTotal = () => {
    //const total = cart.map
    return cart.map(({ id, qty }) => {
        const { price } = products.find((x) => x.id === id);

        return qty * price;
    })
    .reduce((sum, number) => {
        return sum + number;
    }, 0);
};

Number.prototype.format = function () {
    return this.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
};

//* Initialize

setupListerners();


//46:10
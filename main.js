const db = {
    methods: {
    find: (id) => {
        return db.items.find((item) => item.id === id);
    },
    remove: (items) => {
        items.forEach((item) => {
        const product = db.methods.find(item.id);
        product.qty = product.qty - item.qty;
        });

        console.log(db);
    },
    },
    items: [
    {
        id: 0,
        title: "Máscara de pestañas",
        price: 6000,
        qty: 0,
    },
    {
        id: 1,
        title: "Delineador",
        price: 3500,
        qty: 50,
    },
    {
        id: 2,
        title: "Corrector",
        price: 4500,
        qty: 50,
    },
    {
        id: 3,
        title: "Labial",
        price: 5000,
        qty: 50,
    },
    ],
};


const shoppingCart = {
    items : [],
    methods: {
    add: (id, qty) => {
        const cartItem = shoppingCart.methods.get(id);
        if (cartItem) {
        if (shoppingCart.methods.hasInventory(id, qty + cartItem.qty)) {
            cartItem.qty++;
        } else {
            alert("No hay más inventario");
        }
        } else {
        shoppingCart.items.push({ id, qty });
        }
    },
    remove: (id, qty) => {
        const cartItem = shoppingCart.methods.get(id);

        if (cartItem.qty - 1 > 0) {
        cartItem.qty--;
        } else {
        shoppingCart.items = shoppingCart.items.filter(
            (item) => item.id !== id
        );
        }
    },
    count: () => {
        return shoppingCart.items.reduce((acc, item) => acc + item.qyt, 0);
    },
    get: (id) => {
        const index = shoppingCart.items.findIndex((item) => item.id === id);
        return index >= 0 ? shoppingCart.items[index] : null;
    },
    getTotal: () => {
        let total = 0;
        shoppingCart.items.forEach((item) => {
        const found = db.methods.find(item.id);
          total += found.price * item.qty;
        });
        return total;
    },
    hasInventory: (id, qty) => {
        return db.items.find((item) => item.id === id).qty - qty >= 0;
    },
    purchase: () => {
        db.methods.remove(shoppingCart.items);
    },
    },
};

renderStore();

function renderStore() {
    const html = db.items.map((item) => {
    return `
        <div class="item">
            <div class="title">${item.title}</div>
            <div class="price">${numberToCurrency(item.price)}</div>
            <div class="qty">${item.qty} Stock</div>
            <div class="actions"><button class="add" data-id="${
                item.id
            }">Agregar al carrito</button></div>
        </div>`;
    });

    document.querySelector("#store-container").innerHTML = html.join("");

    document.querySelectorAll(".item .actions .add").forEach((button) => {
    button.addEventListener("click", (e) => {
        const id = parseInt(button.getAttribute("data-id"));
        const item = db.methods.find(id);

        if (item && item.qty - 1 > 0) {
            Swal.fire({
                icon: 'success',
                title: 'Producto agregado',
                timer: 1500
            }
            )
        shoppingCart.methods.add(id, 1);
        console.log(db, shoppingCart);
        renderShoppingCart();
        guardarCarrito();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'No hay stock',
                timer: 1500
            }
            )
        }
    });
    });
}

function renderShoppingCart() {
    const html = shoppingCart.items.map((item) => {
    const dbItem = db.methods.find(item.id);
    return `
            <div class="item">
                <div class="title">${dbItem.title}</div>
                <div class="price">${numberToCurrency(dbItem.price)}</div>
                <div class="qty">${item.qty} units</div>
                <div class="subtotal">Subtotal: ${numberToCurrency(
                    item.qty * dbItem.price
                )}</div>
                <div class="actions">
                    <button class="addOne" data-id="${dbItem.id}">+</button>
                    <button class="removeOne" data-id="${dbItem.id}">-</button>
                </div>
            </div>
        `;
    });
    const closeButton = `
    <div class="cart-header">
    <button id="bClose">Close</button>
    </div>`;
    const purchaseButton =
    shoppingCart.items.length > 0
        ? `<div class="cart-actions">
    <button id="bPurchase">Terminar compra</button>
    </div>`
        : "";
    const total = shoppingCart.methods.getTotal();
    const totalDiv = `<div class="total">Total: ${numberToCurrency(total)}</div>`;
    document.querySelector("#shopping-cart-container").innerHTML =
    closeButton + html.join("") + totalDiv + purchaseButton;

    document.querySelector("#shopping-cart-container").classList.remove("hide");
    document.querySelector("#shopping-cart-container").classList.add("show");

    document.querySelectorAll(".addOne").forEach((button) => {
    button.addEventListener("click", (e) => {
        const id = parseInt(button.getAttribute("data-id"));
        shoppingCart.methods.add(id, 1);
        renderShoppingCart();
    });
    });

    document.querySelectorAll(".removeOne").forEach((button) => {
    button.addEventListener("click", (e) => {
        const id = parseInt(button.getAttribute("data-id"));
        shoppingCart.methods.remove(id, 1);
        renderShoppingCart();
    });
    });

    document.querySelector("#bClose").addEventListener("click", (e) => {
        Swal.fire(
            'Seguro quiere cerrar el carrito?',
            'Se borrarán los productos agregados.',
            'warning'
        )
    document.querySelector("#shopping-cart-container").classList.remove("show");
    document.querySelector("#shopping-cart-container").classList.add("hide");
    });

    document.querySelector("#bPurchase").addEventListener("click", (e) => {
        Swal.fire({
            icon: 'success',
            title: 'Compra finalizada',
            timer: 3000
        }
        )
    document.querySelector("#shopping-cart-container").classList.remove("show");
    document.querySelector("#shopping-cart-container").classList.add("hide");
    });
}

function numberToCurrency(n) {
    return new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 2,
    style: "currency",
    currency: "USD",
    }).format(n);
}

function guardarCarrito(){
    const carritoJSON = JSON.stringify(shoppingCart.items);
    localStorage.setItem ("carritoData", carritoJSON)
}

fetch("productos.json")
.then((response) => response.json())
.then((data) => {
    const maquillajes = data.infoMaquillajes;

    const infoContainer = document.getElementById('info-maquillajes');

    maquillajes.forEach((info) =>{
        const infoElement = document.createElement('li');
        infoElement.textContent = `nombre: ${info.nombre}, marca: ${info.marca}, color: ${info.color}`
        infoContainer.appendChild(infoElement);
        console.log(infoElement)
    });

})
.catch(error =>{
    console.error('Ha ocurrido un error.');
})

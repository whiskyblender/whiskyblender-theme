const attachEventListeners = () => {
  const radioButtons = document.querySelectorAll('.max input[type="radio"]');
  radioButtons.forEach((radio) => {
    radio.addEventListener("change", function () {
      let variant = getVariantFromSelectedOptions();
      let subtotal = document.querySelector(`.subtotal-of-items`);
      let atc_button = document.querySelector(".atc");
      let quantity = document
        .querySelector(`.quantity`)
        .querySelector("input").value;
      var strike_price = document.createElement("span");
      strike_price.innerHTML = `£${((variant.compare_at_price / 100) * quantity).toFixed(2)}`;
      strike_price.classList.add('strike-price');
      subtotal.innerHTML = `£${((variant.price / 100) * quantity).toFixed(2)}`;
      console.log(variant.compare_at_price)
      if(variant.compare_at_price !== null ){
        subtotal.insertAdjacentElement("afterbegin", strike_price);
      }


      if (variant.available) {
        atc_button.innerHTML = "Add to basket";
        if (!atc_button.classList.contains("pulse")) {
          atc_button.classList.add("pulse");
        }
        atc_button.disabled = false;
      } else {
        atc_button.innerHTML = "Out of stock";
        if (atc_button.classList.contains("pulse")) {
          atc_button.classList.remove("pulse");
        }
        if (!atc_button.classList.contains("disabled")) {
          atc_button.classList.add("disabled");
        }
        atc_button.disabled = true;
      }
    });
  });
};

const getVariantFromSelectedOptions = () => {
  let radios = document.querySelectorAll('.max input[type="radio"]');
  let checked = Array.from(radios).filter((radio) => radio.checked);
  let selectedOptions = checked.map((radio) => radio.value);
  let variant = Window.product.variants.find((variant) => {
    return variant.options.every((option, i) => option === selectedOptions[i]);
  });
  return variant;
};

const addQuantityListeners = () => {
  let remove = document.querySelector(".remove-quantity");
  let add = document.querySelector(".add-quantity");

  remove.addEventListener("click", function () {
    let quantity = document.querySelector(".quantity").querySelector("input");
    let value = parseInt(quantity.value);
    if (value > 1) {
      quantity.value = value - 1;

      let variant = getVariantFromSelectedOptions();
      let subtotal = document.querySelector(`.subtotal-of-items`);
      if (
        variant.compare_at_price !== "" &&
        variant.compare_at_price !== null &&
        variant.compare_at_price !== undefined
      ) {
        subtotal.innerHTML = `<span class="strike-price"> £${(
          (variant.compare_at_price / 100) *
          quantity.value
        ).toFixed(2)}</span> £${(
          (variant.price / 100) *
          quantity.value
        ).toFixed(2)}`;
      } else {
        subtotal.innerHTML = `£${(
          (variant.price / 100) *
          quantity.value
        ).toFixed(2)}`;
      }
    }
  });

  add.addEventListener("click", function () {
    let quantity = document.querySelector(".quantity").querySelector("input");
    let value = parseInt(quantity.value);
    quantity.value = value + 1;

    let variant = getVariantFromSelectedOptions();
    let subtotal = document.querySelector(`.subtotal-of-items`);
    if (
      variant.compare_at_price !== "" &&
      variant.compare_at_price !== null &&
      variant.compare_at_price !== undefined
    ) {
      subtotal.innerHTML = `<span class="strike-price up2"> £${(
        (variant.compare_at_price / 100) *
        quantity.value
      ).toFixed(2)}</span> £${((variant.price / 100) * quantity.value).toFixed(
        2
      )}`;
    } else {
      subtotal.innerHTML = `£${((variant.price / 100) * quantity.value).toFixed(
        2
      )}`;
    }
  });
};

const addProductToCart = async () => {
  let atc_button = document.querySelector(".atc");

  atc_button.addEventListener("click", async function () {
    let variant = getVariantFromSelectedOptions();
    let quantity = document
      .querySelector(".quantity")
      .querySelector("input").value;
    let data = {
      items: [
        {
          id: variant.id,
          quantity: parseInt(quantity),
        },
      ],
    };

    await fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        atc_button.innerHTML = "Added to Basket!";
        window.location.href = "/cart";
      });
  });
};

function fetchProduct() {
  fetch(location.href.split("?")[0] + ".js")
    .then((response) => response.json())
    .then((data) => {
      Window.product = data;
    });
  attachEventListeners();
  addQuantityListeners();
  addProductToCart();
}

// wb cart update function
document.addEventListener("DOMContentLoaded", function () {
  // Function to update the cart count
  function updateCartCount() {
    fetch("/cart.js")
      .then((response) => response.json())
      .then((cart) => {
        const cartCount = document.getElementById("cart-count");
        cartCount.textContent = cart.item_count > 0 ? cart.item_count : "";
        console.log(cartCount.textContent);
      });
  }

  // Event listener for adding items to the cart
  document.querySelectorAll(".add-to-cart-button").forEach((button) => {
    button.addEventListener("click", function () {
      // Update cart count after item is added
      updateCartCount();
    });
  });

  // Initial call to set the cart count on page load
  updateCartCount();
});

if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", fetchProduct);
} else {
  // `DOMContentLoaded` has already fired
  fetchProduct();
}

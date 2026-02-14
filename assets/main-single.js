console.log('start js')
      var glide = new Glide('.glide', {
            type: 'carousel',
            focusAt: 'center',
            gap: 40,
            perView: 2,
            breakpoints: {
                767: { perView: 1 }
            }
        })

  glide.mount()


function fetchProduct() {
  let urlDetails = location.href.split("?")
  fetch(urlDetails[0] + ".js")
    .then((response) => response.json())
    .then((data) => {
      Window.product = data;
    });


  createStylesheet();
  attachEventListeners();
  addQuantityListeners();
  addProductToCart();
}

if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", fetchProduct);
} else {
  // `DOMContentLoaded` has already fired
  fetchProduct();
}

    const labelLayer = document.querySelector('.label-background');
  const glide_slide = document.querySelectorAll('.max .glide__slide--active');
  console.log(glide_slide)
  glide.on('move.after', () => {
      const active = document.querySelector('.glide__slide--active');
      if (active){
        let activeClass = active.classList[0]
        const classes = ['festive', 'party', 'gold', 'heart', 'standard', 'floral'];
  
        // Remove all classes first
        labelLayer.classList.remove(...classes);
  
        // Add the class corresponding to the selected radio value, if it exists in the class list
        if (classes.includes(activeClass)) {
          labelLayer.classList.add(activeClass);
        }
      }
    
})
  
          function insertSpaceForLongWords(str) {
            const splitLength = 14;
            // Split the string into words
            let words = str.split(' ');

            // Map through the words and modify any word longer than 14 characters
            words = words.map(word => {
                if (word.length > splitLength) {
                    let modifiedWord = '';
                    // Insert a space every 12 characters
                    for (let i = 0; i < word.length; i += splitLength) {
                        modifiedWord += word.slice(i, i + splitLength) + ' ';
                    }
                    return modifiedWord.trim(); // Remove any extra space at the end
                }
                return word; // Return word as-is if not longer than 14 chars
            });

            // Join the words back into a string
            return words.join(' ');
        }
        function resize() {
            const isOverflown = ({ clientWidth, scrollWidth, clientHeight, scrollHeight }) => scrollWidth > clientWidth || scrollHeight > clientHeight

            const resizeText = ({ element, elements, minSize = 18, maxSize = 52, step = 2, unit = 'px' }) => {
                (elements || [element]).forEach(el => {
                    let i = minSize
                    let overflow = false

                    const parent = el.parentNode

                    while (!overflow && i < maxSize) {
                        el.style.fontSize = `${i}${unit}`
                        overflow = isOverflown(parent)
                        el.style.lineHeight = ((el.style.fontSize).slice(0, -2.4)) * 0.74 + "px"
                        if (!overflow) i += step
                    }

                    el.style.fontSize = (`${i - step - 1}${unit}`)
                })
            }

            resizeText({
                elements: document.querySelectorAll('.text'),
                step: 0.5
            })
        }
              resize();

        document.fonts.ready.then(function () {
            resize();
        });

const createStylesheet = async () => {
  await fetch("https://app.whiskyblender.com/blend/get-all")
    .then((response) => response.json())
    .then((data) => {
      let stylesheet = document.querySelector(`#bar-colors`);
      let styles = ``;

      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        let style = `
                [data-name="${item.title}"] {
                    background-color: ${item.circleColour};
                }
            `;
        styles += style;
      }

      stylesheet.innerHTML = styles;
      Window.data = data;
    });

  let bars = document.querySelectorAll(".progress-bar-inner");
  let arr = [];
  bars.forEach((bar) => {
    let width = bar.style.width;
    let name = bar.getAttribute("data-name");
    let obj = {
      name: name,
      width: width.replace("%", ""),
      data: Window.data.find((item) => item.title === name),
    };
    arr.push(obj);
  });

  let barWithHighestWidth = getBarWithHighestWidth(arr);
  let detailsImage = document.querySelector(".gallery-details__image");

  detailsImage.style.backgroundImage = `url(${barWithHighestWidth.data.image})`;
  // add to stylesheet
  let stylesheet = document.querySelector(`#bar-colors`);

  let style = `
        span.decorative:after {
            background-color: ${barWithHighestWidth.data.circleColour};
        }
    `;

  stylesheet.innerHTML += style;
};

const getBarWithHighestWidth = (arr) => {
  let highest = 0;
  let item = "";

  for (let i = 0; i < arr.length; i++) {
    let obj = arr[i];
    if (obj.width > highest) {
      highest = obj.width;
      item = obj;
    }
  }
  return item;
};

// listen to any changes to radio buttons inside of first .max class

const attachEventListeners = () => {
  const radioButtons = document.querySelectorAll('.max input[type="radio"]');
  radioButtons.forEach((radio) => {
    radio.addEventListener("change", function () {
      let variant = getVariantFromSelectedOptions();
      let subtotal = document.querySelector(`.subtotal-of-items`);
      let quantity = document
        .querySelector(`.quantity`)
        .querySelector("input").value;
      subtotal.innerHTML = `£${((variant.price / 100) * quantity).toFixed(2)}`;
    });
  });
};

const getVariantFromSelectedOptions = () => {
  let radios = document.querySelectorAll('.max input[type="radio"]');
  let checked = Array.from(radios).filter((radio) => radio.checked);
  let selectedOptions = checked.map((radio) => radio.value);
  const active = document.querySelector('.glide__slide--active');
  console.log(active)
  if(active){
    selectedOptions.push(active.classList[0]);
  } else{
    selectedOptions.push('standard');
  }
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
      subtotal.innerHTML = `£${((variant.price / 100) * quantity.value).toFixed(
        2
      )}`;
    }
  });

  add.addEventListener("click", function () {
    let quantity = document.querySelector(".quantity").querySelector("input");
    let value = parseInt(quantity.value);
    quantity.value = value + 1;

    let variant = getVariantFromSelectedOptions();
    let subtotal = document.querySelector(`.subtotal-of-items`);
    if (variant.compare_at_price !== "" && variant.compare_at_price !== null && variant.compare_at_price !== undefined) {
      // If strike-price exists, get the next sibling text node
      subtotal.innerHTML = `<span class="strike-price up3"> £${((variant.compare_at_price / 100) * quantity.value).toFixed(2)}</span> £${((variant.price / 100) * quantity.value).toFixed(2)}`;
    } else {
      subtotal.innerHTML = `£${((variant.price / 100) * quantity.value).toFixed(2)}`;
    }
  });
};

const addProductToCart = async () => {
  let atc_button = document.querySelector(".atc");

  atc_button.addEventListener("click", async function () {
    let variant = getVariantFromSelectedOptions();
    console.log(variant);
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

        // start - confetti

        const start = () => {
            setTimeout(function() {
                confetti.start()
            }, 600); // 1000 is time that after 1 second start the confetti ( 1000 = 1 sec)
        };

        //  Stop - confetti

        const stop = () => {
            setTimeout(function() {
                confetti.stop()
            }, 4000); // 5000 is time that after 5 second stop the confetti ( 5000 = 5 sec)
        };

        start();
        stop();
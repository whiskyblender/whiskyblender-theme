  new Glide('.glide', {
      type: 'carousel',
      gap: 40,
      perView: 2,
      autoplay: 2000,
      animationDuration: 1000,
      hoverpause: true,
      breakpoints: {
          767: { perView: 1 }
      }
  }).mount()
new Glide('.glide', {
  type: 'carousel',
  gap: 60,
  perView: 3,
  autoplay: 1,
  animationDuration: 3000,
  animationTimingFunc: 'linear',
  hoverpause: true,
  peek: {
    before: 50,
    after: 50,
  },
  breakpoints: {
    767: {
      perView: 2,
      gap: 10,
      peek: {
        before: 5,
        after: 5,
      },
    },
  },
}).mount();

const swiperReviews = new Swiper('.reviews__slider', {
  pagination: {
    el: ".swiper-pagination",
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: true,
  }
});

const swiperCertificates = new Swiper('.certificates__slider', {
  loop: true,
  slidesPerView: 3,
  spaceBetween: 20,
  pagination: {
    el: ".swiper-pagination",
  },
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  }
});

document.querySelectorAll('.accordeon__triger').forEach((item) => {
  item.addEventListener('click', () => {
    const parent = item.parentNode;
    const list = parent.querySelector('.accordeon__triger-list');

    if (parent.classList.toggle('accordeon__triger--active')) {
      list.style.padding = '18px 27px';
      list.style.maxHeight = '215px';
      list.style.opacity = '1';
    } else {
      list.style.opacity = '0';
      list.style.maxHeight = '0';

      setTimeout(() => {
        list.style.padding = '0';
      }, 210);
    }
  });
});



const menuBurger = document.querySelector('.menu__burger')
const menu = document.querySelector('.menu__list')
const body = document.body;

menuBurger.addEventListener('click', (even) => {
  even.stopPropagation();
  menu.classList.toggle('menu__burger--open')
});

body.addEventListener('click', (even) => {
  if (!menu.contains(even.target) && !menuBurger.contains(even.target)) {
    menu.classList.remove('menu__burger--open')
  }
});

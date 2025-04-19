
if (typeof Swiper !== 'undefined') {
    const swiperElement = document.querySelector(".swiper");
    if (swiperElement) {
        const swiper = new Swiper(swiperElement, {
            scrollbar: {
                el: ".swiper-scrollbar",
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            simulateTouch: false,
            effect: "fade",
        });
    }
}

const video = document.getElementById('CarVideo');
const playButton = document.getElementById('playButton');

if (video && playButton) {
    video.controls = false;

    video.addEventListener('loadedmetadata', () => {
        playButton.style.display = 'block';
    });

    function showControls() {
        video.style.display = 'block';
        video.controls = true;
        playButton.style.display = 'none';
        video.classList.add('fade-in');
        setTimeout(() => video.classList.add('visible'), 10);
    }

    playButton.addEventListener('click', () => {
        showControls();
        video.play();
    });

    const togglePlayButtonVisibility = () => {
        playButton.style.display = video.paused ? 'block' : 'none';
    };

    video.addEventListener('pause', togglePlayButtonVisibility);
    video.addEventListener('ended', togglePlayButtonVisibility);
    video.addEventListener('timeupdate', togglePlayButtonVisibility);
    video.addEventListener('playing', togglePlayButtonVisibility);

    video.addEventListener('error', () => {
        console.error("Ошибка загрузки видео.");
    });
}

const menuBtn = document.querySelector('.menu__btn');
const menu = document.querySelector('.menu__list');
const bodyOverflow = document.body;
const header = document.querySelector('.header');
const closeBtn = document.querySelector('.close__btn');

let div;

if (menuBtn && menu && header && closeBtn) {
    menuBtn.addEventListener('click', () => {
        menu.classList.toggle('menu__list--open');
        bodyOverflow.classList.toggle('scroll--off');

        if (!div) {
            div = document.createElement('div');
            div.className = 'menu--open';
            div.textContent = '';
            header.appendChild(div);
            setTimeout(() => {
                ShowShadow();
            }, 300);
        } else {
            HideShadow();
            setTimeout(() => {
                if (div && header.contains(div)) {
                    header.removeChild(div);
                    div = null;
                }
            }, 300);
        }
    });

    closeBtn.addEventListener('click', () => {
        HideShadow();
        menu.classList.remove('menu__list--open');
        bodyOverflow.classList.remove('scroll--off');
        setTimeout(() => {
            if (div && header.contains(div)) {
                header.removeChild(div);
                div = null;
            }
        }, 300);
    });


    function ShowShadow() {
        if (div) {
            div.style.backgroundColor = 'rgba(0, 0, 0, .5)';
        }
    }

    function HideShadow() {
        if (div) {
            div.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        }
    }
}

const tabBtn = document.querySelectorAll('.tabs__btn-item');
const tabContent = document.querySelectorAll('.tabs__content-item');

if (tabBtn.length > 0 && tabContent.length > 0) {
    tabBtn.forEach(function (elem) {
        elem.addEventListener('click', open);
    });

    function open(even) {
        const tabTarget = even.currentTarget;
        const btn = tabTarget.dataset.button;

        tabBtn.forEach(function (item) {
            item.classList.remove('tabs__btn-item--active');
        });

        tabTarget.classList.add('tabs__btn-item--active');

        tabContent.forEach(function (item) {
            item.classList.remove('tabs__content-item--active');
        });

        const targetContent = document.querySelector(`#${btn}`);
        if (targetContent) {
            targetContent.classList.add('tabs__content-item--active');
        } else {
            console.warn(`Контент с ID #${btn} не найден.`);
        }
    }
}

// function AOSClass() {
//     const screenWidth = window.innerWidth;
//     const body = document.body;
//     console.log(`Current screen width: ${screenWidth}`);
//     if (screenWidth < 1230) {
//         body.classList.add('no-animation');
//         console.log('Class "no-animation" added');
//         AOS.refresh();
//     } else {
//         body.classList.remove('no-animation');
//         console.log('Class "no-animation" removed');
//         AOS.init();
//     }
// }
// window.addEventListener('resize', AOSClass);


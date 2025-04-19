document.addEventListener('DOMContentLoaded', async () => {
    const authLink = document.getElementById('auth-link');
    const topLink = document.querySelector('.top__link');
    const maxRetries = 3;
    let retries = 0;

    async function checkAuth() {
        try {
            const response = await fetch('http://localhost:3000/check-auth', {
                method: 'GET',
                credentials: 'include',  
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            const result = await response.json();

            console.log(`Result: ${JSON.stringify(result)}`);
            console.log('result', result.user.role);
            console.log(`Response OK: ${response.ok}`);

            if (response.ok && result.authenticated) {
                if (result.user.role === 'AGENT') {
                    authLink.href = 'agent-account.html';
                    authLink.textContent = 'Личный кабинет';
                    if (window.location === 'index.html') {topLink.style.display = 'none';}
                } else {
                    authLink.href = 'account.html';
                    authLink.textContent = 'Личный кабинет';
                }
            } else {
                authLink.href = 'register.html';
                authLink.textContent = 'Регистрация/Вход';
            }
            
        } catch (error) {
            console.error('Ошибка проверки авторизации:', error);

            if (retries < maxRetries) {
                retries++;
                console.log(`Повторная попытка ${retries}`);
                setTimeout(() => checkAuth(), 2000); 
            } else {
                authLink.href = 'register.html';
                authLink.textContent = 'Регистрация/Вход';
            }
        } finally {
            console.log('Завершена попытка проверки авторизации');
        }
    }

    checkAuth();  

    const scrollSpeed = 0.05; 
    let currentScroll = window.scrollY; 
    let targetScroll = currentScroll;  
    let animationFrameId = null;       
    let siteScrollEnabled = true;      

    function isScrollableElement(element) {
        const style = getComputedStyle(element);
        return (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
            element.scrollHeight > element.clientHeight;
    }

    function stopSmoothScroll() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId); 
            animationFrameId = null;
        }
        currentScroll = window.scrollY; 
    }

    function smoothScrollStep() {
        currentScroll += (targetScroll - currentScroll) * scrollSpeed;

        window.scrollTo(0, currentScroll);

        if (Math.abs(targetScroll - currentScroll) <= 0.5) {
            animationFrameId = null;
            return; 
        }

        animationFrameId = requestAnimationFrame(smoothScrollStep);
    }

    function onScroll(event) {
        if (!siteScrollEnabled) return; 

        targetScroll = Math.min(
            Math.max(0, targetScroll + event.deltaY), 
            document.documentElement.scrollHeight - window.innerHeight 
        );

        event.preventDefault();

        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(smoothScrollStep);
        }
    }

    document.addEventListener('wheel', (event) => {
        let target = event.target;

        while (target && target !== document.body) {
            if (isScrollableElement(target)) {
                stopSmoothScroll(); 
                siteScrollEnabled = false;
                return; 
            }
            target = target.parentElement;
        }

        siteScrollEnabled = true; 
    });

    document.addEventListener('wheel', onScroll, { passive: false });

    if (typeof Swiper !== 'undefined') {
        const swiperElement = document.querySelector(".swiper");
        const delay = 5000;
        if (swiperElement) {
            const swiper = new Swiper(swiperElement, {
                scrollbar: {
                    el: ".swiper-scrollbar",
                },
                autoplay: {
                    delay: delay,
                    disableOnInteraction: false,
                },
                simulateTouch: false,
                effect: "fade",
                on: {
                    slideChange: function () {
                        updateScrollbarProgress(this);
                    },
                },
            });

            function updateScrollbarProgress(swiperInstance) {
                const scrollbarDrag = swiperInstance.el.querySelector(".swiper-scrollbar-drag");
                const totalSlides = swiperInstance.slides.length;
                const swiperScollbar = swiperInstance.el.querySelector(".swiper-scrollbar");

                const scrollbarWidth = 100 / totalSlides;

                scrollbarDrag.style.transition = "none";

                scrollbarDrag.style.width = '0%';

                scrollbarDrag.style.backgroundColor = '#0066ff';

                setTimeout(() => {
                    swiperScollbar.style.backgroundColor = 'white';
                    scrollbarDrag.style.transition = `all ${delay / 1000}s linear`;
                    scrollbarDrag.style.width = `${scrollbarWidth}%`;
                }, 100);
            }

            updateScrollbarProgress(swiper);
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



    // document.getElementById('contact-form').addEventListener('submit', async (event) => {
    //     event.preventDefault();  

    //     const formData = new FormData(event.target);
    //     const formDataObj = {
    //         name: formData.get('name'),
    //         email: formData.get('email'),
    //         message: formData.get('message')
    //     };
    //     console.log('Отправляемые данные:', formDataObj);
    //     try {
    //         const response = await fetch('http://localhost:3000/send-mail', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',  
    //             },
    //             body: new URLSearchParams(formDataObj).toString(), 
    //         });

    //         const result = await response.json();  

    //         if (result.success) {
    //             alert('Email успешно отправлен!');
    //             event.target.reset();
    //         } else {
    //             alert('Произошла ошибка при отправке: ' + result.message);
    //         }
    //     } catch (error) {
    //         alert('Ошибка при отправке запроса: ' + error.message);
    //     }
    // });

    // document.getElementById('register-form').addEventListener('submit', async (event) => {
    //     event.preventDefault();  

    //     const formData = new FormData(event.target);
    //     const formDataObj = {
    //         email: formData.get('email'),
    //     };
    //     console.log('Отправляемые данные:', formDataObj);
    //     try {
    //         const response = await fetch('http://localhost:3000/send-mail', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',  
    //             },
    //             body: new URLSearchParams(formDataObj).toString(), 
    //         });

    //         const result = await response.json();  

    //         if (result.success) {
    //             alert('Email успешно отправлен!');
    //             event.target.reset();
    //         } else {
    //             alert('Произошла ошибка при отправке: ' + result.message);
    //         }
    //     } catch (error) {
    //         alert('Ошибка при отправке запроса: ' + error.message);
    //     }
    // });





});
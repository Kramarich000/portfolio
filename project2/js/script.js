document.addEventListener('DOMContentLoaded', function() {
    const galleries = document.querySelectorAll('.gallery__list');

    let curr = 0;

    function updateGallery() {
        galleries.forEach((gallery, indx) => {
            if (indx === curr) {
                gallery.classList.add('active');
                gallery.classList.remove('inactive');
            } else {
                gallery.classList.remove('active');
                gallery.classList.add('inactive');
            }
        });
    }

    const btnPrev =  document.querySelector('.gallery__head-btn1');

    btnPrev.addEventListener('click', () => {
        if (curr > 0){
            curr--;
            updateGallery();
        }
    });

    const btnNext =  document.querySelector('.gallery__head-btn2');

    btnNext.addEventListener('click', () => {
        if (curr < galleries.length - 1){
            curr++;
            updateGallery();
        }
    });

    updateGallery();
});

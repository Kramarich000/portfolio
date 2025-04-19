(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const difficulty = urlParams.get('difficulty');
    let isPause = false;
    let animationId = null;
    function getEnemySpeed(difficulty) {
        switch (difficulty) {
            case 'easy':
                return 3;
            case 'medium':
                return 5;
            case 'hard':
                return 6;
            default:
                console.error('Invalid difficulty');
        }
    }
    let enemySpeed = getEnemySpeed(difficulty);

    let score = 0;
    let speed = 2;


    const car = document.querySelector('.car');
    const carInfo = {
        ...createElementInfo(car),
        move: {
            top: null,
            bottom: null,
            left: null,
            right: null,
        },
    };

    const enemy = document.querySelector('.enemy');
    const enemyInfo = createElementInfo(enemy);

    const bullet = document.querySelector('.bullet');

    const bulletInfo = {
        ...createElementInfo(bullet),
        coords: { x: 0, y: 0 },
        visible: false,
    };

    const coin = document.querySelector('.coin');
    const coinInfo = createElementInfo(coin);

    const road = document.querySelector('.road');
    const roadHeight = road.clientHeight;
    const roadWidth = road.clientWidth / 2;

    const gameButton = document.querySelector('.game-button');
    const gameScore = document.querySelector('.game-score');
    const backdrop = document.querySelector('.backdrop');
    const restartButton = document.querySelector('.restart-button');
    
    const trees = document.querySelectorAll('.tree');
    const treesCoords = [];

    for (let i = 0; i < trees.length; i++) {
        const tree = trees[i];
        const coordsTree = getCoords(tree);

        treesCoords.push(coordsTree);
    }

    document.addEventListener('keydown', (event) => {
        if (isPause) {
            return;
        }
        
        const code = event.code;
        if (code === 'ArrowUp' && carInfo.move.top === null) {
            if (carInfo.move.bottom) {
                return;
            }
            carInfo.move.top = requestAnimationFrame(carMoveToTop);
        }
        else if (code === 'ArrowDown' && carInfo.move.bottom === null) {
            if (carInfo.move.top) {
                return;
            }
            carInfo.move.bottom = requestAnimationFrame(carMoveToBottom);
        }
        else if (code === 'ArrowLeft' && carInfo.move.left === null) {
            if (carInfo.move.right) {
                return;
            }
            carInfo.move.left = requestAnimationFrame(carMoveToLeft);
        }
        else if (code === 'ArrowRight' && carInfo.move.right === null) {
            if (carInfo.move.left) {
                return;
            }
            carInfo.move.right = requestAnimationFrame(carMoveToRight);
        }
    }); 

    document.addEventListener('keyup', (event) => {
        const code = event.code;
        
        if (code === 'ArrowUp') {
            cancelAnimationFrame(carInfo.move.top);
            carInfo.move.top = null;
        }
        else if (code === 'ArrowDown') {
            cancelAnimationFrame(carInfo.move.bottom);
            carInfo.move.bottom = null;
        }
        else if (code === 'ArrowLeft') {
            cancelAnimationFrame(carInfo.move.left);
            carInfo.move.left = null;
        }
        else if (code === 'ArrowRight') {
            cancelAnimationFrame(carInfo.move.right);
            carInfo.move.right = null;
        }
    });

    document.addEventListener('keypress', (event) => {
        const code = event.code;
        if (code === 'Space' && !bulletInfo.visible){
            bullet.style.display = 'initial';
            bulletInfo.coords.x = carInfo.coords.x + carInfo.width - 20;
            bulletInfo.coords.y = carInfo.coords.y;
            bulletInfo.visible = true;
        }
    }); 
           
    function createElementInfo(element) {
        return {
            coords: getCoords(element),
            height: element.clientHeight,
            width: element.clientWidth / 2,
            visible: true,
        };
    }

    function carMoveToTop() {
        const newY = carInfo.coords.y - 5;

        if (newY < 0) {
            return;
        }
        
        carInfo.coords.y = newY;
        carMove(carInfo.coords.x, newY);
        carInfo.move.top = requestAnimationFrame(carMoveToTop);
    }

    function carMoveToBottom() {
        const newY = carInfo.coords.y + 5;

        if ((newY + carInfo.height) > roadHeight) {
            return;
        }

        carInfo.coords.y = newY;
        carMove(carInfo.coords.x, newY);
        carInfo.move.bottom = requestAnimationFrame(carMoveToBottom);
    }

    function carMoveToLeft() {
        const newX = carInfo.coords.x - 5;

        if (newX < -roadWidth + carInfo.width) {
            return;
        }

        carInfo.coords.x = newX;
        carMove(newX, carInfo.coords.y);
        carInfo.move.left = requestAnimationFrame(carMoveToLeft);
    }

    function carMoveToRight() {
        const newX = carInfo.coords.x + 5;

        if (newX > roadWidth - carInfo.width) {
            return;
        }

        carInfo.coords.x = newX;
        carMove(newX, carInfo.coords.y);
        carInfo.move.right = requestAnimationFrame(carMoveToRight);
    }

    function carMove(x, y) {
        car.style.transform = `translate(${x}px, ${y}px)`; 
    }

    function bulletMove() {
        if (bulletInfo.visible) {
            NewY = bulletInfo.coords.y - speed * 4
            
            if (NewY < 0){
                bullet.style.display = 'none';
                bulletInfo.visible = false;
            } else {
                bulletInfo.coords.y = NewY;
                bullet.style.transform = `translate(${bulletInfo.coords.x}px, ${NewY}px)`;
            }
        }
        else {
            bullet.style.display = 'none';  
        }

    }

    animationId = requestAnimationFrame(() => startGame(difficulty));

    function startGame(difficulty) {
        getEnemySpeed(difficulty);

        enemyAnimation(-150);
        bulletMove()
        bulletAnimation();

        if (carInfo.visible && enemyInfo.visible && hasCollision(carInfo, enemyInfo)) {
            return finishGame();
        }

        treesAnimation();
        elementAnimation(coin, coinInfo, -100);

        if (bulletInfo.visible && hasCollision(bulletInfo, enemyInfo)) {
            bullet.style.display = 'none';
            bulletInfo.visible = false;
            score+=2;
            gameScore.innerText = score;
            let newYCoord = enemyInfo.coords.y;
            newYCoord = -enemyInfo.height - 150;
            var direction = parseInt(Math.random() * 2);
            var maxXCoord = (roadWidth - enemyInfo.width);
            var randomXCoord = parseInt(Math.random() * maxXCoord);
            if (direction === 0) { 
                enemyInfo.coords.x = -randomXCoord;
            } else if (direction === 1) { 
                enemyInfo.coords.x = randomXCoord;
            }

            enemyInfo.coords.y = newYCoord;
            enemy.style.transform = `translate(${enemyInfo.coords.x}px, ${newYCoord}px)`;
        }

        if (coinInfo.visible && hasCollision(carInfo, coinInfo)) {
            score+=1;
            speed+=0.5;
            enemySpeed+=0.5;
            gameScore.innerText = score;
            coin.style.display = 'none';
            coinInfo.visible = false;

        }
        animationId = requestAnimationFrame(() => startGame(difficulty));
    }

    function treesAnimation() {
        for (let i = 0; i < trees.length; i++) {
            const tree = trees[i];
            const coords = treesCoords[i];

            let newYCoord = coords.y + speed;

            if (newYCoord > window.innerHeight) {
                newYCoord = -370;
            }

            treesCoords[i].y = newYCoord;
            tree.style.transform = `translate(${coords.x}px, ${newYCoord}px)`;
        }
    }
    
    function elementAnimation(elem, elemInfo, elemInitialYCoord) {
        let newYCoord = elemInfo.coords.y + speed;
        let newXCoord = elemInfo.coords.x;

        if (newYCoord > window.innerHeight) {
            newYCoord = elemInitialYCoord;

            const direction = parseInt(Math.random() * 2);
            const maxXCoord = (roadWidth + 1 - elemInfo.width);
            const randomXCoord = parseInt(Math.random() * maxXCoord);
    
            if (direction === 0) { // Двигаем влево
                newXCoord = -randomXCoord;
            }
            else if (direction === 1) { // Двигаем вправо
                newXCoord = randomXCoord;
            }

            elem.style.display = 'initial';
            elemInfo.visible = true;
        }

        elemInfo.coords.y = newYCoord;
        elemInfo.coords.x = newXCoord;
        elem.style.transform = `translate(${newXCoord}px, ${newYCoord}px)`;
    }

    function enemyAnimation(enemyInitialYCoord) {
        let newYCoord = enemyInfo.coords.y + enemySpeed;
        let newXCoord = enemyInfo.coords.x; 

        if (newYCoord > window.innerHeight) {
            newYCoord = enemyInitialYCoord;

            var direction = parseInt(Math.random() * 2);
            var maxXCoord = (roadWidth - enemyInfo.width);
            var randomXCoord = parseInt(Math.random() * maxXCoord);

            if (direction === 0) { 
                newXCoord = -randomXCoord;
            }
            else if (direction === 1) { 
                newXCoord = randomXCoord;
            }

            enemy.style.display = 'initial';
            enemyInfo.visible = true;
        }

        enemyInfo.coords.y = newYCoord;
        enemyInfo.coords.x = newXCoord;
        enemy.style.transform = `translate(${newXCoord}px, ${newYCoord}px)`;
    }

    function bulletAnimation(){
        let newYCoord = enemyInfo.coords.y;
        let newXCoord = enemyInfo.coords.x; 

        if (newYCoord > window.innerHeight) {
            newYCoord = enemyInitialYCoord;

            var direction = parseInt(Math.random() * 2);
            var maxXCoord = (roadWidth + 1 - enemyInfo.width);
            var randomXCoord = parseInt(Math.random() * maxXCoord);

            if (direction === 0) { 
                newXCoord = -randomXCoord;
            }
            else if (direction === 1) {
                newXCoord = randomXCoord;
            }

            enemy.style.display = 'initial';
            enemyInfo.visible = true;
        }

        enemyInfo.coords.y = newYCoord;
        enemyInfo.coords.x = newXCoord;
        enemy.style.transform = `translate(${newXCoord}px, ${newYCoord}px)`;
    }

    function getCoords(element) {
        const matrix = window.getComputedStyle(element).transform;
        const array = matrix.split(',');
        const y = array[array.length - 1];
        const x = array[array.length - 2];
        const numericY = parseFloat(y);
        const numericX = parseFloat(x);

        return { x: numericX, y: numericY };
    }

    function hasCollision(elem1Info, elem2Info) {
        const carYTop = elem1Info.coords.y;
        const carYBottom = elem1Info.coords.y + elem1Info.height;

        const carXLeft = elem1Info.coords.x - elem1Info.width;
        const carXRight = elem1Info.coords.x + elem1Info.width;

        const coinYTop = elem2Info.coords.y;
        const coinYBottom = elem2Info.coords.y + elem2Info.height;

        const coinXLeft = elem2Info.coords.x - elem2Info.width;
        const coinXRight = elem2Info.coords.x + elem2Info.width;

        if (carYTop > coinYBottom || carYBottom < coinYTop) {
            return false;
        }

        if (carXLeft > coinXRight || carXRight < coinXLeft) {
            return false;
        }

        return true;
    }

    function cancelAnimations() {
        cancelAnimationFrame(animationId);
        cancelAnimationFrame(carInfo.move.top);
        cancelAnimationFrame(carInfo.move.bottom);
        cancelAnimationFrame(carInfo.move.left);
        cancelAnimationFrame(carInfo.move.right);
        bulletInfo.visible = 'false';
        bullet.style.display = 'none';
    }

    function finishGame() {
        cancelAnimations();

        gameScore.style.display = 'none';
        gameButton.style.display = 'none';
        backdrop.style.display = 'flex';

        const scoreText = backdrop.querySelector('.finish-text-score');
        scoreText.innerText = score;
        checkAndSaveRecord(score); 
    }
    function checkAndSaveRecord(score) {
        const scores = JSON.parse(localStorage.getItem(score)) || [];

        if (scores.length < 5) {
            const nickname = prompt('Поздравляем! Введите ваш никнейм:');
            if (nickname) {
                saveScore(nickname, score);
            }
        }
    }
    function saveScore(nickname, score) {
        let tableName;
        switch (difficulty) {
            case 'easy':
                tableName = 'easy';
                break;
            case 'medium':
                tableName = 'medium';
                break;
            case 'hard':
                tableName = 'hard';
                break;
        }

        const scores = JSON.parse(localStorage.getItem(tableName)) || [];
        const userScore = {
            nickname: nickname,
            score: score,
        };
        scores.push(userScore);
        scores.sort((a, b) => b.score - a.score);
        if (scores.length > 5) {
            scores.pop();
        }
        localStorage.setItem(tableName, JSON.stringify(scores));
    }

    gameButton.addEventListener('click', () => {
        isPause = !isPause;
        if (isPause) {
            cancelAnimations();

            gameButton.children[0].style.display = 'none';
            gameButton.children[1].style.display = 'initial';
        }
        else {
            animationId = requestAnimationFrame(startGame);
            gameButton.children[0].style.display = 'initial';
            gameButton.children[1].style.display = 'none';
        }
    });

    restartButton.addEventListener('click', () => {
        window.location.reload();
    });
})();
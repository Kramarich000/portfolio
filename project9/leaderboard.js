document.addEventListener('DOMContentLoaded', function () {
    const leaderboardList = document.getElementById('leaderboardList');
    const clearButton = document.getElementById('clearLeaderboard');

    if (!leaderboardList) {
        console.error('Элемент с id "leaderboardList" не найден.');
        return;
    }

    displayLeaderboard();

    function displayLeaderboard() {
        leaderboardList.innerHTML = '';
    
        const tables = ['easy', 'medium', 'hard'];
    
        tables.forEach(table => {
            const scores = JSON.parse(localStorage.getItem(table)) || [];
            const tableTitle = document.createElement('h2');
            tableTitle.innerText = getDifficultyName(table);
            leaderboardList.appendChild(tableTitle);
    
            const tableList = document.createElement('table');
            tableList.classList.add('leaderboard-table');
    
            const headerRow = document.createElement('tr');
            const positionHeader = document.createElement('th');
            positionHeader.innerText = 'Место';
            const nicknameHeader = document.createElement('th');
            nicknameHeader.innerText = 'Имя';
            const scoreHeader = document.createElement('th');
            scoreHeader.innerText = 'Очки';
            const medalHeader = document.createElement('th');
            medalHeader.innerText = 'Медаль'; 
    
            headerRow.appendChild(positionHeader);
            headerRow.appendChild(nicknameHeader);
            headerRow.appendChild(scoreHeader);
            headerRow.appendChild(medalHeader);
    
            tableList.appendChild(headerRow);
    
            scores.forEach((entry, index) => {
                const row = document.createElement('tr');
                const positionCell = document.createElement('td');
                positionCell.innerText = index + 1;
    
                const nicknameCell = document.createElement('td');
                nicknameCell.innerText = entry.nickname;
    
                const scoreCell = document.createElement('td');
                scoreCell.innerText = entry.score;
    
                const medalCell = document.createElement('td');
                medalCell.innerText = getMedalSymbol(index + 1); 
    
                row.appendChild(positionCell);
                row.appendChild(nicknameCell);
                row.appendChild(scoreCell);
                row.appendChild(medalCell);
    
                tableList.appendChild(row);
            });
    
            leaderboardList.appendChild(tableList);
        });
    }
    
    function getMedalSymbol(position) {
        if (position === 1) {
            return '🥇'; 
        } else if (position === 2) {
            return '🥈';
        } else if (position === 3) {
            return '🥉'; 
        } else {
            return ' ---- ';
        }
    }
    
    clearButton.addEventListener('click', clearLeaderboard);

    function clearLeaderboard() {
        localStorage.clear();
        
        displayLeaderboard();
    }

    function getDifficultyName(difficulty) {
        switch (difficulty) {
            case 'easy':
                return 'Легко';
            case 'medium':
                return 'Средне';
            case 'hard':
                return 'Сложно';
            default:
                return 'Неизвестно';
        }
    }
});
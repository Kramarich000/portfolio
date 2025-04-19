const getAllAgents = async () => {
    try {
        const response = await fetch('http://localhost:3000/agents');
        if (!response.ok) throw new Error('Ошибка при получении данных агентов');

        const data = await response.json();

        if (data.success) {
            const contentContainer = document.getElementById('content-1');
            contentContainer.innerHTML = ''; 

            data.agents.forEach(agent => {
                const { firstname, lastname, phonenumber, email, hiredate, department, branchaddress } = agent;

                const card = document.createElement('div');
                card.classList.add('card');

                card.innerHTML = `
                    <img class="card__img" src="images/agent-1.jpg" alt="Agent Photo"> 
                    <div class="card__content">
                        <h4 class="card__title">${firstname} ${lastname}</h4>
                        <p class="card__text"><strong>Телефон:</strong> ${phonenumber}</p>
                        <p class="card__text"><strong>Email:</strong> ${email}</p>
                        <p class="card__text"><strong>Дата найма:</strong> ${hiredate}</p>
                        <p class="card__text"><strong>Отдел:</strong> ${department}</p>
                        <p class="card__text"><strong>Филиал:</strong> ${branchaddress}</p>
                    </div>
                `;

                contentContainer.appendChild(card);
            });
        } else {
            console.error('Не удалось получить данные агентов:', data.message);
        }
    } catch (error) {
        console.error('Ошибка при запросе агентов:', error);
    }
};

const getAllAssessors = async () => {
    try {
        const response = await fetch('http://localhost:3000/assessors');
        if (!response.ok) throw new Error('Ошибка при получении данных оценщиков');

        const data = await response.json();

        if (data.success) {
            const contentContainer = document.getElementById('content-2');             
            contentContainer.innerHTML = ''; 

            data.assessors.forEach(assessor => {
                const { firstname, lastname, specialization, experience, rating } = assessor;

                const card = document.createElement('div');
                card.classList.add('card');

                card.innerHTML = `
                    <img class="card__img" src="images/agent-1.jpg" alt="Assessor Photo">
                    <div class="card__content">
                        <h4 class="card__title">${firstname} ${lastname}</h4>
                        <p class="card__text"><strong>Специализация:</strong> ${specialization}</p>
                        <p class="card__text"><strong>Опыт:</strong> ${experience} лет</p>
                        <p class="card__text"><strong>Рейтинг:</strong> ${rating}</p>
                    </div>
                `;

                contentContainer.appendChild(card);
            });
        } else {
            console.error('Не удалось получить данные оценщиков:', data.message);
        }
    } catch (error) {
        console.error('Ошибка при запросе оценщиков:', error);
    }
};


const getAllBranches = async () => {
    try {
        const response = await fetch('http://localhost:3000/branches');
        if (!response.ok) throw new Error('Ошибка при получении данных филиалов');

        const data = await response.json();

        if (data.success) {
            const contentContainer = document.getElementById('content-3'); 
            contentContainer.innerHTML = ''; 

            data.branches.forEach(branch => {
                const { address, contactinfo, servicearea, status } = branch;

                const card = document.createElement('div');
                card.classList.add('card');

                card.innerHTML = `
                    <img class="card__img" src="images/branch-1.jpg" alt="Branch Photo"> 
                    <div class="card__content">
                        <h4 class="card__title">${address}</h4>
                        <p class="card__text"><strong>Контактная информация:</strong> ${contactinfo}</p>
                        <p class="card__text"><strong>Обслуживаемая территория:</strong> ${servicearea}</p>
                        <p class="card__text"><strong>Статус:</strong> ${status}</p>
                    </div>
                `;

                contentContainer.appendChild(card);
            });
        } else {
            console.error('Не удалось получить данные филиалов:', data.message);
        }
    } catch (error) {
        console.error('Ошибка при запросе филиалов:', error);
    }
};

const getAllLawyers = async () => {
    try {
        const response = await fetch('http://localhost:3000/lawyers');
        if (!response.ok) throw new Error('Ошибка при получении данных юристов');

        const data = await response.json();

        if (data.success) {
            const contentContainer = document.getElementById('content-4'); 
            contentContainer.innerHTML = ''; 

            data.lawyers.forEach(lawyer => {
                const { firstname, lastname, specialization, experience, winrate } = lawyer;

                const card = document.createElement('div');
                card.classList.add('card');

                card.innerHTML = `
                    <img class="card__img" src="images/lawyer-1.jpg" alt="Lawyer Photo"> 
                    <div class="card__content">
                        <h4 class="card__title">${firstname} ${lastname}</h4>
                        <p class="card__text"><strong>Специализация:</strong> ${specialization}</p>
                        <p class="card__text"><strong>Опыт:</strong> ${experience} лет</p>
                        <p class="card__text"><strong>Процент побед:</strong> ${winrate}%</p>
                    </div>
                `;

                contentContainer.appendChild(card);
            });
        } else {
            console.error('Не удалось получить данные юристов:', data.message);
        }
    } catch (error) {
        console.error('Ошибка при запросе юристов:', error);
    }
};

getAllLawyers();

getAllBranches();

getAllAssessors();

getAllAgents();

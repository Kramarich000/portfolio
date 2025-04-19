document.addEventListener('DOMContentLoaded', async () => {
    const btnEdit = document.getElementById('edit');
    const btnDelete = document.getElementById('delete');
    const profilePhoto = document.getElementById('profile-photo');
    const fileInput = document.getElementById('photo');
    const uploadBtn = document.getElementById('upload-btn');
    const deleteBtn = document.querySelector('.delete-btn');
    const editBtn = document.querySelector('.edit-btn');
    const deleteAccountBtn = document.getElementById('delete-account');
    const buttons = document.querySelectorAll('.btn');
    const policyBtn = document.querySelector('.policy-btn');
    const caseBtn = document.querySelector('.case-btn');
    const imgActions = document.querySelector('.img-actions');
    const transactionBtn = document.querySelector('.transaction-btn');
    const userDataPolicy = document.querySelector('.user__data-policy');
    const userDataCase = document.querySelector('.user__data-case');
    const userDataTransaction = document.querySelector('.user__data-transaction');
    const deleteAccountForm = document.getElementById('delete-account-form');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const cancelformBtn = document.querySelector('.cancel-form-btn');
    const imageContainer = document.querySelector('.image-container');
    const photoInput = document.getElementById('photo');
    const userPolicies = document.querySelectorAll('.user__policy');
    let ClientIDphoto;
    let Email;
    let AgentDepartment;
    let AgentID;

    const logoutButton = document.getElementById('logout');
    logoutButton.addEventListener('click', async () => {
        await fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include',
        });
        window.location.href = "index.html";
    });


    const deleteform = document.querySelector('.delete');

    const checkCodeInput = document.getElementById('check-code');


    deleteAccountBtn.addEventListener('click', () => {
        confirmationModal.classList.remove('hidden');
    });

    cancelDeleteBtn.addEventListener('click', () => {
        confirmationModal.classList.add('hidden');
        deleteform.classList.add('hidden');
    });

    cancelformBtn.addEventListener('click', () => {
        deleteAccountForm.classList.add('hidden');
        deleteform.classList.add('hidden');
    });


    const userInfoName = document.querySelector('.user__info-name');
    const userInfoDetails = document.querySelector('.user__info-details');
    const userInfoContainer = document.querySelector('.user__info');

    userInfoName.addEventListener('click', function (event) {
        event.stopPropagation();
        this.classList.toggle('open');
        if (userInfoDetails.style.height) {
            userInfoDetails.style.height = '';
        } else {
            userInfoDetails.style.height = userInfoDetails.scrollHeight + 'px';
        }
    });

    document.addEventListener('click', function (event) {
        if (!userInfoContainer.contains(event.target) && !userInfoName.contains(event.target)) {
            userInfoDetails.style.height = '';
            userInfoName.classList.remove('open');
        }
    });

    policyBtn.addEventListener('click', () => {
        userDataPolicy.classList.remove('hidden');
        policyBtn.classList.add('active');
        caseBtn.classList.remove('active');
        transactionBtn.classList.remove('active');
        userDataCase.classList.add('hidden');
        userDataTransaction.classList.add('hidden');
    });
    caseBtn.addEventListener('click', () => {
        caseBtn.classList.add('active');
        transactionBtn.classList.remove('active');
        policyBtn.classList.remove('active');
        userDataCase.classList.remove('hidden');
        userDataPolicy.classList.add('hidden');
        userDataTransaction.classList.add('hidden');
    });
    transactionBtn.addEventListener('click', () => {
        transactionBtn.classList.add('active');
        caseBtn.classList.remove('active');
        policyBtn.classList.remove('active');
        userDataTransaction.classList.remove('hidden');
        userDataCase.classList.add('hidden');
        userDataPolicy.classList.add('hidden');
    });


    imgActions.addEventListener('mouseover', () => {
        btnEdit.style.display = 'block';
        btnDelete.style.display = 'block';
    });

    imgActions.addEventListener('mouseout', () => {
        btnEdit.style.display = 'none';
        btnDelete.style.display = 'none';
    });

    const checkAuthAndGetUserData = async () => {

        try {
            const response = await fetch('http://localhost:3000/check-auth', {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Ошибка при проверке аутентификации: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.authenticated) {
                const userEmail = result.user.email;
                Email = userEmail;
                console.log('email:', Email);

                const clientResponse = await fetch(`http://localhost:3000/get-client?email=${userEmail}`);
                const clientData = await clientResponse.json();
                console.log(JSON.stringify(clientData, null, 2));
          

                if (clientData.success) {
                    const client = clientData.user;
                    const editBtn = document.getElementById('edit-btn');

                    AgentDepartment = clientData.user.department;
                    AgentID = clientData.user.agentid;
                    console.log('AgentDepartment:', AgentDepartment);
                    console.log('AgentID:', AgentID);

                    document.querySelector('.user__info-name').textContent = `${client.firstname} ${client.lastname}`;
                    document.querySelector('.user__info-email').textContent = `${client.email}`;
                    document.querySelector('.user__info-phone').textContent = `${client.phonenumber}`;
                    const birthDateString = client.hiredate; 
                    console.log('Raw hire date:', birthDateString);
                    
                    const [day, month, year] = birthDateString.split('.').map(Number);
                    
                    const birthDate = new Date(year, month - 1, day);
                    
                    if (isNaN(birthDate)) {
                        console.error("Некорректная дата", birthDateString);
                    } else {
                        const months = [
                            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
                        ];
                    
                        const dayFormatted = birthDate.getDate();
                        const monthFormatted = months[birthDate.getMonth()];
                        const yearFormatted = birthDate.getFullYear();
                    
                        const formattedBirthDate = `${dayFormatted} ${monthFormatted} ${yearFormatted}`;
                    
                        document.querySelector('.user__info-birthyear').textContent = formattedBirthDate;
                        console.log('Formatted birth date:', formattedBirthDate);
                        document.querySelector('.user__info-address').textContent = `${client.department}`;
                    }
                    
                }
            }

        } catch (error) {
            console.error('Ошибка при проверке аутентификации:', error);
        }
    };


    const getClientDataAndDisplay = async () => {
        try {
            const response = await fetch('http://localhost:3000/check-auth', {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Ошибка при проверке аутентификации: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.authenticated) {
                const userEmail = result.user.email;
                console.log('email:', userEmail);

                const clientResponse = await fetch('http://localhost:3000/get-clients', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: userEmail }),
                });

                const clientData = await clientResponse.json();
                console.log('clientData:', clientData);

                if (clientData.success) {
                    const clients = clientData.clients;

                    const policyDetailsContainer = document.querySelector('.user__policy-details');
                    const policyListContainer = document.querySelector('.user__policy');

                    const clientsList = clients.map(client => `
                        <div class = "user__data-clients">
                            <h3 class="user__client-name">${client.firstname} ${client.lastname}</h3>
                            <p class="user__clients-email">Email: ${client.email}</p>
                            <p>Телефон: ${client.phonenumber}</p>
                            <p>Адрес: ${client.address}</p>
                        </div>
                    `).join('');

                    policyDetailsContainer.innerHTML = clientsList;

                    if (AgentDepartment !== null && AgentID !== null) {
                        console.log('AgentID', AgentID);
                        document.getElementById("clientcases").href = "http://localhost:3000/report/clientcases?agentId=" + AgentID;
                        document.getElementById("clients").href = "http://localhost:3000/report/agentcases?agentId=" + AgentID;
                        document.getElementById("agents").href = "http://localhost:3000/report/fetchpolicies?agentid=" + AgentID;
                        await fetchAndDisplayRequests(AgentDepartment, AgentID);
                    } else {
                        console.error('AgentDepartment не найден!');
                    }

                } else {
                    console.error('Не удалось получить данные клиентов');
                }
            } else {
                console.warn('Пользователь не аутентифицирован');
            }
        } catch (error) {
            console.error('Ошибка при обработке запроса:', error);
        }
    };
    
    // const fetchAndDisplayRequests = async (AgentDepartment) => {
    //     try {
    //         const response = await fetch(`http://localhost:3000/get-clients-requests?AgentDepartment=${AgentDepartment}`);
    //         if (!response.ok) {
    //             throw new Error('Не удалось получить заявки');
    //         }
    
    //         const data = await response.json();
    
    //         const allRequests = [...data.policyRequests, ...data.claimRequests];
    
    //         const transactionContainer = document.querySelector('.user__transaction');
    //         transactionContainer.innerHTML = ''; 
    
    //         if (allRequests.length === 0) {
    //             const noRequestsMessage = document.createElement('div');
    //             noRequestsMessage.textContent = 'Нет заявок для отображения';
    //             transactionContainer.appendChild(noRequestsMessage);
    //             return;
    //         }
    
    //         console.log(allRequests);
    
    //         allRequests.forEach((request) => {
    //             const ul = document.createElement('ul');
    //             ul.classList.add('user__transaction-list');
    
    //             const li = document.createElement('li');
    //             li.classList.add('user__transaction-item');
    
    //             const transactionInfo = document.createElement('div');
    //             transactionInfo.classList.add('transaction__info');
    
    //             if (request.status === 'Ожидается') {
    //                 transactionInfo.classList.add('waiting-status'); 
    //             }
    
    //             if (request.caseId) {
    //                 transactionInfo.innerHTML = `
    //                 <p>Тип заявки: Страховой случай</p>
    //                 <p>Тип случая: ${request.claimType || 'Не указан'}</p>
    //                 <p>Тип полиса: ${request.policyType || 'Не указан'}</p>
    //                 <p>Дата заявки: ${request.requestDate}</p>
    //                 <p>Дата случая: ${request.claimDate}</p>
    //                 <p>Статус: ${request.status}</p>
    //                 `;
    //             } else if (request.requestId) {
    //                 transactionInfo.innerHTML = `
    //                 <p>Тип заявки: Страховой полис</p>
    //                 <p>Тип полиса: ${request.policyType || 'Не указан'}</p>
    //                 <p>Дата заявки: ${request.requestDate}</p>
    //                 <p>Дата начала полиса: ${request.startDate}</p>
    //                 <p>Сумма страхования: ${request.insuranceAmount || 'Не указана'}</p>
    //                 <p class="transaction__info-status">Статус: ${request.status}</p>
    //                 `;
    //             } else {
    //                 transactionInfo.innerHTML = `
    //                 <p>Тип заявки: Неизвестен</p>
    //                 <p>Дата заявки: ${request.requestDate}</p>
    //                 <p>Статус: ${request.status}</p>
    //                 `;
    //             }
    
    //             li.appendChild(transactionInfo); 
    //             ul.appendChild(li); 
    //             transactionContainer.appendChild(ul); 
    //         });
    
    //         const userDataTransaction = document.querySelector('.user__data-transaction');
    //         userDataTransaction.classList.remove('hidden');
    //     } catch (error) {
    //         console.error('Ошибка:', error);
    //         const transactionContainer = document.querySelector('.user__transaction');
    //         transactionContainer.innerHTML = '<div>Ошибка при загрузке заявок. Попробуйте позже.</div>';
    //     }
    // };

    const fetchAndDisplayRequests = async (AgentDepartment, AgentId) => {
        try {
            const response = await fetch(`http://localhost:3000/get-clients-requests?AgentDepartment=${AgentDepartment}&AgentId=${AgentId}`);
            if (!response.ok) {
                throw new Error('Не удалось получить заявки');
            }
    
            const data = await response.json();
    
            const allRequests = [...data.policyRequests, ...data.claimRequests];
    
            const transactionContainer = document.querySelector('.user__transaction');
            transactionContainer.innerHTML = ''; 
    
            // if (allRequests.length === 0) {
            //     // const noRequestsMessage = document.createElement('div');
            //     // noRequestsMessage.classList.add('empty-message');
            //     // noRequestsMessage.textContent = 'Нет заявок для отображения';
            //     transactionContainer.appendChild(noRequestsMessage);
            //     return;
            // }
    
            console.log(allRequests);
    
            allRequests.forEach((request) => {
                const ul = document.createElement('ul');
                ul.classList.add('user__transaction-list');
    
                const li = document.createElement('li');
                li.classList.add('user__transaction-item');
    
                const transactionInfo = document.createElement('div');
                transactionInfo.classList.add('transaction__info');
    
                if (request.status === 'Ожидается') {
                    transactionInfo.classList.add('waiting-status'); 
                }
    
                if (request.caseId) {
                    transactionInfo.innerHTML = `
                    <p>Тип заявки: Страховой случай</p>
                    <p>Тип случая: ${request.claimType || 'Не указан'}</p>
                    <p>Тип полиса: ${request.policyType || 'Не указан'}</p>
                    <p>Дата заявки: ${request.requestDate}</p>
                    <p>Дата случая: ${request.claimDate}</p>
                    <p>Статус: ${request.status}</p>
                    `;
                } else if (request.requestId) {
                    transactionInfo.innerHTML = `
                    <p>Тип заявки: Страховой полис</p>
                    <p>Тип полиса: ${request.policyType || 'Не указан'}</p>
                    <p>Дата заявки: ${request.requestDate}</p>
                    <p>Дата начала полиса: ${request.startDate}</p>
                    <p>Сумма страхования: ${request.insuranceAmount || 'Не указана'}</p>
                    <p class="transaction__info-status">Статус: ${request.status}</p>
                    `;
                } else {
                    transactionInfo.innerHTML = `
                    <p>Тип заявки: Неизвестен</p>
                    <p>Дата заявки: ${request.requestDate}</p>
                    <p>Статус: ${request.status}</p>
                    `;
                }
    
                li.appendChild(transactionInfo); 
                ul.appendChild(li); 
                transactionContainer.appendChild(ul); 
            });
    
            // const userDataTransaction = document.querySelector('.user__data-transaction');
            // userDataTransaction.classList.remove('hidden');
        } catch (error) {
            console.error('Ошибка:', error);
            const transactionContainer = document.querySelector('.user__transaction');
            transactionContainer.innerHTML = '<div>Ошибка при загрузке заявок. Попробуйте позже.</div>';
        }
    };
    


    await checkAuthAndGetUserData();
    await getClientDataAndDisplay();

    const profilePhotoElement = document.getElementById('profile-photo');
    fetch(`http://localhost:3000/agent-photo/${AgentID}`)
        .then(response => {
            console.log(`Запрос на загрузку фото для клиента: ${AgentID}`);
            if (!response.ok) {
                console.error('Фото не найдено');
                throw new Error('Фото не найдено');
            }
            return response.blob();
        })
        .then(blob => {
            console.log('Фото получено успешно');
            const imageUrl = URL.createObjectURL(blob);
            imageContainer.style.display = 'block';

            uploadBtn.style.display = 'none';

            editBtn.style.display = 'inline-block';
            deleteBtn.style.display = 'inline-block';
            profilePhotoElement.src = imageUrl;
        })
        .catch(err => {
            console.error('Ошибка при загрузке фото:', err);
            imageContainer.style.display = 'block';

            uploadBtn.style.display = 'none';

            editBtn.style.display = 'inline-block';
            deleteBtn.style.display = 'inline-block';
            profilePhotoElement.src = 'default.jpg';
        });


    document.getElementById('upload-btn').addEventListener('click', function () {
        document.getElementById('photo').click();
    });


    document.getElementById('photo').addEventListener('change', function () {
        if (photoInput.files.length === 0) {
            return;
        }

        const file = photoInput.files[0];
        profilePhoto.src = URL.createObjectURL(file);
        imageContainer.style.display = 'block';

        uploadBtn.style.display = 'none';

        editBtn.style.display = 'inline-block';
        deleteBtn.style.display = 'inline-block';

        const formData = new FormData();
        formData.append('photo', file);

        fetch(`http://localhost:3000/upload-agent-photo/${AgentID}`, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
            })
            .catch(err => {
                console.error('Ошибка при загрузке фото:', err);
            });
    });

    document.getElementById('edit').addEventListener('click', function () {
        const photoInput = document.getElementById('photo');
        photoInput.click();
    });

    document.getElementById('delete').addEventListener('click', function () {
        const imageContainer = document.getElementById('image-container');
        const uploadBtn = document.getElementById('upload-btn');
        const deleteBtn = document.getElementById('delete');
        const editBtn = document.getElementById('edit');

        imageContainer.style.display = 'none';
        uploadBtn.style.display = 'inline-block';
        deleteBtn.style.display = 'none';
        editBtn.style.display = 'none';

        fetch(`http://localhost:3000/delete-agent-photo/${AgentID}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
            })
            .catch(err => {
                console.error('Ошибка при удалении фото:', err);
            });
    });



    confirmDeleteBtn.addEventListener('click', async (event) => {
        event.stopPropagation();

        confirmationModal.classList.add('hidden');
        deleteAccountForm.classList.remove('hidden');
        deleteform.classList.remove('hidden');

        if (!Email) {
            // alert('Не удалось получить email из куки!');
            return;
        }

        console.log('EMAIL', Email);

        try {
            const response = await fetch('http://localhost:3000/delete-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Email }),
            });

            const result = await response.json();

            if (response.ok) {
                // alert(result.message); 
            } else {
                // alert(`Ошибка: ${result.message}`);
            }
        } catch (error) {
            console.error('Ошибка при запросе:', error);
            // alert('Произошла ошибка при отправке запроса. Попробуйте позже.');
        }

        document.addEventListener('click', handleClickOutside);
    });

    deleteAccountForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const userCode = checkCodeInput.value.trim();

        if (!userCode) {
            // alert('Введите код подтверждения.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/confirm-delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: Email, code: userCode }),
            });

            const result = await response.json();

            if (result.success) {
                await fetch('http://localhost:3000/logout', {
                    method: 'POST',
                    credentials: 'include',
                });
                window.location.href = 'index.html';
            } else {
                console.error(`Ошибка: ${result.message}`);
            }
        } catch (err) {
            console.error('Ошибка при подтверждении удаления аккаунта:', err);
        }
    });


    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function showDetails(element) {
        document.querySelectorAll('.case-details .lawyer-info, .case-details .assessor-info, .case-details .policy-info').forEach(el => {
            el.style.display = 'none';
        });

        element.style.display = 'block';
    }




});
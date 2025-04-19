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
    const requestsBtn = document.querySelector('.requests-btn');
    const imgActions = document.querySelector('.img-actions');
    const transactionBtn = document.querySelector('.transaction-btn');
    const userDataPolicy = document.querySelector('.user__data-policy');
    const userDataCase = document.querySelector('.user__data-case');
    const userDataTransaction = document.querySelector('.user__data-transaction');
    const userDataRequests = document.querySelector('.user__data-requests');
    const deleteAccountForm = document.getElementById('delete-account-form');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const cancelformBtn = document.querySelector('.cancel-form-btn');
    const imageContainer = document.querySelector('.image-container');
    const photoInput = document.getElementById('photo');
    const requestsContainer = document.querySelector('.user__requests');
    let ClientIDphoto;

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

    function handleClickOutside(event) {
        if (!deleteAccountForm.contains(event.target) && !deleteAccountBtn.contains(event.target)) {
            deleteAccountForm.classList.add('hidden');
            document.removeEventListener('click', handleClickOutside);
        }
    }

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

    confirmDeleteBtn.addEventListener('click', async (event) => {
        event.stopPropagation();

        confirmationModal.classList.add('hidden');
        deleteAccountForm.classList.remove('hidden');
        deleteform.classList.remove('hidden');

        const email = getCookie('userEmail');

        if (!email) {
            // alert('Не удалось получить email из куки!');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/delete-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
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

        const userEmail = getCookie('userEmail');
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
                body: JSON.stringify({ email: userEmail, code: userCode }),
            });

            const result = await response.json();

            if (result.success) {
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

    // document.querySelectorAll('.user__data-policy, .user__data-case, .user__data-transaction').forEach(container => {
    //     const list = container.querySelector('ul'); 
    //     if (list && !list.children.length) { 
    //         container.classList.add('is-empty'); 
    //     } else {
    //         container.classList.remove('hidden'); 
    //         container.classList.remove('is-empty'); 
    //     }
    // });

    const tabs = [
        { button: policyBtn, content: userDataPolicy },
        { button: caseBtn, content: userDataCase },
        { button: transactionBtn, content: userDataTransaction },
        { button: requestsBtn, content: userDataRequests }
    ];

    function switchTab(activeButton) {
        tabs.forEach(({ button, content }) => {
            if (button === activeButton) {
                button.classList.add('active');
                content.classList.remove('hidden');
            } else {
                button.classList.remove('active');
                content.classList.add('hidden');
            }
        });
    }

    policyBtn.addEventListener('click', () => switchTab(policyBtn, userDataPolicy));
    caseBtn.addEventListener('click', () => switchTab(caseBtn, userDataCase));
    transactionBtn.addEventListener('click', () => switchTab(transactionBtn, userDataTransaction));
    requestsBtn.addEventListener('click', () => switchTab(requestsBtn, userDataRequests));

    let sentPolicyIds = new Set();
    let addedCaseIds = new Set();
    let caseItemsToAdd = [];

    imgActions.addEventListener('mouseover', () => {
        btnEdit.style.display = 'block';
        btnDelete.style.display = 'block';
    });

    imgActions.addEventListener('mouseout', () => {
        btnEdit.style.display = 'none';
        btnDelete.style.display = 'none';
    });

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

            const clientResponse = await fetch(`http://localhost:3000/get-client?email=${userEmail}`);
            const clientData = await clientResponse.json();
            console.log(JSON.stringify(clientData, null, 2));

            if (clientData.success) {
                const client = clientData.user;
                const editBtn = document.getElementById('edit-btn');
                ClientIDphoto = client.clientid;
            
                document.querySelector('.user__info-name').textContent = `${client.firstname} ${client.lastname}`;
                document.querySelector('.user__info-email').textContent = `${client.email}`;
                document.querySelector('.user__info-phone').textContent = `${client.phonenumber}`;
                document.querySelector('.user__info-birthyear').textContent = `${client.birthyear}`;
                document.querySelector('.user__info-address').textContent = `${client.address}`;
            
                const requestsResponse = await fetch(`http://localhost:3000/get-client-requests?clientid=${client.clientid}`);
                const requestsData = await requestsResponse.json();
            
                if (requestsData.success) {
                    const requests = requestsData.requests;
            
                    requestsContainer.innerHTML = '';
            
                    requests.forEach(request => {
                        const requestList = document.createElement('ul');
                        requestList.classList.add('user__request-list');
            
                        const requestItem = document.createElement('li');
                        requestItem.classList.add('user__request');

                        const insuranceAmount = request.insuranceAmount != null ? String(request.insuranceAmount).replace(' RUB', '') : '';
            
                        const urlParams = new URLSearchParams({
                            requestId: request.requestId || request.caseId,
                            policyType: request.policyType,
                            claimType: request.claimType || '',
                            claimDate: request.claimDate || '',
                            startDate: request.startDate || '',
                            insuranceAmount: insuranceAmount
                        }).toString();
            
                        if (request.type === 'Заявки на полисы') {
                            requestItem.innerHTML = `
                                <p class="user__request-type">Тип: ${request.type}</p>
                                <p class="user__request-policy-type">Тип полиса: <span contenteditable="false">${request.policyType}</span></p>
                                <p class="user__request-start-date">Дата начала: <span contenteditable="false">${request.startDate || '—'}</span></p>
                                <p class="user__request-amount">Страховая сумма: <span contenteditable="false">${request.insuranceAmount || '—'}</span> RUB</p>
                                <p class="user__request-date">Дата заявки: ${new Date(request.requestDate).toLocaleString()}</p>
                                <p class="user__request-status">Статус: ${request.status}</p>
                                <div class="user__requests-actions">
                                    <button class="user__requests-cancelbtn top__link" data-id="${request.requestId}">Отменить</button>
                                    <a class="user__requests-editbtn top__link" href="policyCreation.html?${urlParams}">Изменить</a>
                                </div>
                            `;
                        } else if (request.type === 'Заявки на случаи') {
                            requestItem.innerHTML = `
                                <p class="user__request-type">Тип: ${request.type}</p>
                                <p class="user__request-policy-type">Тип полиса: <span contenteditable="false">${request.policyType}</span></p>
                                <p class="user__request-claim-type">Тип претензии: <span contenteditable="false">${request.claimType}</span></p>
                                <p class="user__request-claim-date">Дата претензии: <span contenteditable="false">${request.claimDate || '—'}</span></p>
                                <p class="user__request-date">Дата заявки: ${new Date(request.requestDate).toLocaleString()}</p>
                                <p class="user__request-status">Статус: ${request.status}</p>
                                <div class="user__requests-actions">
                                    <button class="user__requests-cancelbtn top__link" data-id="${request.caseId}">Отменить</button>
                                    <a class="user__requests-editbtn top__link" href="caseCreation.html?${urlParams}">Изменить</a>
                                </div>
                            `;
                        }
            
                        let statusClass = '';
                        switch (request.status.toLowerCase()) {
                            case 'завершен':
                                statusClass = 'user__case--closed';
                                break;
                            case 'ожидается':
                            case 'в ожидании':
                                statusClass = 'user__case--pending';
                                break;
                            default:
                                statusClass = 'user__case--def';
                                break;
                        }
                        requestItem.classList.add(statusClass);
            
                        requestList.appendChild(requestItem);
            
                        requestsContainer.appendChild(requestList);
                    });
                } else {
                    console.log('Заявки не найдены для данного клиента.');
                }
            
            
                
                

                const policyResponse = await fetch(`http://localhost:3000/get-client-policy?clientid=${client.clientid}`);
                const policyData = await policyResponse.json();

                if (policyData.success) {
                    const policies = policyData.policies;


                    const policyContainer = document.querySelector('.user__data-policy');
                    policyContainer.innerHTML = '';
                    const policyIds = [];
                    policies.forEach(async policy => {
                        const policyItem = document.createElement('ul');
                        policyItem.classList.add('user__policy');
                        policyItem.setAttribute('data-policy-id', policy.policyid);

                        const listItem = document.createElement('li');
                        listItem.classList.add('user__policy--one');

                        listItem.innerHTML = `
                            <p class="user__policy-number">Номер: ${policy.policyid}</p>
                            <p class="user__policy-type">Тип страховки: ${policy.policytype}</p>
                            <p class="user__policy-startdate">Дата начала: ${policy.startdate}</p>
                            <p class="user__policy-enddate">Дата окончания: ${policy.enddate}</p>
                            <p class="user__policy-amount">Выплата: ${policy.insuranceamount} RUB</p>
                            <p class="user__policy-premium">Премия: ${policy.premium} RUB</p>


                            <svg class="user__policy-imginfo" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 245.334 245.334" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 245.334 245.334"><g><path d="M122.667,0C55.028,0,0,55.028,0,122.667s55.027,122.667,122.666,122.667s122.667-55.028,122.667-122.667 S190.305,0,122.667,0z M122.667,215.334C71.57,215.334,30,173.764,30,122.667S71.57,30,122.667,30s92.667,41.57,92.667,92.667 S173.763,215.334,122.667,215.334z"/><rect width="30" x="107.667" y="109.167" height="79"/><rect width="30" x="107.667" y="57.167" height="29"/></g></svg>


                            <svg class="user__policy-img" width="116" height="33" viewBox="0 0 116 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.76 32C1.41333 32 1.12 31.8933 0.88 31.68C0.666667 31.44 0.56 31.1467 0.56 30.8V1.96C0.56 1.61333 0.666667 1.33333 0.88 1.12C1.12 0.879999 1.41333 0.759999 1.76 0.759999H21C21.32 0.759999 21.6 0.879999 21.84 1.12C22.08 1.33333 22.2 1.61333 22.2 1.96C22.2 2.28 22.08 2.56 21.84 2.8C21.6 3.04 21.32 3.16 21 3.16H2.96V15.16H16.2C16.5467 15.16 16.8267 15.28 17.04 15.52C17.28 15.7333 17.4 16.0133 17.4 16.36C17.4 16.7067 17.28 17 17.04 17.24C16.8267 17.48 16.5467 17.6 16.2 17.6H2.96V30.8C2.96 31.1467 2.84 31.44 2.6 31.68C2.38667 31.8933 2.10667 32 1.76 32ZM37.6 32.24C35.4667 32.24 33.5467 31.76 31.84 30.8C30.16 29.8133 28.8267 28.48 27.84 26.8C26.88 25.0933 26.4 23.1867 26.4 21.08C26.4 18.9467 26.88 17.04 27.84 15.36C28.8267 13.6533 30.16 12.32 31.84 11.36C33.5467 10.3733 35.4667 9.88 37.6 9.88C39.7333 9.88 41.64 10.3733 43.32 11.36C45 12.32 46.32 13.6533 47.28 15.36C48.2667 17.04 48.76 18.9467 48.76 21.08C48.76 23.1867 48.2667 25.0933 47.28 26.8C46.32 28.48 45 29.8133 43.32 30.8C41.64 31.76 39.7333 32.24 37.6 32.24ZM37.6 30C39.28 30 40.7733 29.6133 42.08 28.84C43.4133 28.04 44.4533 26.9733 45.2 25.64C45.9733 24.28 46.36 22.7467 46.36 21.04C46.36 19.36 45.9733 17.8533 45.2 16.52C44.4533 15.16 43.4133 14.0933 42.08 13.32C40.7733 12.52 39.28 12.12 37.6 12.12C35.9467 12.12 34.4533 12.52 33.12 13.32C31.7867 14.0933 30.7333 15.16 29.96 16.52C29.1867 17.8533 28.8 19.3733 28.8 21.08C28.8 22.76 29.1867 24.28 29.96 25.64C30.7333 26.9733 31.7867 28.04 33.12 28.84C34.4533 29.6133 35.9467 30 37.6 30ZM55.5484 18.64C55.7084 16.9333 56.1751 15.4267 56.9484 14.12C57.7218 12.7867 58.7218 11.7467 59.9484 11C61.1751 10.2533 62.5351 9.88 64.0284 9.88C65.0418 9.88 65.8284 10 66.3884 10.24C66.9484 10.48 67.1618 10.9067 67.0284 11.52C66.9484 11.92 66.7618 12.16 66.4684 12.24C66.1751 12.32 65.8151 12.3333 65.3884 12.28C64.9884 12.2 64.5351 12.16 64.0284 12.16C62.6951 12.16 61.5084 12.44 60.4684 13C59.4284 13.56 58.6151 14.3333 58.0284 15.32C57.4418 16.28 57.1484 17.3867 57.1484 18.64H55.5484ZM55.9484 32C55.6018 32 55.3084 31.8933 55.0684 31.68C54.8551 31.44 54.7484 31.1467 54.7484 30.8V11.32C54.7484 10.9467 54.8551 10.6533 55.0684 10.44C55.3084 10.2267 55.6018 10.12 55.9484 10.12C56.3218 10.12 56.6151 10.2267 56.8284 10.44C57.0418 10.6533 57.1484 10.9467 57.1484 11.32V30.8C57.1484 31.1467 57.0418 31.44 56.8284 31.68C56.6151 31.8933 56.3218 32 55.9484 32ZM81.2475 32C79.7808 31.9733 78.4742 31.64 77.3275 31C76.1808 30.3333 75.2875 29.4267 74.6475 28.28C74.0075 27.1067 73.6875 25.7867 73.6875 24.32V4.4C73.6875 4.02666 73.7942 3.73333 74.0075 3.52C74.2475 3.28 74.5408 3.16 74.8875 3.16C75.2608 3.16 75.5542 3.28 75.7675 3.52C76.0075 3.73333 76.1275 4.02666 76.1275 4.4V24.32C76.1275 25.8667 76.6075 27.1333 77.5675 28.12C78.5275 29.08 79.7675 29.56 81.2875 29.56H82.1675C82.5408 29.56 82.8342 29.68 83.0475 29.92C83.2875 30.1333 83.4075 30.4267 83.4075 30.8C83.4075 31.1467 83.2875 31.44 83.0475 31.68C82.8342 31.8933 82.5408 32 82.1675 32H81.2475ZM70.5675 13.08C70.2475 13.08 69.9808 12.9867 69.7675 12.8C69.5808 12.5867 69.4875 12.32 69.4875 12C69.4875 11.68 69.5808 11.4267 69.7675 11.24C69.9808 11.0267 70.2475 10.92 70.5675 10.92H81.4075C81.7275 10.92 81.9808 11.0267 82.1675 11.24C82.3808 11.4267 82.4875 11.68 82.4875 12C82.4875 12.32 82.3808 12.5867 82.1675 12.8C81.9808 12.9867 81.7275 13.08 81.4075 13.08H70.5675ZM90.4203 32C90.0736 32 89.7803 31.8933 89.5403 31.68C89.327 31.44 89.2203 31.1467 89.2203 30.8V11.32C89.2203 10.9467 89.327 10.6533 89.5403 10.44C89.7803 10.2267 90.0736 10.12 90.4203 10.12C90.7936 10.12 91.087 10.2267 91.3003 10.44C91.5136 10.6533 91.6203 10.9467 91.6203 11.32V30.8C91.6203 31.1467 91.5136 31.44 91.3003 31.68C91.087 31.8933 90.7936 32 90.4203 32ZM90.3803 5.52C89.8736 5.52 89.4336 5.34666 89.0603 5C88.7136 4.62667 88.5403 4.17333 88.5403 3.64C88.5403 3.02666 88.727 2.57333 89.1003 2.28C89.5003 1.96 89.9403 1.8 90.4203 1.8C90.8736 1.8 91.287 1.96 91.6603 2.28C92.0603 2.57333 92.2603 3.02666 92.2603 3.64C92.2603 4.17333 92.0736 4.62667 91.7003 5C91.3536 5.34666 90.9136 5.52 90.3803 5.52ZM107.071 32.24C105.685 32.24 104.231 31.9867 102.711 31.48C101.191 30.9733 99.9246 30.12 98.9113 28.92C98.6979 28.6533 98.6046 28.3733 98.6313 28.08C98.6846 27.76 98.8579 27.4933 99.1513 27.28C99.4179 27.0933 99.6979 27.0267 99.9913 27.08C100.311 27.1333 100.565 27.28 100.751 27.52C101.525 28.4267 102.458 29.0667 103.551 29.44C104.671 29.7867 105.885 29.96 107.191 29.96C109.431 29.96 111.018 29.56 111.951 28.76C112.885 27.96 113.351 27.0267 113.351 25.96C113.351 24.92 112.845 24.0667 111.831 23.4C110.845 22.7067 109.311 22.2133 107.231 21.92C104.565 21.5467 102.591 20.8267 101.311 19.76C100.031 18.6933 99.3913 17.4533 99.3913 16.04C99.3913 14.7067 99.7246 13.5867 100.391 12.68C101.058 11.7467 101.965 11.0533 103.111 10.6C104.285 10.12 105.618 9.88 107.111 9.88C108.925 9.88 110.458 10.2133 111.711 10.88C112.965 11.52 113.978 12.3867 114.751 13.48C114.965 13.7467 115.031 14.04 114.951 14.36C114.898 14.6533 114.698 14.8933 114.351 15.08C114.085 15.2133 113.805 15.2533 113.511 15.2C113.218 15.1467 112.965 14.9867 112.751 14.72C112.085 13.8667 111.271 13.2267 110.311 12.8C109.378 12.3467 108.285 12.12 107.031 12.12C105.351 12.12 104.045 12.48 103.111 13.2C102.178 13.92 101.711 14.7867 101.711 15.8C101.711 16.4933 101.898 17.1067 102.271 17.64C102.671 18.1467 103.311 18.5867 104.191 18.96C105.071 19.3067 106.245 19.5867 107.711 19.8C109.711 20.0667 111.285 20.52 112.431 21.16C113.605 21.8 114.431 22.5467 114.911 23.4C115.418 24.2267 115.671 25.12 115.671 26.08C115.671 27.3333 115.271 28.4267 114.471 29.36C113.671 30.2933 112.618 31.0133 111.311 31.52C110.005 32 108.591 32.24 107.071 32.24Z" fill="white"/>;
                        `;

                        policyItem.appendChild(listItem);
                        policyContainer.appendChild(policyItem);
                        policyIds.push(policy.policyid);

                        const userPolicies = document.querySelectorAll('.user__policy');
                        const userPolicyInfo = document.querySelector('.user__policy-info');
                        const agentsList = document.querySelector('.user__info-agents');
                        const contractsList = document.querySelector('.user__contracts-list');
                        const userInfoCloseBtn = document.querySelector('.user__info-closebtn');
                        const userCaseCloseBtn = document.querySelector('.user__case-closebtn');
                        const userCaseInfo = document.querySelector('.user__case-info');
                        const userInfoInner = document.querySelector('.user__policy-info .user__info-inner');

                        userPolicies.forEach(policy => {
                            policy.addEventListener('click', async (event) => {
                                event.stopPropagation();

                                const existingClone = document.querySelector('.user__info-inner .cloned');
                                if (existingClone) {
                                    existingClone.remove();
                                }

                                const clonedPolicy = policy.cloneNode(true);
                                clonedPolicy.classList.add('cloned');

                                const clonedPolicyInner = clonedPolicy.querySelector('.user__policy--one');
                                if (clonedPolicyInner) {
                                    clonedPolicyInner.innerHTML = '';
                                }

                                clonedPolicyInner.innerHTML = `
                                    <p class="user__policy-type">Номер: ${policy.dataset.policyId}</p>
                                    <p class="user__policy-type">${policy.querySelector('.user__policy-type').textContent}</p>
                                    <p class="user__policy-startdate">${policy.querySelector('.user__policy-startdate').textContent}</p>
                                    <p class="user__policy-enddate">${policy.querySelector('.user__policy-enddate').textContent}</p>
                                    <p class="user__policy-amount">${policy.querySelector('.user__policy-amount').textContent}</p>
                                    <p class="user__policy-premium">${policy.querySelector('.user__policy-premium').textContent}</p>
                                    <svg class="user__policy-img" width="116" height="33" viewBox="0 0 116 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.76 32C1.41333 32 1.12 31.8933 0.88 31.68C0.666667 31.44 0.56 31.1467 0.56 30.8V1.96C0.56 1.61333 0.666667 1.33333 0.88 1.12C1.12 0.879999 1.41333 0.759999 1.76 0.759999H21C21.32 0.759999 21.6 0.879999 21.84 1.12C22.08 1.33333 22.2 1.61333 22.2 1.96C22.2 2.28 22.08 2.56 21.84 2.8C21.6 3.04 21.32 3.16 21 3.16H2.96V15.16H16.2C16.5467 15.16 16.8267 15.28 17.04 15.52C17.28 15.7333 17.4 16.0133 17.4 16.36C17.4 16.7067 17.28 17 17.04 17.24C16.8267 17.48 16.5467 17.6 16.2 17.6H2.96V30.8C2.96 31.1467 2.84 31.44 2.6 31.68C2.38667 31.8933 2.10667 32 1.76 32ZM37.6 32.24C35.4667 32.24 33.5467 31.76 31.84 30.8C30.16 29.8133 28.8267 28.48 27.84 26.8C26.88 25.0933 26.4 23.1867 26.4 21.08C26.4 18.9467 26.88 17.04 27.84 15.36C28.8267 13.6533 30.16 12.32 31.84 11.36C33.5467 10.3733 35.4667 9.88 37.6 9.88C39.7333 9.88 41.64 10.3733 43.32 11.36C45 12.32 46.32 13.6533 47.28 15.36C48.2667 17.04 48.76 18.9467 48.76 21.08C48.76 23.1867 48.2667 25.0933 47.28 26.8C46.32 28.48 45 29.8133 43.32 30.8C41.64 31.76 39.7333 32.24 37.6 32.24ZM37.6 30C39.28 30 40.7733 29.6133 42.08 28.84C43.4133 28.04 44.4533 26.9733 45.2 25.64C45.9733 24.28 46.36 22.7467 46.36 21.04C46.36 19.36 45.9733 17.8533 45.2 16.52C44.4533 15.16 43.4133 14.0933 42.08 13.32C40.7733 12.52 39.28 12.12 37.6 12.12C35.9467 12.12 34.4533 12.52 33.12 13.32C31.7867 14.0933 30.7333 15.16 29.96 16.52C29.1867 17.8533 28.8 19.3733 28.8 21.08C28.8 22.76 29.1867 24.28 29.96 25.64C30.7333 26.9733 31.7867 28.04 33.12 28.84C34.4533 29.6133 35.9467 30 37.6 30ZM55.5484 18.64C55.7084 16.9333 56.1751 15.4267 56.9484 14.12C57.7218 12.7867 58.7218 11.7467 59.9484 11C61.1751 10.2533 62.5351 9.88 64.0284 9.88C65.0418 9.88 65.8284 10 66.3884 10.24C66.9484 10.48 67.1618 10.9067 67.0284 11.52C66.9484 11.92 66.7618 12.16 66.4684 12.24C66.1751 12.32 65.8151 12.3333 65.3884 12.28C64.9884 12.2 64.5351 12.16 64.0284 12.16C62.6951 12.16 61.5084 12.44 60.4684 13C59.4284 13.56 58.6151 14.3333 58.0284 15.32C57.4418 16.28 57.1484 17.3867 57.1484 18.64H55.5484ZM55.9484 32C55.6018 32 55.3084 31.8933 55.0684 31.68C54.8551 31.44 54.7484 31.1467 54.7484 30.8V11.32C54.7484 10.9467 54.8551 10.6533 55.0684 10.44C55.3084 10.2267 55.6018 10.12 55.9484 10.12C56.3218 10.12 56.6151 10.2267 56.8284 10.44C57.0418 10.6533 57.1484 10.9467 57.1484 11.32V30.8C57.1484 31.1467 57.0418 31.44 56.8284 31.68C56.6151 31.8933 56.3218 32 55.9484 32ZM81.2475 32C79.7808 31.9733 78.4742 31.64 77.3275 31C76.1808 30.3333 75.2875 29.4267 74.6475 28.28C74.0075 27.1067 73.6875 25.7867 73.6875 24.32V4.4C73.6875 4.02666 73.7942 3.73333 74.0075 3.52C74.2475 3.28 74.5408 3.16 74.8875 3.16C75.2608 3.16 75.5542 3.28 75.7675 3.52C76.0075 3.73333 76.1275 4.02666 76.1275 4.4V24.32C76.1275 25.8667 76.6075 27.1333 77.5675 28.12C78.5275 29.08 79.7675 29.56 81.2875 29.56H82.1675C82.5408 29.56 82.8342 29.68 83.0475 29.92C83.2875 30.1333 83.4075 30.4267 83.4075 30.8C83.4075 31.1467 83.2875 31.44 83.0475 31.68C82.8342 31.8933 82.5408 32 82.1675 32H81.2475ZM70.5675 13.08C70.2475 13.08 69.9808 12.9867 69.7675 12.8C69.5808 12.5867 69.4875 12.32 69.4875 12C69.4875 11.68 69.5808 11.4267 69.7675 11.24C69.9808 11.0267 70.2475 10.92 70.5675 10.92H81.4075C81.7275 10.92 81.9808 11.0267 82.1675 11.24C82.3808 11.4267 82.4875 11.68 82.4875 12C82.4875 12.32 82.3808 12.5867 82.1675 12.8C81.9808 12.9867 81.7275 13.08 81.4075 13.08H70.5675ZM90.4203 32C90.0736 32 89.7803 31.8933 89.5403 31.68C89.327 31.44 89.2203 31.1467 89.2203 30.8V11.32C89.2203 10.9467 89.327 10.6533 89.5403 10.44C89.7803 10.2267 90.0736 10.12 90.4203 10.12C90.7936 10.12 91.087 10.2267 91.3003 10.44C91.5136 10.6533 91.6203 10.9467 91.6203 11.32V30.8C91.6203 31.1467 91.5136 31.44 91.3003 31.68C91.087 31.8933 90.7936 32 90.4203 32ZM90.3803 5.52C89.8736 5.52 89.4336 5.34666 89.0603 5C88.7136 4.62667 88.5403 4.17333 88.5403 3.64C88.5403 3.02666 88.727 2.57333 89.1003 2.28C89.5003 1.96 89.9403 1.8 90.4203 1.8C90.8736 1.8 91.287 1.96 91.6603 2.28C92.0603 2.57333 92.2603 3.02666 92.2603 3.64C92.2603 4.17333 92.0736 4.62667 91.7003 5C91.3536 5.34666 90.9136 5.52 90.3803 5.52ZM107.071 32.24C105.685 32.24 104.231 31.9867 102.711 31.48C101.191 30.9733 99.9246 30.12 98.9113 28.92C98.6979 28.6533 98.6046 28.3733 98.6313 28.08C98.6846 27.76 98.8579 27.4933 99.1513 27.28C99.4179 27.0933 99.6979 27.0267 99.9913 27.08C100.311 27.1333 100.565 27.28 100.751 27.52C101.525 28.4267 102.458 29.0667 103.551 29.44C104.671 29.7867 105.885 29.96 107.191 29.96C109.431 29.96 111.018 29.56 111.951 28.76C112.885 27.96 113.351 27.0267 113.351 25.96C113.351 24.92 112.845 24.0667 111.831 23.4C110.845 22.7067 109.311 22.2133 107.231 21.92C104.565 21.5467 102.591 20.8267 101.311 19.76C100.031 18.6933 99.3913 17.4533 99.3913 16.04C99.3913 14.7067 99.7246 13.5867 100.391 12.68C101.058 11.7467 101.965 11.0533 103.111 10.6C104.285 10.12 105.618 9.88 107.111 9.88C108.925 9.88 110.458 10.2133 111.711 10.88C112.965 11.52 113.978 12.3867 114.751 13.48C114.965 13.7467 115.031 14.04 114.951 14.36C114.898 14.6533 114.698 14.8933 114.351 15.08C114.085 15.2133 113.805 15.2533 113.511 15.2C113.218 15.1467 112.965 14.9867 112.751 14.72C112.085 13.8667 111.271 13.2267 110.311 12.8C109.378 12.3467 108.285 12.12 107.031 12.12C105.351 12.12 104.045 12.48 103.111 13.2C102.178 13.92 101.711 14.7867 101.711 15.8C101.711 16.4933 101.898 17.1067 102.271 17.64C102.671 18.1467 103.311 18.5867 104.191 18.96C105.071 19.3067 106.245 19.5867 107.711 19.8C109.711 20.0667 111.285 20.52 112.431 21.16C113.605 21.8 114.431 22.5467 114.911 23.4C115.418 24.2267 115.671 25.12 115.671 26.08C115.671 27.3333 115.271 28.4267 114.471 29.36C113.671 30.2933 112.618 31.0133 111.311 31.52C110.005 32 108.591 32.24 107.071 32.24Z" fill="white"/>;

                                `;

                                userPolicyInfo.addEventListener('click', (event) => {
                                    event.stopPropagation();
                                    clonedPolicy.style.display = 'block';
                                });

                                document.addEventListener('click', (event) => {
                                    if (!userPolicyInfo.contains(event.target) && !clonedPolicy.contains(event.target)) {
                                        clonedPolicy.style.display = 'none';
                                    }
                                });

                                userInfoCloseBtn.addEventListener('click', (event) => {
                                    event.stopPropagation();
                                    clonedPolicy.style.display = 'none';
                                });

                                userInfoInner.appendChild(clonedPolicy);

                                const policyId = policy.dataset.policyId;

                                userPolicyInfo.style.opacity = '1';
                                userPolicyInfo.style.pointerEvents = 'all';

                                agentsList.innerHTML = '';
                                contractsList.innerHTML = '';

                                try {
                                    const agentResponse = await fetch(`http://localhost:3000/agent-by-policy?policyId=${policyId}`);
                                    if (!agentResponse.ok) throw new Error('Ошибка при получении данных агента');

                                    const agentData = await agentResponse.json();

                                    if (agentData.success) {
                                        const { agentid, firstname, lastname, phonenumber, email, hiredate, department, branchid } = agentData.agent;

                                        const existingAgent = Array.from(agentsList.children).find(item => item.dataset.agentid === String(agentid));
                                        if (!existingAgent) {
                                            const agentItem = document.createElement('li');
                                            agentItem.dataset.agentid = agentid;
                                            agentItem.innerHTML = `
                                            <li>
                                                <h2>Ваш страховой агент</h2>
                                                <img src="images/agent-1.jpg" alt="juj(((">
                                                <p>Номер полиса: ${policyId}</p>
                                                <p>Имя: ${firstname} ${lastname}</p>
                                                <p>Телефон: ${phonenumber}</p>
                                                <p>Email: ${email}</p>
                                                <p>Дата: ${hiredate}</p>
                                                <p>Отдел: ${department}</p>
                                            </li>
                                        `;
                                            agentsList.appendChild(agentItem);
                                        } else {
                                        }
                                    } else {
                                        console.error('Не удалось получить данные агента для полиса', policyId);
                                    }
                                } catch (error) {
                                    console.error('Ошибка при запросе данных агента:', error);
                                }

                                try {
                                    const contractResponse = await fetch(`http://localhost:3000/contract-by-policy?policyId=${policyId}`);
                                    if (!contractResponse.ok) throw new Error('Ошибка при получении данных договора');

                                    const contractData = await contractResponse.json();
                                    if (contractData.success) {
                                        const { contractid, terms, status, signdate } = contractData.contract;

                                        const existingContract = Array.from(contractsList.children).find(item => item.dataset.contractid === String(contractid));
                                        if (!existingContract) {
                                            const contractItem = document.createElement('li');
                                            contractItem.dataset.contractid = contractid;
                                            contractItem.innerHTML = `
                                                <li>
                                                    <h2 class="user__list-contract--1">ДОГОВОР</h2>
                                                    <p><strong>Номер договора:</strong> ${contractid}</p>
                                                    <p><strong>Статус:</strong> ${status}</p>
                                                    <p><strong>Дата договора:</strong> ${signdate}</p>
                                                    <p><strong>Условия:</strong> ${terms}</p>
                                                </li>
                                            `;
                                            contractsList.appendChild(contractItem);
                                        } else {
                                        }
                                    } else {
                                        console.error('Договор не найден:', contractData.message);
                                    }
                                } catch (error) {
                                    console.error('Ошибка при запросе данных договора:', error);
                                }
                            });
                        });

                        document.addEventListener('click', (event) => {
                            if (!userPolicyInfo.contains(event.target)) {
                                userPolicyInfo.style.opacity = '0';
                                userPolicyInfo.style.pointerEvents = 'none';
                            }
                        });

                        document.addEventListener('click', (event) => {
                            if (!userCaseInfo.contains(event.target)) {
                                event.stopPropagation();
                                userCaseInfo.style.opacity = '0';
                                userCaseInfo.style.pointerEvents = 'none';
                                const userCaseCloseBtn = document.querySelector('.user__case-closebtn');
                                userCaseCloseBtn.style.display = 'none';
                            }
                        });

                        userInfoCloseBtn.addEventListener('click', (event) => {
                            event.stopPropagation();
                            userPolicyInfo.style.opacity = '0';
                            userPolicyInfo.style.pointerEvents = 'none';
                        });

                        userCaseCloseBtn.addEventListener('click', () => {
                            userCaseInfo.style.opacity = '0';
                            userCaseInfo.style.pointerEvents = 'none';
                            const userCaseCloseBtn = document.querySelector('.user__case-closebtn');
                            userCaseCloseBtn.style.display = 'none';
                        });

                    });

                    const caseContainer = document.querySelector('.user__data-case');

                    for (const policyId of policyIds) {
                        if (!sentPolicyIds.has(policyId)) {
                            sentPolicyIds.add(policyId);

                            try {
                                const caseResponse = await fetch(`http://localhost:3000/get-client-case`, {
                                    method: 'POST',
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ policyId }),
                                });

                                const caseData = await caseResponse.json();

                                if (caseData.success) {
                                    const uniqueCases = caseData.cases.filter(singleCase => {
                                        if (!addedCaseIds.has(singleCase.caseid)) {
                                            addedCaseIds.add(singleCase.caseid);
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });

                                    function areObjectsEqual(obj1, obj2) {
                                        return Object.keys(obj1).every(key => obj1[key] === obj2[key]);
                                    }

                                    const filteredCases = uniqueCases.filter((singleCase, index, self) =>
                                        index === self.findIndex(otherCase => areObjectsEqual(singleCase, otherCase))
                                    );

                                    filteredCases.forEach(singleCase => {
                                        const caseItem = document.createElement('ul');
                                        caseItem.classList.add('user__case');
                                        caseItem.setAttribute('data-case-id', singleCase.caseid);

                                        const caseListItem = document.createElement('li');
                                        caseListItem.classList.add('user__case--one');

                                        let statusClass = '';

                                        switch (singleCase.casestatus.toLowerCase()) {
                                            case 'закрыт':
                                                statusClass = 'user__case--closed';
                                                break;
                                            case 'в процессе':
                                            case 'ожидает выплату':
                                                statusClass = 'user__case--pending';
                                                break;
                                            default:
                                                statusClass = 'user__case--def';
                                                break;
                                        }

                                        caseListItem.classList.add(statusClass);

                                        caseListItem.innerHTML = `
                                            <!-- <p class="user__case-policynumber">Номер полиса: ${singleCase.policyid}</p> -->
                                            <p class="user__case-type">Тип: ${singleCase.casetype}</p>
                                            <p class="user__case-date">Дата: ${singleCase.casedate}</p>
                                            <p class="user__case-status">Статус: ${singleCase.casestatus}</p>
                                            <p class="user__case-payout">Сумма: ${singleCase.payoutamount} RUB</p>
                                            <svg class="user__case-imginfo" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 245.334 245.334" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 245.334 245.334"><g><path d="M122.667,0C55.028,0,0,55.028,0,122.667s55.027,122.667,122.666,122.667s122.667-55.028,122.667-122.667 S190.305,0,122.667,0z M122.667,215.334C71.57,215.334,30,173.764,30,122.667S71.57,30,122.667,30s92.667,41.57,92.667,92.667 S173.763,215.334,122.667,215.334z"/><rect width="30" x="107.667" y="109.167" height="79"/><rect width="30" x="107.667" y="57.167" height="29"/></g></svg>

                                        `;

                                        caseItem.appendChild(caseListItem);
                                        caseItemsToAdd.push(caseItem);
                                    });

                                    const transactionContainer = document.querySelector('.user__data-transaction .user__transaction');
                                    transactionContainer.innerHTML = '';

                                    for (const caseId of addedCaseIds) {
                                        const paymentsResponse = await fetch('http://localhost:3000/get-case-payments', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ caseId }),
                                        });

                                        if (!paymentsResponse.ok) {
                                            throw new Error(`Ошибка получения платежей для случая с caseId: ${caseId}`);
                                        }

                                        const paymentsData = await paymentsResponse.json();

                                        if (paymentsData.success) {

                                            const existingTransactionList = transactionContainer.querySelector(`ul[data-case-id="${caseId}"]`);

                                            if (existingTransactionList) {
                                                continue;
                                            }

                                            const transactionList = document.createElement('ul');
                                            transactionList.classList.add('user__transaction');
                                            transactionList.setAttribute('data-case-id', caseId);

                                            paymentsData.payments.forEach(payment => {
                                                const paymentHTML = `
                                                    <p class="transaction__type">Тип: Выплата</p>
                                                    <p class="transaction__id">Номер случая: ${payment.caseid}</p> 
                                                    <p class="transaction__policytype">Вид случая: ${payment.CaseDetails.casetype}</p> 
                                                    <p class="transaction__date">Дата: ${payment.payoutdate}</p>
                                                    <p class="transaction__amount">Сумма: ${payment.amount} RUB</p>
                                                    <p class="transaction__method">Метод: ${payment.paymentmethod}</p>
                                                    <p class="transaction__status">Статус: ${payment.status}</p>
                                                `;

                                                let statusClass = '';
                                                switch (payment.status.toLowerCase().trim()) {
                                                    case 'завершен':
                                                        statusClass = 'user__case--closed';
                                                        break;
                                                    case 'в процессе':
                                                        statusClass = 'user__case--pending';
                                                        break;
                                                    default:
                                                        statusClass = 'user__case--def';
                                                        break;
                                                }

                                                const listItem = document.createElement('li');
                                                listItem.classList.add('user__transaction--item', statusClass);
                                                listItem.innerHTML = paymentHTML;

                                                transactionList.appendChild(listItem);
                                            });

                                            transactionContainer.appendChild(transactionList);

                                        } else {
                                            console.error(`Ошибка для caseId ${caseId}:`, paymentsData.message);
                                        }
                                    }


                                    const payoutsResponse = await fetch(`http://localhost:3000/get-client-payouts?clientid=${client.clientid}`);

                                    if (!payoutsResponse.ok) {
                                        throw new Error('Ошибка получения выплат клиента');
                                    }

                                    const payoutsData = await payoutsResponse.json();
                                    // 
                                    if (payoutsData.success) {

                                        payoutsData.payouts.forEach(payout => {
                                            const existingPayout = transactionContainer.querySelector(`ul[data-payout-id="${payout.transactionid}"]`);
                                            if (existingPayout) {
                                                return;
                                            }

                                            const payoutList = document.createElement('ul');
                                            payoutList.classList.add('user__transaction');
                                            payoutList.setAttribute('data-payout-id', payout.transactionid);

                                            let statusClass = '';
                                            switch (payout.status.toLowerCase()) {
                                                case 'завершен':
                                                    statusClass = 'user__case--closed';
                                                    break;
                                                case 'в ожидании' || 'в процессе':
                                                    statusClass = 'user__case--pending';
                                                    break;
                                                default:
                                                    statusClass = 'user__case--def';
                                                    break;
                                            }

                                            const listItem = document.createElement('li');
                                            listItem.classList.add('transaction-item', statusClass);
                                            listItem.innerHTML = `
                                                <p>Тип: Взнос</p>
                                                <p>Номер полиса: ${payout.policyid}</p>
                                                <p>Тип полиса: ${payout.policytype}</p>
                                                <p>Дата выплаты: ${payout.paymentdate}</p> 
                                                <p>Сумма: ${payout.amount} RUB</p>
                                                <p class="transaction__method">Метод: ${payout.paymentmethod}</p>
                                                <p>Статус: ${payout.status}</p>
                                            `;

                                            payoutList.appendChild(listItem);

                                            transactionContainer.appendChild(payoutList);
                                        });
                                    } else {
                                        console.error('Ошибка:', payoutsData.message);
                                    }

                                    // caseItemsToAdd.forEach(item => {
                                    //     document.querySelector('.user__data-case').appendChild(item);
                                    //     if (!item.hasAttribute('data-click-registered')) {
                                    //         item.addEventListener('click', (e) => {
                                    //             e.stopPropagation();
                                    //             const caseId = item.getAttribute('data-case-id');
                                    //             // 
                                    //         });
                                    //         item.setAttribute('data-click-registered', 'true'); 
                                    //     }
                                    // });



                                } else {
                                    console.error(`Не удалось получить случаи для полиса ${policyId}:`, caseData.message);
                                }

                            } catch (error) {
                                console.error(`Ошибка при обработке policyId ${policyId}:`, error);
                            }
                        } else {
                        }
                    }


                    caseContainer.innerHTML = '';
                    caseItemsToAdd.forEach(caseItem => caseContainer.appendChild(caseItem));

                } else {
                    console.error('Не удалось найти полис:', policyData.message);
                }
            } else {
                console.error('Не удалось найти клиента:', clientData.message);
                // window.location.href = "index.html";
            }

        } else {
            // window.location.href = "index.html";
        }
    } catch (error) {
        console.error('Ошибка при проверке аутентификации:', error);
        // window.location.href = "index.html";
    }

    const userCases = document.querySelectorAll('.user__case');

    if (userCases) {
        userCases.forEach(userCase => {
            userCase.addEventListener('click', async (event) => {
                event.stopPropagation();
                const userCaseCloseBtn = document.querySelector('.user__case-closebtn');
                userCaseCloseBtn.style.display = 'flex';
                const userCase = event.target.closest('.user__case');
                const caseId = userCase ? userCase.dataset.caseId : undefined;

                const userCaseInfo = document.querySelector('.user__case-info');
                const lawyerInfo = document.querySelector('.lawyer-info');
                const assessorInfo = document.querySelector('.assessor-info');

                if (userCaseInfo) {
                    userCaseInfo.style.opacity = '1';
                    userCaseInfo.style.pointerEvents = 'all';

                    userCaseInfo.innerHTML = '';

                    userCaseInfo.innerHTML = userCase.innerHTML;

                }

                if (lawyerInfo) lawyerInfo.innerHTML = '';
                if (assessorInfo) assessorInfo.innerHTML = '';

                try {
                    const caseDetailsResponse = await fetch('http://localhost:3000/get-case-details', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ caseId })
                    });

                    if (!caseDetailsResponse.ok) {
                        throw new Error(`Ошибка получения данных для случая с caseId: ${caseId}`);
                    }

                    const caseDetailsData = await caseDetailsResponse.json();

                    if (caseDetailsData.success) {

                        const { lawyer, assessor, policy } = caseDetailsData;

                        // if (lawyer && assessor && policyid) {
                        const existingCaseDetails = document.querySelector(`.case-details[data-case-id="${caseId}"]`);

                        if (!existingCaseDetails) {
                            const caseDetailsElement = document.createElement('div');
                            caseDetailsElement.classList.add('case-details');
                            caseDetailsElement.dataset.caseId = caseId;

                            const lawyerElement = document.createElement('div');
                            lawyerElement.classList.add('lawyer-info');
                            lawyerElement.innerHTML = `
                                    <h2>Ваш юрист:</h2>
                                    <img src="images/agent-1.jpg" alt="juj(((">
                                    <p>${lawyer.firstname} ${lawyer.lastname}</p>
                                    <p>Специализация: ${lawyer.specialization}</p>
                                    <p>Стаж работы: ${lawyer.experience}</p>
                                    <p>Процент выигранных дел: ${lawyer.winrate}</p>
                                `;

                            const assessorElement = document.createElement('div');
                            assessorElement.classList.add('assessor-info');
                            assessorElement.innerHTML = `
                                    <h2>Ваш Оценщик:</h2>
                                    <img src="images/agent-1.jpg" alt="juj(((">
                                    <p>${assessor.firstname} ${assessor.lastname}</p>
                                    <p>Рейтинг: ${assessor.rating}</p>
                                    <p>Стаж работы: ${assessor.experience}</p>
                                    <p>Специализация: ${assessor.specialization}</p>
                                `;

                            const policyElement = document.createElement('div');
                            policyElement.classList.add('policy-info', 'user__policy');
                            policyElement.innerHTML = `
                                    <p class="user__policy-number">Номер: ${policy.policyid}</p>
                                    <p class="user__policy-type">Тип страховки: ${policy.policytype}</p>
                                    <p class="user__policy-startdate">Дата начала: ${policy.startdate}</p>
                                    <p class="user__policy-enddate">Дата окончания: ${policy.enddate}</p>
                                    <p class="user__policy-amount">Выплата: ${policy.insuranceamount} RUB</p>
                                    <p class="user__policy-premium">Премия: ${policy.premium} RUB</p>
                   
                                `;


                            caseDetailsElement.appendChild(lawyerElement);
                            caseDetailsElement.appendChild(assessorElement);
                            caseDetailsElement.appendChild(policyElement);

                            userCaseInfo.appendChild(caseDetailsElement);


                            // lawyerElement.addEventListener('click', (event) => {
                            //     event.stopPropagation();
                            //     showDetails(lawyerElement);
                            // });

                            // assessorElement.addEventListener('click', (event) => {
                            //     event.stopPropagation();
                            //     showDetails(assessorElement);
                            // });

                            // policyElement.addEventListener('click', (event) => {
                            //     event.stopPropagation();
                            //     showDetails(policyElement);
                            // });

                            document.addEventListener('click', (event) => {
                                const policyInfo = document.querySelector('.policy-info');
                                if (!caseDetailsElement.contains(event.target) && policyInfo && !policyInfo.contains(event.target) && !userCaseInfo.contains(event.target)) {
                                    policyInfo.style.display = 'none';
                                }
                            });
                        } else {
                        }
                        // } else {
                        //     console.error('Недостаточно данных для юриста или оценщика:', caseDetailsData);
                        // }
                    } else {
                        console.error('Ошибка при загрузке данных по случаю');
                    }
                } catch (error) {
                    console.error('Ошибка при запросе данных по случаю:', error);
                }
            });
        });
    } else {
        console.error('Родительский элемент не найден');
    }

    // const userPolicies = document.querySelectorAll('.user__policy'); 
    // const userPolicyInfo = document.querySelector('.user__policy-info'); 

    // userPolicies.forEach(policy  => { 
    //     policy.addEventListener('click', (event) => { 
    //         event.stopPropagation();
    //         userPolicyInfo.style.display = 'block'; 
    //     });
    // });

    // document.addEventListener('click', (event) => {
    //     event.stopPropagation();
    //     userPolicyInfo.style.display = 'none'; 
    // });


    // const logoutButton = document.getElementById('logout');
    // logoutButton.addEventListener('click', async () => {
    //     await fetch('http://localhost:3000/logout', {
    //         method: 'POST',
    //         credentials: 'include',
    //     });
    //     window.location.href = "index.html";
    // });

    // const deleteform = document.querySelector('.delete');

    // function handleUploadButtonClick() {
    //     const fileInput = document.getElementById('photo');
    //     fileInput.click();
    // }

    // if (!uploadBtn.hasAttribute('data-listener-added')) {
    //     uploadBtn.addEventListener('click', function (event) {
    //         handleUploadButtonClick();
    //     });
    //     uploadBtn.setAttribute('data-listener-added', 'true');
    // }
    // const checkCodeInput = document.getElementById('check-code');

    // function handleClickOutside(event) {
    //     if (!deleteAccountForm.contains(event.target) && !deleteAccountBtn.contains(event.target)) {
    //         deleteAccountForm.classList.add('hidden');
    //         document.removeEventListener('click', handleClickOutside); 
    //     }
    // }

    // deleteAccountBtn.addEventListener('click', () => {
    //     confirmationModal.classList.remove('hidden'); 
    // });

    // cancelDeleteBtn.addEventListener('click', () => {
    //     confirmationModal.classList.add('hidden'); 
    //     deleteform.classList.add('hidden');
    // });

    // cancelformBtn.addEventListener('click', () => {
    //     deleteAccountForm.classList.add('hidden');
    //     deleteform.classList.add('hidden');
    // });

    // confirmDeleteBtn.addEventListener('click', (event) => {
    //     event.stopPropagation();
    //     confirmationModal.classList.add('hidden'); 
    //     deleteAccountForm.classList.remove('hidden'); 
    //     deleteform.classList.remove('hidden');

    //     document.addEventListener('click', handleClickOutside);

    // });
    // deleteAccountForm.addEventListener('submit', async (event) => {
    //     event.preventDefault(); 
    //     event.stopPropagation();

    //     const userEmail = getCookie('userEmail'); 
    //     const userCode = checkCodeInput.value.trim(); 

    //     if (!userCode) {
    //         alert('Введите код подтверждения.');
    //         return;
    //     }

    //     try {
    //         const response = await fetch('http://localhost:3000/confirm-delete', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ email: userEmail, code: userCode }),
    //         });

    //         const result = await response.json();

    //         if (result.success) {
    //             alert(result.message);
    //             window.location.href = 'index.html'; 
    //         } else {
    //             alert(`Ошибка: ${result.message}`);
    //         }
    //     } catch (err) {
    //         console.error('Ошибка при подтверждении удаления аккаунта:', err);
    //         alert('Произошла ошибка. Попробуйте еще раз.');
    //     }
    // });

    // function getCookie(name) {
    //     const value = `; ${document.cookie}`;
    //     const parts = value.split(`; ${name}=`);
    //     if (parts.length === 2) return parts.pop().split(';').shift();
    //     return null;
    // }

    const profilePhotoElement = document.getElementById('profile-photo');

    fetch(`http://localhost:3000/profile-photo/${ClientIDphoto}`)
        .then(response => {
            console.log(`Запрос на загрузку фото для клиента: ${ClientIDphoto}`);
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


    document.getElementById("agents").href = "http://localhost:3000/report/policies?clientid=" + ClientIDphoto;
    document.getElementById("clientcases").href = "http://localhost:3000/report/cases?clientid=" + ClientIDphoto;
    document.getElementById("clients").href = "http://localhost:3000/report/payouts?clientid=" + ClientIDphoto;

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

        fetch(`http://localhost:3000/upload-profile-photo/${ClientIDphoto}`, {
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

    const userInfoName = document.querySelector('.user__info-name');
    const userInfoDetails = document.querySelector('.user__info-details');
    userInfoName.addEventListener('click', (e) => {
        e.stopPropagation();
        userInfoDetails.classList.toggle('height-visible');
    });


    document.addEventListener('click', (e) => {
        if (!userInfoDetails.contains(e.target) && !userInfoName.contains(e.target)) {
            userInfoDetails.classList.remove('height-visible');
        }
    });

    const userRequestLists = document.querySelectorAll('.user__request-list');

    userRequestLists.forEach(userRequestList => {
        userRequestList.addEventListener('mouseenter', () => {
            const actions = userRequestList.querySelector('.user__requests-actions');
            if (actions) {
                actions.style.opacity = '1';
                actions.style.pointerEvents = 'all';
            }
        });

        userRequestList.addEventListener('mouseleave', () => {
            const actions = userRequestList.querySelector('.user__requests-actions');
            if (actions) {
                actions.style.opacity = '0';
                actions.style.pointerEvents = 'none';
            }
        });
    });


    document.querySelector('.user__requests').addEventListener('click', (e) => {
        if (e.target.classList.contains('user__requests-cancelbtn')) {
            const cancelButton = e.target;
            const requestId = cancelButton.dataset.id;
            const requestItem = cancelButton.closest('.user__request');
            const requestTypeElem = requestItem.querySelector('.user__request-type');

            if (!requestTypeElem) {
                // alert('Ошибка: Тип заявки не найден.');
                return;
            }

            const requestType = requestTypeElem.innerText;

            fetch('http://localhost:3000/delete-client-request', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestId: requestId,
                    type: requestType,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        requestItem.remove();
                        // alert(`Заявка "${requestType}" успешно отменена.`);
                    } else {
                        // alert(`Ошибка при отмене заявки: ${data.message}`);
                    }
                })
                .catch((error) => {
                    console.error('Ошибка при отправке запроса:', error);
                    // alert('Не удалось отменить заявку.');
                });
        }
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

        fetch(`http://localhost:3000/delete-profile-photo/${ClientIDphoto}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
            })
            .catch(err => {
                console.error('Ошибка при удалении фото:', err);
            });
    });

    function showDetails(element) {
        document.querySelectorAll('.case-details .lawyer-info, .case-details .assessor-info, .case-details .policy-info').forEach(el => {
            el.style.display = 'none';
        });

        element.style.display = 'block';
    }

});
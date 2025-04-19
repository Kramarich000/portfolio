document.addEventListener('DOMContentLoaded', function () {
    const processClaimForm = document.getElementById('process-claim-form');
    const checkCodeForm = document.getElementById('check-code-form');
    const successMessage = document.getElementById('success-notify');
    console.log('ЖЖЖЖ');
    console.log(successMessage);
    let client = {};

    fetch('http://localhost:3000/get-client-from-session', {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                client = data.client;

                console.log(client);

                document.getElementById('first-name').value = client.firstname;
                document.getElementById('last-name').value = client.lastname;
                document.getElementById('email').value = client.email;
                document.getElementById('phone').value = client.phonenumber;
                document.getElementById('birthdate').value = client.birthyear;
                document.getElementById('address').value = client.address;

                let birthdate = client.birthyear;
                document.getElementById('birthdate').value = birthdate;
                const birthyearInput = document.getElementById('birthdate');

                birthyearInput.setAttribute('readonly', true);

                let flatpickrInstance = document.querySelector("#birthdate")._flatpickr;
                if (flatpickrInstance) {
                    flatpickrInstance.setDate(birthdate, true);
                }
            } else {
                console.log('Ошибка: ' + data.message);
                // window.location.href = 'index.html';
            }
        })
        .catch(error => {
            console.log('Ошибка при получении данных клиента:', error);
            // window.location.href = 'index.html';
        });

    document.getElementById('policy-type').addEventListener('change', function () {
        const selectedPolicy = this.value;
        const claimTypeSelect = document.getElementById('claim-type');

        claimTypeSelect.value = '';

        const autoGroup = claimTypeSelect.querySelector('optgroup[label="Автострахование"]');
        const propertyGroup = claimTypeSelect.querySelector('optgroup[label="Имущественное страхование"]');
        const healthGroup = claimTypeSelect.querySelector('optgroup[label="Медицинское страхование"]');
        const travelGroup = claimTypeSelect.querySelector('optgroup[label="Путешествия"]');

        autoGroup.style.display = 'none';
        propertyGroup.style.display = 'none';
        healthGroup.style.display = 'none';
        travelGroup.style.display = 'none';

        if (selectedPolicy === 'ОСАГО' || selectedPolicy === 'КАСКО') {
            autoGroup.style.display = 'block';
        } else if (selectedPolicy === 'Здоровья' || selectedPolicy === 'Жизни') {
            healthGroup.style.display = 'block';
        } else if (selectedPolicy === 'Имущественное страхование') {
            propertyGroup.style.display = 'block';
        } else if (selectedPolicy === 'Путешествия') {
            travelGroup.style.display = 'block';
        }
    });


    processClaimForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const claimType = document.getElementById('claim-type').value.trim();

        const fields = [
            { id: 'agree-terms', errorId: 'agree-terms-error', label: 'Поставьте галочку!' },
        ];

        clearErrorMessages();
        let formIsValid = true;

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            let isValid = true;

            if (element.type === 'checkbox') {
                isValid = element.checked;
            } else {
                const value = element.value.trim();
                isValid = !!value;
            }

            if (!isValid) {
                showError(field.errorId, field.label, field.id);
                formIsValid = false;
            }
        });

        if (!formIsValid) return;

        const formDataObj = {
            clientid: client.clientid,
            email: document.getElementById('email').value.trim(),
            claimType: claimType,
            claimDate: document.getElementById('claim-date').value.trim(),
            policyType: document.getElementById('policy-type').value.trim(),
        };

        console.log('Отправляемые данные:', formDataObj);

        try {
            const verifyResponse = await fetch('http://localhost:3000/send-data-claim-mail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formDataObj.email })
            });

            const verifyResult = await verifyResponse.json();

            console.log(verifyResult);

            if (verifyResult.success === true) {
                ChangeForm(checkCodeForm);

                checkCodeForm.addEventListener('submit', async (codeEvent) => {
                    codeEvent.preventDefault();

                    const code = document.getElementById('check-code').value.trim();

                    console.log(code);

                    if (!code) {
                        showError('verification-code-error', 'Введите код из письма.', 'check-code');
                        return;
                    }

                    // Проверка наличия requestId
                    const urlParams = new URLSearchParams(window.location.search);
                    const requestId = urlParams.get('requestId');

                    const route = requestId
                        ? `http://localhost:3000/update-client-request`
                        : `http://localhost:3000/add-claim-request`;

                    const method = requestId ? 'PUT' : 'POST';

                    const body = requestId
                        ? JSON.stringify({
                            requestId,
                            type: 'Заявки на случаи',
                            updatedData: formDataObj,
                        })
                        : JSON.stringify({ code, ...formDataObj });

                    const response = await fetch(route, {
                        method: method,
                        headers: { 'Content-Type': 'application/json' },
                        body: body,
                    });

                    const result = await response.json();
                    console.log('result = ', result);

                    if (result.success) {
                        ChangeForm(successMessage);
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 3000);
                    } else {
                        showError(result.field, result.message, result.field);
                    }
                });
            } else {
                showError('server-error', verifyResult.message, null);
            }
        } catch (error) {
            showError('server-error', 'Извините, технические работы на сервере. Пожалуйста, попробуйте позже.', null);
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const policyType = urlParams.get('policyType');
    const claimType = urlParams.get('claimType');
    const claimDate = urlParams.get('claimDate');

    document.getElementById('policy-type').value = policyType || '';
    document.getElementById('claim-type').value = claimType || '';
    const claimDatePicker = flatpickr("#claim-date", {
        dateFormat: "Y-m-d",
        placeholder: "Выберите страхового случая",
        minDate: threeYearsAgoFormatted,
        maxDate: todayFormatted,
        disableMobile: true,
        altInput: true,
        altFormat: "j F, Y",
        allowInput: true,
        locale: "ru",
        mode: "single",
        onChange: function (selectedDates, dateStr, instance) {
            console.log("Выбрана дата начала полиса:", dateStr);
        }
    });

    // Устанавливаем значение даты, если оно есть
    if (claimDate) {
        claimDatePicker.setDate(claimDate, true); // true - обновляет UI
    }


    function ChangeForm(ShowingForm) {
        document.querySelectorAll('.auth-form').forEach((form) => {
            form.classList.add('hidden');
            form.classList.remove('active');
        });
        ShowingForm.classList.remove('hidden');
        ShowingForm.classList.add('active');
    }

    function showError(elementId, message, inputId) {
        console.log("Вызов showError с параметрами:", { elementId, message, inputId });

        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        } else {
            console.error(`Элемент с ID ${elementId} не найден в DOM.`);
        }

        if (inputId !== null && inputId !== undefined) {
            const userInput = document.getElementById(inputId);
            if (userInput) {
                userInput.classList.add('error');
            } else {
                console.error(`Элемент с ID ${inputId} не найден в DOM.`);
            }
        } else {
            console.log("Параметр inputId не используется.");
        }
    }

    function clearErrorMessages() {
        const errorElements = document.querySelectorAll('.error-message, .server-error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });

        const userInputs = document.querySelectorAll('.user-input');
        userInputs.forEach(input => {
            input.classList.remove('error');
        });
    }
});

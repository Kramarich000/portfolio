document.addEventListener('DOMContentLoaded', function () {
    const processPolicyForm = document.getElementById('process-policy-form');
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


    processPolicyForm.addEventListener('submit', async (event) => {
        event.preventDefault();

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

        const policyType = document.getElementById('policy-type').value.trim();
        const formDataObj = {
            clientid: client.clientid,
            email: document.getElementById('email').value.trim(),
            policyType: policyType,
            insuranceAmount: document.getElementById('insurance-amount').value.trim(),
            policyStartDate: document.getElementById('policy-start-date').value.trim(),
        };

        console.log('Отправляемые данные:', formDataObj);

        const urlParams = new URLSearchParams(window.location.search);
        const requestId = urlParams.get('requestId');

        try {
            if (requestId) {
                const updatedData = {
                    policyType,
                    startDate: document.getElementById('policy-start-date').value,
                    insuranceAmount: document.getElementById('insurance-amount').value
                };

                const response = await fetch(`http://localhost:3000/update-client-request`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        requestId,
                        type: 'Заявки на полисы',
                        updatedData
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    // alert('Заявка успешно обновлена.');
                    window.location.href = 'index.html';
                } else {
                    // alert(`Ошибка при обновлении заявки: ${data.message}`);
                }
            } else {
                const verifyResponse = await fetch('http://localhost:3000/send-data-policy-mail', {
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

                        const response = await fetch('http://localhost:3000/add-policy-request', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ code, ...formDataObj })
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
            }
        } catch (error) {
            showError('server-error', 'Извините, технические работы на сервере. Пожалуйста, попробуйте позже.', null);
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const policyType = urlParams.get('policyType');
    // const claimType = urlParams.get('claimType');
    const claimDate = urlParams.get('claimDate');
    const startDate = urlParams.get('startDate');
    let insuranceAmount = urlParams.get('insuranceAmount')?.trim();

    const insuranceAmountSelect = document.getElementById('insurance-amount');
    let optionFound = false;

    for (let option of insuranceAmountSelect.options) {
        if (option.value.trim() === insuranceAmount) {
            insuranceAmountSelect.value = option.value;
            optionFound = true;
            break;
        }
    }

    if (!optionFound) {
        console.warn('Значение insuranceAmount не совпадает с опциями:', insuranceAmount);
    }

    

    document.getElementById('policy-type').value = policyType || '';
    // document.getElementById('claim-type').value = claimType || '';

    let today = new Date();
    let maxAdultDate = new Date(); 
    maxAdultDate.setFullYear(today.getFullYear() - 18);  
    let minAllowedDate = new Date();
    minAllowedDate.setFullYear(today.getFullYear() - 100); 

    let tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    let tomorrowFormatted = tomorrow.toISOString().split('T')[0];

    const policyStartDatePicker = flatpickr("#policy-start-date", {
        dateFormat: "Y-m-d",
        placeholder: "Выберите дату начала полиса",
        disableMobile: true,
        altInput: true,
        altFormat: "j F, Y",
        allowInput: true,
        locale: "ru",
        mode: "single",
        minDate: tomorrowFormatted,
        maxDate: "2050-01-01",
        onChange: function (selectedDates, dateStr, instance) {
            console.log("Выбрана дата начала полиса:", dateStr);
        }
    });

    if (claimDate) {
        claimDatePicker.setDate(claimDate, true); 
    }

    if (startDate) {
        policyStartDatePicker.setDate(startDate, true); 
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
document.addEventListener('DOMContentLoaded', function () {
    const editDataForm = document.getElementById('edit-data-form');
    const checkCodeForm = document.getElementById('check-code-form');
    const loginAddress = document.getElementById('login-address');
    const map = document.getElementById('map');
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

                document.getElementById('edit-first-name').value = client.firstname;
                document.getElementById('edit-last-name').value = client.lastname;
                document.getElementById('edit-email').value = client.email;
                document.getElementById('edit-phone').value = client.phonenumber;
                document.getElementById('edit-birthyear').value = client.birthyear;
                document.getElementById('login-address').value = client.address;

                let birthdate = client.birthyear; 
                document.getElementById('edit-birthyear').value = birthdate; 
                const birthyearInput = document.getElementById('edit-birthyear');

                birthyearInput.setAttribute('readonly', true);

                let flatpickrInstance = document.querySelector("#edit-birthyear")._flatpickr;
                if (flatpickrInstance) {
                    flatpickrInstance.setDate(birthdate, true); 
                }
            } else {
                console.log('Ошибка: ' + data.message);
                window.location.href = 'index.html';
            }
        })
        .catch(error => {
            console.log('Ошибка при получении данных клиента:', error);
            window.location.href = 'index.html';
        });


    editDataForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fields = [
            { id: 'edit-email', errorId: 'email-error', label: 'Это поле не может быть пустым!' },
            { id: 'edit-last-name', errorId: 'lastname-error', label: 'Это поле не может быть пустым!' },
            { id: 'edit-phone', errorId: 'birthdate-error', label: 'Это поле не может быть пустым!' },
            { id: 'edit-first-name', errorId: 'firstname-error', label: 'Это поле не может быть пустым!' },
            { id: 'edit-birthyear', errorId: 'address-error', label: 'Это поле не может быть пустым!' },
            { id: 'login-address', errorId: 'phone-error', label: 'Это поле не может быть пустым!' },
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


        const firstName = document.getElementById('edit-first-name').value.trim();
        const lastName = document.getElementById('edit-last-name').value.trim();

        if (!isValidName(firstName)) {
            showError('firstname-error', 'Имя не может содержать цифры и должно начинаться с заглавной буквы.', 'edit-first-name');
            formIsValid = false;
        }

        if (!isValidName(lastName)) {
            showError('lastname-error', 'Фамилия не может содержать цифры и должна начинаться с заглавной буквы.', 'edit-last-name');
            formIsValid = false;
        }

        if (!formIsValid) return;
        console.log(client); 
        console.log(client.email); 

        const formDataObj = {
            clientid: client.clientid,
            oldEmail: client.email,
            email: document.getElementById('edit-email').value.trim(),
            lastName: document.getElementById('edit-last-name').value.trim(),
            birthYear: document.getElementById('edit-birthyear').value.trim(),
            firstName: document.getElementById('edit-first-name').value.trim(),
            address: document.getElementById('login-address').value.trim(),
            phoneNumber: document.getElementById('edit-phone').value.trim(),
        };

        console.log('Отправляемые данные:', formDataObj);

        try {
            const verifyResponse = await fetch('http://localhost:3000/send-data-edit-mail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formDataObj.email })
            });

            const verifyResult = await verifyResponse.json();

            console.log(verifyResult);

            if (verifyResult.success === true) {
                ChangeForm(checkCodeForm);

                console.log('привет');

                checkCodeForm.addEventListener('submit', async (codeEvent) => {
                    codeEvent.preventDefault();

                    console.log('привет2');

                    const code = document.getElementById('edit-verification-code').value.trim();

                    console.log(code);

                    if (!code) {
                        showError('verification-code-error', 'Введите код из письма.', 'edit-verification-code');
                        return;
                    }

                    const response = await fetch('http://localhost:3000/update-client', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code, ...formDataObj })
                    });

                    const result = await response.json();
                    console.log('result = ', result);

                    if (result.success) {
                        console.log('Данные успешно обновлены!');
                        window.location.href = 'index.html';
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


    function ChangeForm(ShowingForm) {
        document.querySelectorAll('.auth-form').forEach((form) => {
            form.classList.add('hidden');
            form.classList.remove('active');
        });
        ShowingForm.classList.remove('hidden');
        ShowingForm.classList.add('active');
    }

    loginAddress.addEventListener('click', (e) => {
        e.stopPropagation();
        map.classList.remove('hidden');
    });

    document.addEventListener('click', (e) => {

        if (!map.contains(e.target)) {
            map.classList.add('hidden');
        }
    });


    function isValidName(name) {
        const namePattern = /^[A-Za-zА-Яа-яЁё]+$/;
        return namePattern.test(name) && name[0] === name[0].toUpperCase();
    }

    // function showError(elementId, message, inputId) {
    //     const errorElement = document.getElementById(elementId);
    //     if (errorElement) errorElement.textContent = message;

    //     const userInput = document.getElementById(inputId);
    //     if (userInput) userInput.classList.add('error');
    // }

    function formatPhoneNumber(event) {
        let value = event.target.value;

        value = value.replace(/\D/g, "");

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        let formattedValue = "+7";

        if (value.length > 1) {
            formattedValue += " (" + value.slice(1, 4);
        }
        if (value.length > 4) {
            formattedValue += ") " + value.slice(4, 7);
        }
        if (value.length > 7) {
            formattedValue += "-" + value.slice(7, 9);
        }
        if (value.length > 9) {
            formattedValue += "-" + value.slice(9, 11);
        }

        event.target.value = formattedValue;

        validatePhoneNumber(formattedValue);

        function validatePhoneNumber(value) {
            const phoneError = document.getElementById('phone-error');

            if (value.length < 18) {
                phoneError.textContent = 'Неверный формат номера телефона. Пример: +7 (XXX) XXX-XX-XX';
                document.getElementById('login-tel').classList.add('error');
            } else {
                phoneError.textContent = '';
                document.getElementById('login-tel').classList.remove('error');
            }
        }
    }


    document.getElementById('edit-phone').addEventListener('input', formatPhoneNumber);


    // function clearErrorMessages() {
    //     document.querySelectorAll('.error-message').forEach(element => element.textContent = '');
    //     document.querySelectorAll('.user-input').forEach(input => input.classList.remove('error'));
    // }


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
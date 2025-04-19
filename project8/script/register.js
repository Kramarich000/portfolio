document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const registerButton = document.getElementById('show-register');
    const loginButton = document.getElementById('show-login');
    const authTitle = document.querySelector('.auth-title');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const forgotPasswordLink = document.getElementById('show-forgot-password');
    const resetCodeForm = document.getElementById('reset-code-form');
    const checkCodeForm = document.getElementById('check-code-form');
    const resetPasswordForm = document.getElementById('reset-password-form');
    const loginAddress = document.getElementById('login-address');
    const map = document.getElementById('map');
    const successMessage = document.getElementById('success-notify');
    console.log(map);

    // const user = JSON.parse(localStorage.getItem('user'));
    // if (user) {
    //     // authTitle.textContent = `Добро пожаловать, ${user.email}!`;
    //     registerForm.classList.add('hidden');
    //     loginForm.classList.add('hidden');
    // } else {
    //     registerForm.classList.add('active');
    // }

    registerButton.style.color = '#0066ff';

    registerButton.addEventListener('click', () => {
        authTitle.textContent = 'Регистрация';
        document.title = 'Регистрация';
        forgotPasswordLink.style.display = 'inline';
        loginButton.style.color = '#151515';
        registerButton.style.color = '#0066ff';
        ChangeForm(registerForm);
    });

    loginButton.addEventListener('click', () => {
        authTitle.textContent = 'Вход';
        document.title = 'Вход';
        forgotPasswordLink.style.display = 'inline';
        registerButton.style.color = '#151515';
        loginButton.style.color = '#0066ff';
        ChangeForm(loginForm);
    });

    forgotPasswordLink.addEventListener('click', (event) => {
        event.preventDefault();
        document.title = 'Восстановление';
        authTitle.textContent = 'Восстановление пароля';
        loginButton.style.color = '#151515';
        registerButton.style.color = '#151515';
        forgotPasswordLink.style.display = 'none';
        ChangeForm(forgotPasswordForm);
    });
    forgotPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const formDataObj = {
            email: formData.get('email'),
        };
        console.log('Отправляемые данные:', formDataObj);

        try {
            const response = await fetch('http://localhost:3000/send-mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formDataObj).toString(),
            });

            const result = await response.json();

            if (result.success) {
                // alert('Email успешно отправлен!');
                authTitle.textContent = 'Введите код восстановления';
                ChangeForm(resetCodeForm);
            } else {
                // alert('Произошла ошибка при отправке: ' + result.message);
            }
        } catch (error) {
            // alert('Ошибка при отправке запроса: ' + error.message);
        }
    });

    resetCodeForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const code = document.getElementById('reset-code').value.trim();
        const email = document.getElementById('forgot-email').value.trim();

        const formDataObj = {
            email: email,
            code: code
        };
        console.log('Отправляемые данные:', formDataObj);

        try {
            const response = await fetch('http://localhost:3000/reset-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formDataObj).toString(),
            });

            const result = await response.json();

            if (result.success) {
                // alert('Код подтверждения верен!');
                ChangeForm(resetPasswordForm);

            } else {
                // alert('Неверный код подтверждения: ' + result.message);
                return;
            }
        } catch (error) {
            // alert('Ошибка при отправке запроса: ' + error.message);
        }
    });

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fields = [
            { id: 'reg-email', errorId: 'email-error', label: 'Это поле не может быть пустым!' },
            { id: 'last-username', errorId: 'lastname-error', label: 'Это поле не может быть пустым!' },
            { id: 'birthdate-username', errorId: 'birthdate-error', label: 'Это поле не может быть пустым!' },
            { id: 'first-username', errorId: 'firstname-error', label: 'Это поле не может быть пустым!' },
            { id: 'login-address', errorId: 'address-error', label: 'Это поле не может быть пустым!' },
            { id: 'login-tel', errorId: 'phone-error', label: 'Это поле не может быть пустым!' },
            { id: 'reg-password', errorId: 'password-error', label: 'Пароль не может быть пустым!' },
            { id: 'confirm-reg-password', errorId: 'confirm-password-error', label: 'Пароль не может быть пустым!' },
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


        const passwordValue = document.getElementById('reg-password').value.trim();
        const confirmRegPasswordValue = document.getElementById('confirm-reg-password').value.trim();

        if (passwordValue !== confirmRegPasswordValue) {
            showError('confirm-password-error', 'Пароли не совпадают!', 'confirm-reg-password');
            formIsValid = false;
        }

        if (!isValidPassword(passwordValue)) {
            showError('password-error', 'Пароль должен содержать минимум 8 символов, одну заглавную букву и один спецсимвол.', 'reg-password');
            formIsValid = false;
        }

        const firstName = document.getElementById('first-username').value.trim();
        const lastName = document.getElementById('last-username').value.trim();



        if (!isValidName(firstName)) {
            showError('firstname-error', 'Имя не может содержать цифры и должно начинаться с заглавной буквы.', 'first-username');
            formIsValid = false;
        }

        if (!isValidName(lastName)) {
            showError('lastname-error', 'Фамилия не может содержать цифры и должна начинаться с заглавной буквы.', 'last-username');
            formIsValid = false;
        }

        if (!formIsValid) return;

        const formDataObj = {
            email: document.getElementById('reg-email').value.trim(),
            password: passwordValue,
            lastUsername: document.getElementById('last-username').value.trim(),
            birthDate: document.getElementById('birthdate-username').value.trim(),
            firstName: document.getElementById('first-username').value.trim(),
            loginAddress: document.getElementById('login-address').value.trim(),
            loginNumber: document.getElementById('login-tel').value.trim(),
        };

        console.log('Отправляемые данные:', formDataObj);

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formDataObj),
            });

            const result = await response.json();
            console.log('result = ', result);
            if (result.success) {
                // alert('Регистрация успешна!');
                ChangeForm(checkCodeForm);
            } else {
                if (result.field === 'reg-email') {
                    showError(result.field, result.message, 'reg-email');
                }
                else if (result.field === 'reg-tel') {
                    showError(result.field, result.message, 'reg-tel');
                }

                else {
                    showError(result.field, 'Критическая ошибка');
                }
            }
        } catch (error) {
            showError('server-error', 'Извините, технические работы на сервере. Пожалуйста, попробуйте позже.');
        }
    });

    loginAddress.addEventListener('click', (e) => {
        e.stopPropagation();
        map.classList.remove('hidden');
    });

    document.addEventListener('click', (e) => {

        if (!map.contains(e.target)) {
            map.classList.add('hidden');
        }
    });

    function isValidPassword(password) {
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return passwordPattern.test(password);
    }

    function isValidName(name) {
        const namePattern = /^[A-Za-zА-Яа-яЁё]+$/;
        return namePattern.test(name) && name[0] === name[0].toUpperCase();
    }

    function showError(elementId, message, inputId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) errorElement.textContent = message;

        const userInput = document.getElementById(inputId);
        if (userInput) userInput.classList.add('error');
    }

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
    }

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


    document.getElementById('login-tel').addEventListener('input', formatPhoneNumber);


    // function clearErrorMessages() {
    //     document.querySelectorAll('.error-message').forEach(element => element.textContent = '');
    //     document.querySelectorAll('.user-input').forEach(input => input.classList.remove('error'));
    // }


    function showError(elementId, message, inputId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        } else {
            console.error(`Элемент с ID ${elementId} не найден`);
        }

        const userInput = document.getElementById(inputId);
        if (userInput) {
            userInput.classList.add('error');
        } else {
            console.error(`Элемент с ID ${inputId} не найден`);
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

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        // const authLink = document.getElementById('auth-link');

        if (!email || !password) {
            // alert('Заполните все поля!');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const result = await response.json();
            console.log('Result:', result);
            console.log('Success:', result.success);
            console.log('Role:', result.role);


            console.log('Result:', result);

            if (result.success === true) {
                if (result.role === 'AGENT') {
                    window.location.replace('agent-account.html');
                } else if (result.role === 'CLIENT') {
                    window.location.replace('account.html');
                }
            } else {
                console.log('Login failed:', result.message);
            }


        } catch (error) {
            // alert('Ошибка при отправке запроса: ' + error.message);
        }
    });

    checkCodeForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value.trim();

        const code = document.getElementById('check-code').value.trim();
        const email = document.getElementById('reg-email').value.trim();

        const lastUsername = document.getElementById('last-username').value.trim();
        const birthDate = document.getElementById('birthdate-username').value.trim();
        const firstName = document.getElementById('first-username').value.trim();
        const loginAddress = document.getElementById('login-address').value.trim();
        const loginTel = document.getElementById('login-tel').value.trim();

        const formDataObj = {
            email: email,
            code: code,
            password: password,
            lastUsername: lastUsername,
            birthDate: birthDate,
            firstName: firstName,
            loginAddress: loginAddress,
            loginNumber: loginTel,
        };

        console.log('Отправляемые данные:', formDataObj);

        try {
            const response = await fetch('http://localhost:3000/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formDataObj).toString(),
            });

            const result = await response.json();

            if (result.success) {
                ChangeForm(successMessage);
                forgotPasswordLink.classList.add('hidden');
                setTimeout(() => {
                    ChangeForm(loginForm);
                    forgotPasswordLink.classList.remove('hidden');

                    authTitle.textContent = 'Вход';
                    registerButton.style.color = '#151515';
                    loginButton.style.color = '#0066ff';
                    document.title = 'Вход';
                }, 30000);


            } else {
                // alert('Неверный код подтверждения: ' + result.message);
                return;
            }
        } catch (error) {
            // alert('Ошибка при отправке запроса: ' + error.message);
        }

    });

    resetPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const password = document.getElementById('reset-password');
        const newPassword = document.getElementById('reset-new-password');
        const newPasswordValue = newPassword.value.trim();
        const passwordValue = password.value.trim();
        const email = document.getElementById('forgot-email').value.trim();
        if (passwordValue !== newPasswordValue) {
            // alert('Пароли не совпадают!');
            return;
        }

        const formDataObj = {
            email: email,
            password: passwordValue,
            newPassword: newPasswordValue
        };

        try {
            const response = await fetch('http://localhost:3000/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formDataObj).toString(),
            });

            const result = await response.json();


            if (result.success) {
                const serverMessage = result.message;
                // alert(serverMessage);
                authTitle.textContent = 'Вход';
                registerButton.style.color = '#151515';
                loginButton.style.color = '#0066ff';
                document.title = 'Вход';
                ChangeForm(loginForm);

            } else {
                // alert('Неверный код подтверждения: ' + result.message);
                return;
            }
        } catch (error) {
            // alert('Ошибка при отправке запроса: ' + error.message);
        }

        document.title = 'Вход';
        authTitle.textContent = 'Вход';
        loginButton.style.color = '#0066ff';
        ChangeForm(loginForm);
    })


    function ChangeForm(ShowingForm) {
        document.querySelectorAll('.auth-form').forEach((form) => {
            form.classList.add('hidden');
            form.classList.remove('active');
        });
        ShowingForm.classList.remove('hidden');
        ShowingForm.classList.add('active');
    }

    // const addressInput = document.getElementById('login-address');
    //         const autocomplete = new google.maps.places.Autocomplete(addressInput);
    //         autocomplete.setFields(['address_component']);
});
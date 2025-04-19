window.addEventListener('load', async function() {
    try {
        const response = await fetch('http://localhost:3000/check-auth', {
            method: 'GET',
            credentials: 'include', 
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });

        const result = await response.json();

        if (result.authenticated) {
            console.log('User Role:', result.user.role);
            if (result.user.role !== 'AGENT') {
                window.location.href = 'index.html'; 
            }
            // else {this.window.location.href = 'register.html'}
        } else {
            // window.location.href = 'register.html'; 
        }

    } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        // window.location.href = 'register.html'; 
    }
});

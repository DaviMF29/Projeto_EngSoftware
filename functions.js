// Função que faz a solicitação para o servidor
async function registerUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    try {
        const response = await fetch('/auth/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email, password, confirmPassword })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.msg); // Exibe a mensagem de resposta do servidor para sucesso
        } else {
            alert(data.msg); // Exibe a mensagem de erro do servidor para falha
        }
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        alert('Erro ao registrar usuário. Por favor, tente novamente.');
    }
}

// Associando a função ao evento de clique do botão

//document.getElementById('registerBtn').addEventListener('click', registerUser);

async function loginUser() {
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    

    try {
        const response = await fetch('/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email,password})
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.msg); // Exibe a mensagem de resposta do servidor para sucesso
        } else {
            alert(data.msg); // Exibe a mensagem de erro do servidor para falha
        }
    } catch (error) {
        console.error('Erro ao logal usuário:', error);
        alert('Erro ao logar usuário. Por favor, tente novamente.');
    }
}

//document.getElementById('registerBtn').addEventListener('click', loginUser);

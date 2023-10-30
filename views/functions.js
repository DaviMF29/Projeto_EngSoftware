// Função que faz a solicitação para o servidor
async function registerUser() {
    const name = document.getElementById('name').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    console.log(name,lastname, email, password, confirmPassword)
    try {
        const response = await fetch('http://localhost:5000/auth/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, lastname, email, password, confirmPassword })
        });

        const data = await response.json();

        if (response.ok) {
            
        } else {
            alert(data.msg); // Exibe a mensagem de erro do servidor para falha
        }
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        alert('Erro ao registrar usuário. Por favor, tente novamente.');
    }
    
}

// Associando a função ao evento de clique do botão

document.getElementById('registerBtn').addEventListener('click', cadastrar);

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

document.getElementById('registerBtn').addEventListener('click', loginUser);


async function filtrarPlantas() {
    
    const filtro = document.getElementById('filtro').value;
    

    try {
        const response = await fetch('http://localhost:4000/plantas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({filtro})
        });

        const data = await response.json();

        if (response.ok) {
            const { tipo_do_filtro } = req.params;
            let plantas;
        
            if (tipo_do_filtro === 'nome') {
                plantas = await database.selectPlanta_nome(req.query.valor);
                return plantas;
            } else if (tipo_do_filtro === 'nome_cientifico') {
                plantas = await database.selectPlanta_nomeCientifico(req.query.valor);
                return plantas;
            } else if (tipo_do_filtro === 'tratamento') {
                plantas = await database.selectPlanta_tratamento(req.query.valor);
                return plantas;
            }
            else{
                console.log(data.msg)
            }
        } 
    } catch (error) {
        console.error('Nenhuma planta encontrada:', error);
        alert('Nenhuma planta encontrada.');
    }
}

document.getElementById('filtroBtn').addEventListener('click', filtrarPlantas);

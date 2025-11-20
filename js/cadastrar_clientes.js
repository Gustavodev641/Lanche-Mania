
const registerName = document.getElementById('register-name');
const registerPhone = document.getElementById('register-phone');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');

const ENDPOINT_CADASTRO = 'http://localhost:8080/food/Customers'; 

btn-auth.addEventListener('click', async () => {
    const nome = registerName.value.trim();
    
    const telefone = registerPhone.value.trim();
    
    const email = registerEmail.value.trim();

    const senha = registerPassword.value.trim();    


    if (!nome || !telefone || !email || !senha) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }
    const dadosClientes = {
        name: nome,      
        phone: telefone,     
        email: email,
        password: senha    
    };

    try {
        const response = await fetch(ENDPOINT_CADASTRO, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosClientes)
        });

        if (response.ok) {
            alert(`Cliente "${nome}" cadastrado com sucesso!`);
            // Limpa os campos após o sucesso
            registerName.value = '';
            registerPhone.value = '';
            registerEmail.value = '';
            registerPassword.value = '';
        } else {
            // Tenta ler a mensagem de erro do backend
            let erro;
            try {
                erro = await response.json();
            } catch (e) {
                erro = { message: null };
            }
            alert(`Falha ao cadastrar: ${response.status} - ${erro.message || 'Erro no servidor'}`);
        }

    } catch (error) {
        // Se o backend não estiver rodando
        alert('Erro de conexão com o backend. O Spring Boot está rodando?');
        console.error('Erro na requisição fetch:', error);
    }
});
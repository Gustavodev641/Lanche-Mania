
const btnCadastrar = document.getElementById('btnCadastrar');
const inputTitulo = document.getElementById('produtoTitulo');
const inputPreco = document.getElementById('produtoPreco');
const inputImg = document.getElementById('produtoImg');

const ENDPOINT_CADASTRO = 'http://localhost:8080/food'; 

btnCadastrar.addEventListener('click', async () => {
    const titulo = inputTitulo.value.trim();
    
    const preco = parseInt(inputPreco.value); 
    
    const imagemUrl = inputImg.value.trim();


    if (!titulo || isNaN(preco) || preco <= 0 || !imagemUrl) {
        alert('Por favor, preencha todos os campos corretamente com valores inteiros para o preço.');
        return;
    }
    const dadosProduto = {
        title: titulo,      
        price: preco,     
        image: imagemUrl    
    };

    try {
        const response = await fetch(ENDPOINT_CADASTRO, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosProduto)
        });

        if (response.ok) {
            alert(`Produto "${titulo}" cadastrado com sucesso!`);
            // Limpa os campos após o sucesso
            inputTitulo.value = '';
            inputPreco.value = '';
            inputImg.value = '';
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
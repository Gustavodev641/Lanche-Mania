const btnCadastrar = document.getElementById('btnCadastrar');
const inputTitulo = document.getElementById('produtoTitulo');
const inputPreco = document.getElementById('produtoPreco');
const inputQuantidade = document.getElementById('produtoQuantidade'); // NOVO: Campo Quantidade
const inputImg = document.getElementById('produtoImg');
const inputDescricao = document.getElementById('produtoDescricao'); // NOVO: Campo Descrição
const inputCategoria = document.getElementById('produtoCategoria'); // NOVO: Campo Categoria

const ENDPOINT_CADASTRO = 'http://localhost:8080/food'; 

btnCadastrar.addEventListener('click', async () => {
    // 1. Coletar e normalizar todos os dados
    const titulo = inputTitulo.value.trim();
    const precoFloat = parseFloat(inputPreco.value);
    const imagemUrl = inputImg.value.trim();
    const descricao = inputDescricao.value.trim();
    const categoria = inputCategoria.value;
    const qtdeInt = parseInt(inputQuantidade.value);

    // 2. Mapear Preço para o formato do Backend (Centavos)
    // O backend espera um Integer, então multiplicamos por 100 (centavos)
    const precoEmCentavos = Math.round(precoFloat * 100); 

    // 3. Validação dos campos obrigatórios
    if (!titulo || isNaN(precoFloat) || precoFloat <= 0 || 
        !imagemUrl || isNaN(qtdeInt) || qtdeInt < 0 || 
        !categoria) { // A categoria agora é obrigatória para evitar o 'null'
        
        alert('Por favor, preencha todos os campos obrigatórios (Título, Preço (>0), URL, Quantidade (>=0) e Categoria).');
        return;
    }
    
    // 4. Preparar o Payload com todos os campos
    const dadosProduto = {
        title: titulo,      
        price: precoEmCentavos, // Enviado em centavos
        image: imagemUrl,
        qtde: qtdeInt,           // Novo campo
        description: descricao,  // Novo campo
        category: categoria      // Novo campo
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
            
            // 5. Limpa todos os campos após o sucesso
            inputTitulo.value = '';
            inputPreco.value = '';
            inputQuantidade.value = '';
            inputImg.value = '';
            inputDescricao.value = '';
            inputCategoria.value = ''; // Limpa a seleção
            
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
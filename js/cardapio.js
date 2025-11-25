
// Função para limpar todos os containers de produtos
function limparContainers() {
    Object.values(CATEGORIAS_MAP).forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        }
    });
    // Ocultar todas as seções por padrão
    document.querySelectorAll('.category-section').forEach(section => {
        section.style.display = 'none';
    });
}

// Função para carregar produtos do backend
async function carregarProdutos() {
    limparContainers(); 

    try {
        console.log('Carregando produtos do banco de dados...');
        
        const response = await fetch(BASE_URL);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const produtos = await response.json();
        console.log('Produtos carregados:', produtos);
        
        if (produtos.length === 0) {
            mostrarMensagemVazio();
            return;
        }

        // 1. Agrupar e renderizar
        produtos.forEach(produto => {
            // NORMALIZAÇÃO CRÍTICA: Converte para minúscula e trata null/undefined
            const categoriaNormalizada = (produto.category || '').toLowerCase(); 
            
            // Tenta obter o ID do container usando a categoria normalizada
            const containerId = CATEGORIAS_MAP[categoriaNormalizada];
            
            if (containerId) {
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML += criarProdutoHTML(produto);
                }
            } else {
                // Mensagem de debug no console para identificar categorias não mapeadas
                console.warn(`[ERRO DE MAPA] Produto "${produto.title}" (ID: ${produto.id}) tem categoria: "${produto.category}". Não há container mapeado para "${categoriaNormalizada}".`);
            }
        });
        
        // 2. Exibir apenas as seções que contêm produtos
        Object.values(CATEGORIAS_MAP).forEach(containerId => {
            const container = document.getElementById(containerId);
            const section = container ? container.closest('.category-section') : null;

            if (container && container.children.length > 0 && section) {
                section.style.display = 'block'; // Mostra a seção se tiver produtos
            } else if (section) {
                section.style.display = 'none'; // Oculta a seção se estiver vazia
            }
        });

        console.log('Produtos renderizados com sucesso!');
        
    } catch (error) {
        // ... (Mostrar erro de conexão)
        console.error('Erro ao carregar produtos:', error);
        mostrarErroConexao();
    }
}


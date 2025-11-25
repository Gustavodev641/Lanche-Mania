// js/carregar_produtos.js

const BASE_URL = "http://localhost:8080/food";

// Mapeamento: Key (valor recebido do DB, normalizado, ex: 'salgado') -> Value (ID do container no HTML, ex: 'salgados-dishes')
const CATEGORIAS_MAP = {
    // Adicione todos os valores possíveis de categoria que você cadastra no DB
    'salgado': 'salgados-dishes',
    'salgados': 'salgados-dishes', 
    'lanche': 'lanches-dishes',
    'lanches': 'lanches-dishes',
    'bebida': 'bebidas-dishes',
    'bebidas': 'bebidas-dishes',
    'doce': 'doces-dishes',
    'doces': 'doces-dishes'
};

// Função para criar o HTML de um produto
function criarProdutoHTML(produto) {
    // Usando toFixed(2) para garantir o formato R$ X.XX
    const precoFormatado = (produto.price / 100).toFixed(2); 

    return `
        <div class="dish">
            <div class="dish-heart">
                <i class="fa-solid fa-heart"></i>
            </div>

            <img src="${produto.image}" class="dish-image" alt="${produto.title}">

            <h3 class="dish-title">
                ${produto.title}
            </h3>

            <span class="dish-description">
                ${produto.description || 'Produto delicioso e de qualidade!'}
            </span>

            <div class="dish-rate">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <span>(${Math.floor(Math.random() * 5000) + 1000}+)</span>
            </div>

            <div class="dish-price">
                <h4>R$ ${precoFormatado}</h4>
                <button class="btn-default add-to-cart" 
                    data-id="${produto.id}" 
                    data-nome="${produto.title}" 
                    data-preco="${produto.price}" 
                    data-imagem="${produto.image}" 
                    onclick="adicionarProduto(this)">
                    <i class="fa-solid fa-basket-shopping"></i>
                </button>
            </div>
        </div>
    `;
}

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
        console.error('Erro ao carregar produtos:', error);
        mostrarErroConexao();
    }
}

// Função para mostrar mensagem quando não há produtos
function mostrarMensagemVazio() {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
        menuSection.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fa-solid fa-utensils" style="font-size: 48px; color: #ccc;"></i>
                <h3 style="color: #666; margin-top: 20px;">Nenhum produto cadastrado ainda</h3>
                <p style="color: #999;">Adicione produtos pelo painel administrativo</p>
            </div>
        `;
    }
}

// Função para mostrar erro de conexão
function mostrarErroConexao() {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            text-align: center;
            padding: 40px;
            background: #ffe6e6;
            border-radius: 12px;
            margin: 20px;
        `;
        errorDiv.innerHTML = `
            <i class="fa-solid fa-exclamation-triangle" style="font-size: 48px; color: #dc3545;"></i>
            <h3 style="color: #dc3545; margin-top: 20px;">Erro ao carregar produtos</h3>
            <p style="color: #666;">Verifique se o servidor Spring Boot está rodando</p>
            <button class="btn-default" onclick="location.reload()" style="margin-top: 20px;">
                <i class="fa-solid fa-refresh"></i> Tentar Novamente
            </button>
        `;
        // Limpa o conteúdo anterior e insere a mensagem de erro no topo
        menuSection.innerHTML = '';
        menuSection.appendChild(errorDiv);
    }
}


function adicionarProduto(botao) {
    const produto = {
        id: botao.dataset.id,
        nome: botao.dataset.nome,
        // O preço está em centavos no data-preco
        preco: parseInt(botao.dataset.preco), 
        imagem: botao.dataset.imagem
    };
    

    if (window.carrinho && typeof window.carrinho.adicionarItem === 'function') {
        window.carrinho.adicionarItem(produto);
    } else {
        console.error("Instância 'carrinho' ou método 'adicionarItem' não encontrados. Verifique a ordem de carregamento dos scripts e carrinho.js.");
        alert("Erro: Serviço de carrinho indisponível.");
    }
}


// Inicia o carregamento quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos();
});
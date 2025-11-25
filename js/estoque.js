const BASE_URL = "http://localhost:8080/food";
let selectedProductId = null;

// Carrega todos os produtos e monta a tabela
async function carregarProdutos() {
    try {
        const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error("Erro ao carregar produtos");
        
        const produtos = await res.json();
        const corpo = document.getElementById("corpoTabela");
        corpo.innerHTML = "";

        if (produtos.length === 0) {
            corpo.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:#777;">
                Nenhum produto cadastrado ainda.
            </td></tr>`;
            return;
        }

        produtos.forEach(p => {
            const qtdeAtual = p.qtde ?? p.quantidade ?? 0;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.id}</td>
                <td>${p.title || p.titulo || "-"}</td>
                <td>R$ ${((p.price || p.preco || 0)/100).toFixed(2)}</td>
                <td style="text-align:center; font-weight:bold;">
                    <button class="btn-qtde menos" onclick="mudarQtde(${p.id}, -1)">−</button>
                    <span id="qtde-${p.id}" class="${qtdeAtual === 0 ? 'zero' : 'positivo'}">
                        ${qtdeAtual}
                    </span>
                    <button class="btn-qtde mais" onclick="mudarQtde(${p.id}, 1)">+</button>
                </td>
                <td><small style="color:#777">Clique na linha para excluir</small></td>
            `;

            // Seleção da linha para deletar (evita conflito com os botões +/−)
            tr.addEventListener("click", (e) => {
                if (e.target.tagName === "BUTTON") return;
                
                document.querySelectorAll("#tabelaEstoque tr").forEach(r => 
                    r.classList.remove("selected")
                );
                tr.classList.add("selected");
                selectedProductId = p.id;
                document.getElementById("btnDeletar").disabled = false;
            });

            corpo.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        document.getElementById("corpoTabela").innerHTML = 
            `<tr><td colspan="5" style="color:red; text-align:center;">
                Erro ao carregar produtos. Verifique o servidor.
            </td></tr>`;
    }
}

// Muda a quantidade (+1 ou -1) e salva no banco
async function mudarQtde(id, delta) {
    event.stopPropagation(); // evita selecionar a linha

    const span = document.getElementById(`qtde-${id}`);
    let atual = parseInt(span.textContent);
    let novo = atual + delta;

    if (novo < 0) novo = 0;

    // Atualiza visualmente
    span.textContent = novo;
    span.className = novo === 0 ? "zero" : "positivo";

    // Salva no backend
    try {
        await fetch(`${BASE_URL}/${id}/estoque`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qtde: novo })
        });
    } catch (err) {
        alert("Erro ao salvar quantidade. Tente novamente.");
        console.error(err);
        carregarProdutos(); // recarrega pra corrigir
    }
}

// Deleta produto selecionado
document.getElementById("btnDeletar").addEventListener("click", async () => {
    if (!selectedProductId) {
        alert("Selecione um produto primeiro!");
        return;
    }

    if (confirm(`Tem certeza que quer EXCLUIR o produto ID ${selectedProductId}?\nEsta ação não pode ser desfeita.`)) {
        try {
            const res = await fetch(`${BASE_URL}/${selectedProductId}`, {
                method: "DELETE"
            });

            if (res.ok || res.status === 204) {
                alert("Produto excluído com sucesso!");
                selectedProductId = null;
                document.getElementById("btnDeletar").disabled = true;
                carregarProdutos();
            } else {
                alert("Erro ao excluir produto.");
            }
        } catch (err) {
            alert("Erro de conexão com o servidor.");
            console.error(err);
        }
    }
});

// Busca em tempo real
document.getElementById("busca").addEventListener("input", function () {
    const termo = this.value.toLowerCase();
    document.querySelectorAll("#corpoTabela tr").forEach(tr => {
        const texto = tr.textContent.toLowerCase();
        tr.style.display = texto.includes(termo) ? "" : "none";
    });
});

// Carrega tudo ao abrir a página
document.addEventListener("DOMContentLoaded", carregarProdutos);
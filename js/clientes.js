// pages/js/clientes.js
const BASE_URL = "http://localhost:8080/food/Customers";
let selectedCustomerId = null;

async function carregarClientes() {
    try {
        const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error("Erro na requisição");

        const clientes = await res.json();
        const corpo = document.getElementById("corpoTabela");
        corpo.innerHTML = "";

        if (clientes.length === 0) {
            document.getElementById("semResultados").style.display = "block";
            return;
        }

        document.getElementById("semResultados").style.display = "none";

        clientes.forEach(c => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${c.id}</td>
                <td>${c.name || "-"}</td>
                <td>${c.cpf || "-"}</td>
                <td>${c.telefone || "-"}</td>
                <td>${c.email || "-"}</td>
            `;

            // Seleção da linha
            tr.addEventListener("click", () => {
                document.querySelectorAll("tr").forEach(r => r.classList.remove("selected"));
                tr.classList.add("selected");
                selectedCustomerId = c.id;
                document.getElementById("btnDeletarCliente").disabled = false;
            });

            corpo.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        document.getElementById("corpoTabela").innerHTML = 
            `<tr><td colspan="5" style="color:red; text-align:center;">
                Erro ao carregar clientes. Servidor está rodando?
            </td></tr>`;
    }
}

// Deletar cliente
document.getElementById("btnDeletarCliente").addEventListener("click", async () => {
    if (!selectedCustomerId) return;

    if (confirm(`Tem certeza que quer DELETAR o cliente ID ${selectedCustomerId}?\nEsta ação não pode ser desfeita.`)) {
        try {
            const res = await fetch(`${BASE_URL}/${selectedCustomerId}`, { method: "DELETE" });

            if (res.ok || res.status === 204) {
                alert("Cliente excluído com sucesso!");
                selectedCustomerId = null;
                document.getElementById("btnDeletarCliente").disabled = true;
                carregarClientes();
            } else {
                alert("Erro ao excluir cliente.");
            }
        } catch (err) {
            alert("Erro de conexão.");
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

// Carrega ao abrir a página
document.addEventListener("DOMContentLoaded", carregarClientes);
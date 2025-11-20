 const url = "http://localhost:8080/food/Customers";

    fetch(url)
        .then(res => res.json())
        .then(clientes => {
            const corpo = document.getElementById("corpoTabela");
            
            if (clientes.length === 0) {
                document.getElementById("semResultados").style.display = "block";
                return;
            }

            clientes.forEach(c => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${c.id}</td>
                    <td>${c.name || '-'}</td>
                    <td>${c.cpf || '-'}</td>
                    <td>${c.telefone || '-'}</td>
                    <td>${c.endereco || '-'}</td>
                `;
                corpo.appendChild(tr);
            });
        })
        .catch(err => {
            console.error(err);
            document.getElementById("corpoTabela").innerHTML = 
                `<tr><td colspan="5" style="text-align:center; color:red;">
                    Erro ao carregar clientes. Verifique se o servidor está rodando.
                 </td></tr>`;
        });

    // Busca em tempo real
    document.getElementById("busca").addEventListener("input", function() {
        const termo = this.value.toLowerCase();
        const linhas = document.querySelectorAll("#corpoTabela tr");

        linhas.forEach(linha => {
            const texto = linha.textContent.toLowerCase();
            linha.style.display = texto.includes(termo) ? "" : "none";
        });
    });

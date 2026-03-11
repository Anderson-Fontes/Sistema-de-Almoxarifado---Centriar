const apiUrl = '/api/epis';

const coresCategoria = {
    'EPI': 'bg-warning text-dark',
    'Consumível': 'bg-info text-dark',
    'Ferramenta': 'bg-secondary',
    'Gás': 'bg-danger',
    'Cobre': 'bg-success',
    'Outros': 'bg-dark'
};

// Mostra ou esconde campos de medidas baseado na categoria
document.getElementById('categoria').addEventListener('change', (e) => {
    const categoria = e.target.value;
    const divMedidas = document.getElementById('camposMedidas');
    if (categoria === 'Gás' || categoria === 'Cobre') {
        divMedidas.classList.remove('d-none');
    } else {
        divMedidas.classList.add('d-none');
        document.getElementById('peso').value = '';
        document.getElementById('comprimento').value = '';
    }
});

let listaEpis = []; 

// Função que desenha a tabela na tela
function renderizarTabela(dados) {
    const tbody = document.getElementById('tabelaEpis');
    tbody.innerHTML = ''; 
    
    dados.forEach(epi => {
        const corBadge = coresCategoria[epi.categoria] || 'bg-secondary';
        
        let textoMedidas = '-';
        if (epi.peso && epi.comprimento) textoMedidas = `${epi.peso}kg / ${epi.comprimento}m`;
        else if (epi.peso) textoMedidas = `${epi.peso}kg`;
        else if (epi.comprimento) textoMedidas = `${epi.comprimento}m`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="text-muted small fw-bold">${epi.codigo_identificacao || '-'}</td>
            <td class="fw-bold text-uppercase">${epi.nome}</td>
            <td><span class="badge ${corBadge} rounded-pill">${epi.categoria}</span></td>
            <td class="text-muted small">${textoMedidas}</td>
            <td class="text-center">
                <span class="badge ${epi.quantidade > 0 ? 'bg-success' : 'bg-danger'} fs-6 rounded-3 px-3 py-1">${epi.quantidade}</span>
            </td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-primary fw-bold" onclick="prepararEdicao(${epi.id})">✏️ Editar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Busca os dados no banco
async function carregarEpis() {
    try {
        const response = await fetch(apiUrl);
        listaEpis = await response.json();
        renderizarTabela(listaEpis); 
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// BARRA DE PESQUISA EM TEMPO REAL
document.getElementById('barraPesquisa').addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    
    const resultadosFiltrados = listaEpis.filter(epi => {
        const nomeMatch = epi.nome.toLowerCase().includes(termo);
        const codMatch = epi.codigo_identificacao ? epi.codigo_identificacao.toLowerCase().includes(termo) : false;
        const catMatch = epi.categoria.toLowerCase().includes(termo);
        
        return nomeMatch || codMatch || catMatch;
    });
    
    renderizarTabela(resultadosFiltrados); 
});

// Prepara o formulário para edição
window.prepararEdicao = function(id) {
    const epi = listaEpis.find(item => item.id === id);
    if (!epi) return;

    document.getElementById('editandoId').value = epi.id;
    document.getElementById('codigo').value = epi.codigo_identificacao || '';
    document.getElementById('nome').value = epi.nome;
    document.getElementById('categoria').value = epi.categoria;
    document.getElementById('categoria').dispatchEvent(new Event('change'));
    
    document.getElementById('peso').value = epi.peso || '';
    document.getElementById('comprimento').value = epi.comprimento || '';
    document.getElementById('ca').value = epi.numero_ca || '';
    
    if (epi.validade_ca) {
        document.getElementById('validade').value = epi.validade_ca.split('T')[0];
    } else {
        document.getElementById('validade').value = '';
    }
    
    document.getElementById('quantidade').value = epi.quantidade;

    document.getElementById('tituloForm').innerText = '✏️ Editar Material';
    document.getElementById('tituloForm').classList.replace('bg-primary', 'bg-warning');
    document.getElementById('tituloForm').classList.replace('text-white', 'text-dark');
    document.getElementById('btnSalvar').innerText = 'Atualizar Material';
    document.getElementById('btnSalvar').classList.replace('btn-primary', 'btn-warning');
    document.getElementById('btnCancelarEdicao').classList.remove('d-none');
    
    window.scrollTo(0, 0); 
};

// Cancela a edição
document.getElementById('btnCancelarEdicao').addEventListener('click', () => {
    document.getElementById('formEpi').reset();
    document.getElementById('editandoId').value = '';
    document.getElementById('categoria').dispatchEvent(new Event('change'));
    
    document.getElementById('tituloForm').innerText = '➕ Cadastrar Material';
    document.getElementById('tituloForm').classList.replace('bg-warning', 'bg-primary');
    document.getElementById('tituloForm').classList.replace('text-dark', 'text-white');
    document.getElementById('btnSalvar').innerText = 'Salvar Material';
    document.getElementById('btnSalvar').classList.replace('btn-warning', 'btn-primary');
    document.getElementById('btnCancelarEdicao').classList.add('d-none');
});

// Envia os dados (POST para Novo, PUT para Atualizar)
document.getElementById('formEpi').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const id = document.getElementById('editandoId').value;
    const material = {
        codigo_identificacao: document.getElementById('codigo').value,
        nome: document.getElementById('nome').value,
        categoria: document.getElementById('categoria').value,
        numero_ca: document.getElementById('ca').value,
        validade_ca: document.getElementById('validade').value,
        quantidade: document.getElementById('quantidade').value,
        peso: document.getElementById('peso').value,
        comprimento: document.getElementById('comprimento').value
    };

    try {
        const metodo = id ? 'PUT' : 'POST';
        const urlFinal = id ? `${apiUrl}/${id}` : apiUrl;

        const response = await fetch(urlFinal, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(material)
        });

        if (response.ok) {
            document.getElementById('btnCancelarEdicao').click(); 
            document.getElementById('barraPesquisa').value = ''; 
            carregarEpis(); 
        } else {
            alert('Erro ao salvar no banco de dados.');
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
    }
});

// Inicia carregando a tabela
carregarEpis();
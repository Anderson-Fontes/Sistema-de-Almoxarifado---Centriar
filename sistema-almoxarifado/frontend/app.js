const apiUrl = '/api/epis';

const estilosCategoria = {
    'EPI': 'bg-warning bg-opacity-10 text-warning-emphasis border border-warning-subtle',
    'Consumível': 'bg-info bg-opacity-10 text-info-emphasis border border-info-subtle',
    'Ferramenta': 'bg-secondary bg-opacity-10 text-secondary-emphasis border border-secondary-subtle',
    'Gás': 'bg-danger bg-opacity-10 text-danger-emphasis border border-danger-subtle',
    'Cobre': 'bg-success bg-opacity-10 text-success-emphasis border border-success-subtle',
    'Outros': 'bg-dark bg-opacity-10 text-dark-emphasis border border-dark-subtle'
};

const painelFormulario = new bootstrap.Offcanvas(document.getElementById('painelFormulario'));

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

window.abrirPainelNovo = function() {
    document.getElementById('formEpi').reset();
    document.getElementById('editandoId').value = '';
    document.getElementById('categoria').dispatchEvent(new Event('change'));
    
    document.getElementById('tituloForm').innerHTML = '<i class="bi bi-box-seam text-primary"></i> Cadastrar Material';
    const btnSalvar = document.getElementById('btnSalvar');
    btnSalvar.innerHTML = 'Confirmar Cadastro';
    btnSalvar.className = 'btn btn-premium btn-lg fs-6 w-100 justify-content-center';
    
    painelFormulario.show();
};

function renderizarTabela(dados) {
    const tbody = document.getElementById('tabelaEpis');
    tbody.innerHTML = ''; 
    document.getElementById('totalItens').innerHTML = `${dados.length} itens localizados`;

    // VERIFICA ESTOQUE MÍNIMO PARA O ALERTA TOPO
    let itensEmAlerta = dados.filter(epi => epi.quantidade <= (epi.estoque_minimo || 0));
    const divAlerta = document.getElementById('alertaEstoqueBaixo');
    
    if(itensEmAlerta.length > 0) {
        divAlerta.classList.remove('d-none');
        document.getElementById('textoAlertaEstoque').innerText = `Atenção: Você possui ${itensEmAlerta.length} item(ns) que atingiram ou estão abaixo do estoque mínimo definido.`;
    } else {
        divAlerta.classList.add('d-none');
    }

    dados.forEach((epi, index) => {
        const estiloBadge = estilosCategoria[epi.categoria] || estilosCategoria['Outros'];
        
        let textoMedidas = '<span class="text-muted opacity-25">-</span>';
        if (epi.peso && epi.comprimento) textoMedidas = `${epi.peso}kg / ${epi.comprimento}m`;
        else if (epi.peso) textoMedidas = `${epi.peso}kg`;
        else if (epi.comprimento) textoMedidas = `${epi.comprimento}m`;

        const tr = document.createElement('tr');
        tr.className = 'linha-animada';
        tr.style.animationDelay = `${index * 0.03}s`;
        
        // COR DA BOLINHA DE QUANTIDADE NA TABELA
        let badgeQtd = '';
        if (epi.quantidade <= (epi.estoque_minimo || 0)) {
            badgeQtd = `<span class="badge bg-danger text-white px-3 py-2 rounded-pill fs-6 shadow-sm" title="Abaixo do estoque mínimo!"><i class="bi bi-arrow-down-circle me-1"></i>${epi.quantidade}</span>`;
        } else {
            badgeQtd = `<span class="badge bg-success bg-opacity-10 text-success border border-success-subtle px-3 py-2 rounded-pill fs-6">${epi.quantidade}</span>`;
        }
        
        tr.innerHTML = `
            <td class="text-muted" style="font-family: monospace;">${epi.codigo_identificacao || '-'}</td>
            <td class="fw-bold">${epi.nome}</td>
            <td><span class="badge badge-soft ${estiloBadge}">${epi.categoria}</span></td>
            <td class="text-muted" style="font-size: 0.8rem;">${textoMedidas}</td>
            <td class="text-center">${badgeQtd}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-light border text-primary fw-semibold" onclick="prepararEdicao(${epi.id})">
                    <i class="bi bi-pencil-square me-1"></i> Editar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function carregarEpis() {
    try {
        const response = await fetch(apiUrl);
        listaEpis = await response.json();
        renderizarTabela(listaEpis); 
    } catch (error) {
        console.error('Erro:', error);
    }
}

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
    
    if (epi.validade_ca) document.getElementById('validade').value = epi.validade_ca.split('T')[0];
    else document.getElementById('validade').value = '';
    
    document.getElementById('quantidade').value = epi.quantidade;
    document.getElementById('estoque_minimo').value = epi.estoque_minimo || 0;

    document.getElementById('tituloForm').innerHTML = '<i class="bi bi-pencil-square text-warning"></i> Editar Material';
    const btnSalvar = document.getElementById('btnSalvar');
    btnSalvar.innerHTML = 'Salvar Alterações';
    btnSalvar.className = 'btn btn-warning btn-lg fs-6 w-100 justify-content-center fw-bold text-dark border-0 shadow-sm';
    
    painelFormulario.show();
};

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
        comprimento: document.getElementById('comprimento').value,
        estoque_minimo: document.getElementById('estoque_minimo').value
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
            painelFormulario.hide(); 
            document.getElementById('barraPesquisa').value = ''; 
            carregarEpis(); 
        } else {
            alert('Erro ao salvar no banco de dados.');
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
    }
});

carregarEpis();
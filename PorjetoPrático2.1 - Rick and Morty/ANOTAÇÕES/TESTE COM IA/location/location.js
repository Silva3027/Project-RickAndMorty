let currentPageUrl = 'https://rickandmortyapi.com/api/location';
let nextUrl = null;
let prevUrl = null;

window.onload = () => {
    // Adiciona o listener para o botão de busca
    document.getElementById('search-button').addEventListener('click', searchLocations);
    // Adiciona o listener para a tecla Enter no campo de busca
    document.getElementById('location-search').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchLocations();
        }
    });

    // Carrega a primeira página de localizações
    loadLocations(currentPageUrl);
};

// Função principal para carregar e exibir as localizações
async function loadLocations(url) {
    const locationList = document.getElementById('location-list');
    locationList.innerHTML = '<h2>Carregando Localizações...</h2>'; // Mensagem de carregamento

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Atualiza as variáveis de controle de navegação
        nextUrl = data.info.next;
        prevUrl = data.info.prev;
        
        // Renderiza os cartões
        renderLocationCards(data.results);
        
        // Atualiza os botões e a informação da página
        updatePagination(data.info);
        
    } catch (error) {
        console.error('Erro ao carregar localizações:', error);
        locationList.innerHTML = '<h2>Erro ao carregar localizações. Tente novamente mais tarde.</h2>';
    }
}

// Renderiza o HTML dos cartões de localização
function renderLocationCards(locations) {
    const locationList = document.getElementById('location-list');
    locationList.innerHTML = ''; // Limpa a lista antes de adicionar novos

    if (locations.length === 0) {
        locationList.innerHTML = '<h3 style="color: white; grid-column: 1 / -1; text-align: center;">Nenhuma localização encontrada.</h3>';
        return;
    }

    locations.forEach(location => {
        const card = document.createElement('div');
        card.className = 'location-card';
        
        // O número de residentes é o tamanho do array 'residents'
        const residentCount = location.residents.length;

        card.innerHTML = `
            <h3>${location.name}</h3>
            <p><strong>Tipo:</strong> ${location.type}</p>
            <p><strong>Dimensão:</strong> ${location.dimension}</p>
            <p><strong>Residentes Conhecidos:</strong> ${residentCount}</p>
            <button onclick="showResidentDetails('${location.id}')" style="margin-top: 10px; width: 100%;">Ver Residentes</button>
        `;
        locationList.appendChild(card);
    });
}


// Atualiza a navegação da página (Próxima/Anterior)
function updatePagination(info) {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const pageInfoSpan = document.getElementById('page-info');

    // Calcula o número da página atual (um pouco complexo, mas funciona para a primeira página)
    let currentPage = 1;
    if (info.next) {
        // Extrai o número da página do 'next' URL (o 'next' aponta para a página atual + 1)
        const nextUrlParams = new URLSearchParams(info.next.split('?')[1]);
        currentPage = parseInt(nextUrlParams.get('page')) - 1;
    } else if (info.prev) {
         // Se não tem 'next', estamos na última página. Extrai do 'prev' e adiciona 1.
        const prevUrlParams = new URLSearchParams(info.prev.split('?')[1]);
        currentPage = parseInt(prevUrlParams.get('page')) + 1;
    } else {
        // Caso só tenha uma página
        currentPage = 1;
    }

    // Garante que o número da página não é negativo
    if (currentPage < 1) currentPage = 1;

    pageInfoSpan.textContent = `Página ${currentPage} de ${info.pages}`;

    // Desabilita/Habilita botões
    prevButton.disabled = !info.prev;
    nextButton.disabled = !info.next;

    // Adiciona/Remove listeners para evitar múltiplas chamadas
    prevButton.onclick = () => info.prev && loadLocations(info.prev);
    nextButton.onclick = () => info.next && loadLocations(info.next);
}

// Função de busca
function searchLocations() {
    const searchTerm = document.getElementById('location-search').value.toLowerCase().trim();
    if (searchTerm === '') {
        // Se a busca estiver vazia, volta para a primeira página
        loadLocations('https://rickandmortyapi.com/api/location');
        return;
    }
    
    // A API de Rick and Morty permite buscar por nome ou tipo
    const searchUrl = `https://rickandmortyapi.com/api/location/?name=${searchTerm}`;
    
    // NOTA: A busca da API não é perfeita para "dimensão",
    // então a busca por nome é a maneira mais simples de começar.
    loadLocations(searchUrl);
}

// TODO: Implementar esta função (ou abrir uma nova página)
function showResidentDetails(locationId) {
    // Por enquanto, apenas um alerta, mas aqui você faria a chamada para a
    // API de personagens para obter a lista de residentes!
    alert(`Funcionalidade 'Ver Residentes' para a Localização ID: ${locationId} será implementada aqui!`);
}
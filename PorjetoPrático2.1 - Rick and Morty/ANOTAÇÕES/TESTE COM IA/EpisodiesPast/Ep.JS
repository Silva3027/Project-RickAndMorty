let currentPageUrl = 'https://rickandmortyapi.com/api/episode';

window.onload = async () => {
    try {
        await loadAllEpisodesAndGroup(); // Nova função para carregar todos e agrupar
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar episódios');
    }

    // Os botões de navegação de página podem não ser necessários se listarmos todos de uma vez,
    // a menos que você queira paginação de temporadas. Por enquanto, vou desativá-los
    // já que o foco é listar tudo como na imagem.
    const nextButton = document.getElementById('next-button');
    const backButton = document.getElementById('back-button');
    nextButton.style.display = 'none'; // Esconde os botões por padrão
    backButton.style.display = 'none'; // Esconde os botões por padrão
};

async function fetchAllEpisodes() {
    let allEpisodes = [];
    let url = 'https://rickandmortyapi.com/api/episode';

    while (url) {
        const response = await fetch(url);
        const data = await response.json();
        allEpisodes = allEpisodes.concat(data.results);
        url = data.info.next; // Pega a URL da próxima página, será null se não houver mais
    }
    return allEpisodes;
}

async function loadAllEpisodesAndGroup() {
    const episodesBySeasonContainer = document.getElementById('episodes-by-season');
    episodesBySeasonContainer.innerHTML = ''; // Limpar resultados anteriores

    try {
        const allEpisodes = await fetchAllEpisodes();

        const groupedEpisodes = {};
        allEpisodes.forEach(episode => {
            // Extrai o número da temporada (ex: S01 -> 1)
            const seasonNumberMatch = episode.episode.match(/S(\d{2})E\d{2}/);
            if (seasonNumberMatch && seasonNumberMatch[1]) {
                const seasonNum = parseInt(seasonNumberMatch[1], 10);
                if (!groupedEpisodes[seasonNum]) {
                    groupedEpisodes[seasonNum] = [];
                }
                groupedEpisodes[seasonNum].push(episode);
            }
        });

        // Ordenar as temporadas numericamente
        const sortedSeasonNumbers = Object.keys(groupedEpisodes).sort((a, b) => parseInt(a) - parseInt(b));

        sortedSeasonNumbers.forEach(seasonNum => {
            const seasonSection = document.createElement('section');
            seasonSection.className = 'season-section';

            const seasonTitle = document.createElement('h3');
            seasonTitle.innerText = `${parseInt(seasonNum)}ª Temporada`; // Adiciona "ª Temporada"
            seasonSection.appendChild(seasonTitle);

            
                const episodeList = document.createElement('ul');
                // Ordenar episódios dentro da temporada pelo número do episódio
                groupedEpisodes[seasonNum].sort((a, b) => {
                    const episodeNumA = parseInt(a.episode.match(/E(\d{2})/)[1]);
                    const episodeNumB = parseInt(b.episode.match(/E(\d{2})/)[1]);
                    return episodeNumA - episodeNumB;
                }).forEach(episode => {
                    const listItem = document.createElement('li');
                    // Formato: "Episódio 01 - Piloto - Assistir"
                    listItem.innerHTML = `Episódio ${parseInt(episode.episode.match(/E(\d{2})/)[1])} - ${episode.name} - <a href="#">Assistir</a>`; // O link pode ser dinâmico depois
                    episodeList.appendChild(listItem);
                });
                seasonSection.appendChild(episodeList);
                episodesBySeasonContainer.appendChild(seasonSection);
            });

        } catch (error) {
            alert('Erro ao carregar ou organizar os episódios');
            console.log(error);
        }
    }

    // Funções de navegação de página (loadNextPage, loadPreviousPage)
    // não são mais necessárias para o layout da imagem, pois carregamos tudo de uma vez.
    // Se você ainda quiser paginação (por exemplo, por temporada), precisaríamos repensar.
async function loadNextPage() {
    // Código antigo para próxima página (manter por enquanto, mas não será usado com o novo layout)
}

async function loadPreviousPage() {
    // Código antigo para página anterior (manter por enquanto, mas não será usado com o novo layout)
}

// As funções convertStatus, convertSpecies, convertGender e hideModal
// parecem ser de uma página de personagens ou modal, e não são relevantes para a listagem de episódios.
// Você pode mantê-las se forem usadas em outros arquivos JS ou remover se não forem necessárias aqui.
function hideModal(){
    const modal = document.getElementById("modal")
    modal.style.visibility = "hidden"

}


function convertStatus(status) {
    const characterStatus = {
        alive:"vivo",
        dead:"morto",
        unknown:"desconhecido",
    };

    return characterStatus[status.toLowerCase()] || status;
}

function convertSpecies(specie) {
    const characterSpecie = {
        human: "humano",
        humanoid: "humanoide",
        alien: "alienigena",
        "mythological creatur": "criatura mitologica",
        disease: "doença",
        robot: "robo",
        unknown: "desconhecido",
    }

    return characterSpecie[specie.toLowerCase()] || specie;
}

function convertGender(gender){
   const characterGender = {
    male: "macho",
    female: "femea",
    unknown: "desconhecido",
    };
    return characterGender[gender.toLowerCase()] || gender;
}
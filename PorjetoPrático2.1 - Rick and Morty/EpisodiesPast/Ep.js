let currentPageUrl = 'https://rickandmortyapi.com/api/episode';

window.onload = async () => {
    try {
        await loadAllEpisodesAndGroup();
} catch (error) {
        console.log(error);
        alert('Erro ao carregar episódios');
} 

};

async function fetchAllEpisodes() {
    let allEpisodes = [];
    let url = 'https://rickandmortyapi.com/api/episode';

    while (url) {
        const response = await fetch(url);
        const data = await response.json();
        allEpisodes = allEpisodes.concat(data.results);
        url = data.info.next;
    }
    return allEpisodes;
}

async function loadAllEpisodesAndGroup() {
    const episodesBySeasonContainer = document.getElementById('episodes-by-season');
    episodesBySeasonContainer.innerHTML = '';

    try {
        const allEpisodes = await fetchAllEpisodes(); 
        
        const groupedEpisodes = {};
        allEpisodes.forEach(episode => {
            const seasonNumberMatch = episode.episode.match(/S(\d{2})E\d{2}/);
        if (seasonNumberMatch && seasonNumberMatch[1]) {
            const seasonNum = parseInt(seasonNumberMatch[1], 10);
            if (!groupedEpisodes[seasonNum]) {
                groupedEpisodes[seasonNum] = [];
            }
                groupedEpisodes[seasonNum].push(episode);
            } else{
                alert("Erro ao carregar as temporadas")
                console.log(allEpisodes);
    }
});

const sortedSeasonNumbers = Object.keys(groupedEpisodes).sort((a, b) => parseInt(a) - parseInt(b));
sortedSeasonNumbers.forEach(seasonNum => {
            const seasonSection = document.createElement('section');
            seasonSection.className = 'season-section';

            const seasonTitle = document.createElement('h3');
            seasonTitle.textContent = `Season ${seasonNum}`;
            seasonSection.appendChild(seasonTitle);

                 const episodeList = document.createElement('ul');
                groupedEpisodes[seasonNum].sort((a, b) => {
                    const episodeNumA = parseInt(a.episode.match(/E(\d{2})/)[1]);
                    const episodeNumB = parseInt(b.episode.match(/E(\d{2})/)[1]);
                    return episodeNumA - episodeNumB;
                }).forEach(episode => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `Episode ${parseInt(episode.episode.match(/E(\d{2})/)[1])} - ${episode.name} - <a href="#">Watch</a>`;
                    episodeList.appendChild(listItem);
                });
                seasonSection.appendChild(episodeList);
                episodesBySeasonContainer.appendChild(seasonSection);
            });
    } catch (error) {
        alert('Erro ao carregar ou organizar os episódios');
        console.log(error);
}};


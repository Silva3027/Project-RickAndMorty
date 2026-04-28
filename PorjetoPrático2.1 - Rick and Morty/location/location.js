let currentPageUrl = 'https://rickandmortyapi.com/api/location';
let currentPage = 1;

window.onload = async () => {
   try{
    await loadLocation(currentPageUrl);
   } catch (error){
    alert('Erro ao carregar os cards');
   }

   const nextButton = document.getElementById('next-button')
   const backButton = document.getElementById('back-button')

   nextButton.addEventListener('click', loadNextPage)
   backButton.addEventListener('click', loadPreviousPage)
   
};

async function loadLocation(url) {
    const locationList = document.getElementById('location-list');
    locationList.innerHTML = '';

    try {
        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((location) => {
            const card = document.createElement("div")
            card.className = 'cards';

            const locationNameBG = document.createElement("div")
            locationNameBG.className = 'location-name-bg';
            
            const name = document.createElement("span")
            name.className = 'location-name'
            name.innerText = `${location.name}`;
            
            const type = document.createElement("span")
            type.className = 'location-type';
            type.innerText = `${location.type}`
            
            const dimensionBG = document.createElement("div")
            dimensionBG.className = 'dimension-bg'

            const dimension = document.createElement("span")
            dimension.className = 'dimension';
            dimension.innerText = `Dimension: ${location.dimension}`;

            
            locationNameBG.appendChild(name)
            locationNameBG.appendChild(type)
            dimensionBG.appendChild(dimension)
            card.appendChild(locationNameBG)
            card.appendChild(dimensionBG)

            locationList.appendChild(card)
        });

    const nextButton = document.getElementById('next-button')
    const backButton = document.getElementById('back-button')

    nextButton.disabled = !responseJson.info.next;
    backButton.disabled = !responseJson.info.prev;

    backButton.style.visibility = responseJson.info.prev ? "visible" : "hidden"

    // Atualiza o número da página
    const pageInfo = document.getElementById('page-info');
    pageInfo.innerText = `Page ${currentPage}`;

    currentPageUrl = url

    } catch (error) {
        alert('Error and loading locations')
        console.log(error);
}};

async function loadNextPage() {
    if (!currentPageUrl) return;
    
    try {
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()

        currentPage++;
        await loadLocation(responseJson.info.next)

    }catch (error) {
        alert('Error loading next page!')
        console.log(erro);
}};

async function loadPreviousPage() {
    if (!currentPageUrl) return;
    
    try {
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()

        currentPage--;
        await loadLocation(responseJson.info.prev)

    }catch (error) {
        alert('Error loading previous page!')
        console.log(erro);
}};
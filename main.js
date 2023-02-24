const $container = document.querySelector(".container");


// Создание карточки кота
const generateCatCard = (cats) => {
    let favorite = "";      
    if (cats.favorite) {
        favorite = `<i class="fa-sharp fa-solid fa-heart"></i>`
    } else {
        favorite = `<i class="fa-sharp fa-regular fa-heart"></i>`
    }
    return (
    `<div data-card = ${cats.id} class="cat-card">
        <img class="cat-card__img" src="${cats.image}" alt="${cats.name}">
        <div class="cat-card__info">
            <p class="cat-card__text">
                <span>${cats.name}</span>, ${cats.age}
            </p>
        </div>
        <div class="cat-card__btns">
            <button data-btn_edit class="cat-card__btn cat-card__btn_edit">
                <i class="fa-solid fa-arrow-rotate-left"></i>
            </button>
            <button data-btn_delete class="cat-card__btn cat-card__btn_delete">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <button data-btn_favorite class="cat-card__btn cat-card__btn_favorite">
                ${favorite}
            </button>
        </div>
        <div class="cat-card__id">id: ${cats.id}</div>
    </div>`
    )
}

// Показать всех котов
function showCat() {
    fetch(`https://cats.petiteweb.dev/api/single/sergeevseo/show`)
        .then(res => {
            return res.json()
        })
        .then(cats => {
            cats.forEach(elem => {
            $container.insertAdjacentHTML("beforeend", generateCatCard(elem))
            });
        })
}

// Переключатель любимый/нелюбимый
$container.addEventListener("click", async(event) => {
    if ("btn_favorite" in event.target.parentElement.dataset){
        const id = event.target.closest("[data-card]").dataset.card;
        if(event.target.classList.contains("fa-regular")){
            await fetch(`https://cats.petiteweb.dev/api/single/sergeevseo/update/${id}`, {
                method: "PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({"favorite": true})
                 })
                document.location.reload();
        } else if (event.target.classList.contains("fa-solid")){
                await fetch(`https://cats.petiteweb.dev/api/single/sergeevseo/update/${id}`, {
                    method: "PUT",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({"favorite": false}) 
            })
            document.location.reload();
        }
    }
})


showCat();

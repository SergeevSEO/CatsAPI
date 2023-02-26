const $container = document.querySelector("[data-container]");
const $addBtn = document.querySelector("[data-btn_add]");
const $modalAddCat = document.querySelector("[data-modal_wrapper]");
const $modalCatInfo = document.querySelector("[data-modal_cat-info]");


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
            <button data-btn_open class="cat-card__btn cat-card__btn_open">
            <i class="fa-regular fa-file-lines"></i>
            </button>
            <button data-btn_delete class="cat-card__btn cat-card__btn_delete">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <button data-btn_favorite class="cat-card__btn cat-card__btn_favorite">
                ${favorite}
            </button>
        </div>
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

// Кнопки на карточке
$container.addEventListener("click", async(event) => {
    //Переключатель любимый/нелюбимый
    if (event.target.classList.contains("fa-heart")){
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
    //Удаление
    if (event.target.classList.contains("fa-xmark")||event.target.classList.contains("cat-card__btn_delete")){
        const id = event.target.closest("[data-card]").dataset.card;
        await fetch(`https://cats.petiteweb.dev/api/single/sergeevseo/delete/${id}`,{
            method: "DELETE"
        });
        document.location.reload();
    }
    //Подробная информация о коте
    if (event.target.classList.contains("fa-file-lines")||event.target.classList.contains("cat-card__btn_open")){
        $modalCatInfo.classList.remove("hidden");
        const id = event.target.closest("[data-card]").dataset.card;
        showCurrentCat (id);
    }
})

// Отрисовка кота
const showCurrentCat = (id) =>{
    fetch(`https://cats.petiteweb.dev/api/single/sergeevseo/show/${id}`)
    .then(res => {
        return res.json();
    })
    .then(data => {
        console.log(data);
        $modalCatInfo.querySelector(".modal-cat-card__name").innerText = data.name;
        $modalCatInfo.querySelector(".modal-cat-card__img").src = data.image;
        $modalCatInfo.querySelector(".modal-cat-card__age").innerText = `Возраст: ${data.age} ${rightAge(data.age)}`;
        showRate(data.rate);
        showFavorUnfavor(data.favorite);
        if (data.description === "") {
            $modalCatInfo.querySelector(".modal-cat-card__text").innerText = "К сожалению, у данного котика нет описания";
        } else {
            $modalCatInfo.querySelector(".modal-cat-card__text").innerText = data.description;
        }
    })
}
// Написание год/года/лет
function rightAge(age){
    if (age === 1) {
        return "год"
    } else 
    if (age >= 2 && age <= 4) {
        return "года"
    } else 
    if (age >= 5 && age <= 20){
        return "лет"
    }
}

// Отрисовка рейтинга кота
function showRate(rate){
    const ratingBD = rate;
    const $ratingFront = $modalCatInfo.querySelector(".modal-cat-card__rating");
    while($ratingFront.firstChild){
        $ratingFront.firstChild.remove();
    }
    for(let i = 1; i<=5; i++){
        const $star = document.createElement('i');
        if (i<=ratingBD) {
            $star.classList.add("fa-solid", "fa-star");
            $ratingFront.appendChild($star);
        } else {
            $star.classList.add("fa-regular", "fa-star");
            $ratingFront.appendChild($star);
        }  
    }
}

// Отрисовка любимый/нелюбимый 
function showFavorUnfavor(favorite) {
    const $favorite = $modalCatInfo.querySelector(".modal-cat-card__favorite");
    const $heart = document.createElement("i");
    while($favorite.firstChild){
        $favorite.firstChild.remove();
    }
    if (favorite) {
        $heart.classList.add("fa-sharp", "fa-solid", "fa-heart")
        $favorite.appendChild($heart);
    } else {
        $heart.classList.add("fa-sharp", "fa-regular", "fa-heart")
        $favorite.appendChild($heart);
    }
}

//Закрыть подробную информацию о коте
$modalCatInfo.addEventListener("click", (event) =>{
    if (event.target.classList.contains("fa-rectangle-xmark")||event.target.hasAttribute("data-modal_cat-info")){
        $modalCatInfo.classList.add("hidden")
    }
})

// Добавление кота
$addBtn.addEventListener("click", (event) => {
    $modalAddCat.classList.remove("hidden");
})

$modalAddCat.addEventListener("click", (event) => {
    if(event.target.classList.contains("fa-rectangle-xmark")||event.target.hasAttribute("data-modal_wrapper")){
        $modalAddCat.classList.add("hidden")
    }
})

document.forms['add-cat'].addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.id = Math.floor(Math.random()*10e7);
    data.age = Number(data.age);
    data.rate = Number(data.rate);
    data.favorite = !!data.favorite;
    await fetch("https://cats.petiteweb.dev/api/single/sergeevseo/add",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    $modalAddCat.classList.add("hidden")
    document.location.reload();
})



showCat();

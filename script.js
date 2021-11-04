const body = document.querySelector('body');
const movies = document.querySelector('.movies');

const btn_next = document.querySelector('.btn-next');
const btn_prev = document.querySelector('.btn-prev');

const modal = document.querySelector('.modal');
const hidden = document.querySelector('.hidden');


//CARROSSEL:
//Elementos do carrossel
function criarElementos(item) {

    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie');
    movieDiv.style.backgroundImage = `url(${item.poster_path})`;

    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie__info');


    const title = document.createElement('span');
    title.classList.add('movie__title');
    title.textContent = item.title;


    const rating = document.createElement('span');
    rating.classList.add('movie__rating');

    const text = document.createElement('span')
    text.textContent = item.vote_average;

    const img = document.createElement('img');
    img.src = "./assets/estrela.svg"

    movies.append(movieDiv);
    movieDiv.append(movieInfo);
    movieInfo.append(title, rating);
    rating.append(img, text)

    abrirModal(movieDiv, item);
};


//Promise do carrossel


function pageZero() {
    let data = [];

    const promise = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR`);

    promise.then(function (respostaDoPromise) {
        if (!respostaDoPromise.ok) {
            console.log('ERRO');
            return;
        }

        const resposta = respostaDoPromise.json();

        resposta.then((itens) => {

            data = [...itens.results];

            function zeroPoint() {
                const spliceItens = itens.results.splice(5);
                movies.innerHTML = '';

                itens.results.forEach((item, index) => {
                    criarElementos(item);
                });
            };

            zeroPoint();


            //Avançar ou voltar carrossel:
            function next(item, index) {
                btn_next.addEventListener('click', function () {

                    const spliceItensDois = data.splice(5, 5);
                    movies.innerHTML = '';

                    spliceItensDois.forEach((item, index) => {
                        if (data.length === 5) {
                            data = [];
                            pageZero();
                        };
                        criarElementos(item);
                    });

                });
            };

            function prev(item, index) {
                btn_prev.addEventListener('click', function () {

                    const spliceItensDois = data.splice(-5, 5);
                    movies.innerHTML = '';

                    spliceItensDois.forEach((item, index) => {
                        if (data.length === 5) {
                            data = [];
                            pageZero();
                        };
                        criarElementos(item);
                    });

                });
            }

            if (!input.value) {
                next();
                prev();
            }


        });
    });
};

pageZero();


//Abrir modal:
function abrirModal(movie, item) {
    movie.addEventListener('click', function (event) {
        modal.classList.remove('hidden')
        modalMovies(item.id)
    });
};

function modalMovies(id) {
    //console.log(id)
    const promiseModal = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`);

    promiseModal.then(function (respostaDoPromiseModal) {
        const resposta = respostaDoPromiseModal.json();

        resposta.then((item) => {
            elementosModal(item);
        });
    });
};


//Elementos do modal:
const modal__title = document.querySelector('.modal__title');
const modal__img = document.querySelector('.modal__img');
const modal__description = document.querySelector('.modal__description');
const modal__average = document.querySelector('.modal__average');
const modal__genres = document.querySelector('.modal__genres');

function elementosModal(item) {
    modal__title.textContent = item.title;
    modal__img.src = item.backdrop_path;
    modal__description.textContent = item.overview;
    modal__average.textContent = item.vote_average;

    const genres = item.genres;

    modal__genres.innerHTML = '';
    genres.forEach(element => {
        const genre = document.createElement('span');
        genre.classList.add('modal__genre');

        genre.textContent = element.name;
        modal__genres.append(genre);
    });
};

const modal__close = document.querySelector('.modal__close');

modal__close.addEventListener('click', function () {
    modal.classList.add('hidden');
});


//INPUT:
const input = document.querySelector('.input');

function inputResults() {
    let conteudo = [];
    input.addEventListener('keydown', function (event) {

        if (event.key !== 'Enter' || input.value === '') return;

        const promiseInput = fetch(` https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`);

        promiseInput.then(function (respostaDoPromiseInput) {
            if (!respostaDoPromiseInput.ok) {
                console.log('ERRO');
                return;
            };

            const resposta = respostaDoPromiseInput.json();

            resposta.then((itens) => {

                conteudo = [...itens.results];


                const splice = itens.results.splice(5);
                movies.innerHTML = '';
                itens.results.forEach(item => {
                    criarElementos(item);
                    btn_next.classList.add('hidden')
                    btn_prev.classList.add('hidden')
                });
            });
        });
    });


    input.addEventListener('input', function (event) {

        if (input.value === '') {
            conteudo = [];
            if (conteudo.length === 0) {
                pageZero();
                btn_prev.classList.remove('hidden');
                btn_next.classList.remove('hidden');
            }
        };
    });
};

inputResults()


//HIGHLIGHT:
const highlight__video = document.querySelector('.highlight__video');
const highlight__title = document.querySelector('.highlight__title');
const highlight__rating = document.querySelector('.highlight__rating');
const highlight__genres = document.querySelector('.highlight__genres');
const highlight__launch = document.querySelector('.highlight__launch');
const highlight__description = document.querySelector('.highlight__description');

const promiseGeral = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR`);

promiseGeral.then(function (respostaDoPromiseGeral) {
    if (!respostaDoPromiseGeral.ok) {
        console.log('ERRO');
        return;
    };

    const resposta = respostaDoPromiseGeral.json();

    resposta.then((item) => {

        highlight__video.style.backgroundImage = `url(${item.backdrop_path})`;
        highlight__title.textContent = item.title;
        highlight__rating.textContent = item.vote_average;

        const genres = item.genres;
        const genreNames = [];

        genres.forEach(item => {
            genreNames.push(item.name)
        });

        highlight__genres.textContent = genreNames;

        const date = item.release_date.split("-");

        highlight__launch.textContent = " / " + date.reverse().join(" - ");
        highlight__description.textContent = item.overview;
    });
});


//Abrir trailer highlight:
const link_video = document.querySelector('.highlight__video-link');

const promiseVideo = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR`);

promiseVideo.then(function (respostaDoPromiseVideo) {

    const resposta = respostaDoPromiseVideo.json();

    resposta.then((item) => {
        const link = item.results[0].key;

        link_video.href = "https://www.youtube.com/watch?v=" + link;
    });
});


//Mudar tema:
const btn_theme = document.querySelector('.btn-theme');
btn_theme.classList.add('light');

const shadow_dark = document.querySelector('.shadow_dark');
const highlight__title_rating = document.querySelector('.highlight__title-rating');
const highlight__info = document.querySelector('.highlight__info');
const subtitle = document.querySelector('.subtitle');

btn_theme.addEventListener('click', function () {

    if (btn_theme.classList.contains('light')) {
        btn_theme.classList.remove('light');
        btn_theme.classList.add('dark');
        btn_theme.src = `${'./assets/dark-mode.svg'}`;

        body.style.backgroundColor = 'black';

        subtitle.style.color = 'white'
        highlight__info.style.backgroundColor = 'grey';
        highlight__genres.style.color = 'white';
        highlight__launch.style.color = 'white';
        highlight__description.style.color = 'white';

        input.style.backgroundColor = 'black';

        btn_next.src = `${'./assets/seta-direita-branca.svg'}`;
        btn_prev.src = `${'./assets/seta-esquerda-branca.svg'}`;
    } else {
        btn_theme.classList.add('light');
        btn_theme.src = `${'./assets/light-mode.svg'}`;

        body.style.backgroundColor = 'white';

        subtitle.style.color = 'black'
        highlight__info.style.backgroundColor = 'white';
        highlight__genres.style.color = 'black';
        highlight__launch.style.color = 'black';
        highlight__description.style.color = 'black';

        input.style.backgroundColor = 'white';

        btn_next.src = `${'./assets/seta-direita-preta.svg'}`;
        btn_prev.src = `${'./assets/seta-esquerda-preta.svg'}`;
    };
});
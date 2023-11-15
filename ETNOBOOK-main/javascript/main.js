

const apiUrl = 'https://etnobook-api.onrender.com/plantas';
const apiFindPlant = 'https://etnobook-api.onrender.com/plantas/find';


function obterDadosDaAPI() {
  console.log("teste");
  return fetch(apiUrl)
      .then(response => response.json())
      .catch(error => {
          console.error('Erro ao obter dados da API:', error);
          throw error;
      });
}

function criarElementosSwiper(plantas) {
  const elementosSwiper = [];

  plantas.forEach(function (planta) {
      const divPlanta = document.createElement('div');
      divPlanta.className = 'swiper-slide';
      divPlanta.setAttribute('data-id', planta.nomecientifico);
      console.log(planta.nomecientifico)

      const nome_cientifico = document.createElement('p');
      nome_cientifico.className = 'nome_cientifico';
      nome_cientifico.textContent = planta.nomecientifico;

      const descricao_planta = document.createElement('p');
      descricao_planta.className = 'descricao_planta';
      descricao_planta.textContent = planta.descricao;

      const nome_popular = document.createElement('h1');
      nome_popular.className = 'nome_popular';
      nome_popular.textContent = planta.nome;

      const img = document.createElement('img');
      img.className = 'img_planta';
      img.src = '../imagens/tyler.jpg'; // Use a URL da imagem da API, se disponível

      divPlanta.appendChild(nome_popular);
      divPlanta.appendChild(nome_cientifico);
      console.log(nome_popular)
      // divPlanta.appendChild(descricao_planta);
      divPlanta.appendChild(img);

      elementosSwiper.push(divPlanta);
      idNomeCientico = planta.nomecientifico
  });
  
  return elementosSwiper;
  
}


document.addEventListener('DOMContentLoaded', function () {
  obterDadosDaAPI()
      .then(function (plantas) {
          const elementosSwiper = criarElementosSwiper(plantas);
          const swiperWrapper = document.querySelector('.swiper-wrapper');

          elementosSwiper.forEach(function (elemento) {
              swiperWrapper.appendChild(elemento);
          });

          // Adiciona evento de clique a todas as divs com a classe "swiper-slide"
          const swiperSlides = document.querySelectorAll('.swiper-wrapper');
          swiperSlides.forEach(function (slide) {
              slide.addEventListener('click', function () {
                  // Lógica de redirecionamento aqui
                  console.log('Clicou em uma div com a classe swiper-slide');
                  criarPaginaDetalhada(idNomeCientico)
              });
          });

          // Inicializa o Swiper após adicionar os elementos
          const swiper = new Swiper("#swiper-main", {
              slidesPerView: 2,
              spaceBetween: 30,
              pagination: {
                  el: ".swiper-pagination",
                  clickable: true,
              },
          });
      })
      .catch(function (error) {
          console.error('Erro ao processar dados:', error);
      });
});

function criarPaginaDetalhada(idNomeCientico) {
    
    try {
      const response = fetch(apiFindPlant, {
          method: 'GET',
          
          body: {
            "nomecientifico": idNomeCientico
          }
      });
  }
  catch{
    console.error('Erro ao encontrar planta:', error);
  }
}
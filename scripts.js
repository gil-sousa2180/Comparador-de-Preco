/**
 * Conceito de logica de programação
 * 
 * Pegar os dados do Input, quando o botão for clicado
 * Ir até o servidor  e trazer os produtos
 * Colocar os Produtos na tela
 * Criar o gráfico de Preços
 */

//1° Dados do input 
const searchForm = document.querySelector('.search-form');//usado para procurar uma class dentro do Html
const productList = document.querySelector('.product-list');
const priceChart = document.querySelector('.price-chart');

let myChart = '' //armazenamento dos gráficos 

searchForm.addEventListener('submit', async function (event) { //monitorar, ficar de olho e quando a função for chamada será executada
    event.preventDefault();//usado para previnir que a tela reinicie automaticamente
    const inputValue = event.target[0].value;

    const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`); //2° Buscando dados do servidor
    const products = (await data.json()).results.slice(0, 10);

    displayItems(products);
    updatePriceChart(products);
});

function displayItems(products) {
    productList.innerHTML = products.map(product => `
          <div class="product-card">              
            <img src="${product.thumbnail.replace(/\w\.jpg/gi, 'W.jpg')}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="product-price">${product.price.toLocaleString('pt-br', { style: "currency", currency: "BRL" })}</p>
            <p class="product-store">Loja: ${product.seller.nickname}</p>
          </div>
       `,
    ).join('');
}
//função criada para chamar sempre um novo gráfico de forma atualizada
function updatePriceChart(products) {
    const ctx = priceChart.getContext('2d')

    if (myChart) {
        myChart.destroy() //Sempre que chamar a função, será desfeito o gráfico anterior e outro é criado
    }
    // myChart -> Armazenando os gráficos    
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {                                     //abrevição quantidade de caracteries, etc
            labels: products.map(product => product.title.substring(0, 20) + '...'),
            datasets: [{
                label: 'Preço (R$)',
                data: products.map(product => product.price),
                backgroundColor: '	rgb(166, 77, 255)',
                borderColor: 'rgb(166, 94, 237)',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return ('R$' + value.toLocaleString('pt-br', { style: "currency", currency: "BRL" })
                            )
                        },
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Comparador de Preços',
                            font: {
                                size: 20
                            }
                        }
                    }

                },
            },

        },

    })
}

//REGEX => Regular Expressions / Expressões Regulares
//REPLACE ('.jpg' substutir 'W.jpg')
//               regex    / replace substituição
//replace(/\w\.jpg.jpg/gi,    'W.jpg')

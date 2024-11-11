const apiUrl = "https://ecom-back-strapi.onrender.com/api/products";
const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzMwNzM1NTUzLCJleHAiOjE3MzMzMjc1NTN9.8tahgsa-twuEcgyDvmwl2R9QCHRlEsppSl95FmpKcBA";

// Função para buscar e preencher os produtos
async function fetchAndDisplayProducts() {
  try {
    // Faz a requisição à API com o cabeçalho de autenticação
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`Erro: ${response.status}`);

    const data = await response.json();

    // Seleciona todos os elementos com a classe .products
    const products = document.querySelectorAll(".products");

    // Preenche os dados para cada produto
    products.forEach((productElement, index) => {
      if (data.data[index]) {
        // Note que 'data.data' pode ser necessário se a API retornar os produtos nesse formato
        const productData = data.data[index].attributes;

        // Define os valores no HTML
        const img = productElement.querySelector("img");
        const name = productElement.querySelector(".productName");
        const price = productElement.querySelector(".productValue");

        img.src = productData.imagens[0];
        name.textContent = productData.nome;
        price.textContent = `Preço: R$ ${productData.preco.toFixed(2)}`;

        // Adicionar event listener no botão de comprar
        const buyButton = productElement.querySelector(".buyButton");
        buyButton.addEventListener("click", () => {
          carrinhoDeCompras.push({
            nome: productData.nome,
            preco: productData.preco
          });
          atualizarCarrinho();
        });
      }
    });
  } catch (error) {
    console.error("Erro ao buscar os produtos:", error);
  }
}

// Chama a função para buscar e exibir os produtos ao carregar a página
fetchAndDisplayProducts();

let carrinhoDeCompras = [];

function atualizarCarrinho() {
  const itensCarrinho = document.getElementById('itens-carrinho');
  const totalCarrinho = document.getElementById('total-carrinho');
  
  // Limpa o conteúdo atual do carrinho
  itensCarrinho.innerHTML = '';
  
  // Adiciona cada item ao carrinho
  carrinhoDeCompras.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'item-carrinho';
    itemElement.innerHTML = `
      <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
      <button class="remover-item" onclick="removerItem(${index})">X</button>
    `;
    itensCarrinho.appendChild(itemElement);
  });
  
  // Atualiza o total
  const total = carrinhoDeCompras.reduce((acc, item) => acc + item.preco, 0);
  totalCarrinho.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
}

function removerItem(index) {
  carrinhoDeCompras.splice(index, 1);
  atualizarCarrinho();
}

// Adiciona a área sensível ao mouse no HTML
const triggerArea = document.createElement('div');
triggerArea.id = 'carrinho-trigger';
document.body.appendChild(triggerArea);

const carrinho = document.getElementById('carrinho');

// Mostra o carrinho quando o mouse entra na área sensível
triggerArea.addEventListener('mouseenter', () => {
  carrinho.classList.add('active');
});

// Oculta o carrinho quando o mouse sai do carrinho
carrinho.addEventListener('mouseleave', () => {
  carrinho.classList.remove('active');
});

// Adicionar após as outras funções do carrinho
document.getElementById('finalizar-compra').addEventListener('click', () => {
  if (carrinhoDeCompras.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  
  const total = carrinhoDeCompras.reduce((acc, item) => acc + item.preco, 0);
  alert(`Compra finalizada com sucesso!\nTotal: R$ ${total.toFixed(2)}`);
  
  // Limpa o carrinho
  carrinhoDeCompras = [];
  atualizarCarrinho();
});

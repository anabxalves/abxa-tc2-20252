const API_URL = 'http://localhost:3000/api/produtos';

const form = document.getElementById('produto-form');
const produtoIdInput = document.getElementById('produto-id');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const tabelaBody = document.querySelector('#produtos-tabela tbody');

const nomeInput = document.getElementById('nome');
const descricaoInput = document.getElementById('descricao');
const precoInput = document.getElementById('preco');

function validarCampoDetalhado(inputElement) {
    const id = inputElement.id;
    const errorElement = document.getElementById(`erro-${id}`);
    errorElement.textContent = '';
    const value = inputElement.value.trim();
    let errorMessage = '';

    if (id === 'nome') {
        if (value === '') {
            errorMessage = 'O nome do produto é obrigatório.';
        } else if (value.length < 3) {
            errorMessage = 'O nome deve ter no mínimo 3 caracteres.';
        } else if (value.length > 100) {
            errorMessage = 'O nome deve ter no máximo 100 caracteres.';
        }
    }

    else if (id === 'descricao') {
        const fullValue = inputElement.value;
        if (fullValue.length > 255) {
            errorMessage = `A descrição excedeu o limite de 255 caracteres. (Atualmente: ${fullValue.length})`;
        }
    }

    else if (id === 'preco') {
        if (value === '') {
            errorMessage = 'O preço é obrigatório.';
        } else {
            const preco = parseFloat(value);
            if (isNaN(preco)) {
                errorMessage = 'Insira um valor numérico válido para o preço.';
            } else if (preco <= 0) {
                errorMessage = 'O preço deve ser maior que R$ 0,00.';
            }
        }
    }

    errorElement.textContent = errorMessage;

    return errorMessage === '';
}

function validarFormulario() {
    let isValid = true;

    isValid &= validarCampoDetalhado(nomeInput);
    isValid &= validarCampoDetalhado(descricaoInput);
    isValid &= validarCampoDetalhado(precoInput);

    return isValid;
}

nomeInput.addEventListener('blur', () => validarCampoDetalhado(nomeInput));
descricaoInput.addEventListener('blur', () => validarCampoDetalhado(descricaoInput));
precoInput.addEventListener('blur', () => validarCampoDetalhado(precoInput));

nomeInput.addEventListener('input', () => validarCampoDetalhado(descricaoInput));
descricaoInput.addEventListener('input', () => validarCampoDetalhado(descricaoInput));
precoInput.addEventListener('input', () => validarCampoDetalhado(descricaoInput));

async function listarProdutos() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        tabelaBody.innerHTML = '';
        data.data.forEach(produto => {
            const row = tabelaBody.insertRow();
            row.insertCell().textContent = produto.id;
            row.insertCell().textContent = produto.nome;
            row.insertCell().textContent = produto.descricao || '-';
            row.insertCell().textContent = `R$ ${produto.preco.toFixed(2)}`;

            const acoesCell = row.insertCell();

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'btn-acao btn-editar';
            editBtn.onclick = () => carregarProdutoParaEdicao(produto);
            acoesCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Excluir';
            deleteBtn.className = 'btn-acao btn-excluir';
            deleteBtn.onclick = () => deletarProduto(produto.id, produto.nome);
            acoesCell.appendChild(deleteBtn);
        });

    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
        alert('Por favor, corrija os erros do formulário antes de enviar.');
        return;
    }

    const id = produtoIdInput.value;
    const produto = {
        descricao: descricaoInput.value,
        nome: nomeInput.value,
        preco: parseFloat(precoInput.value)
    };

    let method = id ? 'PUT' : 'POST';
    let url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto)
        });

        if (response.ok) {
            alert(`Produto ${id ? 'atualizado' : 'cadastrado'} com sucesso!`);
            form.reset();
            produtoIdInput.value = '';
            submitBtn.textContent = 'Cadastrar';
            cancelBtn.style.display = 'none';
            document.querySelectorAll('.erro').forEach(el => el.textContent = '');
            listarProdutos();
        } else {
            const errorData = await response.json();
            alert(`Erro na operação: ${errorData.error || response.statusText}`);
        }
    } catch (error) {
        console.error(`Erro ao ${id ? 'atualizar' : 'cadastrar'} produto:`, error);
        alert('Ocorreu um erro de conexão com o servidor.');
    }
});


function carregarProdutoParaEdicao(produto) {
    produtoIdInput.value = produto.id;
    document.getElementById('nome').value = produto.nome;
    document.getElementById('descricao').value = produto.descricao;
    document.getElementById('preco').value = produto.preco;
    submitBtn.textContent = 'Salvar Edição';
    cancelBtn.style.display = 'inline-block';

    document.querySelectorAll('.erro').forEach(el => el.textContent = '');
}

cancelBtn.addEventListener('click', () => {
    form.reset();
    produtoIdInput.value = '';
    submitBtn.textContent = 'Cadastrar';
    cancelBtn.style.display = 'none';

    document.querySelectorAll('.erro').forEach(el => el.textContent = '');
});


async function deletarProduto(id, nome) {
    if (!confirm(`Tem certeza que deseja excluir o produto "${nome}" (ID: ${id})?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Produto excluído com sucesso!');
            await listarProdutos();
        } else {
            const errorData = await response.json();
            alert(`Erro ao excluir: ${errorData.error || response.statusText}`);
        }
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        alert('Ocorreu um erro de conexão com o servidor.');
    }
}

document.addEventListener('DOMContentLoaded', listarProdutos);
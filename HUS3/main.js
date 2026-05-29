const inputText = document.getElementById('inputText');
const addNote = document.getElementById('addNote');
const listaNotas = document.getElementById('listaNotas');

console.log('Referencias cargadas:', { inputText, addNote, listaNotas });

let notas = JSON.parse(localStorage.getItem('notas')) || [];
console.log(`Se cargaron ${notas.length} notas desde el Local Storage.`);

function crearNota(nota, index) {
    const li = document.createElement('li');
    li.textContent = `${nota} `;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';

    deleteButton.addEventListener('click', () => {
        const notaEliminada = notas.splice(index, 1);
        console.log(`Nota eliminada: "${notaEliminada}"`);
        actualizarLocalStorage();
        renderizarNotas();
    });

    li.appendChild(deleteButton);
    listaNotas.appendChild(li);
}

function renderizarNotas() {
    listaNotas.innerHTML = '';
    notas.forEach((nota, index) => {
        crearNota(nota, index);
    });
}

function actualizarLocalStorage() {
    localStorage.setItem('notas', JSON.stringify(notas));
}

addNote.addEventListener('click', () => {
    const nota = inputText.value.trim();

    if (!nota) {
        alert('La nota no puede estar vacía.');
        inputText.focus();
        return;
    }

    notas.push(nota);
    actualizarLocalStorage();
    renderizarNotas();

    console.log(`Nota agregada: "${nota}". Total de notas: ${notas.length}`);

    inputText.value = '';
    inputText.focus();
});

renderizarNotas();
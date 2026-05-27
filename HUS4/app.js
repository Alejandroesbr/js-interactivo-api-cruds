const form = document.getElementById('dataForm');
const elementInput = document.getElementById('itemInput');
const elementList = document.getElementById('itemList');
const buttonSubmit = document.getElementById('buttonSubmit');
const syncButton = document.getElementById('syncButton');

let elementos = JSON.parse(localStorage.getItem("formElemento")) || [];

form.addEventListener('submit', function (event) {
    Event.preventDefault()

    const element = elementInput.value;
    
    if (name && email){
        const newElement = {element};
        Elemento.push (newElement);
        guardarElementoLocalStorage();
        renderizarLista();

    }
})

function guardarElementoLocalStorage() {
    localStorage.setItem("formElemento",JSON.stringify(elementos));
}

function renderizarLista() {
    buttonSubmit.innerHTML = '';

    elementos.forEach(function (item, index){
        const fila = document.createElement('tr');
        const nombreCelda = document.createElement('td');
        const editarBoton = document.createElement('button');
        const eliminarBoton = document.createElement('button');

        nombreCelda.textContent = item.nombre;
        editarBoton.textContent = 'Editar';
        eliminarBoton.textContent = 'Eliminar';

        activarCelda.appendChild(editarBoto);
        activarCelda.appendChild(eliminarBoton)
        
        fila.appendChild(nombreCelda);
        fila.appendChild(activarCelda);

        buttonSubmit
    })
}


const form = document.getElementById("dataForm");
const elementInput = document.getElementById("itemInput");
const elementList = document.getElementById("itemList");
const buttonSubmit = document.getElementById("buttonSubmit");
const syncButton = document.getElementById("syncButton");

const mensajeFeedback = document.createElement("p");
form.appendChild(mensajeFeedback);

let elementos = JSON.parse(localStorage.getItem("formElemento")) || [];

form.addEventListener("submit", function (event) {
  event.preventDefault(); 

  const elementValue = elementInput.value.trim();

  if (elementValue) {
    const newElement = { nombre: elementValue }; 
    elementos.push(newElement);                  
    guardarElementoLocalStorage();
    renderizarLista();
    
    elementInput.value = ""; 
  }
});

function guardarElementoLocalStorage() {
  localStorage.setItem("formElemento", JSON.stringify(elementos));
}

function renderizarLista() {
  elementList.innerHTML = ""; 

  elementos.forEach(function (item, index) {
    const fila = document.createElement("tr");
    const nombreCelda = document.createElement("td");
    const accionesCelda = document.createElement("td"); 
    const editarBoton = document.createElement("button");
    const eliminarBoton = document.createElement("button");

    nombreCelda.textContent = item.nombre;
    editarBoton.textContent = "Editar";
    eliminarBoton.textContent = "Eliminar";

    editarBoton.addEventListener("click", function() {
        editarData(index);
        });

    eliminarBoton.addEventListener("click", function() {
        eliminarData(index);
    });


    accionesCelda.appendChild(editarBoton);
    accionesCelda.appendChild(eliminarBoton);

    fila.appendChild(nombreCelda);
    fila.appendChild(accionesCelda);

    elementList.appendChild(fila);
  });
}

function editarData(index) {
  const item = elementos[index];
  elementInput.value = item.nombre; 
  
  elementos.splice(index, 1); 
  guardarElementoLocalStorage();
  renderizarLista();
}

function eliminarData(index) {
  const item = elementos[index];

  elementos.splice(index, 1); 
  guardarElementoLocalStorage();
  renderizarLista();
}



// Renderizar al cargar la página
renderizarLista();


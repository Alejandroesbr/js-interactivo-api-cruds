document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById("dataForm");
  const elementInput = document.getElementById("itemInput");
  const elementList = document.getElementById("itemList");
  const feedback = document.getElementById("messegeFeedback");

  const API_URL = "http://localhost:8000/elementos";
  let elements = [];
  let editingID = null;

  // Validacion 1

  function showFeedback(message, isError = false) {
    feedback.textContent = message;
    feedback.style.color = isError ? "red" : "green";
    console.log(`[feedback] ${message}`);
  }

  async function loadElements() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Is not possible to call the API. ")

      elements = await response.json();
      console.log("GET Successful, Response from the server:", elements);

      //Local host sync

      saveInLocalStorage();
      renderList();
    } catch (error) {
      console.error("Error in GET(loading from local storage)", error)
      showFeedback("Error tried to connect with the API, Using local data", true)

      // Backup in Local Storage si el servidor esta caido

      elements = JSON.parse(localStorage.getItem("formElement")) || [];
      renderList();
    }
  }

function saveInLocalStorage() {
    localStorage.setItem("formElement", JSON.stringify(elements));
  }

// Manipulacion del DOM

function renderList() {
  elementList.innerHTML = ""; // Limpiar antes de renderizar
  elements.forEach(item => {
    // Crear <li>
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.id = `item-${item.id}`; // para asiganar id al nodo del DOM

    // Contenido del texto
    const text = document.createElement("span");
    text.textContent = item.name;
    li.appendChild(text);

    // contenedor de acciones
    const actions = document.createElement("div");
    actions.className = "d-flex gap-2";

    // Btn editar
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-warning btn-sm";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => prepareEdit(item));
    actions.appendChild(editBtn);

    // Btn eliminar
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteData(item.id));
    actions.appendChild(deleteBtn);

    li.appendChild(actions);
    elementList.appendChild(li);
  });
}

// POST y PUT

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const elementValue = elementInput.value.trim();

  if (!elementValue) {
    showFeedback("The field cannot be left blank", true);
    return;
  }

  const itemData = { name: elementValue };

  try {
    if (editingID !== null) {
      // PUT
      const response = await fetch(`${API_URL}/${editingID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData)
      });

      if (!response.ok) throw new Error("Error updating on the server");
      const itemUpdate = await response.json();
      console.log("PUT successful. Server response:", itemUpdate);

      // Actualizar array global
      elements = elements.map(emp =>
        emp.id === editingID ? itemUpdate : emp);
      // volver a consultar la API para renderizar datos actualizados
      await loadElements();
      showFeedback("Element update successful ");

      editingID = null;
      document.getElementById("buttonSubmit").textContent = "add";
    
    } else  {
      // POST
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(itemData)
      });

      if (!response.ok) throw new Error("Error to save in the server");
      const newItem = await response.json();
      console.log("POST successful. Response from the server:", newItem);

      // agregar al array

      elements.push(newItem);
      // volver a consultar la API para mantener sincronizado el estado
      await loadElements();

      showFeedback("Element add successful");
    }

    // async todo
    saveInLocalStorage();
    renderList();
    elementInput.value = "";

  } catch (error) {
    console.error("Error in the operations", error);
    showFeedback("Error with the server", true);
  }
});

// preparar al formulario para el put
function prepareEdit(item) {
  elementInput.value = item.name;
  editingID = item.id;
  document.getElementById("buttonSubmit").textContent = "Save Changes";
  elementInput.focus();
}

// DELETE

async function deleteData(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) throw new Error("It could not be deleted from the server");
    console.log (`DELETE successful from the ID: ${id} Response from the server: ${response.status}`);

    // remover del array

    elements = elements.filter(item => item.id !== id);
    // guardar en Local Storage
    saveInLocalStorage();

    // remove para modificar el DOM

    renderList();

    showFeedback("Element delete successful");
  } catch (error) {
    console.error("ERROR DELETE", error);
    showFeedback("The item could not be deleted from the server", true);
  }
}

loadElements();
});
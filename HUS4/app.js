document.addEventListener('DOMContentLoaded', (event) => {

  const form = document.getElementById("dataForm");
  const elementInput = document.getElementById("itemInput");
  const elementList = document.getElementById("itemList");
  const feedback = document.getElementById("messegeFeedback");

  const API_URL = "http://localhost:8000/productos";
  let elements = [];
  let editID =  null;

// Validacion 1

  function showFeedback(message, isError = false) {
    feedback.textContent = message;
    feedback.style.color = isError ? "red" : "green";
    console.log (`[feedback] ${message}`);
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
    

    console.log('DOM fully loaded and parsed');
}
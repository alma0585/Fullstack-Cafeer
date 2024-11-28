const cafeList = document.querySelector("#all-cafe");
const submitButton = document.querySelector("#submit");

fetch("http://localhost:4000/all")
    .then(response => response.json())
    .then(data => {
        data.forEach(e => {
            const newElement = document.createElement("li");
            newElement.innerText = e.name;
            cafeList.appendChild(newElement);
        });
    });



//--------------------------Button that push name and location------------------------//
submitButton.addEventListener("click",()=>{
    const nameFromForm = document.querySelector("#name").value;
    const locationFromForm = document.querySelector("#location").value;

    const jsonObjectToPost = {
        name:nameFromForm,
        location:locationFromForm
    }

    const fetchConfiguration = {
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(jsonObjectToPost)
    }

    fetch("http://localhost:4000/new", fetchConfiguration)
        .then(res => res.json())
        .then(res => console.log(res));
});


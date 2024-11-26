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



//--------------------------Button that push new cafe------------------------//
submitButton.addEventListener("click",()=>{
    const getName = document.querySelector("#name").value;
    const getLocation = document.querySelector("#location").value;
    const getRating = document.querySelector('#rating').value;
    const getDescription = document.querySelector('#description').value;

    const jsonObjectToPost = {
        name:getName,
        location:getLocation,
        rating:getRating,
        description:getDescription
    }

    const fetchConfiguration = {
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(jsonObjectToPost)
    }

    fetch("http://localhost:4000/cafes/new", fetchConfiguration)
        .then(res => res.json())
        .then(res => console.log(res));
});


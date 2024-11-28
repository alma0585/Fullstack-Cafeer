// ------------------------- Cafe List Fetch ----------------------------
const cafeList = document.querySelector("#all-cafe");
const submitButtonCafe = document.querySelector("#submitCafe");

/*
// Fetch all cafes and display them in a list
fetch("http://localhost:4000/cafes")
    .then(response => response.json())
    .then(data => {
        data.forEach(e => {
            const newElement = document.createElement("li");
            newElement.innerText = e.name;
            cafeList.appendChild(newElement);
        });
    });
*/

// -------------------------- Button to Add New Cafe -------------------
submitButtonCafe.addEventListener("click", () => {
    const getName = document.querySelector("#name").value;
    const getLocation = document.querySelector("#location").value;
    const getRating = document.querySelector('#rating').value;
    const getDescription = document.querySelector('#description').value;

    const jsonObjectToPost = {
        name: getName,
        location: getLocation,
        rating: getRating,
        description: getDescription
    };

    const fetchConfiguration = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonObjectToPost)
    };

    // Send data to server and play confetti when success
    fetch("http://localhost:4000/cafes/new", fetchConfiguration)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        })
        .catch(err => {
            console.error("Error:", err);
        });
});

// -------------------------- User List Fetch --------------------------
/*
const userList = document.querySelector("#all-user");

// Fetch all users and display them in a list
fetch("http://localhost:4000/users")
    .then(response => response.json())
    .then(data => {
        data.forEach(e => {
            const newElement = document.createElement("li");
            newElement.innerText = e.username;
            userList.appendChild(newElement);
        });
    });
*/

const submitButtonUser = document.querySelector("#submitUser");

// -------------------------- Button to Add New User -------------------
submitButtonUser.addEventListener("click", () => {
    const getNameUser = document.querySelector("#username").value;
    const getEmailUser = document.querySelector("#email").value;
    const getPassword = document.querySelector('#password').value;

    const jsonObjectToPostUser = {
        username: getNameUser,
        email: getEmailUser,
        password: getPassword
    };

    const fetchConfigurationUser = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonObjectToPostUser)
    };

    // Send data to server and play confetti when success
    fetch("http://localhost:4000/users/new", fetchConfigurationUser)
        .then(async (res) => {
            if (res.status === 201) {
                const responseBody = await res.json();
                console.log(responseBody.message);

                // Trigger confetti
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } else {
                console.error('Error:', res.status);
            }
        })

});

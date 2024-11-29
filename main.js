console.log("It works");

const submitButtonCafe = document.querySelector("#submitCafe");


// Validate if the username exists in the users table
function validateUsernameBeforeRegister() {
    const username = document.querySelector("#usernameRequired").value; // Hent værdien fra inputfeltet

    if (!username) {
        alert("Please provide a username.");
        return Promise.reject("Username is required");
    }

    // Check if username exists
    return fetch(`http://localhost:4000/users/check?username=${username}`)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("Username does not exist");
            }
        })
        .then(data => {
            if (data.exists) {
                return true; // Username is valid
            } else {
                throw new Error("Username does not exist");
            }
        })
        .catch(error => {
            alert(error.message);
            return Promise.reject(error);
        });
}


// -------------------------- Button to Add New Cafe -------------------
submitButtonCafe.addEventListener("click", () => {
    validateUsernameBeforeRegister()
        .then(()=> {
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
                        origin: {y: 0.6}
                    });
                })
                .catch(err => {
                    console.error("Error:", err);
                });
        });
});


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



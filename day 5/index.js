const users = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signup")?.addEventListener("submit", signUp);
  document.getElementById("login")?.addEventListener("submit", login);
});

function signUp(e){
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.some(user=> user.username === username);
    if (exists) {
        document.getElementById("output").innerText = "Username already exists. Please choose another.";
        return console.log("Signed Up");
      }
    users.push({ username, password, gender });
    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("output").innerText ="User registered";
    document.getElementById("signup").reset();
}

function login(e){
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.some(user=> user.username === username && user.password === password);
    if (user){
        alert("Welcome");
        return console.log("Welcome");
    }else{
        document.getElementById("output").innerHTML ="Invalid Credentials";
         
    }
}
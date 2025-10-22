var addButton = document.getElementsByClassName("addButton")[0];
var input = document.getElementsByClassName("input")[0];
var olList = document.getElementsByClassName("olList")[0];

addButton.addEventListener("click", addListItem);



function addListItem(){
    var inputText = input.value.trim();

    if (inputText !== ""){
        var newListItem = document.createElement("li");
        newListItem.textContent = inputText;
        olList.appendChild(newListItem);
        input.value="";
    }

    newListItem.addEventListener("click", toggle);

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", function(){newListItem.remove();});
    newListItem.appendChild(deleteButton);
    olList.appendChild(newListItem);
    input.value = "";
    deleteButton.style.backgroundColor = "red";

}

function toggle(){
    this.classList.toggle("completed");
}
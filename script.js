const aler = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

let editElement;
let editFlag = false;
let editID = "";
form.addEventListener('submit', addItem);

clearBtn.addEventListener('click', clearItems)

window.addEventListener('DOMContentLoaded',setupItem)

function addItem(e){
    e.preventDefault()
    const valu = grocery.value;
    const id = new Date().getTime().toString()
    if (valu && !editFlag) {
        createListItem(id,valu)
        displayAlert('item added to the list','success');
        addToLocalStorage(id,valu)
        setBackToDefault()
    }
    else if (valu && editFlag) {
        editElement.innerHTML = valu;
        displayAlert("value changed",'success');
        setBackToDefault()
        editLocalStorage(editID,valu)
    }
    else{
        displayAlert("please enter value","danger")
    }
}

function displayAlert(text,action){
    aler.textContent = text
    aler.classList.add(`alert-${action}`)
    setTimeout(() => {
        aler.textContent = "";
        aler.classList.remove(`alert-${action}`)
    },1000)
}

function clearItems(){
    const items = document.querySelectorAll('.grocery-item')
    if (items.length > 0) {
        items.forEach(function(item){
            list.removeChild(item)
        })
    }
    displayAlert('empty list','danger')
    setBackToDefault()
    localStorage.removeItem('list')
}

function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element)
    displayAlert('item removed','danger')
    setBackToDefault()
    removeFromLocalStorage(id);
}

function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling
    grocery.value = editElement.innerHTML
    editFlag = true
    editID = element.dataset.id
    submitBtn.textContent = 'Edit'
}

function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "Submit"
}


function addToLocalStorage(id,valu){
    const grocery = { id, valu };
    let items = getLocalStorage()
    items.push(grocery)
    localStorage.setItem('list',JSON.stringify(items))
}

function removeFromLocalStorage(id){
    let items = getLocalStorage()
    items = items.filter(function(item){
        if (item.id !== id) {
            return item
        }
    })
    localStorage.setItem('list',JSON.stringify(items))
}

function editLocalStorage(id,valu){
    let items = getLocalStorage()
    items = items.map(function(item){
        if (item.id === id) {
            item.valu = valu
        }
        return item;
    })
    localStorage.setItem("list",JSON.stringify(items))
};
function getLocalStorage(){
    return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem('list'))
    : [];
}
// localStorage.setItem("orange",JSON.stringify(["item","item2"]));
// const oranges = JSON.parse(localStorage.getItem("orange"));
// localStorage.removeItem("orange")


function setupItem(){
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(function(item){
            createListItem(item.id,item.valu)
        })
    }
}

function createListItem(id,valu){
    const element = document.createElement('article');
    element.classList.add('grocery-item')
    const attr = document.createAttribute('data-id');
    attr.value = id
    element.setAttributeNode(attr)
    element.innerHTML = `
            <p class="title">${valu}</p>
                <div class="btn-container">
                    <button type="button" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                `;
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deleteItem)
    editBtn.addEventListener('click', editItem)
    list.appendChild(element)
}
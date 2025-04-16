const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clear = document.querySelector('#clear');

// Add Items
function addItem (e) {
    e.preventDefault();

    const newItem = itemInput.value;
    
    // Validate input
    if (newItem === '') {
        alert('Please enter an item');
        return;
    }

    // Create a list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(newItem));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    itemList.appendChild(li);

    itemInput.value = '';
}

function createButton(classes) {
    const button = document.createElement('buttton');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

// Remove an item
function removeItem (e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        e.target.parentElement.parentElement.remove();
    }
}

// Clear all items
function clearItems () {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
}

// Event Listeners
itemForm.addEventListener('submit', addItem);
itemList.addEventListener('click', removeItem);
clear.addEventListener('click', clearItems);
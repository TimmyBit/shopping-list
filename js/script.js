const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clear = document.querySelector('#clear');
const itemFilter = document.querySelector('.filter');

function displayItems () {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDom(item));
    checkUI();
}

// Add Items
function onItemSubmit (e) {
    e.preventDefault();
    
    const newItem = itemInput.value;
    
    // Validate input
    if (newItem === '') {
        alert('Please enter an item');
        return;
    }
    
    // Create item DOM element
    addItemToDom(newItem);
    
    // Add item to locat storage
    addItemToStorage(newItem);
    
    checkUI();
    
    itemInput.value = '';
}

function addItemToDom (item) {
    // Create a list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);
    
    // Add li to DOM
    itemList.appendChild(li);
}

function createButton(classes) {
    const button = document.createElement('button');
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

// Get items from storage
function addItemToStorage (item) {
    const itemsFromStorage = getItemsFromStorage();
    
    // Add new item  to array
    itemsFromStorage.push(item);

    // Convert to JSON string and set ti local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage () {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

// Remove an item
function removeItem (e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        e.target.parentElement.parentElement.remove();
    }
    checkUI();
}

// Clear all items
function clearItems () {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
    checkUI();
}

// Filter
function filterItems (e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Check for list items
function checkUI () {
    const items = itemList.querySelectorAll('li');

    if (items.length === 0) {
        clear.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clear.style.display = 'block';
        itemFilter.style.display = 'block';
    }
}

function init() {
    // Event Listeners
    itemForm.addEventListener('submit', onItemSubmit);
    itemList.addEventListener('click', removeItem);
    clear.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);
    checkUI();
}

init();
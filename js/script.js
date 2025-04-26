const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clear = document.querySelector('#clear');
const itemFilter = document.querySelector('.filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

/**
 * Retrieves items from local storage and displays them in the DOM.
 * Also checks and updates UI elements based on current state.
 */
function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDom(item));
    checkUI();
}

/**
 * Handles the form submission event to add or update an item.
 * Prevents default behavior, validates input, and manages edit state.
 *
 * @param {Event} e - The form submission event.
 */
function onItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value.trim();

    if (newItem === '') {
        alert('Please enter an item');
        return;
    }

    if (!isEditMode && checkIfItemExists(newItem)) {
        alert('That item already exists!');
        return;
    }

    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        const originalName = itemToEdit.textContent.trim();

        if (originalName !== newItem && checkIfItemExists(newItem)) {
            alert('That item already exists!');
            return;
        }

        removeItemFromStorage(originalName);
        itemToEdit.remove();
        isEditMode = false;
    }

    addItemToDom(newItem);
    addItemToStorage(newItem);
    checkUI();
    itemInput.value = '';
}

/**
 * Creates and appends a new list item to the DOM.
 *
 * @param {string} item - The text content of the item to add.
 */
function addItemToDom(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    itemList.appendChild(li);
}

/**
 * Creates a button element with specified classes and a close icon.
 *
 * @param {string} classes - The CSS classes to apply to the button.
 * @returns {HTMLButtonElement} - The generated button element.
 */
function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

/**
 * Creates an icon element with given classes.
 *
 * @param {string} classes - The CSS classes to apply to the icon.
 * @returns {HTMLElement} - The generated icon element.
 */
function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

/**
 * Saves a new item to local storage.
 *
 * @param {string} item - The item text to be stored.
 */
function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

/**
 * Retrieves all stored items from local storage.
 *
 * @returns {string[]} - An array of stored item strings.
 */
function getItemsFromStorage() {
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

/**
 * Handles click events on the item list.
 * Determines if an item is being removed or edited.
 *
 * @param {Event} e - The click event.
 */
function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

/**
 * Checks if a given item already exists in local storage.
 *
 * @param {string} item - The item to check for.
 * @returns {boolean} - True if item exists, otherwise false.
 */
function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

/**
 * Enables editing mode for the selected list item.
 * Updates UI and form state accordingly.
 *
 * @param {HTMLElement} item - The list item element to edit.
 */
function setItemToEdit(item) {
    isEditMode = true;

    itemList
        .querySelectorAll('li')
        .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent.trim();
    itemInput.focus();
}

/**
 * Removes a list item from the DOM and storage.
 *
 * @param {HTMLElement} item - The list item element to remove.
 */
function removeItem(item) {
    const itemText = item.textContent.trim();
    item.remove();
    removeItemFromStorage(itemText);
    checkUI();
}

/**
 * Removes a specific item from local storage.
 *
 * @param {string} item - The item to remove.
 */
function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

/**
 * Clears all items from the list and local storage.
 */
function clearItems() {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
    localStorage.removeItem('items');
    checkUI();
}

/**
 * Filters visible items based on text input.
 *
 * @param {Event} e - The input event from the filter field.
 */
function filterItems(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.indexOf(text) !== -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Updates UI elements based on the state of the item list.
 * Resets form to default "Add" mode if not editing.
 */
function checkUI() {
    const items = itemList.querySelectorAll('li');

    if (items.length === 0) {
        clear.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clear.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
    isEditMode = false;
}

/**
 * Initializes the application.
 * Sets up event listeners and initial UI state.
 */
function init() {
    itemForm.addEventListener('submit', onItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clear.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
}

init();

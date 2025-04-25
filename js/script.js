const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clear = document.querySelector('#clear');
const itemFilter = document.querySelector('.filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

/**
 * Displays items from local storage and checks UI status.
 */
function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDom(item));
    checkUI();
}

/**
 * Handles the form submission to add a new item.
 * Validates the input and updates the DOM and local storage.
 *
 * @param {Event} e - The form submit event.
 */
function onItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate input
    if (newItem === '') {
        alert('Please enter an item');
        return;
    }

    // Check for edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }

    // Create item DOM element
    addItemToDom(newItem);

    // Add item to local storage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = '';
}

/**
 * Creates a new list item, appends the input value, and adds a remove button.
 *
 * @param {string} item - The text content of the new list item.
 */
function addItemToDom(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    itemList.appendChild(li);
}

/**
 * Creates a button element with specified classes and an icon.
 *
 * @param {string} classes - The classes to be applied to the button.
 * @returns {HTMLButtonElement} - The created button element.
 */
function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

/**
 * Creates an icon element with the specified classes.
 *
 * @param {string} classes - The classes to be applied to the icon.
 * @returns {HTMLElement} - The created icon element.
 */
function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

/**
 * Adds an item to local storage.
 *
 * @param {string} item - The item to be added to storage.
 */
function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

/**
 * Retrieves all items from local storage.
 *
 * @returns {string[]} - The list of item strings retrieved from local storage.
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
 * Handles item click: removes item if the remove button is clicked,
 * otherwise enters edit mode for the clicked item.
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
 * Enables edit mode for a selected list item.
 * Highlights the item, updates the button to show edit state,
 * and populates the input with the item's text.
 *
 * @param {HTMLElement} item - The list item to edit.
 */
function setItemToEdit(item) {
    isEditMode = true;

    itemList
        .querySelectorAll('li')
        .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

/**
 * Removes an item from the DOM and local storage.
 *
 * @param {HTMLElement} item - The list item to remove.
 */
function removeItem(item) {
    item.remove();
    removeItemFromStorage(item.textContent);
    checkUI();
}

/**
 * Removes an item from local storage.
 *
 * @param {string} item - The item to remove from storage.
 */
function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

/**
 * Clears all items from the DOM and local storage.
 */
function clearItems() {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
    localStorage.removeItem('items');
    checkUI();
}

/**
 * Filters the list items based on user input.
 *
 * @param {Event} e - The input event from the filter text box.
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
 * Updates the UI based on the number of items in the list.
 * Hides or shows the filter and clear buttons accordingly.
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

    formBtn.innerHTML = '<i class = "fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

/**
 * Initializes the application by setting up event listeners and UI checks.
 */
function init() {
    // Event Listeners
    itemForm.addEventListener('submit', onItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clear.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
}

init();

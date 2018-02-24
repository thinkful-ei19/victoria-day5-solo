'use strict';

const STORE = {
  items : [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'rye bread', checked: false}
  ]
};


function generateItemElement(item, itemIndex, template) {
  return `
  <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <input type="text" class="js-shopping-list-edit" style="display:none"/>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}

function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');
  const items = shoppingList.map((item, index) => generateItemElement(item, index));

  return items.join('');
}

function renderShoppingList() {
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);
  $('.js-shopping-list').html(shoppingListItemsString);
  handleEdit();
}

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').on('click', `.js-item-add`, event => {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log("Toggling checked property for item at index " + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

// User can cross off items of the shoppingList
function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

// User can remove items from shoppingList
function removeItem(itemIndex) {
  console.log(`Deliting item ${itemIndex} from the list`)
  STORE.items.splice(itemIndex, 1);
}

function handleRemoveItem(){
  $('.js-shopping-list').on('click', `.js-item-delete`, event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    removeItem(itemIndex);
    renderShoppingList();
  });
}

// User can press a switch/checkbox to toggle between displaying all items or displaying only items that are unchecked
function hideCheckedList(){
  const filteredCheckedItems = STORE.items.filter(item => !item.checked);
  const shoppingListItemsString = generateShoppingItemsString(filteredCheckedItems);
  $('.js-shopping-list').html(shoppingListItemsString);
  console.log(filteredCheckedItems);
  }

function handleCheckedList(){
  $('.navigation').change(event => {
     console.log('`handleCheckedList` ran');
     if ($('input[type=checkbox]').prop('checked')) {
       hideCheckedList();
     } else {
       renderShoppingList();
     }
  });
}

// User can type in a search term and the displayed list will be filtered by item names only containing that search term
function searchList(searchedItem) {
  console.log(searchedItem, 'searchlist item')
  const arrSearch = STORE.items.filter(function(item){
    const itemLowerStr = item.name.toLowerCase()
    return itemLowerStr.includes(searchedItem.toLowerCase());
  });
  console.log(arrSearch, 'arrsearch')
  const shoppingListSearch = generateShoppingItemsString(arrSearch);
  $('.js-shopping-list').html(shoppingListSearch);
}

function handleSearchList() {
  $('#js-shopping-list-form').on('click', `.js-item-search`, event =>  {
    event.preventDefault();
    console.log('`handleSearchList` ran');
    const searchedItem = $('.js-shopping-list-entry').val();
    console.log(searchedItem, 'searcheditem')
    searchList(searchedItem)
  });
}

//  User can edit the title of an item
function edit(oldValue, newValue){
  const idx = STORE.items.findIndex(function(obj){
    return obj.name === oldValue;
  });
  STORE.items[idx].name = newValue;
  renderShoppingList();
}

function handleEdit() {
  $(".js-shopping-item").dblclick(function(){
    $(this).hide().siblings(".js-shopping-list-edit").show().val($(this).text()).focus();
  });
  $(".js-shopping-list-edit").focusout(function(){
      $(this).hide().siblings(".js-shopping-item").show()
      const oldValue = $(this).siblings(".js-shopping-item").text();
      const newValue = $(this).val();
      edit(oldValue, newValue);
  });
}


function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleRemoveItem()
  handleCheckedList();
  handleSearchList();
  handleEdit();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);

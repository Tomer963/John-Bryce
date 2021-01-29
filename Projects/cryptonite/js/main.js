// global
let coins = [];
let coinInfo = [];
let moreInfoStorage;
let pageNumber = 1;
const pageSize = 21;
/****************************************************************************************/
//first function to happen when document ready(windows.onload)
$(document).ready(function () {
  // Load home.html by default
  htmlPage('home.html');
});

/****************************************************************************************/
// show or none the relevant items on screen
function htmlPage(pageName) {
  $.ajax({
    url: `./inner-pages/${pageName}`,
    type: 'GET',
    success: function (data) {
      $('#inner-content').html(data);
      if (pageName === 'home.html') {
        $('.homeNavItem').addClass('active');
        $('.liveReportsNavItem').removeClass('active');
        $('.aboutNavItem').removeClass('active');
        $('#live-report-content').css('display', 'none');
        $('#about-content').css('display', 'none');
        getCoinsFromApi();
      } else if (pageName === 'liveReports.html') {
        $('.liveReportsNavItem').addClass('active');
        $('.homeNavItem').removeClass('active');
        $('.aboutNavItem').removeClass('active');
        $('#about-content').css('display', 'none');
        $('#home-content').css('display', 'none');
        $('#live-report-content').html(data).show();
        initChart();
      } else if (pageName === 'about.html') {
        $('.aboutNavItem').addClass('active');
        $('.homeNavItem').removeClass('active');
        $('.liveReportsNavItem').removeClass('active');
        $('#loaderfirstApi').css('display,none');
        $('#coinsOptions').css('display,none');
        $('#home-content').css('display', 'none');
        $('#live-report-content').css('display', 'none');
        $('#about-content').html(data).show();
      }
    },
  });
}

/*****************************************************************************************************/

// Don't need async because the function isn't using any 'await'
// The only asynchronous part here is the fetch, which is already dealt with by using
// `then` and `catch` functions
function getCoinsFromApi() {
  $('#loaderfirstApi').show();
  fetch('https://api.coingecko.com/api/v3/coins/list')
    .then((response) => response.json())
    .then((data) => {
      coins = data;
      initCoins(data);
    })
    .catch((error) => console.log(error));
}

/************************************************************************************************************/

function initCoins(data) {
  $('#loaderfirstApi').css('display', 'none');
  drawAfterPaginate();
  $('#coinsOptions').show();
  searchOption(data);
  $('#searchForCoin').prop('disabled', false);
}
/************************************************************************************************************/

function drawAfterPaginate() {
  if (pageNumber === 1) {
    $('#previousBtn').css('display', 'none');
  } else if (Math.ceil(coins.length / pageSize) === pageNumber) {
    $('#nextBtn').css('display', 'none');
  } else {
    $('#previousBtn').show();
    $('#nextBtn').show();
  }
  let drawContent = drawCoins(paginate(coins, pageSize, pageNumber));
  $('#coins-place').html(drawContent);
  $('#paginateTheCoins').show();
}

/************************************************************************************************************/
//get the coins array list from first api and paginate
function paginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}
/************************************************************************************************************/
//pagination next page
function nextPage() {
  pageNumber++;
  drawAfterPaginate();
}
/*************************************************************************************************************/
//pagination previos page
function previousPage() {
  pageNumber--;
  drawAfterPaginate();
}
/**************************************************************************************************************************** */

function drawCoins(coins) {
  const coinsInStorage = getFromStorage('selectedCoinsArr');
  if (coinsInStorage === null || coinsInStorage === undefined) {
    setLocalStorage([], 'selectedCoinsArr');
  }
  let content = '';
  for (let i = 0; i < coins.length; i++) {
    content += `
		<div class="col-md-6 col-lg-4">
		<div class="card bg-light my-4 shadow">
		<div class="card-header d-flex justify-content-between align-items-center">
		${coins[i].name}
		</div>
		<div class="card-body">
		  <h5 class="card-title">${coins[i].symbol.toUpperCase()}</h5>
		  <a class="btn btn-dark" onclick="showMoreInfo('${
        coins[i].id
      }',this)" data-toggle="collapse" href="#${coins[i].id}_">
		   More Info
       </a>
       <label class="switch" style="position:relative;left:35px;bottom:11px;">
       <input id="${coins[i].id}" type="checkbox" ${checkIds(
      coins[i].id
    )} onchange="onSwitch('${coins[i].id}','${coins[i].symbol}','${
      coins[i].name
    }', this)">
         <span class="slider round"></span>
       </label>
		  <div class="collapse text-center align-items-center" id="${coins[i].id}_">
		</div>
		</div>
	  </div> 
	</div>
  `;
  }
  return content;
}

/********************************************************************************************************/
// Don't need async because the function isn't using any 'await'
// The only asynchronous part here is the fetch, which is already dealt with by using
// `then` and `catch` functions
function getCoinsInfo(el, id) {
  _loader = `<div class="spinner-border text-info mt-4" style="width: 5rem; height: 5rem;">
	<span class="sr-only">Loading...</span></div>`;
  el.innerHTML = _loader;
  // Dont need await because we are not doing anything AFTER the fetch
  // Await is meant to WAIT for this line to execute and THEN to do more afterwards
  fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
    .then((response) => response.json())
    .then((result) => {
      drawMoreCoinInfo(el, result);
      addCoinInfoToStorage(id, result);
      $('#loaderBeforeApi').css('display', 'none');
    })
    .catch((error) => console.log(error));
}

/*******************************************************************************************/
//draw the collapser card when the user click "More Info" button
//this function get the array that include the coin object with all the informatin

function drawMoreCoinInfo(el, coinInfo) {
  let output = '';
  output = `
	<div class="card-header bg-info mt-3" style="height:45px;">
	  market current price:
	</div>
	<div class="row">
	<div class="col-7">
	<ul class="list-group">
	<li class="list-group-item list-fix">${coinInfo.market_data.current_price.usd} $</li>
	<li class="list-group-item list-fix">${coinInfo.market_data.current_price.eur} €</li>
	<li class="list-group-item list-fix">${coinInfo.market_data.current_price.ils} ₪</li>
	</ul>
	</div>
	<div class="col-5">
	<img class="card-img-top card-img moreInfoImg" src="${coinInfo.image.large}" style="position:relative;right:15px;top:10px;" alt="Card image cap">
	</div>
	</div>
 `;

  el.innerHTML = output;
}

/*******************************************************************************************/
// function local storage set item

function setLocalStorage(data, key) {
  localStorage.setItem(key, JSON.stringify(data));
}

/********************************************************************************************/
function getFromStorage(storageArr) {
  const arr = JSON.parse(localStorage.getItem(storageArr));
  return arr;
}

/*********************************************************************************************/

function getCoinFromStorage(id) {
  moreInfoStorage = getFromStorage('coins');
  return moreInfoStorage.find((coin) => coin.id === id);
}

/*********************************************************************************************/
function showMoreInfo(id, btnText) {
  const el = document.getElementById(id + '_');
  moreInfoStorage = getFromStorage('coins');
  if (moreInfoStorage === null) {
    moreInfoStorage = [];
    getCoinsInfo(el, id);
  } else {
    const idIndex = moreInfoStorage
      .map(function (c) {
        return c.id;
      })
      .indexOf(id);
    if (idIndex !== -1 && isOverTwoMin(moreInfoStorage[idIndex].timeFetched)) {
      moreInfoStorage.splice(idIndex, 1);
      getCoinsInfo(el, id);
    } else if (idIndex === -1) {
      getCoinsInfo(el, id);
    } else {
      const coinData = getCoinFromStorage(id);
      drawMoreCoinInfo(el, coinData.coinInfo);
    }
  }
  changeMoreInfoText(btnText);
}

/**************************************************************************************************************************************/
function addCoinInfoToStorage(id, coinInfo) {
  const timeFetched = new Date().getTime();
  const coinInfoObj = {
    id: id,
    coinInfo: coinInfo,
    timeFetched: timeFetched,
  };
  moreInfoStorage.push(coinInfoObj);
  setLocalStorage(moreInfoStorage, 'coins');
}

/*************************************************************************************************************************************/

//this function get time and return if 2 minutes passed from the current time or not
function isOverTwoMin(timeFetched) {
  const nowTime = new Date().getTime();
  const difference = nowTime - timeFetched; // This will give difference in milliseconds
  const resultInMinutes = difference / 60000;
  return resultInMinutes >= 2 ? true : false;
}

/******************************************************************************************************************************************/
// if check pust the coin object to array and when its uncheck its remove him and update
// the local storage . in the 6 coin the modal alert will show
function onSwitch(id, symbol, name, element) {
  const coinsInStorage = getFromStorage('selectedCoinsArr');
  const idAndSym = {
    id: id,
    symbol: symbol,
    name: name,
  };
  const checked = element.checked;
  if (checked) {
    coinsInStorage.push(idAndSym);
  } else {
    const index = coinsInStorage
      .map(function (e) {
        return e.id;
      })
      .indexOf(id);
    // This is 'one line if'
    if (index !== -1) coinsInStorage.splice(index, 1);
  }
  setLocalStorage(coinsInStorage, 'selectedCoinsArr');

  if (coinsInStorage.length > 5) {
    // Open the modal
    $('#coinsModal').modal('show');
    showToggelsSwitches();
  }
}

/*************************************************************************************************************************************************/

function checkIds(id) {
  const coinsInStorage = getFromStorage('selectedCoinsArr');
  if (coinsInStorage === null) {
    coinsInStorage = setLocalStorage([], 'selectedCoinsArr');
    return '';
  }
  if (
    coinsInStorage
      .map(function (g) {
        return g.id;
      })
      .includes(id)
  ) {
    return 'checked';
  } else {
    return '';
  }
}

/**************************************************************************************************************************************************/
// search funtion of coin/s from api list.
// its get as parameter the coin list ang also get from user the search val he wants.
// after its send to another function called findAllSymbols with the coins list and user search val and get array that
// contains inside only object/s (coin/s) wuth symbol/s that match to user search val snd then draw the coins.
//if nothing founf(array length equal zero) then popup alert will show.

function searchOption(coins) {
  const searchBtn = $('#searchForCoin');
  $(searchBtn).on('click', function (e) {
    e.preventDefault();
    const userSearchVal = $('#search').val().toLowerCase(); //to lower case to make sure the user can search
    //for example btn or BTN or BtN and more..
    if (userSearchVal !== '') {
      const allObjWithSym = findAllSymbols(userSearchVal, coins);
      if (allObjWithSym.length === 0) {
        alert('NO RESULTS, PLEASE SEARCH AGAIN!');
        $('#search').val('');
        return;
      }
      let searchResult = drawCoins(allObjWithSym);
      $('#inner-content').html(searchResult);
      $('#search').val('');
      $('.navbar-collapse').collapse('hide'); //close the nav bar collapser in small devices
    }
  });
}

/**************************************************************************************************************************************************/
//this function get the coins list and what the user want to search and filter from every
//coin object the symbols and return the new array
function findAllSymbols(userSearchVal, coins) {
  const findSymbols = coins.filter((obj) => obj.symbol === userSearchVal);
  return findSymbols;
}

/**************************************************************************************************************************************************/
// when the user choose more than 5 ,its will draw them inside.
function showToggelsSwitches() {
  const coinsInStorage = getFromStorage('selectedCoinsArr');
  let modalSwitches = '';
  for (let i = 0; i < coinsInStorage.length; i++) {
    modalSwitches += `
		<li class="list-group-item d-flex justify-content-between align-items-center mb-0">
		${coinsInStorage[i].symbol.toUpperCase()}
		<label class="switch">
		  <input type="checkbox" ${checkIds(
        coinsInStorage[i].id
      )} onchange="onSwitch('${coins[i].id}','${coins[i].symbol}','${
      coins[i].name
    }', this)">
			<span class="slider round"></span>
		  </label>
	  </li>`;
  }

  $('#modalSwitches').html(modalSwitches);
}

/**************************************************************************************************************************************************/
// when the user click to cancel its remove the last coin
function modalCancelBtn(number) {
  const coinsInStorage = getFromStorage('selectedCoinsArr');
  const canceledCoin = document.getElementById(coinsInStorage[number].id);
  canceledCoin.checked = false;
  onSwitch(
    coinsInStorage[number].id,
    coinsInStorage[number].symbol,
    coinsInStorage[number].name,
    this
  );
}

function modalSaveChanges() {
  const coinsInStorage = getFromStorage('selectedCoinsArr');
  if (coinsInStorage.length <= 5) {
    $('#coinsModal').modal('hide');
    drawAfterPaginate();
  } else {
    alert("oops, try again ,you can't choose more than 5 coins");
  }
}

/**************************************************************************************************************************************************/
// this function get the coins that user choose to toggle on from local storage and then
// draw them

function showSelectedCoins() {
  const coinsInStorage = getFromStorage('selectedCoinsArr');
  if (coinsInStorage.length === 0) {
    alert('NO COIN/S SELECTED!');
  } else {
    let selectedCoins = drawCoins(coinsInStorage);
    $('#inner-content').html(selectedCoins);
  }
}

/**************************************************************************************************************************************************/
// get the coins from storage
// after in the for loop its get the coin himself and change his attribute to be not checked(the input)
// then set new array to local storage
function clearAllSelectedCoins() {
  const coinsInStorage = getFromStorage('selectedCoinsArr');
  for (let i = 0; i < coinsInStorage.length; i++) {
    const canceledCoin = document.getElementById(coinsInStorage[i].id);
    canceledCoin.checked = false;
  }
  setLocalStorage([], 'selectedCoinsArr');
}

/*************************************************************************************************************************************************/
// this function make sure that when the navber is collapsed and you click on one of the nav-link the navbar will collapse
// again and didnt take place from screen

$('.navbar-nav>li>a').on('click', function () {
  $('.navbar-collapse').collapse('hide');
});

/************************************************************************************************************************************************ */
// Get the current year for the copyright
$('#year').text(new Date().getFullYear());

/************************************************************************************************************************************************/
// change the color and the text when the card collapser
function changeMoreInfoText(btnText) {
  if (btnText.innerText === 'MORE INFO') {
    btnText.innerText = 'LESS INFO';
    btnText.style.color = '#FDA600';
  } else {
    btnText.innerText = 'MORE INFO';
    btnText.style.color = 'white';
  }
}

/********************************************************************************************************************************/

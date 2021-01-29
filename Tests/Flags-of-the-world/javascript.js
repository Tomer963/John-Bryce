function showAllFlags() {
  try {
    const showAllFlagUrl = 'https://restcountries.eu/rest/v2/all';
    fetch(showAllFlagUrl)
      .then((response) => response.json())
      .then((data) => drawFlags(data));
  } catch (error) {
    console.log(error);
  }
}

function searchByName() {
  const name = document.getElementById('nameInput').value;
  try {
    const searchByNameUrl = `https://restcountries.eu/rest/v2/name/${name}`;
    fetch(searchByNameUrl)
      .then((response) => response.json())
      .then((data) => drawFlags(data));
  } catch (error) {
    console.log(error);
  }
}

function drawFlags(flags) {
  let output = ``;
  for (let i = 0; i < flags.length; i++) {
    output += `<div class="card mb-3 shadow mx-auto col-md-6" style="max-width: 450px;">
<div class="row">
  <div class="col-md-5">
    <img src="${flags[i].flag}" class="card-img" alt="flag-photo" style="height:100%;width:100%;">
  </div>
  <div class="col-md-7">
    <div class="card-body">
      <h5 class="card-title">${flags[i].name}</h5>
      <p class="card-text">top domain level: ${flags[i].topLevelDomain}</p>
      <p class="card-text"><small class="text-muted">capital: ${flags[i].capital}</small></p>
      <p class="card-text"><small class="text-muted">currencies:<br>
     name: ${flags[i].currencies[0].name}<br>
     code: ${flags[i].currencies[0].code}<br>
     symbol: ${flags[i].currencies[0].symbol}</small></p>


    </div>
  </div>
</div>
</div>`;
  }
  document.getElementById('flags-place').innerHTML = output;
  document.getElementById('nameInput').value = '';
}

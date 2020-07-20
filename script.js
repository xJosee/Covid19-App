const totalCases = document.getElementById("_totalCases");
const totalDeaths = document.getElementById("_totalDeaths");
const totalRecovered = document.getElementById("_totalRecovered");

window.onload = function () {
  getAllCountries();
  getTotalCases();
};

const searchbox = document.querySelector(".search-box");
searchbox.addEventListener("keypress", getCountryName);
searchbox.addEventListener("keyup", function () {
  if (searchbox.value === "") {
    document.querySelector(".contentCountry").style.display = "none";
    document.querySelector(".byCountry").style.display = "grid";
  }
});

function getAllCountries() {
  var uri = "https://coronavirus-19-api.herokuapp.com/countries";

  fetch(uri)
    .then((all) => {
      return all.json();
    })
    .then((data) =>
      data.forEach((country) => {
        //Create components with a country information
        createComponents(country);

        //Asign an image to each country component
        assignFlag(country.country);

        //Hiding the loading page
        document.querySelector(".loader-wrapper").style.display = "none";
      })
    )
    .catch((error) => {
      console.log("Algo ha salido mal " + error);
    });
}

function assignFlag(contrieName) {
  getFlag(contrieName).then((imageFlag) => {
    if (contrieName === "World") {
      document.getElementById(contrieName).src = "assets/world_image.png";
    } else {
      document.getElementById(contrieName).src = imageFlag;
    }
  });
}

function createComponents(country) {
  document.getElementById("Countries").innerHTML +=
    '<div class="style">' +
    '<img src="" id="' +
    country.country +
    '">' +
    "<h2>" +
    country.country +
    "</h2>" +
    "<p> <span>Total de casos</span> : " +
    new Intl.NumberFormat().format(country.cases) +
    "</p>" +
    "<p> <span>Total de muertes</span> : " +
    new Intl.NumberFormat().format(country.deaths) +
    "</p>" +
    "<p> <span>Total de recuperados</span> : " +
    new Intl.NumberFormat().format(country.recovered) +
    "</p>" +
    "</div>";
}

function getFlag(countryName) {

  var uri = 'https://restcountries.eu/rest/v2/name/';

  return fetch(uri+countryName)
    .then(($country) => {
      return $country.json();
    })
    .then((data) => {
      return data[0].flag;
    })
    .catch((error) => {
      console.log("Algo ha salido mal " + error);
    });
}

function getCountryName(event) {
  if (event.keyCode == 13) {
    getByCountry(searchbox.value);
  }
}

function getTotalCases() {

  var uri = 'https://coronavirus-19-api.herokuapp.com/all';

  fetch(uri)
    .then((total) => {
      return total.json();
    })
    .then(renderTotal)
    .catch((error) => console.log("Algo ha salido mal"));
}

function renderTotal(total) {
  totalCases.innerText = new Intl.NumberFormat().format(total.cases);
  totalDeaths.innerText = new Intl.NumberFormat().format(total.deaths);
  totalRecovered.innerText = new Intl.NumberFormat().format(total.recovered);
}

function getByCountry(country) {
  fetch(`https://coronavirus-19-api.herokuapp.com/countries/${country}`)
    .then((totalCountry) => {
      return totalCountry.json();
    })
    .then(renderTotalCountry)
    .catch((error) => {
      console.log("Algo ha salido mal.");
    });
}

function renderTotalCountry(totalCountry) {
  document.querySelector(".contentCountry").style.display = "block";
  document.querySelector(".byCountry").style.display = "none";
  document.querySelector(".CountryName").innerText = totalCountry.country;
  document.querySelector(".TotalCases").innerText =
    "Total de casos : " + totalCountry.cases;
  document.querySelector(".TotalDeaths").innerText =
    "Total de muertes : " + totalCountry.deaths;
  document.querySelector(".TotalRecovered").innerText =
    "Total de recuperados : " + totalCountry.recovered;
  document.querySelector(".TotalCasesActive").innerText =
    "Total de casos activos : " + totalCountry.active;
  document.querySelector(".TodayCases").innerText =
    "Total de casos el día de hoy : " + totalCountry.todayCases;
  document.querySelector(".TodayDeaths").innerText =
    "Total de muertes el día de hoy : " + totalCountry.todayDeaths;
  document.querySelector(".Critical").innerText =
    "Pacientes en estado critico : " + totalCountry.critical;
}

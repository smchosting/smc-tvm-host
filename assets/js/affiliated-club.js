const countryInput = $("#country-input");
const stateInput = $("#state-input");
const cityInput = $("#city-input");
const tableBody = $("#table-body");

// data fetching function 
const dataFetching = async () => {
  try {
    const response = await fetch("assets/json/affiliated-clubs.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// dynamic option creator 
const optionCreator = (optionData, whichInput) =>{ 
  optionData.forEach((City, index) => {
    const option = document.createElement("option");
    if (index == 0) {
      const option = document.createElement("option");
      option.value = "All";
      option.textContent = "All";
      whichInput.append(option);
    }
    option.value = City;
    option.textContent = City;
    whichInput.append(option);
  });
}

// create input
const createCountryInput = (data) => {
  const uniqueCountry = [...new Set(data.map((club) => club.Country))]; // Extract unique Country
  uniqueCountry.sort((a, b) => a.localeCompare(b)); // Sort alphabetically
  optionCreator(uniqueCountry,countryInput)
};

const createStateInput = (data, country) => {
  $("#state-input").empty();
  if(country === "All"){
    const uniqueState = [...new Set(data.map((club) => club.State))];
    uniqueState.sort((a, b) => a.localeCompare(b)); // Sort alphabetically
    optionCreator(uniqueState,stateInput)
  }else{
    const currentCountry = data.filter((club) => club.Country == country);
    const uniqueState = [...new Set(currentCountry.map((club) => club.State))];
    uniqueState.sort((a, b) => a.localeCompare(b)); // Sort alphabetically
    optionCreator(uniqueState,stateInput)
  }
};

const createCityInput = (data, state, country) => {
  $("#city-input").empty();

  let uniqueCity = [];

  if (country === "All") {
    if (state === "All") {
      uniqueCity = [...new Set(data.map((club) => club.City))];
    } else {
      const currentState = data.filter((club) => club.State === state);
      uniqueCity = [...new Set(currentState.map((club) => club.City))];
    }
  } else {
    if (state === "All") {
      uniqueCity = [...new Set(data.map((club) => club.City))];
    } else {
      const currentState = data.filter((club) => club.State === state);
      uniqueCity = [...new Set(currentState.map((club) => club.City))];
    }
  }

  uniqueCity.sort((a, b) => a.localeCompare(b)); // Sort alphabetically
  optionCreator(uniqueCity, cityInput);
};



// table create function 
const tableCreator = (data) => {
  $("#table-body").empty();
  data.forEach((club, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index+1}</td>
            <td>${club.ClubName}  <br> - ${club.Address}</td>
            <td>${club.Country}</td>
            <td>${club.State}</td>
            <td>${club.City}</td>
            <td>${club.PhoneNumbers.join("<br>")}</td>
        `;
    tableBody.append(row);
  });
  $("#total-clubs").text(`You Found ${data.length} Clubs`);
};

// input change handler
const countryInputChange = async () => {
  const data = await dataFetching();
  createStateInput(data, countryInput.val());
  createCityInput(data, stateInput.val() ,countryInput.val());
  if(countryInput.val() == "All"){
    const currentCountry = data.filter((club) => club.Country);
    tableCreator(currentCountry);
  }else{
    const currentCountry = data.filter((club) => club.Country === countryInput.val());
    tableCreator(currentCountry);
  }

};

const stateInputChange = async () => {
  const data = await dataFetching();
  createCityInput(data, stateInput.val() ,countryInput.val());
  if(stateInput.val() === "All"){
    const currentState = data.filter((club) => club.State);
    tableCreator(currentState);
  }else{
    const currentState = data.filter((club) => club.State === stateInput.val());
    tableCreator(currentState);
  }
};

const cityInputChange = async () => {
  const data = await dataFetching();
  
  if(cityInput.val() === "All"){
    const currentCity = data.filter((club) => club.City);
    tableCreator(currentCity);
  }
  else{
    const currentCity = data.filter((club) => club.City === cityInput.val());
    tableCreator(currentCity);
  }
};


$(document).ready(async function () {
  const data = await dataFetching();
  createCountryInput(data);
  createStateInput(data, countryInput.val());
  createCityInput(data, stateInput.val() ,countryInput.val());
  tableCreator(data);
});

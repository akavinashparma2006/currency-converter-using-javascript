const BASE_URL = 'https://api.frankfurter.dev/v1/latest?'

const dropdowns = document.querySelectorAll(".dropdown select");

const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "From" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateExchangeRate = async () => {
    try {
        let amount = document.querySelector(".amount input");
        let amtVal = amount.value;
        if (amtVal === "" || amtVal < 1) {
            amtVal = 1;
            amount.value = "1";
        }

        const from = (fromCurr.value || fromCurr.options[fromCurr.selectedIndex]?.value || '').toUpperCase();
        const to = (toCurr.value || toCurr.options[toCurr.selectedIndex]?.value || '').toUpperCase();

        if (!from || !to) throw new Error(`Missing currency selection. from=${JSON.stringify(fromCurr.value)}, to=${JSON.stringify(toCurr.value)}`);

        const URL = `${BASE_URL}from=${from}&to=${to}`;

        let response = await fetch(URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        let data = await response.json();
        let rate = data?.rates?.[to];
        if (rate === undefined || rate === null) {
            throw new Error(`Rate not found for ${to}. Available keys: ${Object.keys(data?.rates || {})}`);
        }


        let finalAmount = Number(amtVal) * rate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (err) {
        msg.innerText = "Unable to fetch exchange rate. Try again.";
        console.error(err);
    }
};


const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});





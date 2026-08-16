const dropdowns = document.querySelectorAll(".select-container select");
const btn = document.querySelector("form button");

const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

const amount = document.querySelector(".amount input");
const msg = document.querySelector(".msg");
const swap = document.querySelector(".swap");

const countryList = {
    USD: "US",
    INR: "IN",
    EUR: "EU",
    GBP: "GB",
    AUD: "AU",
    CAD: "CA",
    JPY: "JP",
    CNY: "CN",
    CHF: "CH",
    NZD: "NZ",
    SGD: "SG",
    AED: "AE",
    SAR: "SA",
    KRW: "KR",
    RUB: "RU"
};


/* CREATE CURRENCY OPTIONS */

dropdowns.forEach((select) => {

    for (let currCode in countryList) {

        let option = document.createElement("option");

        option.value = currCode;
        option.innerText = currCode;

        if (select.name === "from" && currCode === "USD") {
            option.selected = true;
        }

        if (select.name === "to" && currCode === "INR") {
            option.selected = true;
        }

        select.append(option);
    }

    select.addEventListener("change", (event) => {
        updateFlag(event.target);
        updateExchangeRate();
    });
});


/* UPDATE FLAG */

function updateFlag(select) {

    const currCode = select.value;
    const countryCode = countryList[currCode];

    const img = select.parentElement.querySelector("img");

    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}


/* UPDATE EXCHANGE RATE */

async function updateExchangeRate() {

    const amtVal = Number(amount.value);

    if (!amtVal || amtVal <= 0) {
        msg.innerText = "Please enter a valid amount";
        return;
    }

    const from = fromCurr.value;
    const to = toCurr.value;

    if (from === to) {
        msg.innerText = `${amtVal} ${from} = ${amtVal} ${to}`;
        return;
    }

    try {

        const url =
            `https://api.exchangerate-api.com/v4/latest/${from}`;

        const response = await fetch(url);

        const data = await response.json();

        const rate = data.rates[to];

        if (!rate) {
            msg.innerText = "Exchange rate not available";
            return;
        }

        const result = amtVal * rate;

        msg.innerText =
            `${amtVal} ${from} = ${result.toFixed(2)} ${to}`;

    } catch (error) {

        console.log(error);

        msg.innerText = "Unable to get exchange rate";
    }
}


/* BUTTON */

btn.addEventListener("click", (event) => {

    event.preventDefault();

    updateExchangeRate();
});


/* SWAP BUTTON */

swap.addEventListener("click", () => {

    const temp = fromCurr.value;

    fromCurr.value = toCurr.value;
    toCurr.value = temp;

    updateFlag(fromCurr);
    updateFlag(toCurr);

    updateExchangeRate();
});


/* AMOUNT CHANGE */

amount.addEventListener("input", () => {

    if (amount.value !== "") {
        updateExchangeRate();
    }
});


/* INITIAL */

window.addEventListener("load", () => {

    updateFlag(fromCurr);
    updateFlag(toCurr);

    updateExchangeRate();
});
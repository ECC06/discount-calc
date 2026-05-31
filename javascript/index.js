import { getHistoryFromLocalStorage, updateHistoryInHTML, historyConts } from "./re-used-functions.js";

const historyBtn = document.getElementById("history-btn");

const form = document.getElementsByTagName("form")[0];
const currencySignsList = document.querySelectorAll(".currency-sign");

const currencyDropdown = document.getElementById("currency-dropdown");

const noCalculationsCont = document.getElementById("no-calculations-cont");
const outputCont = document.getElementById("output-cont");

const priceElem = document.getElementById("price");
const discountElem = document.getElementById("discount");
const newPriceElem = document.getElementById("new-price");
const savingsElem = document.getElementById("savings");

const clearBtn = document.getElementById("clear-btn");

const historyModal = document.getElementById("history-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const noHistoryCont = document.getElementById("no-history-cont");
const historyCont = document.getElementById("history-cont");

let selectedCurrency = currencyDropdown.value || "£";

//!RUNS ON PAGE LOAD
document.addEventListener("DOMContentLoaded", function (e) {
    if (getHistoryFromLocalStorage() !== null) {
        const historyArr = getHistoryFromLocalStorage();

        historyArr.forEach((obj) => {
            updateHistoryInHTML(
                obj.discountPercentage,
                obj.originalPrice,
                obj.discount
            )
        });

        //display history containers in HTML
        noHistoryCont.classList.add("display-none");
        historyCont.classList.remove("display-none");

    }
});

//!CALCULATE DISCOUNT 
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const priceInput = +Number(priceElem.value).toFixed(2); //e.g 120
    const discountInput = +Number(discountElem.value).toFixed(2); // 40%

    const { discount, savings } = calculateDiscountAndSavings(); //{discount: 72, savings: 48}

    const historyArr = getHistoryFromLocalStorage() ?? [];
    const locale = new Date().toLocaleString("en-GB", { timeZone: "UTC" }); //e.g "10/5/2026, 03:00:00"

    const todaysDate = locale.split(", ")[0]; //e.g "10/5/2026"

    showResult(discount, savings);
    storeHistory();
    updateHistoryInHTML(discountInput, priceInput, discount, todaysDate);

    function calculateDiscountAndSavings() {
        const discount = priceInput - ((discountInput / 100) * priceInput);
        const discountRoundedDown = Number(discount.toFixed(2));

        const savings = priceInput - discountRoundedDown;

        return { discount: discountRoundedDown, savings: savings };
    }

    function showResult() {
        newPriceElem.textContent = discount;
        savingsElem.textContent = savings;

        noCalculationsCont.classList.add("display-none");
        outputCont.classList.remove("display-none");
    }

    function storeHistory() {
        const historyInfo = {
            currency: selectedCurrency, //e.g £
            originalPrice: priceInput, //e.g 120
            discountPercentage: discountInput, //e.g 40
            discount: discount, // e.g 72
            savings: savings //e.g 48
        };

        if (historyArr.length === 10) historyArr.pop();

        historyArr.unshift(historyInfo);

        localStorage.setItem("history", JSON.stringify(historyArr));
    }
});

//!HIDE THE DISCOUNT CALCULATION WHEN USER CLEARS INPUT
clearBtn.addEventListener("click", function (e) {
    showDefaultState();

    function showDefaultState() {
        outputCont.classList.add("display-none");
        noCalculationsCont.classList.remove("display-none");
    }
});

//!UPDATE THE CURRENCY SIGNS
currencyDropdown.addEventListener("change", function () {
    const dropdown = this;

    //update all signs in the ui
    currencySignsList.forEach((sign) => {
        sign.textContent = dropdown.value; //user selection
    });

    selectedCurrency = dropdown.value;

    dropdown.value = "";
});

//!OPEN AND CLOSE THE HISTORY MODAL 
historyBtn.addEventListener("click", function (e) {
    historyModal.showModal();
});

closeModalBtn.addEventListener("click", function (e) {
    historyModal.close();
});



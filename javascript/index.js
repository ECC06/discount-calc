import { getHistoryFromLocalStorage, updateHistoryInHTML, historyConts, historyCont, showHistoryCont, noHistoryCont } from "./re-used-functions.js";

const historyBtn = document.getElementById("history-btn");

const headingAndForm = document.getElementById("heading-and-form");
const form = document.getElementsByTagName("form")[0];
const currencySignsList = document.querySelectorAll(".currency-sign");

const dropdownBtn = document.getElementById("dropdown-btn");
const currencyDropdown = document.getElementById("currency-dropdown");

const noCalculationsCont = document.getElementById("no-calculations-cont");
const outputCont = document.querySelector(".output-cont");

const priceInputElem = document.getElementById("price-input");
const discountInputCont = document.getElementById("discount-input-cont");
const discountInputElem = document.getElementById("discount-input");
const newPriceElem = document.getElementById("new-price");
const savingsElem = document.getElementById("savings");

const clearInputBtn = document.getElementById("clear-input-btn");
const backBtn = document.getElementById("back-btn");

const historyModal = document.getElementById("history-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const clearHistoryBtn = document.getElementById("clear-history-btn");

let selectedCurrency = currencyDropdown.value || "£";

let charsAtLowerBound;

//!UPDATE HISTORY MODAL'S HTML IF THERE'S HISTORY IN LOCAL STORAGE
document.addEventListener("DOMContentLoaded", function (e) {
    if (getHistoryFromLocalStorage() !== null) {
        const historyArr = getHistoryFromLocalStorage();

        //update HTML with history
        historyArr.forEach((obj) => {
            updateHistoryInHTML(obj)
        });

        showHistoryCont();
    }
});

//!LIMITS THE LENGTH OF THE DISCOUNT INPUT BOX (because it's set to fixed-size: content in css)
discountInputElem.addEventListener('keyup', function () {
    const containerWidth = discountInputCont.getBoundingClientRect().width;
    const inputWidth = discountInputElem.getBoundingClientRect().width;
    const lowerBound = ((80 / 100) * containerWidth).toFixed(2);
    const upperBound = ((83 / 100) * containerWidth).toFixed(2);

    // 
    if ((inputWidth > lowerBound) && (inputWidth < upperBound)) {
        charsAtLowerBound = discountInputElem.value.length;
        discountInputElem.style.setProperty("width", `${lowerBound}px`);
    }

    if (discountInputElem.value.length < charsAtLowerBound) {
        discountInputElem.style.setProperty("width", "auto");
    }

    // console.log({ condition1, containerWidth, inputWidth, minValue: lowerBound, maxValue: upperBound, numOfCharsAtWidthCap: charsAtLowerBound });
});

//!CALCULATE DISCOUNT 
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const priceInput = +Number(priceInputElem.value).toFixed(2); //e.g 120
    const discountInput = +Number(discountInputElem.value).toFixed(2); // 40%

    const { discount, savings } = calculateDiscountAndSavings(); //{discount: 72, savings: 48}

    const historyArr = getHistoryFromLocalStorage() ?? [];
    const locale = new Date().toLocaleString("en-GB", { timeZone: "UTC" }); //e.g "10/5/2026, 03:00:00"

    const todaysDate = locale.split(", ")[0]; //e.g "10/5/2026"

    const historyInfo = {
        currency: selectedCurrency, //e.g £
        originalPrice: priceInput, //e.g 120
        discountPercentage: discountInput, //e.g 40
        discount: discount, // e.g 72
        savings: savings, //e.g 48
        dateSearched: todaysDate //e.g 12/08/2017
    };


    showResult(discount, savings);
    storeHistory();
    updateHistoryInHTML(historyInfo);
    showHistoryCont();

    function calculateDiscountAndSavings() {
        const discount = priceInput - ((discountInput / 100) * priceInput);
        const discountRoundedDown = Number(discount.toFixed(2));

        const savings = Number((priceInput - discountRoundedDown).toFixed(2));

        return { discount: discountRoundedDown, savings: savings };
    }

    function showResult() {
        newPriceElem.textContent = discount;
        savingsElem.textContent = savings;

        //for mobile screens
        if (window.innerWidth <= 768) {
            formInputsCont.classList.add("display-none");
        }

        noCalculationsCont.classList.add("display-none");
        outputCont.classList.remove("display-none");
    }

    function storeHistory() {
        if (historyArr.length === 10) historyArr.pop();

        historyArr.unshift(historyInfo);

        localStorage.setItem("history", JSON.stringify(historyArr));
    }
});

//!DISPLAY THE CURRENCY AND THE PERCENTAGE SIGN WHEN THE USER FOCUSES IN ON THE INPUT
form.addEventListener("focusin", function (e) {
    if (e.target.id === "price-input") {
        const currencySign = document.querySelector("#price-input-cont .currency-sign");
        currencySign.classList.remove("display-none");
    } else if (e.target.id === "discount-input") {
        const percentageSign = document.querySelector("#discount-input + #percent");
        percentageSign.classList.remove("display-none");
    }
})

//!HIDE THE OUTPUT WINDOW WHEN USER CLEARS INPUT
clearInputBtn.addEventListener("click", function (e) {
    showDefaultState();

    function showDefaultState() {
        outputCont.classList.add("display-none");
        noCalculationsCont.classList.remove("display-none");
    }
});

//!OPEN THE CURRENCY DROPDOWN
dropdownBtn.addEventListener("click", function () {
    currencyDropdown.classList.toggle("opened");
});

//!UPDATE THE CURRENCY SIGNS
currencyDropdown.addEventListener("click", function (e) {
    let selectedLi;

    if (e.target.className === "dropdown-li") {
        selectedLi = e.target;
        selectedCurrency = selectedLi;

        showSelected();

        //update all signs in the ui
        currencySignsList.forEach((sign) => {
            sign.textContent = `(${selectedLi.dataset.sign})`;
        });
    }

    function showSelected() {
        const listItems = currencyDropdown.querySelectorAll("li");

        //clears .selected from all list items
        listItems.forEach((li) => {
            li.classList.remove("selected");
        });

        selectedLi.classList.add("selected");
    }
});

//!SHOWS THE FORM ON MOBILE
backBtn.addEventListener("click", function (e) {
    outputCont.classList.add("display-none");
    formInputsCont.classList.remove("display-none");
});

//!OPEN THE HISTORY MODAL 
historyBtn.addEventListener("click", function (e) {
    historyModal.showModal();
});

//!CLOSE THE HISTORY MODAL 
closeModalBtn.addEventListener("click", function (e) {
    historyModal.close();
});

//!CLEAR HISTORY
clearHistoryBtn.addEventListener("click", function (e) {
    localStorage.clear();
    historyConts.innerHTML = "";

    //hide default window
    noHistoryCont.classList.remove("display-none");
    historyCont.classList.add("display-none");
});

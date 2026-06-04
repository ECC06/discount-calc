import { getHistoryFromLocalStorage, updateHTMLwithLi, historyConts, historyCont, showHistoryCont, noHistoryCont } from "./re-used-functions.js";

const historyBtn = document.getElementById("history-btn");

const headingAndForm = document.getElementById("heading-and-form");
const form = document.getElementsByTagName("form")[0];
const currencyPrefix = document.querySelector("#price-input-cont .currency-sign");
const percentageSign = document.querySelector("#discount-input + #percent");


const dropdownBtn = document.getElementById("dropdown-btn");
const currencyDropdown = document.getElementById("currency-dropdown");

const outputCont = document.querySelector(".output-cont");
const noCalculationsCont = document.querySelector(".no-calculations-cont");
const calculationOutput = document.getElementById("calculation-output");

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


const dropdownLi = document.querySelector(".dropdown-li");
let selectedCurrency = dropdownLi.dataset.sign;

let charsAtLowerBound;

// //!UPDATE HISTORY MODAL'S HTML IF THERE'S HISTORY IN LOCAL STORAGE
document.addEventListener("DOMContentLoaded", function (e) {
    if (getHistoryFromLocalStorage() !== null) {
        const historyArr = getHistoryFromLocalStorage();
        const listElements = historyArr.map((obj) => {
            const { currency, originalPrice, discountPercentage, discount, savings, dateSearched } = obj;

            return `
            <li class="history-item">
                <div class="wrapper">
                    <p class="history-numbers-text">
                        <span>${discountPercentage}% off</span> 
                        <span>${currency}${originalPrice}</span>, which is 
                        <span class="discount">${currency}${discount}</span>
                    </p>
                    <!-- e.g 20% off £29, which is £23.30 -->

                    <p class="date-searched-text">
                        Searched on: <span class="date">${dateSearched}</span>
                    </p>
                    <!-- e.g Searched on: 10/15/2025 -->
                </div>
            </li>`;
        });

        console.log(listElements.join(""));

        //update HTML with history
        historyConts.innerHTML = listElements.join("");

        showHistoryCont();
    }
});

//!LIMITS THE LENGTH OF THE DISCOUNT INPUT BOX (because it's set to fixed-size: content in css)
discountInputElem.addEventListener('keyup', function (e) {
    const containerWidth = discountInputCont.getBoundingClientRect().width;
    const inputWidth = discountInputElem.getBoundingClientRect().width;
    const lowerBound = ((80 / 100) * containerWidth).toFixed(2);
    const upperBound = ((83 / 100) * containerWidth).toFixed(2);

    limitInputElemWidth();
    removePercentOnEmpty();

    function limitInputElemWidth() {
        // if the input's width is between 80% and 83% of the containers' width, limit the inputs' width
        if ((inputWidth > lowerBound) && (inputWidth < upperBound)) {
            charsAtLowerBound = discountInputElem.value.length; //28
            discountInputElem.style.setProperty("width", `${lowerBound} px`); //200
        }

        /*
            when the input's width reaches the lower bound, the number of characters it contains is stored
            When the user is deleting content, if the number of characters should fall below this threshold, then set the input element's width back to auto, which will allow "fixed-size: content" to let it grow and shrink based on the number of characters it has
        */

        if (discountInputElem.value.length < charsAtLowerBound) {
            discountInputElem.style.setProperty("width", "auto");
        }
    }

    function removePercentOnEmpty() {
        if (discountInputElem.value === "") {
            percentageSign.classList.add("display-none");
            discountInputElem.placeholder = "e.g 25%";
        } else {
            percentageSign.classList.remove("display-none");
        }
    }
    // console.log({ condition1, containerWidth, inputWidth, minValue: lowerBound, maxValue: upperBound, numOfCharsAtWidthCap: charsAtLowerBound });
});

//!
window.addEventListener('resize', function (e) {
    if (window.innerWidth >= 992) {
        headingAndForm.classList.remove("display-none");
    } else {
        headingAndForm.classList.add("display-none");
    }
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
    updateHTMLwithLi(historyInfo);
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
        if (window.innerWidth < 992) {
            headingAndForm.classList.add("display-none");
            outputCont.classList.remove("display-none");
        }
        noCalculationsCont.classList.add("display-none");
        calculationOutput.classList.remove("display-none");

    }

    function storeHistory() {
        if (historyArr.length === 10) historyArr.pop();

        historyArr.unshift(historyInfo);

        localStorage.setItem("history", JSON.stringify(historyArr));
    }
});

const clearPlaceHolder = function () {
    if (discountInputElem.value === "") {
        discountInputElem.placeholder = "";
    }
}

//!DISPLAY THE CURRENCY SIGN, PERCENTAGE SIGN AND PLACEHOLDER WHEN THE USER FOCUSES IN ON THE CORRESPONDING INPUT
form.addEventListener("focusin", function (e) {
    if (e.target.id === "price-input") {
        currencyPrefix.classList.remove("display-none");
        e.target.placeholder = "";
    } else if (e.target.id === "discount-input") {
        percentageSign.classList.remove("display-none")
        clearPlaceHolder();
    }
});

//!ALLOW USER TO FOCUS WHEN THEY CLICK ON #discount-input-cont (because the </input> inside doesn't take it's full width)
document.querySelector("main").addEventListener("click", function (e) {
    if (e.target.id === "discount-input-cont") {
        discountInputElem.focus();
    }
});

//!REMOVE THE CURRENCY SIGN, PERCENTAGE SIGN AND PLACEHOLDER WHEN THE USER FOCUSES IN ON THE CORRESPONDING INPUT
form.addEventListener("focusout", function (e) {
    if (e.target.id === "price-input") {
        priceInputElem.placeholder = `e.g ${selectedCurrency} 150`;

        if (priceInputElem.value === "") {
            currencyPrefix.classList.add("display-none");
        }
    }

    if (e.target.id === "discount-input") {
        discountInputElem.placeholder = "e.g 25%";

        if (discountInputElem.value === "") {
            percentageSign.classList.add("display-none");
        };
    }
});


//!HIDE THE OUTPUT WINDOW WHEN USER CLEARS INPUT
clearInputBtn.addEventListener("click", function (e) {

    showDefaultState();
    clearInputPrefixes();

    function clearInputPrefixes() {
        currencyPrefix.classList.add("display-none");
        percentageSign.classList.add("display-none");
    }


    function showDefaultState() {
        if (window.innerWidth >= 992) {
            calculationOutput.classList.add("display-none");
            noCalculationsCont.classList.remove("display-none");
        }
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
        selectedCurrency = selectedLi.dataset.sign;
        priceInputElem.placeholder = `e.g ${selectedCurrency} 150`;

        showSelected();

        const currencySignsList = document.querySelectorAll(".currency-sign");
        //update all signs in the ui
        currencySignsList.forEach((sign) => {
            sign.textContent = `${selectedLi.dataset.sign}`;
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
    headingAndForm.classList.remove("display-none");
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
    const confirmClear = confirm("Are you sure you want to clear your history?");

    if (confirmClear === true) {
        localStorage.clear();
        historyConts.innerHTML = "";

        //hide default window
        noHistoryCont.classList.remove("display-none");
        historyCont.classList.add("display-none");
    }

});

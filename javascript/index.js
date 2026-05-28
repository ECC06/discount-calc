const form = document.getElementsByTagName("form")[0];
const currencySignsList = document.querySelectorAll(".currency-sign");

const currencyDropdown = document.getElementById("currency-dropdown");

const noCalculationsCont = document.getElementById("no-calculations-cont");
const outputCont = document.getElementById("output-container");

const priceElem = document.getElementById("price");
const discountElem = document.getElementById("discount");
const newPriceElem = document.getElementById("new-price");
const savingsElem = document.getElementById("savings");

const clearBtn = document.getElementById("clear-btn");


//update the currency signs
currencyDropdown.addEventListener("change", function () {
    const dropdown = this;
    const displayedText = currencyDropdown.options[currencyDropdown.selectedIndex];

    currencySignsList.forEach((sign) => {
        sign.textContent = dropdown.value; //user selection
    });

    dropdown.value = "";
});

form.addEventListener("submit", function (e) {
    e.preventDefault();

    calculateDiscount();
    showResult();

    function calculateDiscount() {
        const priceInput = Number(priceElem.value);
        const discountInput = Number(discountElem.value);

        const discount = priceInput - ((discountInput / 100) * priceInput);
        const finalDiscount = Number(discount.toFixed(2));

        newPriceElem.textContent = finalDiscount;
        savingsElem.textContent = priceInput - discount;
    }

    function showResult() {
        noCalculationsCont.style.display = "none";
        outputCont.style.display = "block";
    }
});

clearBtn.addEventListener("click", function (e) {
    showDefaultState();

    function showDefaultState() {
        outputCont.style.display = "none";
        noCalculationsCont.style.display = "block";
    }
});


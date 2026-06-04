//!UTILITY FUNCTIONS
export const getHistoryFromLocalStorage = () => JSON.parse(localStorage.getItem("history"));
export const historyConts = document.getElementById("history-containers");

export const noHistoryCont = document.getElementById("no-history-cont");
export const historyCont = document.querySelector(".history-cont");


export function showHistoryCont() {
    //hide default window
    noHistoryCont.classList.add("display-none");
    historyCont.classList.remove("display-none");
}

export function updateHTMLwithLi(historyObj) {

    const { currency, originalPrice, discountPercentage, discount, savings, dateSearched } = historyObj;

    const historyItem = `
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

    //add the content at the beginning
    historyConts.innerHTML = `${historyItem}${historyConts.innerHTML}`;
}

//!UTILITY FUNCTIONS
export const getHistoryFromLocalStorage = () => JSON.parse(localStorage.getItem("history"));
export const historyConts = document.getElementById("history-containers");

export const noHistoryCont = document.getElementById("no-history-cont");
export const historyCont = document.getElementById("history-cont");


export function showHistoryCont() {
    //hide default window
    noHistoryCont.classList.add("display-none");
    historyCont.classList.remove("display-none");
}

export function updateHistoryInHTML(historyObj) {
    const historyArr = getHistoryFromLocalStorage();
    const { currency, originalPrice, discountPercentage, discount, savings, dateSearched } = historyObj;

    if (historyArr.length > 0) {

        const HTMLstrings = historyArr.map((obj) => {
            return `
                    <li class="history-item">
                        <p>${discountPercentage}% off ${currency}${originalPrice}, which is <span class="discount-output">${currency}${discount}</span>
                        </p>
                        <!-- e.g 20% off £29, which is £23.30 -->
                        
                        <p>Searched on: <span class="date-searched">${dateSearched}</span></p>
                        <!-- e.g Searched on: 10/15/2025 -->
                </li>
                `
            /*
            
                
            */
        });

        historyConts.innerHTML = HTMLstrings.join("");
    }
}
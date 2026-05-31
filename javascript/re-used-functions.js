//!UTILITY FUNCTIONS
export const getHistoryFromLocalStorage = () => JSON.parse(localStorage.getItem("history"));
export const historyConts = document.getElementById("history-containers");

export function updateHistoryInHTML(discountPercentage, originalPrice, discount, date) {
    const historyArr = getHistoryFromLocalStorage();
    if (historyArr.length > 0) {

        const HTMLstrings = historyArr.map((obj) => {
            return `
                    <div class="history-cont">
                        <div>
                            <p>${discountPercentage}% off ${originalPrice}, which is ${discount}</p> <!-- e.g 20% off £29, which is £23.30 -->
                            <p>Searched on: ${date}</p> <!-- e.g Searched on: 10/15/2025 -->
                        </div>
                    </div>
                `
        });

        historyConts.innerHTML = HTMLstrings.join("");
    }
}
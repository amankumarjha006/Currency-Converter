const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".From select");
const toCurr = document.querySelector(".To select");
const msg = document.querySelector(".msg");

for (const select of dropdowns) {
  for (let currCode in countryList) {
    const option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;
    if (select.name === "From" && currCode === "USD") option.selected = true;
    if (select.name === "To" && currCode === "INR") option.selected = true;
    select.append(option);
  }
  select.addEventListener("change", (evt) => updateFlag(evt.target));
}

const updateFlag = (element) => {
  const countryCode = countryList[element.value];
  const img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  const amountEl = document.querySelector(".amount input");
  let amtVal = parseFloat(amountEl.value);
  if (!amtVal || amtVal < 1) {
    amtVal = 1;
    amountEl.value = "1";
  }

  const base = fromCurr.value.toLowerCase();
  const target = toCurr.value.toLowerCase();

  const apiURL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`;

  try {
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();

    const rate = data[base]?.[target];
    if (typeof rate !== "number") throw new Error("Rate not found in API response");

    const finalAmt = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmt.toFixed(2)} ${toCurr.value}`;
    msg.classList.add("show"); // make it visible
  } catch (err) {
    console.error("Fetch error:", err);
    msg.innerText = "⚠️ Failed to fetch exchange rate.";
    msg.classList.add("show"); // make it visible even on error
  }
});


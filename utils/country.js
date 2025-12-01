const toggle = document.getElementById("dark-mode");
const details = document.getElementById("country-detail");
const toggleText = document.querySelector("span");
const toggleIcon = document.querySelector("i");
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme");

  if (saved === "dark") {
    document.body.classList.add("dark-theme");
    toggleIcon.className = "fa-solid fa-sun";
    toggleText.textContent = "Light Mode";
  }

  loadCountry();
});

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  const isDark = document.body.classList.contains("dark-theme");

  if (isDark) {
    toggleIcon.className = "fa-solid fa-sun";
    toggleText.textContent = "Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    toggleIcon.className = "fa-regular fa-moon";
    toggleText.textContent = "Dark Mode";
    localStorage.setItem("theme", "light");
  }
});

async function loadCountry() {
  if (!code) {
    console.error("No country code found in URL");
    return;
  }

  try {
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);

    const data = await res.json();

    if (!Array.isArray(data) || !data[0]) {
      throw new Error("Invalid country data");
    }

    const country = data[0];

    console.log("Country details:", country);

    await renderCountry(country);
  } catch (err) {
    console.error("Error fetching country details:", err);
    details.innerHTML = `<p>Failed to load country details :(</p>`;
  } finally {
    console.log("Load Country Complete!");
  }
}

async function renderCountry(country) {
  const box = document.getElementById("country-detail");

  const flag = country.flags?.svg || country.flags?.png || "";
  const name = country.name?.common || "Unknown";
  const nativeName = country.name?.nativeName
    ? Object.values(country.name.nativeName)[0].common
    : "Unknown";

  const population = country.population?.toLocaleString() || "N/A";
  const region = country.region || "N/A";
  const capital = country.capital ? country.capital.join(", ") : "N/A";

  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((c) => c.name)
        .join(", ")
    : "N/A";

  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";

  let bordersHTML = "No Neighbors";

  if (country.borders && country.borders.length > 0) {
    const codes = country.borders.join(",");

    const res = await fetch(
      `https://restcountries.com/v3.1/alpha?codes=${codes}&fields=name,cca3`
    );

    let borderData = await res.json();

    if (!Array.isArray(borderData)) {
      borderData = [];
    }

    bordersHTML = borderData
      .map(
        (c) =>
          `<a class="border-tag" href="country.html?code=${c.cca3}" aria-label="View Details for ${c.name.common}">${c.name.common}</a>`
      )
      .join("");
  }

  box.innerHTML = `
    <div class="detail-wrapper">
      <img src="${flag}" class="detail-flag" alt="Flag of ${name}">

      <div class="detail-info">
        <h2>${name}</h2>

        <div class="detail-columns">
          <div>
            <p><strong>Native Name:</strong> ${nativeName}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Region:</strong> ${region}</p>
            <p><strong>Capital:</strong> ${capital}</p>
          </div>
          <div>
            <p><strong>Currencies:</strong> ${currencies}</p>
            <p><strong>Languages:</strong> ${languages}</p>
          </div>
        </div>

        <div class="borders">
          <strong>Border Countries:</strong> 
          ${bordersHTML}
        </div>
      </div>
    </div>
  `;
}

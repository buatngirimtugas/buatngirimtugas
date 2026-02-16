// =========================
// 1) DATA
// =========================
const allTickets = [
  // PASTE DATA TIKET KAMU DI SINI
];

// =========================
// 2) ELEMENTS
// =========================
const ticketGallery = document.getElementById("ticket-gallery");
const securedTicketCountSpan = document.getElementById("secured-ticket-count");
const noResultsMessage = document.getElementById("no-results-message");

const filterCountry = document.getElementById("filter-country");
const filterWebsite = document.getElementById("filter-website");
const filterEvent = document.getElementById("filter-event");
const filterYear = document.getElementById("filter-year");
const filterArtist = document.getElementById("filter-artist");
const btnReset = document.getElementById("btn-reset");

// =========================
// 3) HELPERS
// =========================
function normalize(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function createOption(selectEl, value) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = value;
  selectEl.appendChild(opt);
}

// =========================
// 4) POPULATE FILTER OPTIONS
// =========================
function populateFilters() {
  const countries = [...new Set(allTickets.map(t => t.country))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  const websites = [...new Set(allTickets.map(t => t.purchaseWebsite))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  const years = [...new Set(allTickets.map(t => t.year))]
    .filter(Boolean)
    .sort((a, b) => b - a);

  countries.forEach(c => createOption(filterCountry, c));
  websites.forEach(w => createOption(filterWebsite, w));
  years.forEach(y => createOption(filterYear, y));
}

// =========================
// 5) RENDER TICKETS
// =========================
function renderTickets(tickets) {
  ticketGallery.innerHTML = "";

  if (tickets.length === 0) {
    noResultsMessage.style.display = "block";
    securedTicketCountSpan.textContent = "0";
    return;
  }

  noResultsMessage.style.display = "none";

  let total = 0;

  tickets.forEach(ticket => {
    const qty = Number(ticket.quantity || 1);
    total += qty;

    const div = document.createElement("div");
    div.className = "ticket-item";

    div.innerHTML = `
      <img src="${ticket.image}" alt="Tiket ${ticket.eventName}" loading="lazy" />
      <div class="ticket-info">
        <h3>${ticket.eventName}</h3>
        <p><strong>Artist:</strong> ${ticket.artist}</p>
        <p><strong>Lokasi:</strong> ${ticket.city}, ${ticket.country}</p>
        <p><strong>Dibeli dari:</strong> ${ticket.purchaseWebsite}</p>
        <p><strong>Tahun:</strong> ${ticket.year}</p>
        <p><strong>Jumlah:</strong> ${qty} Tiket</p>
        ${ticket.notes ? `<p class="ticket-notes">"${ticket.notes}"</p>` : ""}
      </div>
    `;

    ticketGallery.appendChild(div);
    const img = div.querySelector("img");
    img.onerror = () => {
    img.src = "https://via.placeholder.com/600x400?text=Ticket+Image";
};

  });

  securedTicketCountSpan.textContent = total;
}

// =========================
// 6) FILTER LOGIC
// =========================
function applyFilters() {
  const selectedCountry = normalize(filterCountry.value);
  const selectedWebsite = normalize(filterWebsite.value);
  const selectedEvent = normalize(filterEvent.value);
  const selectedYear = filterYear.value;
  const selectedArtist = normalize(filterArtist.value);

  const filtered = allTickets
    .filter(ticket => {
      const matchesCountry =
        !selectedCountry || normalize(ticket.country).includes(selectedCountry);

      const matchesWebsite =
        !selectedWebsite || normalize(ticket.purchaseWebsite).includes(selectedWebsite);

      const matchesEvent =
        !selectedEvent || normalize(ticket.eventName).includes(selectedEvent);

      const matchesYear =
        !selectedYear || String(ticket.year) === String(selectedYear);

      const matchesArtist =
        !selectedArtist || normalize(ticket.artist).includes(selectedArtist);

      return (
        matchesCountry &&
        matchesWebsite &&
        matchesEvent &&
        matchesYear &&
        matchesArtist
      );
    })
    .sort((a, b) => (b.year - a.year) || (b.id - a.id)); // terbaru dulu

  renderTickets(filtered);
}

const applyFiltersDebounced = debounce(applyFilters, 250);

// =========================
// 7) RESET
// =========================
function resetFilters() {
  filterCountry.value = "";
  filterWebsite.value = "";
  filterEvent.value = "";
  filterYear.value = "";
  filterArtist.value = "";
  applyFilters();
}

// =========================
// 8) EVENTS
// =========================
filterCountry.addEventListener("change", applyFilters);
filterWebsite.addEventListener("change", applyFilters);
filterYear.addEventListener("change", applyFilters);

filterEvent.addEventListener("input", applyFiltersDebounced);
filterArtist.addEventListener("input", applyFiltersDebounced);

btnReset.addEventListener("click", resetFilters);

// =========================
// 9) INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  populateFilters();
  applyFilters();
});

const eventSuggestions = document.getElementById("event-suggestions");
const artistSuggestions = document.getElementById("artist-suggestions");

function populateSuggestions() {
  // EVENT
  const events = [...new Set(allTickets.map(t => t.eventName))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  eventSuggestions.innerHTML = "";
  events.forEach(e => {
    const opt = document.createElement("option");
    opt.value = e;
    eventSuggestions.appendChild(opt);
  });

  // ARTIST
  const artists = [...new Set(allTickets.map(t => t.artist))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  artistSuggestions.innerHTML = "";
  artists.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    artistSuggestions.appendChild(opt);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  populateFilters();
  populateSuggestions();   // <-- TAMBAHKAN INI
  applyFilters();
});


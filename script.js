/* =====================================================
   ELEMENT REFERENCES
===================================================== */
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

const profileModal = document.getElementById("profileModal");
const aboutModal = document.getElementById("aboutModal");
const contactModal = document.getElementById("contactModal");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const bookingForm = document.querySelector(".booking-form");
const travelDate = document.getElementById("travelDate");
const tripButtons = document.querySelectorAll(".trip-type button");

/* =====================================================
   HAMBURGER MENU
===================================================== */
hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
});

document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
        menu.style.display = "none";
    }
});

/* =====================================================
   SECTION NAVIGATION
===================================================== */
function showSection(type) {
    menu.style.display = "none";

    if (type === "flight") window.scrollTo({ top: 0, behavior: "smooth" });
    if (type === "ticket") showTickets();
    if (type === "bus/car") alert("Bus/Car booking");
    if (type === "hotel") alert("Hotel booking");
}

/* =====================================================
   PROFILE MODAL
===================================================== */
function openProfile() {
    profileModal.style.display = "flex";
    showLogin();
}

function closeProfile() {
    profileModal.style.display = "none";
}

function showLogin() {
    loginForm.style.display = "flex";
    signupForm.style.display = "none";
}

function showSignup() {
    signupForm.style.display = "flex";
    loginForm.style.display = "none";
}

/* =====================================================
   ABOUT & CONTACT
===================================================== */
function openAbout() {
    aboutModal.style.display = "flex";
}
function closeAbout() {
    aboutModal.style.display = "none";
}

function openContact() {
    contactModal.style.display = "flex";
}
function closeContact() {
    contactModal.style.display = "none";
}

window.addEventListener("click", (e) => {
    if (e.target === profileModal) closeProfile();
    if (e.target === aboutModal) closeAbout();
    if (e.target === contactModal) closeContact();
});

/* =====================================================
   DATE RESTRICTION
===================================================== */
if (travelDate) {
    const today = new Date().toISOString().split("T")[0];
    travelDate.min = today;
}

/* =====================================================
   TRIP TYPE (ONE WAY / RETURN)
===================================================== */
tripButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        tripButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const isReturn = btn.textContent.includes("Return");
        toggleReturnDate(isReturn);
    });
});

function toggleReturnDate(show) {
    let returnField = document.getElementById("returnDateField");

    if (show && !returnField) {
        returnField = document.createElement("div");
        returnField.className = "field";
        returnField.id = "returnDateField";
        returnField.innerHTML = `
            <label>Return Date</label>
            <input type="date" min="${travelDate.min}">
        `;
        travelDate.closest(".row").appendChild(returnField);
    }

    if (!show && returnField) {
        returnField.remove();
    }
}

/* =====================================================
   FLIGHT DATABASE (MOCK – PROFESSIONAL)
===================================================== */
const flightDatabase = [
    { airline: "Air Peace", base: 50000 },
    { airline: "Arik Air", base: 48000 },
    { airline: "Ibom Air", base: 52000 },
    { airline: "British Airways", base: 180000 },
    { airline: "Qatar Airways", base: 210000 }
];

/* =====================================================
   BOOKING & FLIGHT SEARCH
===================================================== */
bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = document.querySelectorAll(".counter-group input");
    const infants = +inputs[0].value;
    const children = +inputs[1].value;
    const teens = +inputs[2].value;
    const adults = +inputs[3].value;

    if (adults === 0) {
        alert("At least one adult is required.");
        return;
    }

    const travellers = infants + children + teens + adults;
    const flightClass = document.querySelectorAll("select")[0].value;

    let classMultiplier = 1;
    if (flightClass === "Business") classMultiplier = 1.6;
    if (flightClass === "First Class") classMultiplier = 2.2;

    showAvailableFlights(travellers, classMultiplier);
});

/* =====================================================
   SHOW AVAILABLE FLIGHTS
===================================================== */
function showAvailableFlights(travellers, classMultiplier) {

    let modal = document.getElementById("flightModal");

    if (!modal) {
        modal = document.createElement("div");
        modal.className = "modal";
        modal.id = "flightModal";
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" onclick="closeFlightModal()">&times;</span>
                <h3>Select a Flight</h3>
                <div id="flightList"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const list = document.getElementById("flightList");
    list.innerHTML = "";

    flightDatabase.forEach(flight => {
        const price = Math.round(flight.base * classMultiplier * travellers);

        const card = document.createElement("div");
        card.className = "flight-card";
        card.innerHTML = `
            <div class="flight-info">
                <strong>${flight.airline}</strong>
                <span>${travellers} traveller(s)</span>
                <span>${document.querySelector(".trip-type .active").textContent}</span>
            </div>
            <div class="flight-price">₦${price.toLocaleString()}</div>
            <button onclick="confirmFlight('${flight.airline}', ${price})">
                Select
            </button>
        `;
        list.appendChild(card);
    });

    modal.style.display = "flex";
}

function closeFlightModal() {
    document.getElementById("flightModal").style.display = "none";
}

/* =====================================================
   CONFIRM FLIGHT & SAVE TICKET
===================================================== */
function confirmFlight(airline, price) {

    const ticket = {
        id: Date.now(),
        airline,
        date: travelDate.value,
        price
    };

    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    tickets.push(ticket);
    localStorage.setItem("tickets", JSON.stringify(tickets));

    closeFlightModal();
    alert("✅ Flight booked successfully!");
    bookingForm.reset();
}

/* =====================================================
   TICKET VIEW
===================================================== */
function showTickets() {
    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];

    if (!tickets.length) {
        alert("No tickets booked yet.");
        return;
    }

    let message = "🎫 YOUR TICKETS\n\n";

    tickets.forEach((t, i) => {
        message += `
${i + 1}. ${t.airline}
Date: ${t.date}
Price: ₦${t.price.toLocaleString()}

`;
    });

    alert(message);
}

/*=============================bus booking=============
fetch("/bus/routes")


async function searchRoutes() {
  const from = document.getElementById("from").value.toLowerCase();
  const to = document.getElementById("to").value.toLowerCase();

  const res = await fetch("/booking/routes");
  const data = await res.json();

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const filtered = data.filter(route =>
    route.from.toLowerCase().includes(from) &&
    route.to.toLowerCase().includes(to)
  );

  if (filtered.length === 0) {
    resultsDiv.innerHTML = "<p class='no-result'>No routes found ❌</p>";
    return;
  }

  filtered.forEach(route => {
    const div = document.createElement("div");
    div.className = "route";

    div.innerHTML = `
      <div class="route-info">
        <strong>${route.from} → ${route.to}</strong><br/>
        Price: ₦${route.price} <br/>
        Time: ${route.departureTime || "Not specified"}
      </div>
      <button onclick="bookRoute('${route._id}')">Book</button>
    `;

    resultsDiv.appendChild(div);
  });
}

async function bookRoute(routeId) {
  try {
    const res = await fetch("/booking/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: "123456789", // temporary
        routeId: routeId,
        seatNumber: 1
      })
    });

    const data = await res.json();

    alert("✅ Booking Successful!");
  } catch (error) {
    alert("❌ Booking Failed");
    console.error(error);
  }
}
*/
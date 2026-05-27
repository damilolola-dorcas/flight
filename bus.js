/* =====================================================
   SKYBOOK - CAR & RIDE BOOKING
   Author: Damilola
   Version: 2.0
===================================================== */

// ==================== GLOBAL VARIABLES ====================
let currentBookingType = null;

// ==================== CAR DATABASE ====================
const carsDatabase = [
    { name: "Toyota Corolla", type: "Economy", price: 15000, seats: 4, transmission: "Automatic", ac: true, bags: 2 },
    { name: "Honda Accord", type: "Standard", price: 22000, seats: 5, transmission: "Automatic", ac: true, bags: 3 },
    { name: "Toyota Camry", type: "Standard", price: 20000, seats: 5, transmission: "Automatic", ac: true, bags: 3 },
    { name: "Lexus RX 350", type: "Luxury", price: 40000, seats: 5, transmission: "Automatic", ac: true, bags: 4 },
    { name: "Mercedes E-Class", type: "Luxury", price: 55000, seats: 5, transmission: "Automatic", ac: true, bags: 4 },
    { name: "BMW 5 Series", type: "Premium", price: 50000, seats: 5, transmission: "Automatic", ac: true, bags: 4 },
    { name: "Range Rover Sport", type: "SUV", price: 70000, seats: 7, transmission: "Automatic", ac: true, bags: 6 },
    { name: "Toyota Hiace Bus", type: "Minibus", price: 80000, seats: 14, transmission: "Manual", ac: true, bags: 10 },
    { name: "Mercedes Sprinter", type: "Luxury Bus", price: 120000, seats: 20, transmission: "Automatic", ac: true, bags: 15 },
    { name: "Hyundai Tucson", type: "SUV", price: 35000, seats: 5, transmission: "Automatic", ac: true, bags: 4 },
    { name: "Kia Picanto", type: "Economy", price: 12000, seats: 4, transmission: "Manual", ac: true, bags: 2 },
    { name: "Nissan Patrol", type: "Luxury SUV", price: 80000, seats: 7, transmission: "Automatic", ac: true, bags: 6 }
];

// ==================== RIDE DATABASE ====================
const ridesDatabase = [
    { type: "Economy Ride", price: 3500, capacity: 4, waitTime: "3-5 min", car: "Toyota Corolla", features: ["AC", "GPS"] },
    { type: "Standard Ride", price: 5500, capacity: 4, waitTime: "3-5 min", car: "Honda Accord", features: ["AC", "GPS", "Music"] },
    { type: "Premium Ride", price: 8500, capacity: 4, waitTime: "5-7 min", car: "Lexus ES", features: ["AC", "GPS", "Music", "Water"] },
    { type: "SUV Ride", price: 12000, capacity: 6, waitTime: "5-7 min", car: "Hyundai Santa Fe", features: ["AC", "GPS", "Extra Space"] },
    { type: "Luxury Ride", price: 20000, capacity: 4, waitTime: "8-10 min", car: "Mercedes S-Class", features: ["AC", "GPS", "Drinks", "WiFi"] },
    { type: "Van/Taxi", price: 15000, capacity: 8, waitTime: "10-12 min", car: "Toyota Hiace", features: ["AC", "GPS", "Extra Luggage"] }
];

// ==================== HAMBURGER MENU ====================
document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.getElementById("hamburger");
    const menu = document.getElementById("menu");
    
    if (hamburger) {
        hamburger.addEventListener("click", function(e) {
            e.stopPropagation();
            if (menu.style.display === "flex") {
                menu.style.display = "none";
            } else {
                menu.style.display = "flex";
            }
        });
    }
    
    document.addEventListener("click", function(e) {
        if (menu && !menu.contains(e.target) && e.target !== hamburger) {
            menu.style.display = "none";
        }
    });
    
    // Close menu when clicking on a link
    const menuLinks = document.querySelectorAll(".hamburger-menu a");
    menuLinks.forEach(link => {
        link.addEventListener("click", function() {
            menu.style.display = "none";
        });
    });
});

// ==================== DATE SETUP ====================
function setupDates() {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    
    const rentPickupDate = document.getElementById("rentPickupDate");
    const rentReturnDate = document.getElementById("rentReturnDate");
    
    if (rentPickupDate) {
        rentPickupDate.value = today;
        rentPickupDate.min = today;
    }
    if (rentReturnDate) {
        rentReturnDate.value = tomorrowStr;
        rentReturnDate.min = today;
    }
}

// ==================== SHOW HOTELS ====================
function showHotels() {
    alert("🏨 Hotel bookings coming soon! Stay tuned for amazing deals on luxury accommodations.");
}

// ==================== SEARCH RENTAL CARS ====================
function searchRentalCars() {
    const resultsDiv = document.getElementById("rentResults");
    if (!resultsDiv) return;
    
    resultsDiv.innerHTML = '<div style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin"></i> Searching for available cars...</div>';
    
    setTimeout(() => {
        const pickupDate = document.getElementById("rentPickupDate")?.value;
        const returnDate = document.getElementById("rentReturnDate")?.value;
        
        if (!pickupDate || !returnDate) {
            resultsDiv.innerHTML = `<div class="result-card" style="text-align: center; color: #666; justify-content: center;">
                <i class="fas fa-calendar" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                <p>Please select pickup and return dates</p>
            </div>`;
            return;
        }
        
        const pickup = new Date(pickupDate);
        const returnD = new Date(returnDate);
        const days = Math.max(1, Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24)));
        
        if (days < 1) {
            resultsDiv.innerHTML = `<div class="result-card" style="text-align: center; color: #666; justify-content: center;">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Return date must be after pickup date</p>
            </div>`;
            return;
        }
        
        resultsDiv.innerHTML = "";
        const displayCars = carsDatabase.slice(0, 8);
        
        displayCars.forEach(car => {
            const totalPrice = car.price * days;
            
            const card = document.createElement("div");
            card.className = "result-card";
            card.innerHTML = `
                <div class="result-info">
                    <h3><i class="fas fa-car"></i> ${car.name}</h3>
                    <p><i class="fas fa-tag"></i> ${car.type} • <i class="fas fa-chair"></i> ${car.seats} seats • <i class="fas fa-cog"></i> ${car.transmission}</p>
                    <p><i class="fas fa-suitcase"></i> ${car.bags} bags • <i class="fas fa-wind"></i> ${car.ac ? 'AC' : 'No AC'}</p>
                    <p><i class="fas fa-calendar"></i> ${days} day(s) rental</p>
                </div>
                <div class="result-price">
                    <div class="price">₦${totalPrice.toLocaleString()}</div>
                    <div style="font-size: 0.75rem; color: #888;">₦${car.price.toLocaleString()}/day</div>
                    <button class="book-btn" onclick="bookCar('${car.name}', '${car.type}', ${totalPrice}, ${days}, ${car.price})">Book Now →</button>
                </div>
            `;
            resultsDiv.appendChild(card);
        });
    }, 500);
}

// ==================== SEARCH RIDES ====================
function searchRides() {
    const resultsDiv = document.getElementById("rideResults");
    if (!resultsDiv) return;
    
    const pickup = document.getElementById("ridePickup")?.value;
    const dropoff = document.getElementById("rideDropoff")?.value;
    
    if (!pickup || !dropoff) {
        resultsDiv.innerHTML = `<div class="result-card" style="text-align: center; color: #666; justify-content: center;">
            <i class="fas fa-map-marker-alt" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
            <p>Please enter pickup and drop-off locations</p>
        </div>`;
        return;
    }
    
    resultsDiv.innerHTML = '<div style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin"></i> Finding available rides...</div>';
    
    setTimeout(() => {
        resultsDiv.innerHTML = "";
        
        ridesDatabase.forEach(ride => {
            const featuresHtml = ride.features.map(f => `<span style="display: inline-block; background: #e8f0fe; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.7rem; margin-right: 0.3rem;">${f}</span>`).join('');
            
            const card = document.createElement("div");
            card.className = "result-card";
            card.innerHTML = `
                <div class="result-info">
                    <h3><i class="fas fa-taxi"></i> ${ride.type}</h3>
                    <p><i class="fas fa-car"></i> ${ride.car} • <i class="fas fa-users"></i> ${ride.capacity} passengers</p>
                    <p><i class="fas fa-clock"></i> Arrives in ${ride.waitTime}</p>
                    <div style="margin-top: 0.5rem;">${featuresHtml}</div>
                </div>
                <div class="result-price">
                    <div class="price">₦${ride.price.toLocaleString()}</div>
                    <div style="font-size: 0.75rem; color: #888;">fixed price</div>
                    <button class="book-btn" onclick="bookRide('${ride.type}', ${ride.price}, '${pickup}', '${dropoff}')">Book Now →</button>
                </div>
            `;
            resultsDiv.appendChild(card);
        });
    }, 500);
}

// ==================== BOOK CAR ====================
function bookCar(carName, carType, price, days, dailyRate) {
    const pickupLocation = document.getElementById("rentPickup")?.value || "Lagos Airport";
    const pickupDate = document.getElementById("rentPickupDate")?.value;
    const returnDate = document.getElementById("rentReturnDate")?.value;
    const pickupTime = document.getElementById("rentPickupTime")?.value || "10:00";
    const returnTime = document.getElementById("rentReturnTime")?.value || "10:00";
    
    if (!pickupDate || !returnDate) {
        alert("Please select pickup and return dates");
        return;
    }
    
    const booking = {
        id: Date.now(),
        type: "car_rental",
        service: "car",
        item: carName,
        carType: carType,
        price: price,
        dailyRate: dailyRate,
        days: days,
        pickupLocation: pickupLocation,
        pickupDate: pickupDate,
        pickupTime: pickupTime,
        returnDate: returnDate,
        returnTime: returnTime,
        bookingRef: "CAR" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        bookingDate: new Date().toLocaleString(),
        status: "confirmed"
    };
    
    const bookings = JSON.parse(localStorage.getItem("skybook_ride_bookings")) || [];
    bookings.push(booking);
    localStorage.setItem("skybook_ride_bookings", JSON.stringify(bookings));
    
    let message = `🚗 CAR BOOKING CONFIRMED! 🚗\n\n`;
    message += `Booking Reference: ${booking.bookingRef}\n`;
    message += `Car: ${carName} (${carType})\n`;
    message += `Duration: ${days} day(s)\n`;
    message += `Daily Rate: ₦${dailyRate.toLocaleString()}\n`;
    message += `Total: ₦${price.toLocaleString()}\n\n`;
    message += `📍 Pickup: ${pickupLocation}\n`;
    message += `📅 Pickup Date: ${pickupDate} at ${pickupTime}\n`;
    message += `📅 Return Date: ${returnDate} at ${returnTime}\n\n`;
    message += `Thank you for choosing SkyBook! 🚗✨`;
    
    alert(message);
    
    document.getElementById("rentPickup").value = "Lagos Airport";
    setupDates();
    document.getElementById("rentResults").innerHTML = "";
}

// ==================== BOOK RIDE ====================
function bookRide(rideType, price, pickup, dropoff) {
    if (!pickup || !dropoff) {
        alert("Please enter pickup and drop-off locations");
        return;
    }
    
    const booking = {
        id: Date.now(),
        type: "ride",
        service: "ride",
        item: rideType,
        price: price,
        pickup: pickup,
        dropoff: dropoff,
        bookingRef: "RIDE" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        bookingDate: new Date().toLocaleString(),
        status: "confirmed",
        estimatedArrival: "5-10 minutes"
    };
    
    const bookings = JSON.parse(localStorage.getItem("skybook_ride_bookings")) || [];
    bookings.push(booking);
    localStorage.setItem("skybook_ride_bookings", JSON.stringify(bookings));
    
    let message = `🚕 RIDE BOOKING CONFIRMED! 🚕\n\n`;
    message += `Booking Reference: ${booking.bookingRef}\n`;
    message += `Ride: ${rideType}\n`;
    message += `From: ${pickup}\n`;
    message += `To: ${dropoff}\n`;
    message += `Total: ₦${price.toLocaleString()}\n`;
    message += `Estimated Arrival: ${booking.estimatedArrival}\n\n`;
    message += `Your driver is on the way!\nThank you for choosing SkyBook! 🚕✨`;
    
    alert(message);
    
    document.getElementById("ridePickup").value = "";
    document.getElementById("rideDropoff").value = "";
    document.getElementById("rideResults").innerHTML = "";
}

// ==================== SHOW BOOKINGS ====================
function showBookings() {
    const bookings = JSON.parse(localStorage.getItem("skybook_ride_bookings")) || [];
    
    if (bookings.length === 0) {
        alert("📋 No bookings yet.\n\nBook a car or ride with SkyBook today!");
        return;
    }
    
    let message = "📋 MY BOOKINGS 📋\n\n";
    message += "═".repeat(35) + "\n\n";
    
    bookings.forEach((b, i) => {
        if (b.service === "car") {
            message += `${i+1}. 🚗 CAR RENTAL\n`;
            message += `   Ref: ${b.bookingRef}\n`;
            message += `   Car: ${b.item}\n`;
            message += `   ${b.days} day(s) - ₦${b.price.toLocaleString()}\n`;
            message += `   Pickup: ${b.pickupDate} at ${b.pickupTime}\n`;
            message += `   Return: ${b.returnDate} at ${b.returnTime}\n`;
            message += `   Status: ${b.status}\n`;
        } else {
            message += `${i+1}. 🚕 RIDE BOOKING\n`;
            message += `   Ref: ${b.bookingRef}\n`;
            message += `   Ride: ${b.item}\n`;
            message += `   From: ${b.pickup}\n`;
            message += `   To: ${b.dropoff}\n`;
            message += `   Price: ₦${b.price.toLocaleString()}\n`;
            message += `   Status: ${b.status}\n`;
        }
        message += `   Booked: ${b.bookingDate}\n`;
        message += "\n" + "─".repeat(35) + "\n\n";
    });
    
    alert(message);
}

// ==================== MODAL FUNCTIONS ====================
function openProfile() { 
    const modal = document.getElementById("profileModal");
    if (modal) modal.style.display = "flex";
    switchAuth('login');
}

function closeProfile() { 
    const modal = document.getElementById("profileModal");
    if (modal) modal.style.display = "none";
}

function openAbout() { 
    const modal = document.getElementById("aboutModal");
    if (modal) modal.style.display = "flex";
}

function closeAbout() { 
    const modal = document.getElementById("aboutModal");
    if (modal) modal.style.display = "none";
}

function openContact() { 
    const modal = document.getElementById("contactModal");
    if (modal) modal.style.display = "flex";
}

function closeContact() { 
    const modal = document.getElementById("contactModal");
    if (modal) modal.style.display = "none";
}

function switchAuth(formType) {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const authTabs = document.querySelectorAll(".auth-tab");
    
    if (formType === 'login') {
        if (loginForm) loginForm.classList.add("active");
        if (signupForm) signupForm.classList.remove("active");
        if (authTabs[0]) authTabs[0].classList.add("active");
        if (authTabs[1]) authTabs[1].classList.remove("active");
    } else {
        if (signupForm) signupForm.classList.add("active");
        if (loginForm) loginForm.classList.remove("active");
        if (authTabs[1]) authTabs[1].classList.add("active");
        if (authTabs[0]) authTabs[0].classList.remove("active");
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", function() {
    setupDates();
    
    // Handle auth forms
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            alert("🔐 Login successful!\n\nWelcome back to SkyBook Rides!");
            closeProfile();
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener("submit", function(e) {
            e.preventDefault();
            alert("🎉 Account created successfully!\n\nWelcome to SkyBook Rides!");
            closeProfile();
        });
    }
    
    // Social media links
    const socialLinks = document.querySelectorAll('.social-icons a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            if (url && url !== '#') {
                window.open(url, '_blank');
            } else {
                alert('Social media page coming soon!');
            }
        });
    });
    
    // Footer links
    const footerLinks = document.querySelectorAll('.footer-section a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const text = this.textContent;
            if (text === 'About Us') {
                e.preventDefault();
                openAbout();
            } else if (text === 'Contact Us') {
                e.preventDefault();
                openContact();
            } else if (text === 'My Bookings') {
                e.preventDefault();
                showBookings();
            }
        });
    });
    
    // Enter key support for ride search
    const ridePickup = document.getElementById("ridePickup");
    const rideDropoff = document.getElementById("rideDropoff");
    
    if (ridePickup && rideDropoff) {
        const searchOnEnter = function(e) {
            if (e.key === "Enter") {
                searchRides();
            }
        };
        ridePickup.addEventListener("keypress", searchOnEnter);
        rideDropoff.addEventListener("keypress", searchOnEnter);
    }
    
    console.log("🚗 SkyBook Rides is ready!");
});

// Close modals when clicking outside
window.addEventListener("click", function(e) {
    const profileModal = document.getElementById("profileModal");
    const aboutModal = document.getElementById("aboutModal");
    const contactModal = document.getElementById("contactModal");
    
    if (profileModal && e.target === profileModal) closeProfile();
    if (aboutModal && e.target === aboutModal) closeAbout();
    if (contactModal && e.target === contactModal) closeContact();
});
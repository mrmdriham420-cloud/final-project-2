// Navbar Toggle
document.addEventListener("DOMContentLoaded", function () {

    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    }

    loadCourses();

});

// Load Courses
async function loadCourses() {

    const container = document.querySelector(".course-container");

    if (!container) return;

    try {

        const response = await fetch("http://localhost:5000/api/courses");
        const courses = await response.json();

        container.innerHTML = "";

        courses.forEach(course => {

            const card = document.createElement("div");

            card.className = "course-card";

            card.innerHTML = `
                <h3>${course.name}</h3>
                <p><strong>Teacher:</strong> ${course.teacher}</p>
                <p><strong>Credits:</strong> ${course.credits}</p>
                <p>👥 ${course.enrolledStudents} Students</p>
                <p>⭐ ${course.averageRating} (${course.ratings ? course.ratings.length : 0} ratings)</p>
            `;

            card.onclick = function () {
                window.location.href = `course-details.html?id=${course._id}`;
            };

            container.appendChild(card);

        });

    } catch (err) {

        console.error(err);

    }

}

// Filter Courses (Search + Credits)
function filterCourses() {

    const query = document.getElementById("search-input").value.toLowerCase();
    const creditFilter = document.getElementById("credit-filter").value;
    const cards = document.querySelectorAll(".course-card");

    cards.forEach(card => {

        const text = card.innerText.toLowerCase();
        const creditText = card.querySelector("p:nth-child(3)").innerText;
        const credits = creditText.replace("Credits:", "").trim();

        const matchSearch = text.includes(query);
        const matchCredit = creditFilter === "all" || credits === creditFilter;

        if (matchSearch && matchCredit) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

}

// Load Course Details
async function loadCourseDetails() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    try {

        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        const course = await response.json();

        if (!course) {
            document.querySelector("section").innerHTML = "<p>Course not found!</p>";
            return;
        }

        document.getElementById("course-name").innerText = course.name;
        document.getElementById("course-credits").innerText = "Credits: " + course.credits;
        document.getElementById("course-teacher").innerText = "Teacher: " + course.teacher;
        document.getElementById("course-description").innerText = course.description;
        document.getElementById("student-count").innerText = "👥 Enrolled Students: " + course.enrolledStudents;
        document.getElementById("average-rating").innerText = "⭐ Average Rating: " + course.averageRating;
        document.getElementById("total-ratings").innerText = (course.ratings ? course.ratings.length : 0) + " ratings";

    } catch (err) {

        console.error(err);

    }

}

// Enroll Course
async function enrollCourse() {

    const token = localStorage.getItem("token");
    const message = document.getElementById("enroll-message");

    if (!token) {
        message.style.color = "red";
        message.innerText = "Please login first to enroll!";
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    try {

        const response = await fetch(`http://localhost:5000/api/courses/enroll/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        message.style.color = "green";
        message.innerText = "✅ Successfully Enrolled!";

        document.getElementById("student-count").innerText = "👥 Enrolled Students: " + data.enrolledStudents;

        document.getElementById("enroll-btn").disabled = true;
        document.getElementById("enroll-btn").style.backgroundColor = "gray";
        document.getElementById("enroll-btn").innerText = "Enrolled";

    } catch (err) {
        console.error(err);
        message.style.color = "red";
        message.innerText = "Something went wrong!";
    }

}

// Rate Course
async function rateCourse(star) {

    const token = localStorage.getItem("token");
    const message = document.getElementById("rating-message");

    if (!token) {
        message.style.color = "red";
        message.innerText = "Please login first to rate!";
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
        return;
    }

    // Star highlight করো
    const stars = document.querySelectorAll(".star");
    stars.forEach((s, index) => {
        if (index < star) {
            s.classList.add("selected");
        } else {
            s.classList.remove("selected");
        }
    });

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    // Token থেকে userId বের করো
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    try {

        const response = await fetch(`http://localhost:5000/api/courses/rate/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ userId, star })
        });

        const data = await response.json();

        message.style.color = "green";
        message.innerText = "✅ Rating দেওয়া হয়েছে!";

        document.getElementById("average-rating").innerText = "⭐ Average Rating: " + data.averageRating;
        document.getElementById("total-ratings").innerText = data.totalRatings + " ratings";

    } catch (err) {
        console.error(err);
        message.style.color = "red";
        message.innerText = "Something went wrong!";
    }

}

// Login
async function loginUser(event) {

    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {

        const response = await fetch("http://localhost:5000/api/auth/login", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        if (data.token) {

            localStorage.setItem("token", data.token);

            alert(data.message);

            window.location.href = "index.html";

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.error(err);

        alert("Server Error!");

    }

}

// Register
async function registerUser(event) {

    event.preventDefault();

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {

        const response = await fetch("http://localhost:5000/api/auth/register", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })

        });

        const data = await response.json();

        alert(data.message);

        if (data.message === "Registration Successful") {

            window.location.href = "login.html";

        }

    } catch (err) {

        console.error(err);

        alert("Server Error!");

    }

}
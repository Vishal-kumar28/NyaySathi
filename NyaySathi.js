/* =============================
   NyaySathi.js – Legal Assistant
   ============================= */

// ✅ Floating Chatbot Toggle
const chatToggle = document.getElementById("chat-toggle");
const chatbot = document.getElementById("legal-chatbot");
const closeChat = document.getElementById("close-chat");
const askButton = document.getElementById("ask-button");
const chatBody = document.getElementById("chat-body");
const userInput = document.getElementById("user-question");

chatToggle.addEventListener("click", () => {
  chatbot.style.display = "flex";
  chatToggle.style.display = "none";
});

closeChat.addEventListener("click", () => {
  chatbot.style.display = "none";
  chatToggle.style.display = "block";
});

// ✅ Chatbot API Integration
askButton.addEventListener("click", async () => {
  const question = userInput.value.trim();
  if (question === "") return;

  // Show user message
  const userMsg = document.createElement("div");
  userMsg.className = "user-message";
  userMsg.innerText = question;
  chatBody.appendChild(userMsg);

  // Call backend API
  try {
    let res = await fetch("http://localhost:5000/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    let data = await res.json();

    // Show bot response
    const botMsg = document.createElement("div");
    botMsg.className = "bot-message";
    botMsg.innerText = data.answer || "🤖 Sorry, I couldn't fetch a response.";
    chatBody.appendChild(botMsg);

  } catch (err) {
    const errorMsg = document.createElement("div");
    errorMsg.className = "bot-message";
    errorMsg.innerText = "⚠️ Server not responding. Try again later.";
    chatBody.appendChild(errorMsg);
  }

  // Clear input
  userInput.value = "";

  // Auto scroll to bottom
  chatBody.scrollTop = chatBody.scrollHeight;
});

// ✅ Document Drafter API Integration
const docType = document.getElementById("document-type");
const docTemplate = document.getElementById("document-template");
const party1 = document.getElementById("party1-name");
const party2 = document.getElementById("party2-name");
const docDate = document.getElementById("document-date");
const docOutput = document.getElementById("document-output-text");

async function generateDocument() {
  const type = docType.value;
  const template = docTemplate.value;
  const p1 = party1.value || "Party 1";
  const p2 = party2.value || "Party 2";
  const date = docDate.value || new Date().toLocaleDateString();

  try {
    let res = await fetch("http://localhost:5000/api/documents/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, template, party1: p1, party2: p2, date })
    });

    let data = await res.json();
    docOutput.value = data.document || "⚠️ Failed to generate document.";
  } catch (err) {
    docOutput.value = "⚠️ Server error. Please try again later.";
  }
}

// Attach Generate Document button
document.querySelector("#document-drafter button").addEventListener("click", generateDocument);

// ✅ Vernacular Language & Region Selection
const languageSelect = document.getElementById("language");
const regionSelect = document.getElementById("region");

document.querySelector("#vernacular-support button").addEventListener("click", () => {
  const lang = languageSelect.value;
  const region = regionSelect.value;
  alert(`🌐 Language set to: ${lang}\n📍 Region set to: ${region}`);
});

// ✅ Smooth Scroll for Navbar Links
document.querySelectorAll(".navbar-links a").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 60,
        behavior: "smooth"
      });
    }
  });
});


// ✅ Handle Signup
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    alert(data.msg);

    if (res.ok) {
      window.location.href = "login.html"; // Redirect after signup
    }
  } catch (err) {
    alert("⚠️ Signup failed. Try again.");
  }
});

// ✅ Handle Login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    alert(data.msg);

    if (res.ok) {
      localStorage.setItem("token", data.token); // Save JWT token
      window.location.href = "index.html"; // Redirect to main app
    }
  } catch (err) {
    alert("⚠️ Login failed. Try again.");
  }
});

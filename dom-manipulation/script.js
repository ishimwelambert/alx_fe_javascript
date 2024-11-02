// Initialize quotes array
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
];

// Display a random quote
function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length === 0) return;

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  document.getElementById("quoteDisplay").innerText = randomQuote.text;
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);
  showRandomQuote();
}

// Populate categories in the dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  const categories = [...new Set(quotes.map(quote => quote.category))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Get quotes filtered by selected category
function getFilteredQuotes() {
  const selectedCategory = localStorage.getItem("lastSelectedCategory") || "all";
  document.getElementById("categoryFilter").value = selectedCategory;

  if (selectedCategory === "all") return quotes;
  return quotes.filter(quote => quote.category === selectedCategory);
}

// Add a new quote and sync with server
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value;
  const quoteCategory = document.getElementById("newQuoteCategory").value;

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  postQuoteToServer(newQuote);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added and synced to the server!");
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Export quotes to JSON
function exportToJson() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Server Interaction - Fetch quotes
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverQuotes = await response.json();
    handleServerQuotes(serverQuotes);
  } catch (error) {
    console.error("Error fetching data from server:", error);
  }
}

// Handle and resolve conflicts with server data
function handleServerQuotes(serverQuotes) {
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    if (!quotes.some(quote => quote.text === serverQuote.title)) {
      quotes.push({ text: serverQuote.title, category: "General" });
      updated = true;
    }
  });

  if (updated) {
    alert("New quotes synced from the server!");
    saveQuotes();
    populateCategories();
  }
}

// Server Interaction - Post new quote
async function postQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: quote.text, body: quote.category }),
    });
    console.log("Quote posted to server:", quote);
  } catch (error) {
    console.error("Error posting data to server:", error);
  }
}

// New syncQuotes function to manually sync quotes with the server
async function syncQuotes() {
  // Fetch quotes from server and resolve any conflicts
  await fetchQuotesFromServer();

  // Post any new local quotes to the server
  quotes.forEach(quote => postQuoteToServer(quote));

  alert("Quotes synced with server!");
}

// Periodic data sync with server every minute
setInterval(fetchQuotesFromServer, 60000);

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
});

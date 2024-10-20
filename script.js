
// Array of quote objects with text and category
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Motivation" }
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  // Display the quote in the 'quoteDisplay' div
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>${randomQuote.text} - <strong>${randomQuote.category}</strong></p>`;
}

// Add event listener to 'newQuote' button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Function to add a new quote
function addQuote() {
  // Get the values from the input fields
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  // Validate input (ensure both fields are filled)
  if (newQuoteText && newQuoteCategory) {
    // Create a new quote object and add it to the array
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    
    // Display success message
    alert("New quote added successfully!");

    // Optionally, you can also update the DOM to show the new quote immediately
    showRandomQuote();
    
    // Clear the input fields after adding
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Please enter both a quote and a category.");
  }
}

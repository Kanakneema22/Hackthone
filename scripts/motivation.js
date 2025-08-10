async function fetchMotivationQuotes() {
  const response = await fetch("https://dummyjson.com/quotes/random");
  const data = await response.json();
  console.log(data);
  return data;
}

async function displayMotivationQuote() {
  const { quote, author } = await fetchMotivationQuotes();
  const quoteElement = document.getElementById("quote");
  const authorElement = document.getElementById("author");
  const motivationContainerElement = document.getElementById(
    "motivation-container"
  );

  motivationContainerElement.style.display = "flex";
  quoteElement.textContent = `${quote || "No quote found"}`;
  authorElement.textContent = `- ${author || "Unknown"}`;
}

displayMotivationQuote();
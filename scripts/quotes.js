export let quotes = {
    general: [],
    coffee: [],
    email: []
};

export function fetchQuotes() {
    fetch('quotes.json')
        .then(response => response.json())
        .then(data => {
            quotes = data.quotes;
        })
        .catch(error => {
            console.error('Error fetching quotes:', error);
            showTemporaryMessage('Failed to load quotes.', 5000);
        });
}
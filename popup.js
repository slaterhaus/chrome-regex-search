const search = () => {
    const regex = document.getElementById('regex-input').value;
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {message: 'search', regex: regex}, (response) => {
            document.getElementById('result').innerText = `Matches found: ${response.count}`;
        });
    });
}
document.getElementById('search-btn').onclick = search;

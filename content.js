const style = document.createElement('style');
style.innerHTML = `
  .highlight {
    background-color: yellow;
  }
`;
document.head.appendChild(style);

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.message === 'search') {
            const highlightedEls = document.getElementsByClassName('highlight')
            for (let el of highlightedEls) {
                el.className = "";
            }
            const regExp = new RegExp(request.regex, '');
            const matches = document.body.innerText.match(regExp);
            highlightMatches(regExp);
            sendResponse({count: matches ? matches.length : 0});
        }
    }
);

function highlightMatches(regExp) {
    // Recursive function to handle text node regex highlighting
    function highlightNode(node) {
        if (node.nodeType === 3) { // Node type 3 is a Text node
            const match = node.data.match(regExp);
            if (match) {
                const highlight = document.createElement('span');
                const wordNode = node.splitText(match.index);
                const wordClone = wordNode.cloneNode(true);

                highlight.className = 'highlight';
                wordNode.splitText(match[0].length);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; // Valid match
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // Only element nodes
            !/(script|style)/i.test(node.tagName) && // Ignore script and style nodes
            !(node.tagName === 'SPAN' && node.className === 'highlight')) { // Skip if already highlighted
            for (let i = 0; i < node.childNodes.length; i++) {
                i += highlightNode(node.childNodes[i]);
            }
        }
        return 0; // No match
    }

    // Start the highlighting process!
    highlightNode(document.body);
}

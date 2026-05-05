/* A function to build a beautiful layout of newsy postcards from an RSS feed... */

function buildPostcards() {
  const rssUrl = "https://pmckay.com/feed.xml"; /* This is my personal website's RSS feed, as a sample. In your project, add your site's feed, or whatever other feed you want. -pm 😊 */
  const rows = document.querySelectorAll(".postcards");

  fetch(rssUrl)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      const items = data.querySelectorAll("item");

      if (!items.length) {
        console.warn("No RSS items found.");
        return;
      }

      let itemIndex = 0;

      rows.forEach(row => {
        // Clear existing content (optional)
        row.innerHTML = "";

        for (let i = 0; i < 3; i++) {
          if (itemIndex >= items.length) break;

          const item = items[itemIndex];

          const title = item.querySelector("title")?.textContent || "";
          const link = item.querySelector("link")?.textContent || "";
          const description = item.querySelector("description")?.textContent || "";
          const pubDate = item.querySelector("pubDate")?.textContent || "";

          // Attempt to get media content (common RSS formats)

          let mediaContent = "";

// Proper namespace-safe selection
const media = item.getElementsByTagNameNS(
  "http://search.yahoo.com/mrss/",
  "content"
)[0];

if (media) {
  mediaContent = media.getAttribute("url");
}

          // Create card element
          const card = document.createElement("span");
          card.className = "card four columns";

          card.innerHTML = `
            <span class="cardscreen"></span>
            <a href="${link}">
              <h4>${title}</h4>
              <img src="${mediaContent}" alt="postcard image">
              <p class="summary">${stripHtml(description)}</p>
              <p class="date">${formatDate(pubDate)}</p>
            </a>
          `;

          row.appendChild(card);
          itemIndex++;
        }
      });
    })
    .catch(err => {
      console.error("Error loading RSS feed:", err);
    });

  // Helper: remove HTML tags from description
  function stripHtml(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }

  // Helper: format pubDate nicely
  function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
});


/* A function to build a river of headlines from an RSS feed... */

function loadRSSheds() {
  fetch("https://blog.pmckay.com/feed.xml")
    .then(response => response.text())
    .then(data => {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(data, 'text/xml');
      let items = xmlDoc.getElementsByTagName('item');
      let list = document.getElementById('newsRiver');
      for (let i = 0; i < items.length; i++) {
        let title = items[i].getElementsByTagName('title')[0].textContent;
        let link = items[i].getElementsByTagName('link')[0].textContent;
        let pubDate = items[i].getElementsByTagName('pubDate')[0].textContent;
        let guid = document.createElement('li');
        let hyperlink = document.createElement('a');
        hyperlink.textContent = title;
        hyperlink.href = link;
        let date = document.createElement('span');
        date.textContent = pubDate;
        guid.appendChild(hyperlink);
        guid.appendChild(date);
        list.appendChild(guid);
      }
    });
};


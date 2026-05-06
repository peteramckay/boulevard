/*

Desmond
Copyright (c) 2018-2026, Peter A. McKay
Free to use under MIT License

*/



/* A function to build a layout of beautiful, newsy postcards from an RSS feed... */

function buildPostcards() {
  const feedUrl = "feed.xml"; 
  const rows = document.querySelectorAll(".postcards");

  fetch(feedUrl)
    .then(response => response.text())
    .then(str => {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(str, 'text/xml');
      const items = xmlDoc.querySelectorAll("item");
      let itemIndex = 0;

      rows.forEach(row => {
        row.innerHTML = "";
        for (let i = 0; i < 3; i++) {
          if (itemIndex >= items.length) break;
          const item = items[itemIndex];
          const title = item.querySelector("title")?.textContent || "";
          const link = item.querySelector("link")?.textContent || "";
          const description = item.querySelector("description")?.textContent || "";
          const pubDate = item.querySelector("pubDate")?.textContent || "";

          let mediaContent = "";
          const media = item.getElementsByTagNameNS("http://search.yahoo.com/mrss/", "content")[0];
          if (media) mediaContent = media.getAttribute("url");

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
    });

  function stripHtml(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return isNaN(date) ? dateString : date.toLocaleDateString(undefined, {
      year: "numeric", month: "long", day: "numeric"
    });
  }
}


/* A function to build a simple "river" river of news headlines from an RSS feed... */


function loadRSSheds() {
  const feedUrl = "feed.xml";
  fetch(feedUrl)
    .then(response => response.text())
    .then(str => {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(str, 'text/xml');  
      let items = xmlDoc.getElementsByTagName('item');
      let list = document.getElementById('newsRiver');
      if (!list) return;
      list.innerHTML = "";
      for (let i = 0; i < items.length; i++) {
        let title = items[i].getElementsByTagName('title')[0].textContent;
        let link = items[i].getElementsByTagName('link')[0].textContent;
        let pubDate = items[i].getElementsByTagName('pubDate')[0].textContent;
        let listItem = document.createElement('li');
        listItem.innerHTML = `<a href="${link}">${title}</a> <span> — ${pubDate}</span>`;
        list.appendChild(listItem);
      }
    });
}
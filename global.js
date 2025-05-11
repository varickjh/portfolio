console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Part 2:

// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
//   );

// currentLink?.classList.add('current');

// Alternative:
// if (currentLink) {
//     or if (currentLink !== undefined)
//     currentLink.classList.add('current');
//   }

// Part 3
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
? "/"                  // Local server
: "/portfolio/";         // GitHub Pages repo name

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'contact/', title: 'Contact' },
    { url: 'meta/', title: 'Meta' },
    { url: 'https://github.com/varickjh', title: 'GitHub' }
  ];

let nav = document.createElement('nav');

for (let p of pages) {
    let url = p.url;
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    // Logic:
    // if (!url.startsWith('http')) {
    //     url = BASE_PATH + url;
    //   }

    let title = p.title;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    // Alternative:
    // a.classList.toggle(
    //     'current',
    //     a.host === location.host && a.pathname === location.pathname,
    //   );
    else if (a.host !== location.host){
        a.target = "_blank";
    }
  }

document.body.prepend(nav);

document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select>
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
      </label>`,
  );

let select = document.querySelector("select");

select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value
});

if ("colorScheme" in localStorage){
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme;
}

// Lab 4

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
  // Your code will go here
  containerElement.innerHTML = '';
  for (const proj of project){
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${proj.title}</${headingLevel}>
      <img src="${proj.image}" alt="${project.title}">
      <p>${proj.description}</p>
      <h4>Year: ${proj.year}</h4>
    `;
    containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
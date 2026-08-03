  const page = window.PAGE;
  if (!page) {
    console.error("page-shell: window.PAGE is missing");
    return;
  }

  const hero = document.getElementById("pageHero");
  if (!hero) {
    console.error("page-shell: <section id=\"pageHero\"> is missing");
    return;
  }


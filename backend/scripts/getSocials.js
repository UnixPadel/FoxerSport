fetch('https://foxersport.com/')
  .then(r => r.text())
  .then(html => {
    const links = html.match(/href=["']([^"']*)["']/gi);
    const socials = links.filter(l => l.includes('facebook') || l.includes('instagram') || l.includes('foxersport') && !l.includes('foxersport.com') && !l.includes('foxersport.com.tr'));
    console.log([...new Set(socials)]);
  })
  .catch(console.error);

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const cat = await prisma.category.findFirst({ where: { slug: 'rackets' } });
  const rackets = await prisma.product.findMany({ 
    where: { categoryId: cat.id }, 
    include: { translations: true } 
  });

  for (const r of rackets) {
    const name = r.translations[0].name;
    
    // Extract features from name to make it look realistic
    let carbonType = 'Matériaux de première qualité';
    if (name.includes('18K')) carbonType = 'Fibre de carbone 18K';
    else if (name.includes('12K')) carbonType = 'Fibre de carbone 12K';
    else if (name.includes('3K')) carbonType = 'Fibre de carbone 3K';

    const desc = `<h3><strong>${name}</strong></h3>
<p>La raquette de padel <strong>${name}</strong> est soigneusement conçue pour les joueurs à la recherche de l'excellence sur le terrain. Elle combine durabilité, précision et confort exceptionnel pour des performances optimales.</p>
<h4><span style="font-size: 18px;">Caractéristiques principales :</span></h4>
<ul>
<li><strong>Matériau :</strong> ${carbonType} pour une durabilité supérieure et une réactivité légère.</li>
<li><strong>Forme :</strong> Design optimisé offrant un équilibre parfait entre puissance et contrôle.</li>
<li><strong>Noyau :</strong> Noyau EVA Soft Core pour une meilleure sensation de balle et un confort durable.</li>
<li><strong>Poids :</strong> Environ 360-375 grammes, garantissant agilité et équilibre parfait.</li>
<li><strong>Poignée :</strong> Manche ergonomique et antidérapant pour un contrôle optimal pendant le jeu intense.</li>
</ul>
<h4><span style="font-size: 18px;">Performance :</span></h4>
<p>La <strong>${name}</strong> permet d'effectuer des frappes puissantes et précises grâce à sa constance. Son design polyvalent en fait un choix parfait pour s'adapter à votre style de jeu, qu'il soit offensif ou défensif.</p>
<h4><span style="font-size: 18px;">À qui s’adresse-t-elle :</span></h4>
<ul>
<li><strong>Niveau de compétence :</strong> Joueurs intermédiaires et avancés cherchant à progresser.</li>
<li><strong>Style de jeu :</strong> Idéale pour les joueurs exigeants qui privilégient les attaques contrôlées.</li>
</ul>
<p>Élevez votre jeu à un niveau supérieur avec la <strong>${name}</strong>, conçue pour vous accompagner vers la victoire sur le terrain !</p>`;

    await prisma.productTranslation.update({
      where: { id: r.translations[0].id },
      data: { description: desc }
    });
    
    console.log(`Updated description for: ${name}`);
  }
}

run()
  .then(() => console.log('Done!'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());

document.addEventListener("DOMContentLoaded", () => {
  const projects = [
    {
      title: "Exploration of MobileNetV1 on CIFAR-10 Dataset",
      description: "This project was the final project written by Jay Buensuceso and Sialoi Ta'a for UC San Diego's COGS 181 Winter 2024 Neural Networks and Deep Learning class taught by Professor Zhuowen Tu.",
      technologies: ["Python", "PyTorch", "Jupyter Notebook", "CIFAR-10"],
      link: "https://github.com/flashruler/Exploration-of-MobileNetV1-on-CIFAR-10-Dataset",
    },
    {
        title: "Shoe Recommendation System using T-SNE and UMAP",
        description: "The final project for UC San Diego's COGS 118B Unsupervised Learning class taught by Professor Jason Fleischer.",
        technologies: ["Python", "Pandas", "Scikit-learn", "T-SNE", "UMAP"],
        link: "https://github.com/flashruler/Shoe-Recommendation-System-using-T-SNE-and-UMAP",
      },
    {
        title: "Makerspace Digital Bulletin Board",
        description: "A digital bulletin board written in NextJS for the UC San Diego Makerspace.",
        technologies: ["Typescript", "Next.js", "PostgreSQL", "Express.js", "NodeJS"],
      },
      {
        title: "Next.js Based Image Proxy Reader",
        description: "A web-based image proxy and manga reader written in Next.js and Typescript inspired by Cubari.moe.",
        technologies: ["Typescript", "Next.js"],
      }
  ]

  const projectsContainer = document.querySelector("#projects .grid")

  projects.forEach((project) => {
    const projectCard = document.createElement("div")
    projectCard.className = "bg-white p-6 rounded-lg shadow-md project-card cursor-pointer"
    projectCard.innerHTML = `
            <h3 class="text-xl font-semibold mb-2">${project.title}</h3>
            <p class="text-gray-600 mb-4">${project.description}</p>
            <div class="flex flex-wrap gap-2 mb-4">
                ${project.technologies.map((tech) => `<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">${tech}</span>`).join("")}
            </div>
        `
    projectsContainer.appendChild(projectCard)
  })

  const dialog = document.getElementById('projectDialog');
  const projectCards = document.querySelectorAll('.project-card');
  const closeButtons = document.querySelectorAll('.close-dialog');

  const projectsDetails = {
      'Exploration of MobileNetV1 on CIFAR-10 Dataset': {
          title: 'Exploration of MobileNetV1 on CIFAR-10 Dataset',
          description: `
              <h4 class="text-lg font-bold mb-2">Written Using:</h4>
              <p class="mb-4">Python, PyTorch, Jupyter Notebook, CIFAR-10 Dataset</p>
              <h4 class="text-lg font-bold mb-2">Description:</h4>

              <p class="mb-4">This final project delves into the fascinating world of neural network architectures by investigating the complexity characteristics of the CIFAR-10 image classification dataset by using an implementation of Google's MobileNetV1.</p>

              <h4 class="text-lg font-bold mb-2">Our Work Includes:</h4>
              <ul class="list-disc pl-6 mb-4">
                <li> Custom implementations of MobileNetV1 optimized for CIFAR-10</li>
                <li> Detailed analysis of performance metrics and computational efficiency</li>
                <li> Comprehensive insights from various implementations</li>
                <li> Strategic recommendations for future architectural improvements</li>
              </ul>
              <div class="mt-4 flex gap-4">
                  <a href="https://github.com/flashruler/Exploration-of-MobileNetV1-on-CIFAR-10-Dataset" class="text-blue-600 hover:underline">Source Code</a>
              </div>
          `
      },
      'Makerspace Digital Bulletin Board': {
          title: 'Makerspace Digital Bulletin Board',
          description: `
              <h4 class="text-lg font-bold mb-2">Written using:</h4>
              <p class="mb-4">Typescript, Next.js, NodeJS, PostgreSQL, ExpressJS</p>
              <img src="./assets/digital_bulletin.png" alt="Makerspace Digital Bulletin Board" class="mb-4">
              <h4 class="text-lg font-bold mb-2">Description:</h4>
              <p class="mb-4">When the UC San Diego Makerspace opened in 2022, its atrium featured a
               TV displaying a simple Google Sites webpage as a digital bulletin board. 
               Over time, updates became infrequent, resulting in outdated and incorrect 
               information being displayed. </p>
               <p class="mb-4">Recognizing an opportunity for improvement rather than merely updating 
               content, we developed a comprehensive solution using Next.js, Express.js, 
               and PostgreSQL. This strategic overhaul not only streamlined the update 
               process but also expanded our content capabilities significantly.</p>
               <p class="mb-4">The revamped system now successfully delivers current, relevant 
               information to the 5,000+ students and faculty who visit the Makerspace 
               each quarter, transforming what was once a neglected display into a
                valuable information hub for the entire community.</p>
          `
      },
      'Next.js Based Image Proxy Reader': {
          title: 'Next.js Based Image Proxy Reader ',
          description: `
              <h4 class="text-lg font-bold mb-2">Written using:</h4>
              <p class="mb-4">Typescript, Next.js</p>
              <img src="./assets/proxy_reader.png" alt="Next.js Based Image Proxy Reader" class="mb-4">
              <h4 class="text-lg font-bold mb-2">Description:</h4>
              <p class="mb-4">This project is a web-based image proxy and manga reader, built entirely with Next.js and TypeScript and inspired
               by Cubari.moe. It fetches images from external sources like Imgur or JSON files hosted on GitHub Gists, then displays
                them in a streamlined, chapter-based format optimized for manga reading. The application features a fully custom, 
                cross-platform user interface designed to deliver a seamless and visually appealing manga reading experience.</p>
               <p>A special shoutout goes to <a class="text-blue-600 hover:underline" href="https://cubari.moe/">cubari.moe</a> for being the inspiration for this project.</p>
               <div class="mt-4 flex gap-4">
                  <a href="https://github.com/flashruler/proxyreader" class="text-blue-600 hover:underline">Source Code</a>
              </div>
          `
      },
      'Shoe Recommendation System using T-SNE and UMAP': {
          title: 'Shoe Recommendation System using T-SNE and UMAP',
          description: `
              <h4 class="text-lg font-bold mb-2">Written using:</h4>
              <p class="mb-4">Python, Pandas, Scikit-learn, T-SNE, UMAP</p>
              <img src="./assets/umap_tsne_cluster_2.png" alt="Shoe Recommendation System using T-SNE and UMAP" class="mb-4">
              <h4 class="text-lg font-bold mb-2">Description:</h4>
              <p> This was a final project for UC San Diego's COGS 118B Unsupervised Learning class taught by Professor Jason Fleischer. Our report 
              can be found in the "Final Project Unsupervised Shoe Recommender System.ipynb" notebook. Additionally,
                The original notebooks where we did our individual T-SNE and UMAP implementations can be viewed 
                in "TSNE_IMPLEMENTATION_AGGO.ipynb" and "UMAP_IMPLEMENTATION_AGGO.ipynb" respectively.</p>
              <div class="mt-4 flex gap-4">
                  <a href="https://github.com/flashruler/Shoe-Recommendation-using-T-SNE-and-UMAP" class="text-blue-600 hover:underline">Source Code</a>
              </div>
          `
      }
      // Add more projects here
  };

  projectCards.forEach(card => {
      card.addEventListener('click', () => {
          const projectTitle = card.querySelector('h3').textContent;
          const project = projectsDetails[projectTitle];
          
          document.getElementById('dialogTitle').textContent = project.title;
          document.getElementById('dialogContent').innerHTML = project.description;
          dialog.classList.remove('hidden');
          dialog.classList.add('flex');
      });
  });

  closeButtons.forEach(button => {
      button.addEventListener('click', () => {
          dialog.classList.add('hidden');
          dialog.classList.remove('flex');
      });
  });

  // Close dialog when clicking outside
  dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
          dialog.classList.add('hidden');
          dialog.classList.remove('flex');
      }
  });
})


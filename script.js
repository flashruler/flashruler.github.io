document.addEventListener("DOMContentLoaded", () => {
  const projects = [
    {
        title: "Climbr - Climbing workout tracker & analysis tool",
        description: "Climbr is an all in one climbing workout tracker and analysis tool. It allows you to track your climbing workouts and analyze your climbs.",
        technologies: ["Next.js", "Node.js", "Supabase", "tensorflow"],
        categories: ["web-dev", "ml"],
        link: "https://github.com/flashruler/Exploration-of-MobileNetV1-on-CIFAR-10-Dataset",
      },
    {
      title: "Exploration of MobileNetV1 on CIFAR-10 Dataset",
      description: "This project was the final project written by Jay Buensuceso and Sialoi Ta'a for UC San Diego's COGS 181 Winter 2024 Neural Networks and Deep Learning class taught by Professor Zhuowen Tu.",
      technologies: ["Python", "PyTorch", "Jupyter Notebook", "CIFAR-10"],
      categories: ["ml"],
      link: "https://github.com/flashruler/Exploration-of-MobileNetV1-on-CIFAR-10-Dataset",
    },
    {
        title: "Shoe Recommendation System using T-SNE and UMAP",
        description: "The final project for UC San Diego's COGS 118B Unsupervised Learning class taught by Professor Jason Fleischer.",
        technologies: ["Python", "Pandas", "Scikit-learn", "T-SNE", "UMAP"],
        categories: ["ml"],
        link: "https://github.com/flashruler/Shoe-Recommendation-System-using-T-SNE-and-UMAP",
      },
    {
        title: "Makerspace Digital Bulletin Board",
        description: "A digital bulletin board written in NextJS for the UC San Diego Makerspace.",
        technologies: ["Typescript", "Next.js", "PostgreSQL", "Express.js", "NodeJS"],
        categories: ["web-dev"],
      },
      {
        title: "Next.js Based Image Proxy Reader",
        description: "A web-based image proxy and manga reader written in Next.js and Typescript inspired by Cubari.moe.",
        technologies: ["Typescript", "Next.js"],
        categories: ["web-dev"],
      }
  ]

  const projectsContainer = document.querySelector("#projects .grid")
  let currentFilter = 'all'

  // Create filter buttons
  const createFilterButtons = () => {
    const filterContainer = document.createElement("div")
    filterContainer.className = "flex flex-wrap gap-2 mb-8 justify-left"
    filterContainer.innerHTML = `
      <button class="filter-btn active px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors" data-filter="all">All Projects</button>
      <button class="filter-btn px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors" data-filter="web-dev">Web Development</button>
      <button class="filter-btn px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors" data-filter="ml">Machine Learning</button>
    `
    
    // Insert before the projects grid
    projectsContainer.parentNode.insertBefore(filterContainer, projectsContainer)
    
    // Add event listeners to filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Store current scroll position
        const currentScrollY = window.scrollY
        
        // Update active button styling
        document.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('active', 'bg-blue-600', 'text-white')
          b.classList.add('bg-gray-200', 'text-gray-700')
        })
        e.target.classList.remove('bg-gray-200', 'text-gray-700')
        e.target.classList.add('active', 'bg-blue-600', 'text-white')
        
        // Apply filter
        currentFilter = e.target.dataset.filter
        renderProjects()
        
        // Restore scroll position after a brief delay to allow DOM updates
        requestAnimationFrame(() => {
          window.scrollTo(0, currentScrollY)
        })
      })
    })
  }

  const renderProjects = () => {
    projectsContainer.innerHTML = ''
    
    const filteredProjects = currentFilter === 'all' 
      ? projects 
      : projects.filter(project => project.categories.includes(currentFilter))

    filteredProjects.forEach((project) => {
      const projectCard = document.createElement("div")
      projectCard.className = "bg-white p-6 rounded-lg shadow-md project-card cursor-pointer transform transition-all duration-300 hover:scale-105"
      projectCard.innerHTML = `
              <h3 class="text-xl font-semibold mb-2">${project.title}</h3>
              <p class="text-gray-600 mb-4">${project.description}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                  ${project.technologies.map((tech) => `<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">${tech}</span>`).join("")}
              </div>
          `
      projectsContainer.appendChild(projectCard)
    })

    // Re-attach click listeners for project cards
    attachProjectCardListeners()
  }

  const dialog = document.getElementById('projectDialog');
  const closeButtons = document.querySelectorAll('.close-dialog');

  const projectsDetails = {

    'Climbr - Climbing workout tracker & analysis tool': {
          title: 'Climbr - Climbing workout tracker & analysis tool',
          description: `
              <h4 class="text-lg font-bold mb-2">Written Using:</h4>
              <p class="mb-4">Next.js, Node.js, Supabase, Tensorflow</p>
              <img src="./assets/climbr.png" alt="Climbr - Climbing workout tracker & analysis tool" class="mb-4">
              <h4 class="text-lg font-bold mb-2">Description:</h4>

              <p class="mb-4">Climbr is an all in one climbing workout tracker and analysis tool written in Next.js with a supabase databasse backend. It allows you to track your climbing workouts and analyze your climbs.</p>
              <p class="mb-4">Additionally, this app has a social feature where users can share their workouts to friends and see their progress.</p>
              <p class="mb-4"> Using Google's Movenet tensorflow model, it uses pose estimations to calculate your balance on the wall, angles of your arms, and graphs the output for a user to analyze their performance.</p>

              <h4 class="text-lg font-bold mb-2">Our Work Includes:</h4>
              <ul class="list-disc pl-6 mb-4">
                <li> Custom implementations of Movenet tensorflow model for pose estimation</li>
                <li> Detailed analysis of climber performance metrics</li>
                <li> Workout tracking stored in supabase database</li>
                <li> Friends list and social features</li>
              </ul>
              <div class="mt-4 flex gap-4">
                  <a href="https://climbr.edlweiss.me" class="text-blue-600 hover:underline">Check out the live demo!</a>
              </div>
          `
      },
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
                  <a href="https://reader.edlweiss.me" class="text-blue-600 hover:underline">Check out the live demo!</a>
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

  const attachProjectCardListeners = () => {
    const projectCards = document.querySelectorAll('.project-card');
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
  };

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

  // Initialize filter buttons and render projects after dialog setup
  createFilterButtons()
  renderProjects()
})


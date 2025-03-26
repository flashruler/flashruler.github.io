document.addEventListener("DOMContentLoaded", () => {
  const projects = [
    {
      title: "Exploration of MobileNetV1 on CIFAR-10 Dataset",
      description: "This project was the final project written by Jay Buensuceso and Sialoi Ta'a for UC San Diego's COGS 181 Winter 2024 Neural Networks and Deep Learning class taught by Professor Zhuowen Tu.",
      technologies: ["Python", "PyTorch", "Jupyter Notebook", "CIFAR-10"],
      link: "https://github.com/flashruler/Exploration-of-MobileNetV1-on-CIFAR-10-Dataset",
    },
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
              <h4 class="text-lg font-bold mb-2">Includes:</h4>
              <p class="mb-4">Python, PyTorch, Jupyter Notebook, CIFAR-10 Dataset</p>
              <h4 class="text-lg font-bold mb-2">Description:</h4>
              <p>Detailed project description goes here...</p>
              <div class="mt-4 flex gap-4">
                  <a href="https://github.com/flashruler/Exploration-of-MobileNetV1-on-CIFAR-10-Dataset" class="text-blue-600 hover:underline">GitHub</a>
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


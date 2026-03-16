export type ProjectCategory = "web-dev" | "ml";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  categories: ProjectCategory[];
  image?: string;
  details: string[];
  links?: ProjectLink[];
}

export const projects: Project[] = [
  {
    title: "San Diego FIRST Tech Challenge League Selection",
    description:
      "Web application for managing the San Diego FIRST Tech Challenge league selection process.",
    technologies: ["Typescript", "Next.js", "Convex", "Resend"],
    categories: ["web-dev"],
    image: "/assets/sdftc_league_selection.png",
    details: [
      "Developed to streamline and manage league selection for the San Diego FIRST Tech Challenge community.",
      "Migrated to a reactive data model for real-time updates and improved reliability during event operations.",
    ],
    links: [{ label: "Live Website", href: "https://leagueselection.edlweiss.me" }],
  },
  {
    title: "Iris - Network Packet Analyzer",
    description:
      "Network Packet Analyzer Dashboard for monitoring and analyzing network traffic in real-time.",
    technologies: ["Typescript", "Vite", "React", "Python", "FastAPI", "Tshark", "Docker"],
    categories: ["web-dev"],
    image: "/assets/iris.png",
    details: [
      "Iris captures and analyzes packets through a Python backend that orchestrates tshark commands.",
      "Built an interface focused on observability and actionable network diagnostics.",
    ],
  },
  {
    title: "Printfarm - 3D Printing Farm Management System",
    description:
      "3D Printing Farm Management System for monitoring and managing multiple 3D printers.",
    technologies: ["Typescript", "Vite", "React", "Python", "FastAPI"],
    categories: ["web-dev"],
    details: [
      "Built for print queue visibility and centralized control across multiple printers.",
      "Designed to reduce manual overhead for day-to-day farm operations.",
    ],
  },
  {
    title: "Climbr - Climbing workout tracker & analysis tool",
    description:
      "An all-in-one climbing workout tracker and analysis tool with social and performance insights.",
    technologies: ["Next.js", "Node.js", "Supabase", "TensorFlow"],
    categories: ["web-dev", "ml"],
    image: "/assets/climbr.png",
    details: [
      "Tracks climbing workouts and shares progress through social features.",
      "Uses pose estimation to analyze movement, balance, and climbing efficiency.",
    ],
  },
  {
    title: "Exploration of MobileNetV1 on CIFAR-10 Dataset",
    description:
      "Final project for UC San Diego COGS 181 covering MobileNetV1 behavior and tradeoffs on CIFAR-10.",
    technologies: ["Python", "PyTorch", "Jupyter Notebook", "CIFAR-10"],
    categories: ["ml"],
    details: [
      "Investigated performance and complexity characteristics of MobileNetV1 variants.",
      "Documented architectural tradeoffs and practical recommendations.",
    ],
    links: [
      {
        label: "Source Code",
        href: "https://github.com/flashruler/Exploration-of-MobileNetV1-on-CIFAR-10-Dataset",
      },
    ],
  },
  {
    title: "Shoe Recommendation System using T-SNE and UMAP",
    description:
      "Final UCSD COGS 118B project exploring unsupervised recommendation using dimensionality reduction.",
    technologies: ["Python", "Pandas", "Scikit-learn", "T-SNE", "UMAP"],
    categories: ["ml"],
    image: "/assets/umap_tsne_cluster_2.png",
    details: [
      "Compared T-SNE and UMAP approaches for latent-space recommendation quality.",
      "Published reproducible notebooks and analysis outputs.",
    ],
    links: [
      {
        label: "Source Code",
        href: "https://github.com/flashruler/Shoe-Recommendation-using-T-SNE-and-UMAP",
      },
    ],
  },
  {
    title: "Makerspace Digital Bulletin Board",
    description:
      "A digital bulletin board application for UC San Diego Makerspace operations.",
    technologies: ["Typescript", "Next.js", "PostgreSQL", "Express", "Node.js"],
    categories: ["web-dev"],
    image: "/assets/digital_bulletin.png",
    details: [
      "Replaced an outdated display flow with a maintainable, structured content pipeline.",
      "Improved freshness and relevance of daily information shown to Makerspace visitors.",
    ],
  },
  {
    title: "Next.js Based Image Proxy Reader",
    description:
      "A web-based image proxy and manga reader inspired by Cubari.moe.",
    technologies: ["Typescript", "Next.js"],
    categories: ["web-dev"],
    image: "/assets/proxy_reader.png",
    details: [
      "Fetches image content from remote sources and renders chapter-based reading workflows.",
      "Designed for a clean, cross-platform reading experience.",
    ],
    links: [
      { label: "Live Demo", href: "https://reader.edlweiss.me" },
      { label: "Source Code", href: "https://github.com/flashruler/proxyreader" },
    ],
  },
];

export const projects = [
    {
      title: "San Diego FIRST Tech Challenge League Selection",
      description:
        "Web application for managing the San Diego FIRST Tech Challenge league selection process.",
      technologies: ["Typescript", "Next.js", "Convex","resend"],
      categories: ["web-dev"],
      image: "/assets/sdftc_league_selection.png",
    },
    {
      title: "Iris - Network Packet Analyzer",
      description:
        "Network Packet Analyzer Dashboard for monitoring and analyzing network traffic in real-time.",
      technologies: ["Typescript", "Vite", "React.js", "Python", "FastAPI", "Tshark", "Docker"],
      categories: ["web-dev"],
    },
    {
      title: "Printfarm - 3D Printing Farm Management System",
      description:
        "3D Printing Farm Management System for monitoring and managing multiple 3D printers.",
      technologies: ["Typescript", "Vite", "React.js", "Python", "FastAPI"],
      categories: ["web-dev"],
    },
    {
      title: "Climbr - Climbing workout tracker & analysis tool",
      description:
        "Climbr is an all in one climbing workout tracker and analysis tool. It allows you to track your climbing workouts and analyze your climbs.",
      technologies: ["Next.js", "Node.js", "Supabase", "tensorflow"],
      categories: ["web-dev", "ml"],
      link: "https://github.com/flashruler/Exploration-of-MobileNetV1-on-CIFAR-10-Dataset",
      image: "/assets/climbr.png",
    },
    {
      title: "Exploration of MobileNetV1 on CIFAR-10 Dataset",
      description:
        "This project was the final project written by Jay Buensuceso and Sialoi Ta'a for UC San Diego's COGS 181 Winter 2024 Neural Networks and Deep Learning class taught by Professor Zhuowen Tu.",
      technologies: ["Python", "PyTorch", "Jupyter Notebook", "CIFAR-10"],
      categories: ["ml"],
      link: "https://github.com/flashruler/Exploration-of-MobileNetV1-on-CIFAR-10-Dataset",
      image: "/assets/cluster_25.png",
    },
    {
      title: "Shoe Recommendation System using T-SNE and UMAP",
      description:
        "The final project for UC San Diego's COGS 118B Unsupervised Learning class taught by Professor Jason Fleischer.",
      technologies: ["Python", "Pandas", "Scikit-learn", "T-SNE", "UMAP"],
      categories: ["ml"],
      link: "https://github.com/flashruler/Shoe-Recommendation-System-using-T-SNE-and-UMAP",
      image: "/assets/umap_tsne_cluster_2.png",
    },
    {
      title: "Makerspace Digital Bulletin Board",
      description:
        "A digital bulletin board written in NextJS for the UC San Diego Makerspace.",
      technologies: [
        "Typescript",
        "Next.js",
        "PostgreSQL",
        "Express.js",
        "NodeJS",
      ],
      categories: ["web-dev"],
      image: "/assets/digital_bulletin.png",
    },
    {
      title: "Next.js Based Image Proxy Reader",
      description:
        "A web-based image proxy and manga reader written in Next.js and Typescript inspired by Cubari.moe.",
      technologies: ["Typescript", "Next.js"],
      categories: ["web-dev"],
      image: "/assets/proxy_reader.png",
    },
  ];

export type Project = {
  title: string;
  description: string;
  technologies: string[];
  categories: string[];
  link?: string;
  image?: string;
};

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Home() {
  const [filter, setFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects = projects.filter(
    (project) => filter === "all" || project.categories.includes(filter)
  );

  return (
    <div className="container mx-auto mt-8 px-4 max-w-6xl relative">
      <div className="bgLines" aria-hidden="true"></div>
      <section id="about" className="mb-12 max-w-2xl relative z-10">
        <h2 className="text-3xl font-bold mb-4">
          Hello &mdash; I'm Jay, a software developer interested in full-stack
          development and machine learning!
        </h2>
        <div className="flex gap-8">
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              I graduated from UC San Diego and I enjoy crafting efficient,
              scalable, and user-friendly web applications. Check out some of
              my projects below!
            </p>
          </div>
        </div>
      </section>

      <section id="projects" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">My Projects</h2>
        
        <div className="flex flex-wrap gap-2 mb-8 justify-start">
          <Button 
            variant={filter === "all" ? "default" : "secondary"} 
            onClick={() => setFilter("all")}
          >
            All Projects
          </Button>
          <Button 
            variant={filter === "web-dev" ? "default" : "secondary"} 
            onClick={() => setFilter("web-dev")}
          >
            Web Development
          </Button>
          <Button 
            variant={filter === "ml" ? "default" : "secondary"} 
            onClick={() => setFilter("ml")}
          >
            Machine Learning
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <Card 
              key={idx} 
              className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
              onClick={() => setSelectedProject(project)}
            >
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-40 object-cover rounded-t-lg border-b"
                />
              )}
              <CardHeader>
                <CardTitle className="leading-tight">{project.title}</CardTitle>
                <CardDescription className="line-clamp-3">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 4).map((tech, tIdx) => (
                    <Badge key={tIdx} variant="secondary">{tech}</Badge>
                  ))}
                  {project.technologies.length > 4 && (
                    <Badge variant="outline">+{project.technologies.length - 4} more</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section id="contact" className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Volunteering</h2>
        <p className="text-lg text-muted-foreground">
          Here are the FIRST events I have volunteered at as a technical volunteer. I have been a volunteer for 6 years and I enjoy helping teams with their technical issues and seeing their robots in action!
        </p>
        <ul> 2024-2025
          <li className="ml-4 list-disc text-lg text-muted-foreground">San Diego Regional League Meets & Championship - Lead FIRST Technical Advisor</li>
          <li className="ml-4 list-disc text-lg text-muted-foreground">FIRST Championship - Control System Advisor and FIRST Technical Advisor
          </li>
          <li className="ml-4 list-disc text-lg text-muted-foreground">Cowtown Invitational - FIRST Technical Advisor</li>
        </ul>
        <ul> 2023-2024
          <li className="ml-4 list-disc text-lg text-muted-foreground">San Diego Regional League Meets & Championship - Lead FIRST Technical Advisor</li>
        </ul>
        <ul> 2022-2023
          <li className="ml-4 list-disc text-lg text-muted-foreground">San Diego Regional League Meets & Championship - Lead FIRST Technical Advisor</li>
          <li className="ml-4 list-disc text-lg text-muted-foreground">FIRST Championship - Control System Advisor, Wifi Technical Advisor, and FIRST Technical Advisor Assistant</li>
        </ul>
        <ul> 2021-2022
          <li className="ml-4 list-disc text-lg text-muted-foreground">San Diego Regional League Meets & Championship - Lead Field Technical Advisor</li>
        </ul>
        <ul> 2020-2021
          <li className="ml-4 list-disc text-lg text-muted-foreground">San Diego Region Livestream Manager</li>
        </ul>
         <ul> 2019-2020
          <li className="ml-4 list-disc text-lg text-muted-foreground">San Diego Region League Meets & Championship - Lead Scorekeeper</li>
        </ul>
      </section>

      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              {selectedProject.image && (
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-56 object-cover rounded-md border"
                />
              )}
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
                <DialogDescription className="text-lg mt-2">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, tIdx) => (
                      <Badge key={tIdx}>{tech}</Badge>
                    ))}
                  </div>
                </div>
                {selectedProject.link && (
                  <div>
                    <h4 className="font-semibold mb-2">Links</h4>
                    <a 
                      href={selectedProject.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-blue-600 hover:underline"
                    >
                      View Source / Deploy
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import FilterBar from "@/components/FilterBar";
import ProjectCard from "@/components/ProjectCard";
import AddProjectForm from "@/components/AddProjectForm";
import { Project } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch all projects
  const { data: projects = [], isLoading, error } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Filter and sort projects
  const filteredProjects = projects.filter(project => {
    // Category filter
    if (selectedCategory !== "all" && project.category !== selectedCategory) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        (project.tag && project.tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortOrder) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "az":
        return a.title.localeCompare(b.title);
      case "za":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  // Group projects by category for display
  const appProjects = sortedProjects.filter(p => p.category === 'app');
  const gameProjects = sortedProjects.filter(p => p.category === 'game');
  const imageProjects = sortedProjects.filter(p => p.category === 'image');
  const videoProjects = sortedProjects.filter(p => p.category === 'video');
  const etcProjects = sortedProjects.filter(p => p.category === 'etc');

  return (
    <main className="pt-24 pb-12">
      <Hero />
      
      <FilterBar
        onCategoryChange={setSelectedCategory}
        onSortChange={setSortOrder}
        onSearchChange={setSearchQuery}
      />

      {/* Display filtered projects (when a filter is active) */}
      {(selectedCategory !== "all" || searchQuery) && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold inline-block">
                <span className="text-neon-cyan">SEARCH RESULTS</span>
                <div className="h-[2px] w-full bg-neon-cyan mt-2"></div>
              </h2>
              <p className="text-cyber-text/80 mt-4">
                {sortedProjects.length} {sortedProjects.length === 1 ? 'project' : 'projects'} found
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="text-neon-cyan">Loading projects...</div>
              </div>
            ) : error ? (
              <div className="bg-cyber-slate p-6 border border-red-500/30 rounded-sm">
                <h3 className="text-xl font-orbitron text-red-500 mb-2">Error</h3>
                <p className="text-cyber-text/80">Failed to load projects. Please try again later.</p>
              </div>
            ) : sortedProjects.length === 0 ? (
              <div className="bg-cyber-slate p-8 border border-neon-cyan/30 rounded-sm text-center">
                <h3 className="text-xl font-orbitron text-neon-cyan mb-4">No Projects Found</h3>
                <p className="text-cyber-text/80 mb-6">Try adjusting your filters or search query.</p>
                <Button 
                  variant="neon" 
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                >
                  RESET FILTERS
                </Button>
              </div>
            ) : (
              <div className="grid-masonry">
                {sortedProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Only render category sections when not filtering */}
      {selectedCategory === "all" && !searchQuery && (
        <>
          {/* App Section */}
          <section id="app" className="py-16 px-4">
            <div className="container mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-orbitron font-bold inline-block">
                  <span className="text-neon-magenta">APP</span>
                  <div className="h-[2px] w-full bg-neon-magenta mt-2"></div>
                </h2>
                <p className="text-cyber-text/80 mt-4 max-w-3xl">
                  Interactive web applications and tools designed for various purposes - from productivity to creative experimentation.
                </p>
              </motion.div>
              
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="text-neon-cyan">Loading applications...</div>
                </div>
              ) : error ? (
                <div className="bg-cyber-slate p-6 border border-red-500/30 rounded-sm">
                  <h3 className="text-xl font-orbitron text-red-500 mb-2">Error</h3>
                  <p className="text-cyber-text/80">Failed to load applications. Please try again later.</p>
                </div>
              ) : appProjects.length === 0 ? (
                <div className="bg-cyber-slate p-8 border border-neon-magenta/30 rounded-sm text-center">
                  <h3 className="text-xl font-orbitron text-neon-magenta mb-4">No Applications Yet</h3>
                  <p className="text-cyber-text/80">Applications will appear here once added.</p>
                </div>
              ) : (
                <div className="grid-masonry">
                  {appProjects.slice(0, 3).map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </div>
              )}
              
              {appProjects.length > 3 && (
                <div className="mt-10 text-center">
                  <Button 
                    variant="neonMagenta" 
                    size="lg"
                    onClick={() => {
                      setSelectedCategory("app");
                    }}
                  >
                    VIEW ALL APPS
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Game Section */}
          <section id="game" className="py-16 px-4 bg-cyber-dark/50">
            <div className="container mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-orbitron font-bold inline-block">
                  <span className="text-neon-yellow">GAME</span>
                  <div className="h-[2px] w-full bg-neon-yellow mt-2"></div>
                </h2>
                <p className="text-cyber-text/80 mt-4 max-w-3xl">
                  Browser-based games and interactive experiences designed to challenge and entertain.
                </p>
              </motion.div>
              
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="text-neon-cyan">Loading games...</div>
                </div>
              ) : error ? (
                <div className="bg-cyber-slate p-6 border border-red-500/30 rounded-sm">
                  <h3 className="text-xl font-orbitron text-red-500 mb-2">Error</h3>
                  <p className="text-cyber-text/80">Failed to load games. Please try again later.</p>
                </div>
              ) : gameProjects.length === 0 ? (
                <div className="bg-cyber-slate p-8 border border-neon-yellow/30 rounded-sm text-center">
                  <h3 className="text-xl font-orbitron text-neon-yellow mb-4">No Games Yet</h3>
                  <p className="text-cyber-text/80">Games will appear here once added.</p>
                </div>
              ) : (
                <div className="grid-masonry">
                  {gameProjects.slice(0, 3).map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </div>
              )}
              
              {gameProjects.length > 3 && (
                <div className="mt-10 text-center">
                  <Button 
                    variant="neonYellow" 
                    size="lg"
                    onClick={() => {
                      setSelectedCategory("game");
                    }}
                  >
                    VIEW ALL GAMES
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Image Section */}
          <section id="image" className="py-16 px-4">
            <div className="container mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-orbitron font-bold inline-block">
                  <span className="text-neon-green">IMAGE</span>
                  <div className="h-[2px] w-full bg-neon-green mt-2"></div>
                </h2>
                <p className="text-cyber-text/80 mt-4 max-w-3xl">
                  Digital artwork, generative designs, and visual experiments exploring the intersection of technology and art.
                </p>
              </motion.div>
              
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="text-neon-cyan">Loading images...</div>
                </div>
              ) : error ? (
                <div className="bg-cyber-slate p-6 border border-red-500/30 rounded-sm">
                  <h3 className="text-xl font-orbitron text-red-500 mb-2">Error</h3>
                  <p className="text-cyber-text/80">Failed to load images. Please try again later.</p>
                </div>
              ) : imageProjects.length === 0 ? (
                <div className="bg-cyber-slate p-8 border border-neon-green/30 rounded-sm text-center">
                  <h3 className="text-xl font-orbitron text-neon-green mb-4">No Images Yet</h3>
                  <p className="text-cyber-text/80">Images will appear here once added.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {imageProjects.slice(0, 6).map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </div>
              )}
              
              {imageProjects.length > 6 && (
                <div className="mt-10 text-center">
                  <Button 
                    variant="neonGreen" 
                    size="lg"
                    onClick={() => {
                      setSelectedCategory("image");
                    }}
                  >
                    VIEW ALL IMAGES
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Video Section */}
          <section id="video" className="py-16 px-4 bg-cyber-dark/50">
            <div className="container mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-orbitron font-bold inline-block">
                  <span className="text-neon-blue">VIDEO</span>
                  <div className="h-[2px] w-full bg-neon-blue mt-2"></div>
                </h2>
                <p className="text-cyber-text/80 mt-4 max-w-3xl">
                  Motion graphics, animations, and visual storytelling through the digital medium.
                </p>
              </motion.div>
              
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="text-neon-cyan">Loading videos...</div>
                </div>
              ) : error ? (
                <div className="bg-cyber-slate p-6 border border-red-500/30 rounded-sm">
                  <h3 className="text-xl font-orbitron text-red-500 mb-2">Error</h3>
                  <p className="text-cyber-text/80">Failed to load videos. Please try again later.</p>
                </div>
              ) : videoProjects.length === 0 ? (
                <div className="bg-cyber-slate p-8 border border-neon-blue/30 rounded-sm text-center">
                  <h3 className="text-xl font-orbitron text-neon-blue mb-4">No Videos Yet</h3>
                  <p className="text-cyber-text/80">Videos will appear here once added.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videoProjects.slice(0, 4).map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </div>
              )}
              
              {videoProjects.length > 4 && (
                <div className="mt-10 text-center">
                  <Button 
                    variant="neonBlue" 
                    size="lg"
                    onClick={() => {
                      setSelectedCategory("video");
                    }}
                  >
                    VIEW ALL VIDEOS
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* ETC Section */}
          {etcProjects.length > 0 && (
            <section id="etc" className="py-16 px-4">
              <div className="container mx-auto">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mb-12"
                >
                  <h2 className="text-3xl md:text-4xl font-orbitron font-bold inline-block">
                    <span className="text-neon-magenta">ETC</span>
                    <div className="h-[2px] w-full bg-neon-magenta mt-2"></div>
                  </h2>
                  <p className="text-cyber-text/80 mt-4 max-w-3xl">
                    Other experimental works and projects that don't fit into standard categories.
                  </p>
                </motion.div>
                
                <div className="grid-masonry">
                  {etcProjects.slice(0, 3).map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </div>
                
                {etcProjects.length > 3 && (
                  <div className="mt-10 text-center">
                    <Button 
                      variant="neonMagenta" 
                      size="lg"
                      onClick={() => {
                        setSelectedCategory("etc");
                      }}
                    >
                      VIEW ALL MISC PROJECTS
                    </Button>
                  </div>
                )}
              </div>
            </section>
          )}
          
          {/* Add Project Form */}
          <section id="add-project" className="py-16 px-4 bg-cyber-black">
            <div className="container mx-auto max-w-4xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12 text-center"
              >
                <h2 className="text-3xl md:text-4xl font-orbitron font-bold inline-block">
                  <span className="text-neon-cyan">ADD PROJECT</span>
                  <div className="h-[2px] w-full bg-neon-cyan mt-2"></div>
                </h2>
                <p className="text-cyber-text/80 mt-4 max-w-3xl mx-auto">
                  Share your digital creation with the TOY FACTORY community. Upload your work and let it become part of the experience.
                </p>
              </motion.div>
              
              <AddProjectForm />
            </div>
          </section>
        </>
      )}
    </main>
  );
}
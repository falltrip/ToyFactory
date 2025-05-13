import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatDate, truncateText } from "@/lib/utils";
import { Project } from "@shared/schema";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'app':
        return 'neon-magenta';
      case 'game':
        return 'neon-yellow';
      case 'image':
        return 'neon-green';
      case 'video':
        return 'neon-blue';
      default:
        return 'neon-cyan';
    }
  };

  const getButtonVariant = (category: string) => {
    switch (category) {
      case 'app':
        return 'neonMagenta';
      case 'game':
        return 'neonYellow';
      case 'image':
        return 'neonGreen';
      case 'video':
        return 'neonBlue';
      default:
        return 'neon';
    }
  };

  const getButtonText = (category: string) => {
    switch (category) {
      case 'app':
        return 'LAUNCH';
      case 'game':
        return 'PLAY';
      case 'image':
        return 'VIEW';
      case 'video':
        return 'WATCH';
      default:
        return 'OPEN';
    }
  };

  // For video projects, render a play button
  const renderVideoOverlay = () => {
    if (project.category === 'video') {
      return (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-neon-blue/20 backdrop-blur-sm flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          {project.videoLength && (
            <div className="absolute bottom-2 right-2 bg-cyber-black/70 text-neon-blue text-xs px-2 py-1 rounded-sm font-bold">
              {project.videoLength}
            </div>
          )}
        </>
      );
    }
    return null;
  };

  // Get color class names directly
  const getGlowClass = (category: string) => {
    switch (category) {
      case 'app':
        return 'bg-neon-magenta/20';
      case 'game':
        return 'bg-neon-yellow/20';
      case 'image':
        return 'bg-neon-green/20';
      case 'video':
        return 'bg-neon-blue/20';
      default:
        return 'bg-neon-cyan/20';
    }
  };

  const getDotClass = (category: string) => {
    switch (category) {
      case 'app':
        return 'bg-neon-magenta';
      case 'game':
        return 'bg-neon-yellow';
      case 'image':
        return 'bg-neon-green';
      case 'video':
        return 'bg-neon-blue';
      default:
        return 'bg-neon-cyan';
    }
  };

  const getTitleClass = (category: string) => {
    switch (category) {
      case 'app':
        return 'text-neon-magenta';
      case 'game':
        return 'text-neon-yellow';
      case 'image':
        return 'text-neon-green';
      case 'video':
        return 'text-neon-blue';
      default:
        return 'text-neon-cyan';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-sm overflow-hidden bg-cyber-black/50 border border-white/5 hover:border-white/20 transition-all duration-300"
    >
      {/* Glow effect on hover */}
      <div 
        className={cn(
          "absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm z-0 blur-sm",
          getGlowClass(project.category)
        )}
      ></div>
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Thumbnail with aspect ratio */}
        <div className={cn(
          "overflow-hidden relative",
          project.category === 'image' ? 'aspect-square' : 'aspect-video'
        )}>
          <img
            src={project.thumbnail}
            alt={`${project.title} thumbnail`}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isHovered && "scale-105"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/80 via-transparent to-transparent"></div>
          
          {/* Category badge */}
          <div className="absolute top-2 left-2 flex items-center space-x-2">
            <div className={cn("h-2 w-2 rounded-full animate-pulse", getDotClass(project.category))}></div>
            <span className="text-xs uppercase text-white/80 font-orbitron tracking-wider">
              {project.category}
            </span>
          </div>
          
          {/* Optional tag */}
          {project.tag && (
            <div className="absolute top-2 right-2 bg-cyber-black/50 backdrop-blur-sm border border-white/10 text-white text-xs px-2 py-0.5 rounded-sm">
              {project.tag}
            </div>
          )}
          
          {renderVideoOverlay()}
          
          {/* On hover overlay with button */}
          <div className={cn(
            "absolute inset-0 bg-cyber-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <Button 
              variant={getButtonVariant(project.category) as any} 
              size="sm" 
              onClick={() => window.open(project.url, '_blank')}
              className="transform transition-transform duration-300 hover:scale-105"
            >
              {getButtonText(project.category)}
            </Button>
          </div>
        </div>

        {/* Project info */}
        <div className="p-4">
          <h3 className={cn("text-lg font-orbitron font-bold mb-1 transition-colors duration-300", getTitleClass(project.category))}>
            {project.title}
          </h3>
          <p className="text-white/70 text-sm mb-3 line-clamp-2">
            {truncateText(project.description, 100)}
          </p>

          <div className="flex justify-between items-center text-xs text-white/40 font-space">
            {project.updatedAt ? `Updated: ${formatDate(project.updatedAt)}` : `Created: ${formatDate(project.createdAt)}`}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

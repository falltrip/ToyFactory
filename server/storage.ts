import { users, type User, type InsertUser, projects, type Project, type InsertProject } from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // File handling
  saveFile(file: Express.Multer.File): Promise<string>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private userCurrentId: number;
  private projectCurrentId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.userCurrentId = 1;
    this.projectCurrentId = 1;
    
    // Add some initial projects for demonstration
    this.addInitialProjects();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async getProjectsByCategory(category: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.category === category,
    );
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectCurrentId++;
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: now,
      updatedAt: null
    };
    this.projects.set(id, project);
    return project;
  }
  
  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject: Project = {
      ...project,
      ...updateData,
      updatedAt: new Date()
    };
    
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }
  
  // File handling
  async saveFile(file: Express.Multer.File): Promise<string> {
    // Generate unique filename
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    
    // Create write stream
    const writeStream = fs.createWriteStream(filePath);
    
    return new Promise((resolve, reject) => {
      // Write file
      writeStream.write(file.buffer);
      writeStream.end();
      
      writeStream.on('finish', () => {
        // Return the URL path to the file
        resolve(`/uploads/${fileName}`);
      });
      
      writeStream.on('error', (err) => {
        reject(err);
      });
    });
  }
  
  // Add initial projects for demo
  private addInitialProjects() {
    const now = new Date();
    
    // App projects
    this.projects.set(this.projectCurrentId++, {
      id: 1,
      title: "Neural Network Visualizer",
      description: "An interactive tool that allows users to build, train and visualize neural networks in real-time with intuitive controls.",
      category: "app",
      tag: "INTERACTIVE",
      thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      url: "https://example.com/neural-visualizer",
      videoLength: null,
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)  // 2 days ago
    });
    
    this.projects.set(this.projectCurrentId++, {
      id: 2,
      title: "Waveform Generator",
      description: "Create unique audio visualizations from any sound input. Export as animated GIFs or videos with customizable colors and effects.",
      category: "app",
      tag: "AUDIO",
      thumbnail: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      url: "https://example.com/waveform-generator",
      videoLength: null,
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)   // 3 days ago
    });
    
    this.projects.set(this.projectCurrentId++, {
      id: 3,
      title: "Code Synthesis",
      description: "Advanced code editor with AI-powered completion, syntax visualization, and collaborative features for programmers.",
      category: "app",
      tag: "PRODUCTIVITY",
      thumbnail: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      url: "https://example.com/code-synthesis",
      videoLength: null,
      createdAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
      updatedAt: null
    });
    
    // Game projects
    this.projects.set(this.projectCurrentId++, {
      id: 4,
      title: "Neon Drifter",
      description: "Race through a cyberpunk cityscape on your hoverbike, avoiding obstacles and collecting energy cells to boost your speed.",
      category: "game",
      tag: "ARCADE",
      thumbnail: "https://pixabay.com/get/g3d904f34e3586629319e2366ba2f2143ce7cbeed93dcd778d33822399ae5414767a041a2ad38d3531f794e982f53aecbb3b60864a1b88ff7c5e5b116c6d9a7e7_1280.jpg",
      url: "https://example.com/neon-drifter",
      videoLength: null,
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      updatedAt: null
    });
    
    this.projects.set(this.projectCurrentId++, {
      id: 5,
      title: "Circuit Logic",
      description: "Connect circuits to solve increasingly complex energy flow puzzles. Features 50+ levels with unique mechanics and challenges.",
      category: "game",
      tag: "PUZZLE",
      thumbnail: "https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      url: "https://example.com/circuit-logic",
      videoLength: null,
      createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
      updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)   // 4 days ago
    });
    
    // Image projects
    this.projects.set(this.projectCurrentId++, {
      id: 6,
      title: "Neural Dreams",
      description: "Generated using a custom GAN architecture trained on abstract digital art.",
      category: "image",
      tag: "GENERATIVE",
      thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      url: "https://example.com/neural-dreams",
      videoLength: null,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: null
    });
    
    this.projects.set(this.projectCurrentId++, {
      id: 7,
      title: "Geometric Fractals",
      description: "Recursive geometric patterns generated using custom WebGL shaders.",
      category: "image",
      tag: "PROCEDURAL",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      url: "https://example.com/geometric-fractals",
      videoLength: null,
      createdAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000), // 11 days ago
      updatedAt: null
    });
    
    // Video projects
    this.projects.set(this.projectCurrentId++, {
      id: 8,
      title: "Motion Study 03",
      description: "Abstract visualization of data structures morphing and evolving through geometric transformations.",
      category: "video",
      tag: "ABSTRACT",
      thumbnail: "https://images.unsplash.com/photo-1558507652-2d9626c4e67a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      url: "https://example.com/motion-study-03",
      videoLength: "02:34",
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: null
    });
    
    this.projects.set(this.projectCurrentId++, {
      id: 9,
      title: "Digital Environment",
      description: "Walkthrough of a generated architectural space that responds to sound input and user interaction.",
      category: "video",
      tag: "ENVIRONMENT",
      thumbnail: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      url: "https://example.com/digital-environment",
      videoLength: "04:17",
      createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      updatedAt: null
    });
  }
}

export const storage = new MemStorage();

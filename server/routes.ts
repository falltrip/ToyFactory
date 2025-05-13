import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer for in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Serve uploaded files
const serveStatic = (app: Express) => {
  app.use('/uploads', express.static(UPLOAD_DIR));
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Add API routes prefix
  const apiRouter = express.Router();
  app.use('/api', apiRouter);
  
  // Serve static uploads
  serveStatic(app);

  // Get all projects
  apiRouter.get('/projects', async (req: Request, res: Response) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Failed to fetch projects' });
    }
  });

  // Get a specific project
  apiRouter.get('/projects/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid project ID' });
      }

      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ message: 'Failed to fetch project' });
    }
  });

  // Get projects by category
  apiRouter.get('/projects/category/:category', async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const projects = await storage.getProjectsByCategory(category);
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects by category:', error);
      res.status(500).json({ message: 'Failed to fetch projects' });
    }
  });

  // Create a new project with file upload
  apiRouter.post('/projects', upload.single('thumbnail'), async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'Thumbnail image is required' });
      }

      // Parse and validate project data
      const projectData = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        tag: req.body.tag || null,
        url: req.body.url,
        videoLength: req.body.videoLength || null,
        thumbnail: '' // Will be set after file is saved
      };

      try {
        insertProjectSchema.parse(projectData);
      } catch (validationError) {
        return res.status(400).json({ message: 'Invalid project data', error: validationError });
      }

      // Save the file and get the URL
      const fileUrl = await storage.saveFile(file);
      projectData.thumbnail = fileUrl;

      // Save the project
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ message: 'Failed to create project' });
    }
  });

  // Update a project
  apiRouter.patch('/projects/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid project ID' });
      }

      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const updatedProject = await storage.updateProject(id, req.body);
      res.json(updatedProject);
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ message: 'Failed to update project' });
    }
  });

  // Delete a project
  apiRouter.delete('/projects/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid project ID' });
      }

      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const success = await storage.deleteProject(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: 'Failed to delete project' });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ message: 'Failed to delete project' });
    }
  });

  // Error handler middleware
  apiRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('API Error:', err);
    res.status(500).json({ message: err.message || 'Internal server error' });
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Import express here to avoid "Cannot use import statement outside a module" error
import express from "express";

interface Project {
  id: string;
  name: string;
  progress: number;
  motivation: number;
  priority: number;
  isActive: boolean;
}

const API_URL = 'http://localhost:8080'; // Change this to your server URL

export const projectService = {
  async getAllProjects(): Promise<Project[]> {
    const response = await fetch(`${API_URL}/projects/`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  },

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const response = await fetch(`${API_URL}/projects/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      throw new Error('Failed to create project');
    }
    return response.json();
  },

  async updateProject(project: Project): Promise<Project> {
    const response = await fetch(`${API_URL}/projects/${project.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      throw new Error('Failed to update project');
    }
    return response.json();
  },

  async deleteProject(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  },
}; 
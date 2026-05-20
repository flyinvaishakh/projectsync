import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Plus, Folder } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Changed single quotes '' to backticks ``
      const { data } = await axios.get(`${API_URL}/api/projects`, config);
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Changed single quotes '' to backticks ``
      await axios.post(
        `${API_URL}/api/projects`,
        {
          name: newProjectName,
          description: newProjectDesc,
        },
        config,
      );
      setIsModalOpen(false);
      setNewProjectName("");
      setNewProjectDesc("");
      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <>
      <div className="container animate-fade-in-up">
        <div className="page-header">
          <div>
            <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              Projects Overview
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Manage and track all your team projects
            </p>
          </div>
          <button
            className="premium-btn"
            onClick={() => setIsModalOpen(true)}
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <Plus size={20} />
            New Project
          </button>
        </div>

        <div className="dashboard-grid">
          {projects.map((project) => (
            <Link to={`/project/${project._id}`} key={project._id}>
              <div
                className="premium-card"
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      padding: "10px",
                      background: "rgba(59, 130, 246, 0.1)",
                      borderRadius: "12px",
                      color: "#3b82f6",
                    }}
                  >
                    <Folder size={24} />
                  </div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    {project.name}
                  </h3>
                </div>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    flexGrow: 1,
                    marginBottom: "1.5rem",
                  }}
                >
                  {project.description || "No description provided."}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--border-color)",
                  }}
                >
                  <span
                    className={`status-badge ${project.status.toLowerCase().replace(" ", "")}`}
                  >
                    {project.status}
                  </span>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Owner: {project.owner?.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: "1.5rem" }}>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  className="premium-input"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                  placeholder="e.g., Website Redesign"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="premium-input"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  rows="3"
                  placeholder="Brief description of the project"
                ></textarea>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  marginTop: "2rem",
                }}
              >
                <button
                  type="button"
                  className="premium-btn premium-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="premium-btn">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

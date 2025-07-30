// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const projectService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "Tags"
            }
          },
          {
            field: {
              Name: "Owner"
            }
          },
          {
            field: {
              Name: "title"
            }
          },
          {
            field: {
              Name: "description"
            }
          },
          {
            field: {
              Name: "status"
            }
          },
          {
            field: {
              Name: "deadline"
            }
          },
          {
            field: {
              Name: "createdAt"
            }
          },
          {
            field: {
              Name: "updatedAt"
            }
          },
          {
            field: {
              Name: "completionPercentage"
            }
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching projects:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching projects:", error.message);
        throw error;
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "Tags"
            }
          },
          {
            field: {
              Name: "Owner"
            }
          },
          {
            field: {
              Name: "title"
            }
          },
          {
            field: {
              Name: "description"
            }
          },
          {
            field: {
              Name: "status"
            }
          },
          {
            field: {
              Name: "deadline"
            }
          },
          {
            field: {
              Name: "createdAt"
            }
          },
          {
            field: {
              Name: "updatedAt"
            }
          },
          {
            field: {
              Name: "completionPercentage"
            }
          }
        ]
      };
      
      const response = await apperClient.getRecordById('project', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching project with ID ${id}:`, error.message);
        throw error;
      }
    }
  },

  async create(projectData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: projectData.Name,
        Tags: projectData.Tags,
        Owner: parseInt(projectData.Owner) || null,
        title: projectData.title,
        description: projectData.description,
        status: projectData.status,
        deadline: projectData.deadline,
        createdAt: projectData.createdAt,
        updatedAt: projectData.updatedAt,
        completionPercentage: projectData.completionPercentage || 0
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create project ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create project");
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating project:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating project:", error.message);
        throw error;
      }
    }
  },

  async update(id, projectData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: projectData.Name,
        Tags: projectData.Tags,
        Owner: parseInt(projectData.Owner) || null,
        title: projectData.title,
        description: projectData.description,
        status: projectData.status,
        deadline: projectData.deadline,
        createdAt: projectData.createdAt,
        updatedAt: projectData.updatedAt,
        completionPercentage: projectData.completionPercentage
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update project ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || "Failed to update project");
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating project:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating project:", error.message);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete project ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete project");
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting project:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting project:", error.message);
        throw error;
      }
    }
  },

  async updateProgress(id, percentage) {
    try {
      const updateableData = {
        Id: parseInt(id),
        completionPercentage: percentage
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update project progress ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || "Failed to update project progress");
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating project progress:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating project progress:", error.message);
        throw error;
      }
    }
  },

  async getByDateRange(startDate, endDate) {
    try {
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "Tags"
            }
          },
          {
            field: {
              Name: "Owner"
            }
          },
          {
            field: {
              Name: "title"
            }
          },
          {
            field: {
              Name: "description"
            }
          },
          {
            field: {
              Name: "status"
            }
          },
          {
            field: {
              Name: "deadline"
            }
          },
          {
            field: {
              Name: "createdAt"
            }
          },
          {
            field: {
              Name: "updatedAt"
            }
          },
          {
            field: {
              Name: "completionPercentage"
            }
          }
        ],
        where: [
          {
            FieldName: "deadline",
            Operator: "GreaterThanOrEqualTo",
            Values: [startDate]
          },
          {
            FieldName: "deadline",
            Operator: "LessThanOrEqualTo",
            Values: [endDate]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching projects by date range:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching projects by date range:", error.message);
        throw error;
      }
    }
  }
};
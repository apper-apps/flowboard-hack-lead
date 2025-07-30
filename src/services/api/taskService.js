// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const taskService = {
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
              Name: "priority"
            }
          },
          {
            field: {
              Name: "dueDate"
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
              Name: "projectId"
            }
          },
          {
            field: {
              Name: "assigneeId"
            }
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching tasks:", error.message);
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
              Name: "priority"
            }
          },
          {
            field: {
              Name: "dueDate"
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
              Name: "projectId"
            }
          },
          {
            field: {
              Name: "assigneeId"
            }
          }
        ]
      };
      
      const response = await apperClient.getRecordById('task', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching task with ID ${id}:`, error.message);
        throw error;
      }
    }
  },

  async getByProject(projectId) {
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
              Name: "priority"
            }
          },
          {
            field: {
              Name: "dueDate"
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
              Name: "projectId"
            }
          },
          {
            field: {
              Name: "assigneeId"
            }
          }
        ],
        where: [
          {
            FieldName: "projectId",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by project:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching tasks by project:", error.message);
        throw error;
      }
    }
  },

  async getByAssignee(assigneeId) {
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
              Name: "priority"
            }
          },
          {
            field: {
              Name: "dueDate"
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
              Name: "projectId"
            }
          },
          {
            field: {
              Name: "assigneeId"
            }
          }
        ],
        where: [
          {
            FieldName: "assigneeId",
            Operator: "EqualTo",
            Values: [parseInt(assigneeId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by assignee:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching tasks by assignee:", error.message);
        throw error;
      }
    }
  },

  async create(taskData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: taskData.Name,
        Tags: taskData.Tags,
        Owner: parseInt(taskData.Owner) || null,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        createdAt: taskData.createdAt,
        updatedAt: taskData.updatedAt,
        projectId: parseInt(taskData.projectId) || null,
        assigneeId: parseInt(taskData.assigneeId) || null
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create task ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create task");
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating task:", error.message);
        throw error;
      }
    }
  },

  async update(id, taskData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: taskData.Name,
        Tags: taskData.Tags,
        Owner: parseInt(taskData.Owner) || null,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        createdAt: taskData.createdAt,
        updatedAt: taskData.updatedAt,
        projectId: parseInt(taskData.projectId) || null,
        assigneeId: parseInt(taskData.assigneeId) || null
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update task ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || "Failed to update task");
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating task:", error.message);
        throw error;
      }
    }
  },

  async updateStatus(id, status) {
    try {
      const updateableData = {
        Id: parseInt(id),
        status: status
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update task status ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || "Failed to update task status");
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task status:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating task status:", error.message);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete task ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete task");
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting task:", error.message);
        throw error;
      }
    }
  },

  async search(query) {
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
              Name: "priority"
            }
          },
          {
            field: {
              Name: "dueDate"
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
              Name: "projectId"
            }
          },
          {
            field: {
              Name: "assigneeId"
            }
          }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title",
                    operator: "Contains",
                    subOperator: "",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "description",
                    operator: "Contains",
                    subOperator: "",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "Tags",
                    operator: "Contains",
                    subOperator: "",
                    values: [query]
                  }
                ],
                operator: "OR"
              }
            ]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching tasks:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error searching tasks:", error.message);
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
              Name: "priority"
            }
          },
          {
            field: {
              Name: "dueDate"
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
              Name: "projectId"
            }
          },
          {
            field: {
              Name: "assigneeId"
            }
          }
        ],
        where: [
          {
            FieldName: "dueDate",
            Operator: "GreaterThanOrEqualTo",
            Values: [startDate]
          },
          {
            FieldName: "dueDate",
            Operator: "LessThanOrEqualTo",
            Values: [endDate]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by date range:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching tasks by date range:", error.message);
        throw error;
      }
    }
  },

  async updateDueDate(id, dueDate) {
    try {
      const updateableData = {
        Id: parseInt(id),
        dueDate: dueDate
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update task due date ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || "Failed to update task due date");
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task due date:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating task due date:", error.message);
        throw error;
      }
    }
  }
};
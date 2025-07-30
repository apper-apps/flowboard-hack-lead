// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const commentService = {
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
              Name: "taskId"
            }
          },
          {
            field: {
              Name: "userId"
            }
          },
          {
            field: {
              Name: "content"
            }
          },
          {
            field: {
              Name: "createdAt"
            }
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('app_Comment', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching comments:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching comments:", error.message);
        throw error;
      }
    }
  },

  async getByTask(taskId) {
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
              Name: "taskId"
            }
          },
          {
            field: {
              Name: "userId"
            }
          },
          {
            field: {
              Name: "content"
            }
          },
          {
            field: {
              Name: "createdAt"
            }
          }
        ],
        where: [
          {
            FieldName: "taskId",
            Operator: "EqualTo",
            Values: [parseInt(taskId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('app_Comment', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching comments by task:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching comments by task:", error.message);
        throw error;
      }
    }
  },

  async create(commentData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: commentData.Name,
        Tags: commentData.Tags,
        Owner: parseInt(commentData.Owner) || null,
        taskId: parseInt(commentData.taskId) || null,
        userId: parseInt(commentData.userId) || null,
        content: commentData.content,
        createdAt: commentData.createdAt
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord('app_Comment', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create comment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create comment");
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating comment:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating comment:", error.message);
        throw error;
      }
    }
  },

  async update(id, commentData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: commentData.Name,
        Tags: commentData.Tags,
        Owner: parseInt(commentData.Owner) || null,
        taskId: parseInt(commentData.taskId) || null,
        userId: parseInt(commentData.userId) || null,
        content: commentData.content,
        createdAt: commentData.createdAt
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('app_Comment', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update comment ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || "Failed to update comment");
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating comment:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating comment:", error.message);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('app_Comment', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete comment ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete comment");
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting comment:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting comment:", error.message);
        throw error;
      }
    }
  }
};
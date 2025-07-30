// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const userService = {
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
              Name: "email"
            }
          },
          {
            field: {
              Name: "avatar"
            }
          },
          {
            field: {
              Name: "role"
            }
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('app_User', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching users:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching users:", error.message);
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
              Name: "email"
            }
          },
          {
            field: {
              Name: "avatar"
            }
          },
          {
            field: {
              Name: "role"
            }
          }
        ]
      };
      
      const response = await apperClient.getRecordById('app_User', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching user with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching user with ID ${id}:`, error.message);
        throw error;
      }
    }
  },

  async create(userData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: userData.Name,
        Tags: userData.Tags,
        Owner: parseInt(userData.Owner) || null,
        email: userData.email,
        avatar: userData.avatar,
        role: userData.role
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord('app_User', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create user ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create user");
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating user:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating user:", error.message);
        throw error;
      }
    }
  },

  async update(id, userData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: userData.Name,
        Tags: userData.Tags,
        Owner: parseInt(userData.Owner) || null,
        email: userData.email,
        avatar: userData.avatar,
        role: userData.role
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('app_User', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update user ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || "Failed to update user");
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating user:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating user:", error.message);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('app_User', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete user ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete user");
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting user:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting user:", error.message);
        throw error;
      }
    }
  }
};
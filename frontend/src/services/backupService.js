import axios from './axios';

export const backupService = {
  getBackupStatus: async () => {
    return axios.get('/api/admin/backup/status');
  },

  getBackupLogs: async () => {
    return axios.get('/api/admin/backup/logs');
  },

  triggerManualBackup: async () => {
    return axios.post('/api/admin/backup/trigger');
  },

  updateBackupConfig: async (configData) => {
    return axios.post('/api/admin/backup/config', configData);
  }
};

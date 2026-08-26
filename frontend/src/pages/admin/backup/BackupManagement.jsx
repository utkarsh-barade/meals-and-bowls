import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backupService } from '@/services/backupService';
import {
  Database,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Settings,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export default function BackupManagement() {
  const queryClient = useQueryClient();
  const [sheetIdInput, setSheetIdInput] = useState('');
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Fetch Backup Status & Config
  const { data: statusData, isLoading, isError, refetch } = useQuery({
    queryKey: ['backup-status'],
    queryFn: async () => {
      const res = await backupService.getBackupStatus();
      return res.data?.data;
    },
    refetchInterval: 10000,
  });

  const config = statusData?.config;
  const lastLog = statusData?.lastLog;

  useEffect(() => {
    if (config) {
      if (config.googleSheetId !== undefined) {
        setSheetIdInput(config.googleSheetId || '');
      }
      if (config.autoBackupEnabled !== undefined) {
        setAutoBackupEnabled(config.autoBackupEnabled);
      }
    }
  }, [config]);

  // Mutation: Trigger Manual Backup
  const triggerMutation = useMutation({
    mutationFn: () => backupService.triggerManualBackup(),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['backup-status']);
      if (res.data?.success) {
        setFeedback({ type: 'success', message: 'Manual backup completed successfully!' });
      } else {
        setFeedback({ type: 'error', message: res.data?.message || 'Backup failed' });
      }
    },
    onError: (err) => {
      setFeedback({ type: 'error', message: err?.response?.data?.message || err.message || 'Failed to trigger backup' });
    },
  });

  // Mutation: Update Settings
  const configMutation = useMutation({
    mutationFn: (data) => backupService.updateBackupConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['backup-status']);
      setFeedback({ type: 'success', message: 'Backup settings updated successfully!' });
    },
    onError: (err) => {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to update settings' });
    },
  });

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setFeedback(null);
    configMutation.mutate({
      googleSheetId: sheetIdInput,
      autoBackupEnabled: autoBackupEnabled,
    });
  };

  const formattedLastTime = lastLog?.timestamp
    ? new Date(lastLog.timestamp).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      })
    : 'No backup recorded yet';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-surface-border shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <Database size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
              Data Backup & Google Sheets Sync
            </h1>
            <p className="text-small text-text-secondary">
              Automated Daily 12:00 AM Midnight Data Backup & Live Google Sheets Sync
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="p-2.5 text-text-secondary hover:text-text-primary bg-surface-muted hover:bg-surface-border rounded-xl transition-colors"
            title="Refresh Status"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={() => {
              setFeedback(null);
              triggerMutation.mutate();
            }}
            disabled={triggerMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            {triggerMutation.isPending ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Zap size={18} className="text-amber-300 fill-amber-300" />
            )}
            <span>{triggerMutation.isPending ? 'Backing up...' : 'Backup Now'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={cn(
            'p-4 rounded-xl flex items-start gap-3 border text-small font-medium',
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          )}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">{feedback.message}</div>
          <button
            onClick={() => setFeedback(null)}
            className="text-text-secondary hover:text-text-primary text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Schedule */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold uppercase text-text-secondary">
              Auto Schedule
            </span>
            <Clock size={20} className="text-blue-500" />
          </div>
          <div className="mt-3">
            <p className="text-lg font-bold text-text-primary">Daily 12:00 AM</p>
            <p className="text-caption text-text-secondary mt-0.5">
              {config?.autoBackupEnabled ? '🟢 Active (Midnight IST)' : '🔴 Auto Backup Paused'}
            </p>
          </div>
        </div>

        {/* Card 2: Last Backup Status */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold uppercase text-text-secondary">
              Last Backup
            </span>
            {lastLog?.status === 'SUCCESS' ? (
              <CheckCircle2 size={20} className="text-emerald-500" />
            ) : (
              <AlertTriangle size={20} className="text-red-500" />
            )}
          </div>
          <div className="mt-3">
            <span
              className={cn(
                'inline-block px-2.5 py-0.5 rounded-full text-caption font-bold uppercase',
                lastLog?.status === 'SUCCESS'
                  ? 'bg-emerald-100 text-emerald-800'
                  : lastLog?.status === 'FAILED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-700'
              )}
            >
              {lastLog?.status || 'NO DATA'}
            </span>
            <p className="text-caption text-text-secondary mt-1 truncate" title={formattedLastTime}>
              {formattedLastTime}
            </p>
          </div>
        </div>

        {/* Card 3: Total Synced */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold uppercase text-text-secondary">
              Synced Records
            </span>
            <ShieldCheck size={20} className="text-indigo-500" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-text-primary">
              {lastLog?.totalRecords !== undefined ? lastLog.totalRecords : 0}
            </p>
            <p className="text-caption text-text-secondary mt-0.5">
              Customers, Subscriptions & Payments
            </p>
          </div>
        </div>

        {/* Card 4: Open Google Sheet */}
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold uppercase text-text-secondary">
              Google Sheet
            </span>
            <FileSpreadsheet size={20} className="text-emerald-600" />
          </div>
          <div className="mt-3">
            {config?.googleSheetId ? (
              <a
                href={`https://docs.google.com/spreadsheets/d/${config.googleSheetId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-small font-semibold transition-colors"
              >
                <span>Open Sheet</span>
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="text-caption text-amber-600 font-medium">Sheet ID Not Set</span>
            )}
          </div>
        </div>
      </div>

      {/* Configuration & Setup Form */}
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-surface-border pb-3">
          <Settings size={20} className="text-primary" />
          <h2 className="text-lg font-bold text-text-primary">Google Sheets Configuration</h2>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-small font-semibold text-text-primary">
                Google Sheet ID
              </label>
              <input
                type="text"
                value={sheetIdInput}
                onChange={(e) => setSheetIdInput(e.target.value)}
                placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                className="w-full px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-small"
              />
              <p className="text-caption text-text-secondary">
                Google Sheet URL se ID copy karein: <code className="bg-surface-muted px-1.5 py-0.5 rounded">docs.google.com/spreadsheets/d/<b>[SHEET_ID]</b>/edit</code>
              </p>
            </div>

            <div className="flex items-center gap-3 h-11 px-4 border border-surface-border rounded-xl bg-surface-muted/50">
              <input
                type="checkbox"
                id="autoBackupToggle"
                checked={autoBackupEnabled}
                onChange={(e) => setAutoBackupEnabled(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-surface-border focus:ring-primary"
              />
              <label htmlFor="autoBackupToggle" className="text-small font-semibold text-text-primary cursor-pointer">
                Daily 12:00 AM Auto Backup
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={configMutation.isPending}
              className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              {configMutation.isPending ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>

        {/* Setup Instructions */}
        <div className="mt-6 p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-small text-amber-900 space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-amber-900">
            📌 Setup Instructions:
          </p>
          <ul className="list-disc list-inside space-y-1 text-caption text-amber-800">
            <li>Google Cloud Console se ek <b>Service Account JSON Key</b> download karein aur project root me <code>credentials.json</code> naam se save karein.</li>
            <li>Apni Google Sheet ko open karein aur Service Account wali Email Address ko <b>Editor</b> permission de dein.</li>
          </ul>
        </div>
      </div>

      {/* Backup History Section */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-surface-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Clock size={18} />
            <span>Backup Execution Logs</span>
          </h2>
          <span className="text-caption text-text-secondary">
            Showing last 20 execution attempts
          </span>
        </div>

        {statusData?.recentLogsCount > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-small">
              <thead className="bg-surface-muted text-text-secondary font-semibold border-b border-surface-border">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Trigger Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Synced Records</th>
                  <th className="px-6 py-3">Message / Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {statusData?.lastLog && (
                  <tr key={statusData.lastLog.id || 'latest'} className="hover:bg-surface-muted/40">
                    <td className="px-6 py-4 font-medium text-text-primary">
                      {new Date(statusData.lastLog.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-caption font-bold',
                          statusData.lastLog.triggerType === 'AUTOMATIC'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        )}
                      >
                        {statusData.lastLog.triggerType || 'AUTOMATIC'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-caption font-bold',
                          statusData.lastLog.status === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        )}
                      >
                        {statusData.lastLog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-text-primary">
                      {statusData.lastLog.totalRecords}
                    </td>
                    <td className="px-6 py-4 text-caption text-text-secondary">
                      {statusData.lastLog.errorMessage ? (
                        <span className="text-red-600 font-medium">{statusData.lastLog.errorMessage}</span>
                      ) : (
                        <span className="text-emerald-600 font-medium">Successfully synced to Google Sheet</span>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-text-secondary">
            <Database size={40} className="mx-auto mb-3 text-text-placeholder" />
            <p className="font-semibold text-text-primary">No backup logs found</p>
            <p className="text-caption text-text-secondary mt-1">
              Click "Backup Now" above to trigger your first manual backup sync.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

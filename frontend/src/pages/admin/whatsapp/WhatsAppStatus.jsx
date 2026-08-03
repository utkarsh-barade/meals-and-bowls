import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/services/axios';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CheckCircle, XCircle, RefreshCw, Send, Wifi } from 'lucide-react';

const whatsappService = {
  getStatus: () => axios.get('/api/admin/whatsapp/status'),
  flushQueue: () => axios.post('/api/admin/whatsapp/flush-queue'),
};

export default function WhatsAppStatus() {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['wa-gateway-status'],
    queryFn: whatsappService.getStatus,
    refetchInterval: 8000, // Poll every 8 seconds
  });

  const { mutate: flushQueue, isPending: isFlushing } = useMutation({
    mutationFn: whatsappService.flushQueue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wa-gateway-status'] });
    },
  });

  const statusData = data?.data?.data;
  const connected = statusData?.connected === true;
  const qrCode = statusData?.qrCode;
  const queueLength = statusData?.queueLength ?? 0;
  const configured = statusData?.configured !== false;
  const error = statusData?.error;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-page-title text-text-primary">WhatsApp Status</h1>
        <Button
          variant="secondary"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['wa-gateway-status'] })}
          disabled={isFetching}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Connection Status Card */}
      <Card>
        <Card.Body>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-text-secondary" />
              <h2 className="text-section-title text-text-primary font-semibold">
                Gateway Status
              </h2>
            </div>
            {isFetching && (
              <span className="text-caption text-text-secondary animate-pulse">Checking...</span>
            )}
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-text-secondary">Loading status...</div>
          ) : !configured ? (
            <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/30 rounded-lg">
              <XCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-warning">Gateway Not Configured</p>
                <p className="text-small text-text-secondary mt-1">
                  <code className="bg-surface-hover px-1 py-0.5 rounded text-xs">WA_GATEWAY_URL</code> environment
                  variable is not set in Render Backend settings.
                </p>
              </div>
            </div>
          ) : connected ? (
            <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <div>
                <p className="font-semibold text-success">WhatsApp Connected</p>
                <p className="text-small text-text-secondary mt-0.5">
                  Messages will be delivered via WhatsApp (Free).
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-danger/10 border border-danger/30 rounded-lg">
                <XCircle className="w-5 h-5 text-danger mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-danger">WhatsApp Disconnected</p>
                  <p className="text-small text-text-secondary mt-0.5">
                    Scan the QR code below with your WhatsApp Business app to connect.
                    {queueLength > 0 && (
                      <span className="ml-1 font-medium text-warning">
                        ({queueLength} message{queueLength > 1 ? 's' : ''} pending in queue)
                      </span>
                    )}
                  </p>
                  {error && (
                    <p className="text-caption text-danger/70 mt-1 font-mono">{error}</p>
                  )}
                </div>
              </div>

              {/* QR Code */}
              {qrCode ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <p className="text-small text-text-secondary font-medium">
                    Open WhatsApp &rarr; Linked Devices &rarr; Link a Device &rarr; Scan this QR
                  </p>
                  <div className="p-3 bg-white border-2 border-primary/20 rounded-xl shadow-sm">
                    <img
                      src={qrCode}
                      alt="WhatsApp QR Code"
                      className="w-56 h-56"
                    />
                  </div>
                  <p className="text-caption text-text-secondary">QR refreshes every 8 seconds automatically</p>
                </div>
              ) : (
                <div className="py-6 text-center text-text-secondary">
                  <p className="text-small">Waiting for QR code from gateway...</p>
                  <p className="text-caption mt-1">Make sure the wa-gateway service is running on Railway/Render.</p>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Queue Card */}
      {configured && (
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-section-title text-text-primary font-semibold">Pending Queue</h2>
                <p className="text-small text-text-secondary mt-1">
                  Messages queued when WhatsApp was disconnected.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-bold ${queueLength > 0 ? 'text-warning' : 'text-success'}`}>
                  {queueLength}
                </span>
                {connected && queueLength > 0 && (
                  <Button
                    variant="primary"
                    onClick={() => flushQueue()}
                    disabled={isFlushing}
                    className="flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isFlushing ? 'Sending...' : 'Send All Now'}
                  </Button>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* How it works */}
      <Card>
        <Card.Body>
          <h2 className="text-section-title text-text-primary font-semibold mb-3">How It Works</h2>
          <ol className="space-y-2 text-small text-text-secondary list-decimal list-inside">
            <li>Scan the QR code with your WhatsApp Business app to connect.</li>
            <li>Once connected, all meal notifications go via <strong>WhatsApp (Free)</strong>.</li>
            <li>If WhatsApp disconnects, messages are <strong>queued</strong> + SMS fallback fires instantly.</li>
            <li>Re-scan QR anytime to reconnect. Queued messages auto-send on reconnect.</li>
          </ol>
        </Card.Body>
      </Card>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { customerPortalService } from '@/services/customerPortalService';
import Card from '@/components/ui/Card';
import { User, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Profile() {
  const { logout } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['customer-profile'],
    queryFn: customerPortalService.getProfile
  });

  if (isLoading) return <div className="p-4">Loading profile...</div>;
  if (error) return <div className="p-4 text-danger">Failed to load profile.</div>;

  const profile = data?.data;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-page-title text-text-primary">Profile</h1>
        <p className="text-small text-text-secondary">Your account details</p>
      </div>

      <Card>
        <Card.Body>
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            {/* Photo */}
            <div className="w-32 h-32 rounded-2xl bg-surface-muted border-2 border-surface-border overflow-hidden flex-shrink-0 flex items-center justify-center">
              {profile?.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = ''; }} // fallback handled by CSS/empty state if needed
                />
              ) : (
                <User className="w-12 h-12 text-text-placeholder" />
              )}
            </div>

            {/* Details */}
            <div className="flex-1 text-center sm:text-left space-y-4">
              <div>
                <h2 className="text-h3 font-bold text-text-primary">{profile?.fullName}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-text-secondary mt-1">
                  <Phone className="w-4 h-4" />
                  <span>{profile?.mobileNumber}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-surface-border">
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-surface-muted text-text-primary hover:bg-surface-border transition-colors rounded-btn font-medium text-small"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

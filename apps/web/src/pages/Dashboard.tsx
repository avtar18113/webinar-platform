import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { apiListWebinars } from "../api/webinars";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recentWebinars, setRecentWebinars] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalWebinars: 0,
    registeredWebinars: 0,
    completedWebinars: 0,
    upcomingWebinars: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const res = await apiListWebinars();
      if (res.ok && res.webinars) {
        setRecentWebinars(res.webinars.slice(0, 3));
        
        // Calculate stats based on user role
        const total = res.webinars.length;
        const upcoming = res.webinars.filter((w: any) => 
          w.status?.toLowerCase() === 'upcoming'
        ).length;
        const completed = res.webinars.filter((w: any) => 
          w.status?.toLowerCase() === 'completed'
        ).length;
        const live = res.webinars.filter((w: any) => 
          w.status?.toLowerCase() === 'live'
        ).length;

        setStats({
          totalWebinars: total,
          registeredWebinars: 0, // This would come from user's registered webinars
          completedWebinars: completed,
          upcomingWebinars: upcoming + live
        });
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'live':
        return 'var(--danger)';
      case 'upcoming':
        return '#10b981';
      case 'completed':
        return 'var(--muted)';
      default:
        return 'var(--muted)';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <div className="card" style={{
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      transition: 'transform 0.2s ease',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: `linear-gradient(135deg, ${color || 'var(--primary)'}20, transparent)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color || 'var(--primary)'
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>{value}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: '24px 16px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px' 
          }}>
            <div style={{ 
              padding: '16px 32px', 
              background: 'var(--card)', 
              borderRadius: '100px',
              color: 'var(--muted)',
              border: '1px solid var(--border)'
            }}>
              Loading dashboard...
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '24px 16px', maxWidth: '1200px' }}>
        {/* Welcome Header */}
        <div style={{
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 700, 
              color: 'var(--text)',
              marginBottom: '8px'
            }}>
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p style={{ color: 'var(--muted)' }}>
              Here's what's happening with your webinars today
            </p>
          </div>
          
          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link 
              to="/webinars" 
              className="btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Browse Webinars
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <StatCard
            title="Total Webinars"
            value={stats.totalWebinars}
            color="var(--primary)"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <line x1="8" y1="10" x2="16" y2="10" />
              </svg>
            }
          />
          <StatCard
            title="Registered"
            value={stats.registeredWebinars}
            color="#10b981"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
          />
          <StatCard
            title="Upcoming"
            value={stats.upcomingWebinars}
            color="#f59e0b"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
          />
          <StatCard
            title="Completed"
            value={stats.completedWebinars}
            color="#8b5cf6"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            }
          />
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Left Column - Recent Webinars */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)' }}>
                Recent Webinars
              </h3>
              <Link to="/webinars" style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>
                View all →
              </Link>
            </div>

            {recentWebinars.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentWebinars.map((webinar) => (
                  <div 
                    key={webinar.id}
                    className="card"
                    style={{
                      padding: '16px',
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => navigate(`/webinars/${webinar.slug}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.background = 'var(--bg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.background = 'var(--card)';
                    }}
                  >
                    <img 
                      src={webinar.thumbnailUrl} 
                      alt={webinar.title}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{webinar.title}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '4px' }}>
                        {new Date(webinar.startAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <span style={{
                        background: getStatusColor(webinar.status),
                        color: '#ffffff',
                        padding: '2px 8px',
                        borderRadius: '100px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-block'
                      }}>
                        {webinar.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                color: 'var(--muted)',
                border: '1px dashed var(--border)',
                borderRadius: '12px'
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '12px', opacity: 0.5 }}>
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <line x1="8" y1="10" x2="16" y2="10" />
                </svg>
                <p>No webinars available</p>
                <Link to="/webinars" className="btn" style={{ marginTop: '12px', display: 'inline-block' }}>
                  Browse Webinars
                </Link>
              </div>
            )}
          </div>

          {/* Right Column - User Profile & Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Profile Card */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), #60a5fa)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 600
                }}>
                  {user?.name ? getInitials(user.name) : 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '4px' }}>{user?.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{user?.email}</div>
                  <div style={{ 
                    display: 'inline-block',
                    marginTop: '8px',
                    background: 'var(--primary)20',
                    color: 'var(--primary)',
                    padding: '2px 8px',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {user?.role || 'Attendee'}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--muted)' }}>Member since</span>
                  <span style={{ fontWeight: 500 }}>February 2026</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Last active</span>
                  <span style={{ fontWeight: 500 }}>Just now</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text)' }}>
                Quick Actions
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  className="btn ghost"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    justifyContent: 'flex-start',
                    padding: '12px',
                    width: '100%'
                  }}
                  onClick={() => navigate('/webinars')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <line x1="8" y1="10" x2="16" y2="10" />
                  </svg>
                  Browse All Webinars
                </button>

                <button 
                  className="btn ghost"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    justifyContent: 'flex-start',
                    padding: '12px',
                    width: '100%'
                  }}
                  onClick={() => navigate('/webinars?filter=upcoming')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Upcoming Webinars
                </button>

                <button 
                  className="btn ghost"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    justifyContent: 'flex-start',
                    padding: '12px',
                    width: '100%'
                  }}
                  onClick={() => navigate('/webinars?filter=registered')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  My Registered Webinars
                </button>

                <button 
                  className="btn ghost"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    justifyContent: 'flex-start',
                    padding: '12px',
                    width: '100%'
                  }}
                  onClick={logout}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span style={{ color: 'var(--danger)' }}>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Now Section (if any live webinars) */}
        {recentWebinars.some(w => w.status?.toLowerCase() === 'live') && (
          <div className="card" style={{ 
            padding: '24px',
            background: 'linear-gradient(135deg, var(--danger)10, transparent)',
            borderLeft: '4px solid var(--danger)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{
                background: 'var(--danger)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '100px',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  background: 'white', 
                  borderRadius: '50%',
                  animation: 'pulse 1.5s infinite'
                }} />
                LIVE NOW
              </div>
              <span style={{ color: 'var(--text)' }}>
                A webinar is currently live! Join now to participate.
              </span>
              <button 
                className="btn"
                style={{ marginLeft: 'auto' }}
                onClick={() => {
                  const liveWebinar = recentWebinars.find(w => w.status?.toLowerCase() === 'live');
                  if (liveWebinar) navigate(`/webinars/${liveWebinar.id}/lobby`);
                }}
              >
                Join Live Session
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add animations */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { User, SocialLinks, SocialAccount } from '../types';
import { db } from '../db';
import { socket } from '../socket';
import { api } from '../api';

interface ProfilePageProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(user.bio);
  const [editedTheme, setEditedTheme] = useState(user.themeColor);
  const [editedSocials, setEditedSocials] = useState<SocialLinks>({ ...user.socials });
  
  // Verification states
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [tempEmail, setTempEmail] = useState(user.email);
  const [tempPhone, setTempPhone] = useState(user.phoneNumber || '');
  const [emailTimer, setEmailTimer] = useState(0);
  const [phoneTimer, setPhoneTimer] = useState(0);
  const [loading, setLoading] = useState<'email' | 'phone' | string | null>(null);
  
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl);
  const [bannerPreview, setBannerPreview] = useState(user.profileBanner);
  const [bannerVideoPreview, setBannerVideoPreview] = useState(user.profileBannerVideo);
  const [uploading, setUploading] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let interval: any;
    if (emailTimer > 0) {
      interval = setInterval(() => setEmailTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emailTimer]);

  useEffect(() => {
    let interval: any;
    if (phoneTimer > 0) {
      interval = setInterval(() => setPhoneTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [phoneTimer]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      bio: editedBio,
      themeColor: editedTheme,
      avatarUrl: avatarPreview,
      profileBanner: bannerPreview,
      profileBannerVideo: bannerVideoPreview,
      socials: editedSocials
    };
    db.updateUser(updatedUser);
    setUser(updatedUser);
    socket.emit('USER_UPDATE', updatedUser);
    setIsEditing(false);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const maxSize = isVideo ? 10 * 1024 * 1024 : 2 * 1024 * 1024; // 10MB for video, 2MB for images

      if (file.size > maxSize) {
        alert(`Tactical Warning: File size exceeds ${isVideo ? '10MB' : '2MB'} limit.`);
        return;
      }

      setUploading(type);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'avatar') {
          setAvatarPreview(base64String);
        } else {
          if (isVideo) {
            setBannerVideoPreview(base64String);
            setIsPlaying(true);
            // Don't clear banner image, it acts as a poster/fallback
          } else {
            setBannerPreview(base64String);
            setBannerVideoPreview(undefined); // Clear video if new image uploaded
          }
        }
        setUploading(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startVerification = async (type: 'email' | 'phone') => {
    setLoading(type);
    try {
      await api.verification.requestCode(type, type === 'email' ? tempEmail : tempPhone);
      if (type === 'email') {
        setVerifyingEmail(true);
        setEmailTimer(60);
      } else {
        setVerifyingPhone(true);
        setPhoneTimer(60);
      }
    } catch (e) {
      alert("Relay Failure: Could not dispatch code.");
    } finally {
      setLoading(null);
    }
  };

  const confirmVerification = async (type: 'email' | 'phone') => {
    setLoading(type);
    try {
      const code = type === 'email' ? emailCode : phoneCode;
      const updatedUser = await api.verification.confirmCode(user.id, type, code);
      setUser(updatedUser);
      if (type === 'email') setVerifyingEmail(false);
      else setVerifyingPhone(false);
    } catch (e: any) {
      alert(e.message || "Invalid Decryption Key.");
    } finally {
      setLoading(null);
    }
  };

  const simulateSocialVerification = async (platform: keyof SocialLinks) => {
    // Fix: Add type guard to ensure platform points to a SocialAccount object
    const account = editedSocials[platform];
    if (typeof account !== 'object' || account === null || !('handle' in account) || !account.handle) return;
    
    setLoading(platform);
    await new Promise(r => setTimeout(r, 1500));
    setEditedSocials(prev => ({
      ...prev,
      // Fix: Spread explicitly cast object to satisfy TS compiler requirements
      [platform]: { ...(account as SocialAccount), verified: true }
    }));
    setLoading(null);
  };

  const handleSocialChange = (platform: keyof SocialLinks, handle: string) => {
    // Fix: Handle potential string vs object type for SocialLinks values based on current key
    const existing = editedSocials[platform];
    const isVerified = (typeof existing === 'object' && existing !== null && 'verified' in existing) ? existing.verified : false;
    
    setEditedSocials(prev => ({
      ...prev,
      [platform]: { handle, verified: isVerified || false }
    }));
  };

  const themes = [
    { name: 'Cyan Pulse', color: '#06b6d4' },
    { name: 'Purple Neon', color: '#a855f7' },
    { name: 'Emerald Edge', color: '#10b981' },
    { name: 'Amber Glow', color: '#f59e0b' },
    { name: 'Rose Rage', color: '#f43f5e' }
  ];

  const securityScore = [user.isEmailVerified, user.isPhoneVerified, user.isVIP].filter(Boolean).length;
  const securityPercent = (securityScore / 3) * 100;
  const currentTheme = isEditing ? editedTheme : user.themeColor;

  const platforms: { id: keyof SocialLinks, label: string, icon: string, color: string }[] = [
    { id: 'twitch', label: 'Twitch', icon: '👾', color: '#a855f7' },
    { id: 'youtube', label: 'YouTube', icon: '📺', color: '#ef4444' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵', color: '#ec4899' }
  ];

  const currentVideo = isEditing ? bannerVideoPreview : user.profileBannerVideo;
  const currentBanner = isEditing ? bannerPreview : user.profileBanner;

  return (
    <div 
      className="space-y-8 animate-in fade-in zoom-in-95 duration-500"
      style={{ '--theme-accent': currentTheme } as React.CSSProperties}
    >
      {/* Profile Header */}
      <div className="relative rounded-[40px] overflow-hidden gamer-border shadow-2xl group/banner bg-slate-900/40" style={{ borderColor: `${currentTheme}20` }}>
        <div className="h-56 md:h-72 relative overflow-hidden bg-slate-950">
          {currentVideo ? (
            <div className="absolute inset-0 w-full h-full">
               <video 
                ref={videoRef}
                src={currentVideo} 
                autoPlay 
                loop 
                muted={isMuted} 
                playsInline
                className="w-full h-full object-cover transition-transform duration-1000 group-hover/banner:scale-105"
              />
              <div className="absolute bottom-6 right-6 z-40 flex items-center gap-2">
                <button 
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause background video" : "Play background video"}
                  className="h-10 w-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all hover:scale-105 active:scale-95"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  <span className="text-lg">{isPlaying ? '⏸' : '▶'}</span>
                </button>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  aria-label={isMuted ? "Unmute background video" : "Mute background video"}
                  className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all hover:scale-105 active:scale-95"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  <span className="text-lg">{isMuted ? '🔇' : '🔊'}</span>
                </button>
              </div>
            </div>
          ) : (
            <img src={currentBanner} alt="Banner" className="w-full h-full object-cover transition-transform duration-1000 group-hover/banner:scale-105" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
          
          {isEditing && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 opacity-0 group-hover/banner:opacity-100 transition-opacity z-20">
              <button 
                onClick={() => bannerInputRef.current?.click()} 
                className="px-6 py-3 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
              >
                Upload Photo/Video
              </button>
              {currentVideo && (
                <button 
                  onClick={() => setBannerVideoPreview(undefined)}
                  className="px-6 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-red-500 transition-all"
                >
                  Clear Video
                </button>
              )}
              <p className="text-[9px] font-bold text-slate-300 uppercase">Max 10MB Video / 2MB Image</p>
            </div>
          )}
          <input 
            type="file" 
            ref={bannerInputRef} 
            className="hidden" 
            accept="image/*,video/*" 
            onChange={(e) => handleMediaUpload(e, 'banner')} 
          />
        </div>

        <div className="px-8 pb-10 -mt-20 relative z-30 flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="h-40 w-40 rounded-[32px] bg-slate-800 p-1 border-4 border-slate-900 overflow-hidden relative group/avatar shadow-2xl">
              <img src={isEditing ? avatarPreview : user.avatarUrl} className="w-full h-full object-cover rounded-[28px]" />
              {isEditing && (
                <button onClick={() => avatarInputRef.current?.click()} className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black uppercase">Change Avatar</span>
                </button>
              )}
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleMediaUpload(e, 'avatar')} />
            </div>
            <div className="text-center md:text-left pb-2">
              <h2 className="text-4xl font-heading font-black uppercase italic text-white tracking-tighter leading-none mb-2">{user.username}</h2>
              <div className="flex items-center gap-2">
                <p className="font-black uppercase tracking-[0.3em] text-[10px] transition-colors" style={{ color: currentTheme }}>{user.rank}</p>
                <span className="h-1 w-1 bg-slate-700 rounded-full"></span>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Node: {user.id.substring(0,6)}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            {isEditing && (
              <button 
                onClick={() => { setIsEditing(false); setEditedBio(user.bio); setEditedTheme(user.themeColor); setEditedSocials({...user.socials}); setBannerVideoPreview(user.profileBannerVideo); setBannerPreview(user.profileBanner); }} 
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 font-black text-[10px] uppercase rounded-2xl transition-all"
              >
                Cancel
              </button>
            )}
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
              className="px-8 py-3 font-black text-[10px] uppercase rounded-2xl border border-white/10 transition-all shadow-xl pro-shadow active:scale-95"
              style={{ backgroundColor: isEditing ? '#22c55e' : '#1e293b', color: 'white' }}
            >
              {isEditing ? 'Commit Loadout' : 'Configure Identity'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Identity Configuration (Visible only when editing) */}
          {isEditing && (
            <div className="p-8 gamer-border rounded-[40px] bg-slate-900/60 animate-in slide-in-from-top-4 duration-500 border-dashed" style={{ borderColor: currentTheme }}>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: currentTheme }}></span>
                Core Frequency Adjustment
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pro Presets</label>
                  <div className="flex flex-wrap gap-3">
                    {themes.map(t => (
                      <button 
                        key={t.name}
                        onClick={() => setEditedTheme(t.color)}
                        className={`h-12 w-12 rounded-2xl border-2 transition-all hover:scale-110 active:scale-90 ${editedTheme === t.color ? 'border-white shadow-xl' : 'border-transparent opacity-60'}`}
                        style={{ backgroundColor: t.color }}
                        title={t.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Precision Scanner (Custom Color)</label>
                  <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-3xl border border-white/5">
                    <input 
                      type="color" 
                      value={editedTheme}
                      onChange={(e) => setEditedTheme(e.target.value)}
                      className="h-12 w-12 bg-transparent border-0 cursor-pointer p-0 appearance-none"
                    />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-500 uppercase">HEX CODE</span>
                      <span className="text-lg font-heading font-black text-white tracking-widest">{editedTheme.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Broadcaster Uplink Matrix */}
          <div className="p-8 gamer-border rounded-[40px] bg-slate-900/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <span className="text-9xl font-black italic">LINK</span>
            </div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Broadcaster Uplink Matrix</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {platforms.map(p => {
                const social = isEditing ? editedSocials[p.id] : user.socials[p.id];
                // Fix: Cast social to SocialAccount or undefined for correct property access
                const socialAccount = social as SocialAccount | undefined;
                const isLinked = !!socialAccount?.handle;
                const isVerified = !!socialAccount?.verified;
                const isLoading = loading === p.id;

                return (
                  <div key={p.id} className="p-5 bg-slate-950/50 border border-white/5 rounded-3xl group/uplink transition-all hover:border-white/20">
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-xl border border-white/5 shadow-inner" style={{ color: p.color }}>
                        {p.icon}
                      </div>
                      {isVerified && (
                        <span className="text-[8px] font-black px-2 py-0.5 rounded-full border border-green-500/50 text-green-400 bg-green-500/10">VERIFIED</span>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{p.label} Handle</p>
                      {isEditing ? (
                        <div className="space-y-3">
                          <input 
                            type="text" 
                            // Fix: Safe property access for SocialAccount handles
                            value={socialAccount?.handle || ''}
                            onChange={(e) => handleSocialChange(p.id, e.target.value)}
                            placeholder="@username"
                            className="w-full bg-slate-900 border border-white/5 rounded-xl py-2 px-4 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 outline-none transition-all"
                          />
                          {!isVerified && isLinked && (
                            <button 
                              onClick={() => simulateSocialVerification(p.id)}
                              disabled={isLoading}
                              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-[9px] font-black uppercase text-slate-300 rounded-lg border border-white/5 transition-all"
                            >
                              {isLoading ? 'SYNCING...' : 'VERIFY UPLINK'}
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className={`text-sm font-bold ${isLinked ? 'text-white' : 'text-slate-700 italic'}`}>
                          {/* Fix: Safe property access for SocialAccount handles in display mode */}
                          {isLinked && socialAccount ? socialAccount.handle : 'Offline'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tactical Overview (Bio) */}
          <div className="p-8 gamer-border rounded-[40px] bg-slate-900/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <span className="text-9xl font-black italic">BIO</span>
            </div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Tactical Overview</h3>
            {isEditing ? (
              <div className="relative">
                <textarea 
                  value={editedBio} 
                  onChange={e => setEditedBio(e.target.value)} 
                  maxLength={500}
                  className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 text-sm text-slate-300 focus:outline-none transition-all h-48 font-medium leading-relaxed resize-none" 
                  style={{ borderColor: `${currentTheme}40` }}
                  placeholder="Transmission instructions for the hub..."
                />
                <div className="absolute bottom-4 right-6 text-[9px] font-black text-slate-600 uppercase">
                  {editedBio.length} / 500 CHARS
                </div>
              </div>
            ) : (
              <p className="text-slate-300 leading-relaxed font-medium text-lg italic relative z-10">
                "{user.bio}"
              </p>
            )}
          </div>

          {/* Security & Verification HUD */}
          <div className="p-8 gamer-border rounded-[40px] bg-slate-900/60 relative overflow-hidden" style={{ borderColor: `${currentTheme}15` }}>
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <span className="text-9xl font-black italic">SAFE</span>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-2" style={{ color: currentTheme }}>Security Integrity Matrix</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Verification status of your Hub-Core uplink</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-500 uppercase mb-1">Account Shield Level</span>
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-700 ${securityScore >= i ? 'shadow-[0_0_10px_var(--theme-accent)]' : 'bg-slate-800'}`} style={{ backgroundColor: securityScore >= i ? currentTheme : undefined }}></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Email Slot */}
              <div className={`p-6 rounded-[32px] border transition-all duration-500 ${user.isEmailVerified ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-950/50 border-white/5'}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Primary Email</span>
                  {user.isEmailVerified ? (
                    <span className="text-[8px] font-black text-green-400 bg-green-500/10 px-2 py-1 rounded">SECURED</span>
                  ) : (
                    <span className="text-[8px] font-black text-amber-500 bg-amber-500/10 px-2 py-1 rounded animate-pulse">ACTION REQ</span>
                  )}
                </div>
                
                <div className="space-y-4">
                  <input 
                    type="email" 
                    value={tempEmail} 
                    onChange={e => setTempEmail(e.target.value)}
                    disabled={user.isEmailVerified || verifyingEmail}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none outline-none disabled:opacity-50"
                    style={{ borderBottomColor: !user.isEmailVerified ? currentTheme : 'transparent' }}
                  />
                  
                  {!user.isEmailVerified && !verifyingEmail && (
                    <button 
                      onClick={() => startVerification('email')}
                      disabled={loading === 'email'}
                      className="w-full py-3 text-white text-[10px] font-black uppercase rounded-xl transition-all shadow-lg pro-shadow disabled:opacity-50"
                      style={{ backgroundColor: currentTheme }}
                    >
                      {loading === 'email' ? 'TRANSMITTING...' : 'START VERIFICATION'}
                    </button>
                  )}

                  {verifyingEmail && (
                    <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="ENTER 4-DIGIT KEY"
                          value={emailCode}
                          onChange={e => setEmailCode(e.target.value)}
                          className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl py-3 px-4 text-center text-cyan-400 font-black tracking-[0.5em] outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => confirmVerification('email')}
                          className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white text-[10px] font-black uppercase rounded-xl transition-all"
                        >
                          CONFIRM
                        </button>
                        <button 
                          disabled={emailTimer > 0}
                          onClick={() => startVerification('email')}
                          className="px-4 py-3 bg-slate-800 text-slate-400 text-[10px] font-black uppercase rounded-xl disabled:opacity-30"
                        >
                          {emailTimer > 0 ? `${emailTimer}s` : 'RESEND'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Phone Slot */}
              <div className={`p-6 rounded-[32px] border transition-all duration-500 ${user.isPhoneVerified ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-950/50 border-white/5'}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mobile Relay</span>
                  {user.isPhoneVerified ? (
                    <span className="text-[8px] font-black text-green-400 bg-green-500/10 px-2 py-1 rounded">LINKED</span>
                  ) : (
                    <span className="text-[8px] font-black text-slate-400 bg-slate-800 px-2 py-1 rounded">UNLINKED</span>
                  )}
                </div>

                <div className="space-y-4">
                  <input 
                    type="tel" 
                    placeholder="+234 ..."
                    value={tempPhone} 
                    onChange={e => setTempPhone(e.target.value)}
                    disabled={user.isPhoneVerified || verifyingPhone}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none outline-none disabled:opacity-50"
                    style={{ borderBottomColor: !user.isPhoneVerified ? currentTheme : 'transparent' }}
                  />
                  
                  {!user.isPhoneVerified && !verifyingPhone && (
                    <button 
                      onClick={() => startVerification('phone')}
                      disabled={loading === 'phone'}
                      className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase rounded-xl transition-all border border-white/5 disabled:opacity-50"
                    >
                      {loading === 'phone' ? 'LINKING...' : 'LINK PHONE NUMBER'}
                    </button>
                  )}

                  {verifyingPhone && (
                    <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                      <input 
                        type="text" 
                        placeholder="SMS PAYLOAD KEY"
                        value={phoneCode}
                        onChange={e => setPhoneCode(e.target.value)}
                        className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl py-3 px-4 text-center text-cyan-400 font-black tracking-[0.5em] outline-none"
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => confirmVerification('phone')}
                          className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white text-[10px] font-black uppercase rounded-xl transition-all"
                        >
                          VERIFY
                        </button>
                        <button 
                          disabled={phoneTimer > 0}
                          onClick={() => startVerification('phone')}
                          className="px-4 py-3 bg-slate-800 text-slate-400 text-[10px] font-black uppercase rounded-xl disabled:opacity-30"
                        >
                          {phoneTimer > 0 ? `${phoneTimer}s` : 'RESEND'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[8px]">🛡️</div>
                <div className="h-6 w-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[8px]">🔐</div>
                <div className="h-6 w-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[8px]">👤</div>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Account Trust Score: <span className="text-white">{Math.round(securityPercent)}%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="p-8 gamer-border rounded-[32px] bg-slate-900/40" style={{ borderColor: `${currentTheme}20` }}>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Battle Record</h3>
            <div className="space-y-4">
               {[
                 { label: 'Matches Deployed', val: user.stats.tournamentsPlayed, color: 'text-white' },
                 { label: 'Confirmed Wins', val: user.stats.tournamentsWon, color: 'text-green-400' },
                 { label: 'K/D Matrix', val: user.stats.kdRatio, color: currentTheme }
               ].map(stat => (
                 <div key={stat.label} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                    <span className="text-sm font-black transition-colors" style={{ color: stat.color === 'text-white' || stat.color === 'text-green-400' ? undefined : stat.color }}>{stat.val}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-slate-950 to-slate-900 rounded-[32px] border border-white/5 relative overflow-hidden group">
             <div className="absolute inset-0 opacity-10 blur-3xl rounded-full" style={{ backgroundColor: currentTheme }}></div>
             <div className="relative z-10 flex justify-between items-center mb-4">
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: currentTheme }}>Uplink Status</span>
                <span className="text-[10px] font-black text-white">OPTIMAL</span>
             </div>
             <p className="relative z-10 text-[10px] text-slate-600 font-medium italic">"Operational security is paramount. Your chosen frequency ensures high-fidelity tactical communication."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

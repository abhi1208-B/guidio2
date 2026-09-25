import React, { useState } from 'react';
import { X, User, Lock, Mail, Shield, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (user: { name: string; email: string; isGuide: boolean }) => void;
  onOpenJoinGuide: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  onClose,
  onSuccess,
  onOpenJoinGuide,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGuideAccount, setIsGuideAccount] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const displayName = name.trim() || email.split('@')[0] || 'Traveler';
    onSuccess({
      name: displayName,
      email,
      isGuide: isGuideAccount,
    });
    onClose();

    if (isGuideAccount) {
      onOpenJoinGuide();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#FBFBF9]">
          <h3 className="font-serif font-bold text-lg text-neutral-900">
            {mode === 'login' ? 'Sign In to Guido' : 'Create Guido Account'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Hegde"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <label className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isGuideAccount}
                onChange={(e) => setIsGuideAccount(e.target.checked)}
                className="w-4 h-4 text-[#1B4332] rounded focus:ring-0"
              />
              <span className="text-xs text-emerald-950 font-medium">
                I want to register as a Karnataka Local Guide
              </span>
            </label>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#1B4332] hover:bg-[#133225] rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <div className="pt-2 text-center text-xs text-neutral-600">
            {mode === 'login' ? (
              <span>
                Don’t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-[#1B4332] font-semibold underline cursor-pointer"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#1B4332] font-semibold underline cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

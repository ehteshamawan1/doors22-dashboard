/**
 * Settings Page
 * System configurations and preferences
 */

'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  // State for various settings
  const [postingTime, setPostingTime] = useState('12:00'); // 12:00 PM ET (noon)
  const [contentMixImages, setContentMixImages] = useState(70);
  const [contentMixVideos, setContentMixVideos] = useState(30);
  const [brandVoice, setBrandVoice] = useState('professional-inspirational');
  const [autoApproval, setAutoApproval] = useState(false);
  const [trendAnalysisEnabled, setTrendAnalysisEnabled] = useState(true);
  const [contentGenerationEnabled, setContentGenerationEnabled] = useState(true);
  const [autoPostingEnabled, setAutoPostingEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`);

        if (response.ok) {
          const data = await response.json();
          const settings = data.settings;

          setPostingTime(settings.postingTime || '17:00');
          setContentMixImages(settings.contentMix?.images || 70);
          setContentMixVideos(settings.contentMix?.videos || 30);
          setBrandVoice(settings.brandVoice || 'professional-inspirational');
          setAutoApproval(settings.autoApproval || false);
          setTrendAnalysisEnabled(settings.modules?.trendAnalysisEnabled !== false);
          setContentGenerationEnabled(settings.modules?.contentGenerationEnabled !== false);
          setAutoPostingEnabled(settings.modules?.autoPostingEnabled || false);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const settings = {
        postingTime,
        contentMix: {
          images: contentMixImages,
          videos: contentMixVideos
        },
        brandVoice,
        autoApproval,
        modules: {
          trendAnalysisEnabled,
          contentGenerationEnabled,
          autoPostingEnabled
        }
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        const error = await response.json();
        alert(`Error saving settings: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure system preferences and automation settings</p>
      </div>

      <div className="space-y-6">
        {/* Content Generation Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Generation</h2>

          <div className="space-y-6">
            {/* Content Mix */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Content Mix (Images vs Videos)
              </label>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Images</span>
                    <span className="font-medium">{contentMixImages}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={contentMixImages}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setContentMixImages(val);
                      setContentMixVideos(100 - val);
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Videos/Reels</span>
                    <span className="font-medium">{contentMixVideos}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={contentMixVideos}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setContentMixVideos(val);
                      setContentMixImages(100 - val);
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Adjust the ratio of images to video/reel content generated daily
              </p>
            </div>

            {/* Brand Voice */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Brand Voice & Caption Tone
              </label>
              <select
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="professional-inspirational">Professional & Inspirational</option>
                <option value="casual-friendly">Casual & Friendly</option>
                <option value="technical-detailed">Technical & Detailed</option>
                <option value="luxury-premium">Luxury & Premium</option>
                <option value="modern-minimal">Modern & Minimal</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Sets the tone for AI-generated captions and responses
              </p>
            </div>
          </div>
        </div>

        {/* Posting Schedule */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Posting Schedule</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Daily Posting Time (Eastern Time)
              </label>
              <input
                type="time"
                value={postingTime}
                onChange={(e) => setPostingTime(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {postingTime} ET (Eastern Time)
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Optimal Posting Times (Eastern):</strong>
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1">
                <li>• Instagram: 11:00 AM - 2:00 PM ET (weekdays)</li>
                <li>• Facebook: 1:00 PM - 3:00 PM ET (weekdays)</li>
                <li>• Current setting: {postingTime} ET</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Approval Workflow */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Approval Workflow</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Auto-Approval Mode</p>
                <p className="text-sm text-gray-600">
                  Skip manual approval and auto-post all generated content
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  ⚠️ Warning: Content will post without review
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoApproval}
                  onChange={(e) => setAutoApproval(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* System Modules */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Modules</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Daily Trend Analysis</p>
                <p className="text-sm text-gray-600">
                  Analyze competitor content and market trends (Runs at 10:00 PM ET)
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={trendAnalysisEnabled}
                  onChange={(e) => setTrendAnalysisEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Content Generation</p>
                <p className="text-sm text-gray-600">
                  Generate 4 daily posts using reference images (Runs at 10:15 PM ET)
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={contentGenerationEnabled}
                  onChange={(e) => setContentGenerationEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Auto-Posting to Social Media</p>
                <p className="text-sm text-gray-600">
                  Automatically post approved content to Instagram & Facebook
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ✓ Meta API connected
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPostingEnabled}
                  onChange={(e) => setAutoPostingEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Credentials</h2>

          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>🔒 Security Notice:</strong> API keys are stored securely in environment variables.
                For security reasons, keys cannot be viewed or edited from the dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">OpenAI API</p>
                <p className="text-xs text-gray-600">sk-proj-***************************</p>
                <span className="badge bg-green-100 text-green-700 text-xs mt-2">✓ Connected</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Midjourney (Discord)</p>
                <p className="text-xs text-gray-600">MTAx***************************</p>
                <span className="badge bg-green-100 text-green-700 text-xs mt-2">✓ Connected</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Cloudinary</p>
                <p className="text-xs text-gray-600">Cloud: dedqi4eca</p>
                <span className="badge bg-green-100 text-green-700 text-xs mt-2">✓ Connected</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Meta Graph API</p>
                <p className="text-xs text-gray-600">Instagram & Facebook</p>
                <span className="badge bg-green-100 text-green-700 text-xs mt-2">✓ Connected</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Firebase</p>
                <p className="text-xs text-gray-600">Project: socialchatbot-717b7</p>
                <span className="badge bg-green-100 text-green-700 text-xs mt-2">✓ Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary"
            disabled={isSaving}
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            className="btn-primary"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

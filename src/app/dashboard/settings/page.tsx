/**
 * Settings Page
 * System configurations and preferences
 */

'use client';

import { useState } from 'react';

export default function SettingsPage() {
  // State for various settings
  const [postingTime, setPostingTime] = useState('17:00'); // 5:00 PM UTC
  const [contentMixImages, setContentMixImages] = useState(70);
  const [contentMixVideos, setContentMixVideos] = useState(30);
  const [brandVoice, setBrandVoice] = useState('professional-inspirational');
  const [autoApproval, setAutoApproval] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [trendAnalysisEnabled, setTrendAnalysisEnabled] = useState(true);
  const [contentGenerationEnabled, setContentGenerationEnabled] = useState(true);
  const [autoPostingEnabled, setAutoPostingEnabled] = useState(false);

  const handleSave = () => {
    // In production, this would save to backend API
    alert('Settings saved successfully!');
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
                Daily Posting Time (UTC)
              </label>
              <input
                type="time"
                value={postingTime}
                onChange={(e) => setPostingTime(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {postingTime} UTC (Default: 17:00 UTC = 12:00 PM EST)
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Optimal Posting Times:</strong>
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1">
                <li>• Instagram: 11:00 AM - 2:00 PM EST (weekdays)</li>
                <li>• Facebook: 1:00 PM - 3:00 PM EST (weekdays)</li>
                <li>• Current setting: {postingTime} UTC</li>
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

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">
                  Receive email alerts when new content needs approval
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
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
                  Analyze competitor content and market trends (Runs at 3:00 AM UTC)
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
                  Generate images and videos with Midjourney (Runs at 3:15 AM UTC)
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
                <p className="text-xs text-yellow-600 mt-1">
                  ⚠️ Requires Meta API credentials
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPostingEnabled}
                  onChange={(e) => setAutoPostingEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
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
                <p className="text-xs text-gray-600">Not configured</p>
                <span className="badge bg-red-100 text-red-700 text-xs mt-2">✗ Not Connected</span>
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
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            className="btn-primary"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  ClipboardIcon,
  CheckIcon,
  Loader2Icon,
  RefreshCwIcon,
} from "lucide-react";

export default function Component() {
  const [activeTab, setActiveTab] = useState("password");
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(8);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [url, setUrl] = useState("");
  const [expireAfterDays, setExpireAfterDays] = useState("");
  const [expireAfterViews, setExpireAfterViews] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePassword = () => {
    let charset = "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    let newPassword = "";
    for (let i = 0; i < passwordLength; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
  };

  const generateUrl = () => {
    setLoading(true);
    setError("");

    fetch("/api/p.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: {
          payload: password,
          expire_after_days: expireAfterDays + 1,
          expire_after_views: expireAfterViews + 1,
        },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching unique URL");
        }
        return response.json();
      })
      .then((result) => {
        setUrl(`https://pwpush.com/p/${result.url_token}`);
      })
      .catch(() => {
        setError("Error fetching unique URL. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    setPassword("");
    setPasswordLength(8);
    setIncludeUppercase(true);
    setIncludeNumbers(true);
    setIncludeSymbols(true);
    setUrl("");
    setExpireAfterDays("");
    setExpireAfterViews("");
    setError("");
  };

  return (
    <div className="max-w-md mx-auto overflow-hidden bg-white shadow-md rounded-xl md:max-w-2xl">
      <div className="md:flex">
        <div className="w-full p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold tracking-wide text-indigo-500 ">
              SecureShare
            </div>
            <button
              onClick={resetAll}
              className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-indigo-700 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              Reset All
            </button>
          </div>
          <div className="flex mb-4">
            <button
              className={`flex-1 py-2 px-4 text-center ${
                activeTab === "password"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("password")}
            >
              Password Generator
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center ${
                activeTab === "url"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("url")}
            >
              URL Generator
            </button>
          </div>

          {activeTab === "password" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="passwordLength"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password Length: {passwordLength}
                </label>
                <input
                  type="range"
                  id="passwordLength"
                  min="8"
                  max="32"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="uppercase"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="uppercase"
                  className="block ml-2 text-sm text-gray-900"
                >
                  Include Uppercase
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="numbers"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="numbers"
                  className="block ml-2 text-sm text-gray-900"
                >
                  Include Numbers
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="symbols"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="symbols"
                  className="block ml-2 text-sm text-gray-900"
                >
                  Include Symbols
                </label>
              </div>
              <button
                onClick={generatePassword}
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Generate Password
              </button>
              {password && (
                <div className="mt-4">
                  <label
                    htmlFor="generatedPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Generated Password:
                  </label>
                  <div className="flex mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      id="generatedPassword"
                      value={password}
                      readOnly
                      className="flex-1 block w-full min-w-0 px-3 py-2 border-gray-300 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(password)}
                      className="inline-flex items-center px-3 py-2 text-gray-500 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                    >
                      {copied ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        <ClipboardIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "url" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="expireAfterDays"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expire After Days:
                </label>
                <input
                  type="number"
                  id="expireAfterDays"
                  value={expireAfterDays}
                  onChange={(e) =>
                    setExpireAfterDays(Math.max(0, Number(e.target.value)))
                  }
                  min="0"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="expireAfterViews"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expire After Views:
                </label>
                <input
                  type="number"
                  id="expireAfterViews"
                  value={expireAfterViews}
                  onChange={(e) =>
                    setExpireAfterViews(Math.max(0, Number(e.target.value)))
                  }
                  min="0"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button
                onClick={generateUrl}
                disabled={loading || !password}
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2Icon className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Unique URL"
                )}
              </button>
              {error && <div className="text-sm text-red-600">{error}</div>}
              {url && (
                <div className="mt-4">
                  <label
                    htmlFor="generatedUrl"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Generated URL:
                  </label>
                  <div className="flex mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      id="generatedUrl"
                      value={url}
                      readOnly
                      className="flex-1 block w-full min-w-0 px-3 py-2 border-gray-300 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(url)}
                      className="inline-flex items-center px-3 py-2 text-gray-500 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                    >
                      {copied ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        <ClipboardIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

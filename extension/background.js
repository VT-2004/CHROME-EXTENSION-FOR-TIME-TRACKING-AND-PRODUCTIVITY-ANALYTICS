let activeTab = null;
let startTime = null;

// 🔥 Tab switch
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) trackTime(tab.url);
});

// 🔥 Page load
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        trackTime(tab.url);
    }
});

// 🧠 Website classification (FIXED)
function classifyWebsite(site) {
    site = site.toLowerCase(); // normalize

    const productiveSites = [
        "github",
        "leetcode",
        "stackoverflow",
        "geeksforgeeks",
        "google"
    ];

    return productiveSites.some(s => site.includes(s))
        ? "Productive"
        : "Unproductive";
}

// 🚫 URL validation
function isValidUrl(url) {
    return (
        url.startsWith("http") &&
        !url.includes("chrome://") &&
        !url.includes("newtab")
    );
}

// ⏱️ Main tracking logic (FIXED)
function trackTime(url) {
    if (!isValidUrl(url)) return;

    const currentTime = Date.now();
    const currentHost = new URL(url).hostname.toLowerCase();

    // 🔁 Send data only when switching tabs
    if (activeTab && startTime && activeTab !== currentHost) {
        const timeSpent = Math.floor((currentTime - startTime) / 1000);

        // 🚫 Ignore very small durations
        if (timeSpent > 2) {
            fetch("https://chrome-extension-for-time-tracking-and-1bef.onrender.com/api/activity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    website: activeTab,
                    timeSpent: timeSpent,
                    category: classifyWebsite(activeTab)
                })
            });
        }
    }

    // 🔄 Update current tab
    activeTab = currentHost;
    startTime = currentTime;
}
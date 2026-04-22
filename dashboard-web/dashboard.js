fetch("https://chrome-extension-for-time-tracking-and-1bef.onrender.com/api/weekly")
    .then(res => res.json())
    .then(data => {

        if (!data || data.length === 0) {
            document.getElementById("loading").innerText = "No data available";
            return;
        }

        let totalTime = 0;
        let productiveTime = 0;
        let unproductiveTime = 0;
        let siteData = {};

        data.forEach(item => {
            totalTime += item.timeSpent;

            if (item.category === "Productive") {
                productiveTime += item.timeSpent;
            } else {
                unproductiveTime += item.timeSpent;
            }

            siteData[item.website] = (siteData[item.website] || 0) + item.timeSpent;
        });

        const totalMin = totalTime / 60;
        const productiveMin = productiveTime / 60;
        const unproductiveMin = unproductiveTime / 60;

        const score = totalTime > 0
            ? (productiveTime / totalTime) * 100
            : 0;

        function animateValue(id, endValue, suffix) {
            const element = document.getElementById(id);
            if (!element) return;

            let current = 0;
            const increment = endValue / 50;

            function update() {
                current += increment;
                if (current >= endValue) current = endValue;

                element.innerText = current.toFixed(2) + suffix;

                if (current < endValue) requestAnimationFrame(update);
            }
            update();
        }

        animateValue("totalTime", totalMin, " min");
        animateValue("productiveTime", productiveMin, " min");
        animateValue("unproductiveTime", unproductiveMin, " min");

        const scoreEl = document.getElementById("score");
        if (scoreEl) {
            scoreEl.innerText = "🔥 Productivity Score: " + score.toFixed(2) + "%";
        }

        const sortedSites = Object.entries(siteData)
            .sort((a, b) => b[1] - a[1]);

        if (sortedSites.length > 0) {
            const topEl = document.getElementById("topSite");
            if (topEl) {
                topEl.innerText = "🏆 Top Site: " + sortedSites[0][0];
            }
        }

        const list = document.getElementById("siteList");
        if (list) {
            list.innerHTML = "";

            sortedSites.forEach(([site, time]) => {
                const li = document.createElement("li");
                li.innerText = `${site} -> ${(time / 60).toFixed(2)} min`;
                list.appendChild(li);
            });
        }

        // 📊 Chart
        const canvas = document.getElementById("myChart");
        if (canvas) {
            const ctx = canvas.getContext("2d");

            if (window.chart) window.chart.destroy();

            window.chart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: ["Productive", "Unproductive"],
                    datasets: [{
                        data: [productiveTime, unproductiveTime],
                        backgroundColor: ["#2ecc71", "#e74c3c"]
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            });
        }

        document.getElementById("loading").style.display = "none";

    })
    .catch(err => {
        console.error(err);

        const loading = document.getElementById("loading");
        if (loading) {
            loading.innerText = "Failed to load data";
        }
    });

// 🌙 Dark mode toggle
const toggleBtn = document.getElementById("toggleTheme");
if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        toggleBtn.innerText = document.body.classList.contains("dark") ? "☀️" : "🌙";
    });
}
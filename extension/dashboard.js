fetch("http://localhost:5000/api/weekly")
    .then(res => res.json())
    .then(data => {

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

            if (!siteData[item.website]) {
                siteData[item.website] = 0;
            }
            siteData[item.website] += item.timeSpent;
        });

        const totalMin = totalTime / 60;
        const productiveMin = productiveTime / 60;
        const unproductiveMin = unproductiveTime / 60;

        let score = totalTime > 0 ? (productiveTime / totalTime) * 100 : 0;

        function animateValue(id, endValue, suffix) {
            let current = 0;
            let increment = endValue / 50;

            function update() {
                current += increment;
                if (current >= endValue) current = endValue;

                document.getElementById(id).innerText =
                    current.toFixed(2) + suffix;

                if (current < endValue) requestAnimationFrame(update);
            }
            update();
        }

        animateValue("totalTime", totalMin, " min");
        animateValue("productiveTime", productiveMin, " min");
        animateValue("unproductiveTime", unproductiveMin, " min");

        document.getElementById("score").innerText =
            "🔥 Productivity Score: " + score.toFixed(2) + "%";

        // 📊 Sort sites
        const sortedSites = Object.entries(siteData)
            .sort((a, b) => b[1] - a[1]);

        // 🏆 Top site
        if (sortedSites.length > 0) {
            document.getElementById("topSite").innerText =
                "🏆 Top Site: " + sortedSites[0][0];
        }

        // 📋 List
        const list = document.getElementById("siteList");
        list.innerHTML = "";

        sortedSites.forEach(([site, time]) => {
            const li = document.createElement("li");
            li.innerText = `${site} -> ${(time / 60).toFixed(2)} min`;
            list.appendChild(li);
        });

        // 📊 Pie Chart
        const ctx = document.getElementById("myChart").getContext("2d");

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

        document.getElementById("loading").style.display = "none";

    })
    .catch(err => console.error(err));

// 🌙 Dark mode toggle
document.getElementById("toggleTheme").addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const btn = document.getElementById("toggleTheme");
    btn.innerText = document.body.classList.contains("dark") ? "☀️" : "🌙";
});
function calculate() {
  // Get values from input fields
  const mass = parseFloat(document.getElementById("mass").value);
  const height = parseFloat(document.getElementById("height").value);
  const radius = parseFloat(document.getElementById("radius").value);
  const n1 = parseFloat(document.getElementById("n1").value);
  const n2 = parseFloat(document.getElementById("n2").value);
  const time = parseFloat(document.getElementById("time").value);

  // Validate
  if ([mass, height, radius, n1, n2, time].some(isNaN)) {
    document.getElementById("resultBox").innerText = "Please enter all values correctly.";
    return;
  }

  const g = 9.8; // gravity
  const omega = (2 * Math.PI * n2) / time; // angular speed (rad/s)

  // Moment of inertia formula:
  // I = (N * 2gh / (ω² - s²)) * (1 + n1/n2)
  const numerator = mass * 2 * g * height;
  const denominator = (omega * omega) - (radius * radius);
  const inertia = (numerator / denominator) * (1 + n1 / n2);

  // Show result
  document.getElementById("resultBox").innerHTML = `
    <strong>Angular Speed (ω):</strong> ${omega.toFixed(2)} rad/s<br>
    <strong>Moment of Inertia (I):</strong> ${inertia.toFixed(4)} kg·m²
  `;
  // Animate the wheel
  const wheel = document.getElementById("wheel");
  const speed = Math.min(omega * 5, 200); // limit max speed
  wheel.style.animation = `spin ${1000 / speed}s linear infinite`;

  drawGraph(omega, time)
}

function downloadResult() {
  const resultBox = document.getElementById("resultBox");
  const content = resultBox.innerText;

  if (!content.trim()) {
    alert("Please calculate the result first!");
    return;
  }

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "flywheel_result.txt";
  link.click();

  URL.revokeObjectURL(url);
}

function renderExplanationCards() {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  explanationData.forEach(card => {
    const cardElement = document.createElement("div");
    cardElement.className = "card";

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const front = document.createElement("div");
    front.className = "card-front";
    front.innerHTML = `<h3>${card.title}</h3><p>${card.content}</p>`;

    const back = document.createElement("div");
    back.className = "card-back";
    back.innerHTML = `<p><strong>Fun Fact:</strong><br>${card.fun || "Coming soon..."}</p>`;

    inner.appendChild(front);
    inner.appendChild(back);
    cardElement.appendChild(inner);
    container.appendChild(cardElement);
  });
}

let chartInstance = null;

function drawGraph(initialOmega, time) {
  const labels = [];
  const data = [];

  const steps = 20; // resolution of graph
  const deltaT = time / steps;

  for (let i = 0; i <= steps; i++) {
    const t = i * deltaT;
    const omega = initialOmega * Math.exp(-0.3 * t); // simulates exponential decay
    labels.push(t.toFixed(1));
    data.push(omega.toFixed(2));
  }

  const ctx = document.getElementById("omegaChart").getContext("2d");

  if (chartInstance) chartInstance.destroy(); // refresh if chart exists

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
     datasets: [{
  label: 'Angular Speed (ω) over Time (s)',
  data: data,
  fill: true,
  backgroundColor: 'rgba(41, 127, 185, 0.23)',
  borderColor: '#2980b9',
  borderWidth: 3,
  pointBackgroundColor: '#3498db',
  pointRadius: 4,
  tension: 0.4
}]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: 'Time (s)' }
        },
        y: {
          title: { display: true, text: 'Angular Speed (rad/s)' }
        }
      }
    }
  });
} 

// Run when page loads
window.onload = () => {
  renderExplanationCards();
};
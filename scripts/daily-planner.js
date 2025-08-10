const dailyPlanner = [];
const storedPlanner = JSON.parse(localStorage.getItem("daily-planner")) || [];

for (let i = 6; i <= 24; i++) {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const ampm = i < 12 ? "AM" : "PM";
  const timeLabel = `${hour}:00 ${ampm}`;

  dailyPlanner.push({
    time: timeLabel,
    task: storedPlanner[i - 6]?.task || "",
  });
}

const renderDailyPlannerCards = () => {
  const plannerContainer = document.querySelector(".planner-container");
  plannerContainer.innerHTML = "";

  dailyPlanner.forEach((task, index) => {
    const card = document.createElement("div");
    card.classList.add("planner-card");
    card.innerHTML = `
      <span class="time">${task.time}</span>
      <input type="text" class="planner-input" placeholder="Task for ${task.time}" value="${task.task}" />
    `;

    plannerContainer.appendChild(card);

    const input = card.querySelector(".planner-input");
    input.addEventListener("input", (e) => {
      dailyPlanner[index].task = e.target.value;
      localStorage.setItem("daily-planner", JSON.stringify(dailyPlanner));
    });
  });
};

renderDailyPlannerCards();
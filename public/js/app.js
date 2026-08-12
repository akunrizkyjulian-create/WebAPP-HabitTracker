const API_URL = 'http://127.0.0.1:8000/api';

async function ambilHabits() {
    const response = await fetch (`${API_URL}/habits`);
    const habits = await response.json();
    tampilkanHabits(habits);
}

function tampilkanHabits(habits) {
    const container = document.getElementById('app');

    if (habits.length === 0) {
        container.innerHTML = '<p>Belum ada Habit.</p>';
        return;
    }

    let html = '';

    habits.forEach(habit => {
        html += `<div class="habit-card"> 
            <h3>${habit.name}</h3>
        </div>`;
    });

    container.innerHTML = html;
}

ambilHabits()
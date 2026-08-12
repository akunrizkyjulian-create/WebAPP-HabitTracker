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
        const log = habit.logs[0];
        const currentValue = log ? log.current_value : 0;
        const  isCompleted = log ? log.is_completed : false;

        if (habit.type === 'progress') {
            html += `<div class="habit-card"> 
                <h3>${habit.name}</h3>
                <p>${currentValue} / ${habit.target_value} ${habit.unit}</p>
            </div>`;
        } else {
            html += `<div class="habit-card"> 
                <h3>${habit.name}</h3>
                 <input type="checkbox" ${isCompleted ? 'checked' : ''}>
            </div>`;
        }
    });

    container.innerHTML = html;
}

ambilHabits()
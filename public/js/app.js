const API_URL = 'http://127.0.0.1:8000/api';

async function ambilHabits() {
    const response = await fetch(`${API_URL}/habits`);
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
        const currentValue = log ? parseFloat(log.current_value) : 0;
        const isCompleted = log ? log.is_completed : false;

        if (habit.type === 'progress') {
            html += `<div class="habit-card">
                <h3>${habit.name}</h3>
                <p>${currentValue} / ${habit.target_value} ${habit.unit}</p>
                <button class="btn-kurang" data-id="${habit.id}" data-current="${currentValue}" data-target="${habit.target_value}">-</button>
                <button class="btn-tambah" data-id="${habit.id}" data-current="${currentValue}" data-target="${habit.target_value}">+</button>
            </div>`;
        } else {
            html += `<div class="habit-card">
                <h3>${habit.name}</h3>
                <input type="checkbox" class="checkbox-habit" data-id="${habit.id}" ${isCompleted ? 'checked' : ''}>
            </div>`;
        }
    });

    container.innerHTML = html;

    pasangEventListener();
}

function pasangEventListener() {
    document.querySelectorAll('.btn-tambah').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const current = parseFloat(button.dataset.current);
            const target = parseFloat(button.dataset.target);
            const newValue = Math.min(target, current + 0.5);
            updateProgress(id,newValue);
        });
    });

    document.querySelectorAll('.btn-kurang').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const current = parseFloat(button.dataset.current);
            const newValue = Math.max(0, current - 0.5);
            updateProgress(id, newValue);
        });
    });

    document.querySelectorAll('.checkbox-habit').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const id = checkbox.dataset.id;
            updateCheckbox(id, checkbox.checked);
        });
    });
}

async function updateProgress(habitId, newValue) {
    const today = new Date().toISOString().split('T')[0];

    await fetch(`${API_URL}/habit-logs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            habit_id: habitId,
            date: today,
            current_value: newValue,
        }),
    });

    ambilHabits();
}

async function updateCheckbox(habitId, isCompleted) {
    const today = new Date().toISOString().split('T')[0];

    await fetch(`${API_URL}/habit-logs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            habit_id: habitId,
            date: today,
            is_completed: isCompleted,
        }),
    });

    ambilHabits();
}

ambilHabits();
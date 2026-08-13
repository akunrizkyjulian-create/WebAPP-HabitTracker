const API_URL = 'http://127.0.0.1:8000/api';

async function ambilHabits() {
    const response = await fetch(`${API_URL}/habits?date=${selectedDate}`);
    const habits = await response.json();
    tampilkanHabits(habits);
    tampilkanCircleProgress(hitungPresentase(habits));
}

function tampilkanHabits(habits) {
    const container = document.getElementById('app');

    if (habits.length === 0) {
        container.innerHTML = '<p>Belum ada Habit.</p>';
        return;
    }

    let html = '<div class="habit-list">';

    habits.forEach(habit => {
        const log = habit.logs[0];
        const currentValue = log ? parseFloat(log.current_value) : 0;
        const isCompleted = log ? log.is_completed : false;

        if (habit.type === 'progress') {
            const percent = (currentValue / habit.target_value) * 100;

            html += `<div class="habit-card">
                <h3 class="habit-name">${habit.name}</h3>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${percent}%"></div>
                </div>
                <div class="habit-footer">
                    <span class="habit-value">${currentValue} / ${habit.target_value} ${habit.unit}</span>
                    <div class="habit-buttons">
                        <button class="btn-kurang" data-id="${habit.id}" data-current="${currentValue}" data-target="${habit.target_value}">-</button>
                        <button class="btn-tambah" data-id="${habit.id}" data-current="${currentValue}" data-target="${habit.target_value}">+</button>
                    </div>
                </div>
            </div>`;
        } else {
            html += `<div class="habit-card habit-checkbox-card">
                <h3 class="habit-name">${habit.name}</h3>
                <input type="checkbox" class="checkbox-habit" data-id="${habit.id}" ${isCompleted ? 'checked' : ''}>
            </div>`;
        }
    });

    html += '</div>';

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
    const today = selectedDate;

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
    const today = selectedDate;

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

//hitung persentase & render circle
function hitungPresentase(habits) {
    if (habits.length === 0) return 0;

    let selesai = 0;

    habits.forEach(habit => {
        const log = habit.logs[0];

        if (habit.type === 'checkbox') {
            if (log && log.is_completed) selesai++;
        } else {
            const currentValue = log ? parseFloat(log.current_value) : 0;
            if (currentValue >= habit.target_value) selesai++;
        }
    });

    return Math.round((selesai / habits.length) * 100);
}

function tampilkanCircleProgress(percent) {
    const circle = document.getElementById('circle-progress');
    circle.style.background = `conic-gradient(#4a90d9 ${percent}%, #e5e5e5 0)`;
    circle.innerHTML = `<div class="circle-inner"> ${percent}% </div>`;
}

//Fitur jadwal/tanggal

let selectedDate = formatTanggal(new Date());

function formatTanggal(date) {
    const tahun = date.getFullYear();
    const bulan = String (date.getMonth() + 1).padStart(2, '0');
    const tanggal = String(date.getDate()).padStart(2, '0');
    return `${tahun}-${bulan}-${tanggal}`
}

function tampilkanDateNav() {
    const namaHari = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const tanggalAktif = new Date(selectedDate);
    const hariKe = tanggalAktif.getDay();

    const awalMinggu = new Date(tanggalAktif);
    awalMinggu.setDate(tanggalAktif.getDate() - hariKe);

    let html = '<div class="date-scroll">';
    
    for (let i = 0; i < 7; i++) {
        const hari = new Date(awalMinggu);
        hari.setDate(awalMinggu.getDate() + i);

        const tanggalFormat = formatTanggal(hari);
        const isActive = tanggalFormat === selectedDate;

        html += `<div class="date-item ${isActive ? 'active' : ''}" data-date="${tanggalFormat}">
            <span class="date-day-name">${namaHari[i]}</span>
            <span class="date-day-number">${hari.getDate()}</span>
        </div>`;
    }

    html += '</div>';

    document.getElementById('date-nav').innerHTML = html;

    document.querySelectorAll('.date-item').forEach(item => {
        item.addEventListener('click', () => {
            selectedDate = item.dataset.date;
            ambilHabits();
            tampilkanDateNav();
        });
    });
}

tampilkanDateNav();
ambilHabits();
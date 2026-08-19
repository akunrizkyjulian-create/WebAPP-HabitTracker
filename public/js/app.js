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

    let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';

    habits.forEach(habit => {
        const log = habit.logs[0];
        const currentValue = log ? parseFloat(log.current_value) : 0;
        const isCompleted = log ? log.is_completed : false;

        if (habit.type === 'progress') {
            const percent = (currentValue / habit.target_value) * 100;

            html += `<div class="bg-white rounded-2xl p-5 shadow-sm">
                <h3 class="font-bold text-base mb-3">${habit.name}</h3>
                <div class="bg-gray-200 rounded-lg h-3 overflow-hidden mb-3">
                    <div class="bg-blue-500 h-full rounded-lg transition-all duration-300" style="width: ${percent}%"></div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">${currentValue} / ${habit.target_value} ${habit.unit}</span>
                    <div class="flex gap-2">
                        <button class="btn-kurang w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-lg flex items-center justify-center" data-id="${habit.id}" data-current="${currentValue}" data-target="${habit.target_value}">-</button>
                        <button class="btn-tambah w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-lg flex items-center justify-center" data-id="${habit.id}" data-current="${currentValue}" data-target="${habit.target_value}">+</button>
                    </div>
                </div>
            </div>`;
        } else {
            html += `<div class="bg-white rounded-2xl p-5 shadow-sm">
                <h3 class="font-bold text-base mb-1">${habit.name}</h3>
                <p class="text-sm text-amber-600 font-semibold mb-3" id="streak-${habit.id}">Memuat streak...</p>
                <input type="checkbox" class="checkbox-habit w-6 h-6 cursor-pointer accent-blue-500" data-id="${habit.id}" ${isCompleted ? 'checked' : ''}>
            </div>`;
        }
    });

    html += '</div>';

    container.innerHTML = html;

    pasangEventListener();

    habits.forEach(habit => {
        if (habit.type === 'checkbox') {
            tampilkanStreak(habit.id);
        }
    });
}

async function tampilkanStreak(habitId) {
    const response = await fetch(`${API_URL}/habits/${habitId}/streak`);
    const data = await response.json();

    const elemen = document.getElementById(`streak-${habitId}`);
    if (elemen) {
        elemen.textContent = `${data.streak} Day Streak`;
    }
}

function pasangEventListener() {
    document.querySelectorAll('.btn-tambah').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const current = parseFloat(button.dataset.current);
            const target = parseFloat(button.dataset.target);
            const newValue = Math.min(target, current + 0.5);
            updateProgress(id, newValue);
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
    circle.style.background = `conic-gradient(#3b82f6 ${percent}%, #e5e7eb 0)`;
    circle.innerHTML = `<div class="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-[11px] font-bold text-gray-700">${percent}%</div>`;
}

let selectedDate = formatTanggal(new Date());

function formatTanggal(date) {
    const tahun = date.getFullYear();
    const bulan = String(date.getMonth() + 1).padStart(2, '0');
    const tanggal = String(date.getDate()).padStart(2, '0');
    return `${tahun}-${bulan}-${tanggal}`;
}

function tampilkanDateNav() {
    const namaHari = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const tanggalAktif = new Date(selectedDate);
    const hariKe = tanggalAktif.getDay();

    const awalMinggu = new Date(tanggalAktif);
    awalMinggu.setDate(tanggalAktif.getDate() - hariKe);

    let html = '<div class="flex gap-2 overflow-x-auto pb-1">';

    for (let i = 0; i < 7; i++) {
        const hari = new Date(awalMinggu);
        hari.setDate(awalMinggu.getDate() + i);

        const tanggalFormat = formatTanggal(hari);
        const isActive = tanggalFormat === selectedDate;

        const activeClass = isActive
            ? 'bg-gray-900 text-white'
            : 'bg-white text-gray-700';

        html += `<div class="date-item ${activeClass} flex flex-col items-center gap-1 px-4 py-2 rounded-2xl cursor-pointer shrink-0 shadow-sm" data-date="${tanggalFormat}">
            <span class="text-[11px] font-bold opacity-60">${namaHari[i]}</span>
            <span class="text-base font-bold">${hari.getDate()}</span>
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
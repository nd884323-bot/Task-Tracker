// Habit Tracker - Spreadsheet Style
class HabitTracker {
    constructor() {
        this.habits = [];
        this.trackedDays = {};
        this.currentDate = new Date();
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.render();
        this.updateCharts();
    }

    setupEventListeners() {
        // Month navigation
        document.getElementById('prevMonth').addEventListener('click', () => this.previousMonth());
        document.getElementById('nextMonth').addEventListener('click', () => this.nextMonth());

        // Add habit button
        document.getElementById('addHabitBtn').addEventListener('click', () => this.openModal());

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());

        // Modal
        const modal = document.getElementById('modal');
        const closeBtn = document.querySelector('.close');
        closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });

        // Form submission
        document.getElementById('habitForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addHabit();
        });
    }

    loadFromStorage() {
        const stored = localStorage.getItem('habitTrackerData');
        if (stored) {
            const data = JSON.parse(stored);
            this.habits = data.habits || [];
            this.trackedDays = data.trackedDays || {};
        } else {
            // Default habits
            this.habits = [
                { id: 1, name: 'Deep Work', emoji: '💪', goal: 1 },
                { id: 2, name: 'Wake up early', emoji: '🌅', goal: 1 },
                { id: 3, name: 'No Alcohol', emoji: '🍷', goal: 1 },
                { id: 4, name: 'Cold Shower', emoji: '❄️', goal: 1 },
                { id: 5, name: 'Gym', emoji: '🏋️', goal: 1 },
                { id: 6, name: 'Time with God', emoji: '🙏', goal: 1 },
                { id: 7, name: 'Goal tracking', emoji: '📋', goal: 1 },
                { id: 8, name: 'Budget tracking', emoji: '💰', goal: 1 },
                { id: 9, name: 'Reading/Meditating', emoji: '📚', goal: 1 },
                { id: 10, name: 'No Porn', emoji: '🚫', goal: 1 },
            ];
        }
    }

    saveToStorage() {
        localStorage.setItem('habitTrackerData', JSON.stringify({
            habits: this.habits,
            trackedDays: this.trackedDays
        }));
    }

    openModal() {
        document.getElementById('modal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('modal').style.display = 'none';
        document.getElementById('habitForm').reset();
    }

    addHabit() {
        const name = document.getElementById('habitName').value;
        const emoji = document.getElementById('habitEmoji').value || '✓';
        const goal = parseInt(document.getElementById('habitGoal').value) || 1;

        const habit = {
            id: Date.now(),
            name,
            emoji,
            goal
        };

        this.habits.push(habit);
        this.saveToStorage();
        this.closeModal();
        this.render();
        this.updateCharts();
    }

    deleteHabit(id) {
        if (confirm('Delete this habit?')) {
            this.habits = this.habits.filter(h => h.id !== id);
            this.saveToStorage();
            this.render();
            this.updateCharts();
        }
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }

    getDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    getDaysInMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }

    getMonthStart(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    toggleHabit(habitId, day) {
        const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
        const dateStr = this.getDateString(date);
        const key = `${dateStr}_${habitId}`;

        if (!this.trackedDays[key]) {
            this.trackedDays[key] = 1;
        } else {
            const habit = this.habits.find(h => h.id === habitId);
            if (this.trackedDays[key] >= habit.goal) {
                delete this.trackedDays[key];
            } else {
                this.trackedDays[key]++;
            }
        }

        this.saveToStorage();
        this.render();
        this.updateCharts();
    }

    render() {
        this.renderMonthDisplay();
        this.renderTable();
        this.updateStats();
        this.renderTopHabits();
    }

    renderMonthDisplay() {
        const monthYear = this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        document.getElementById('monthYear').textContent = monthYear;
    }

    renderTable() {
        const daysInMonth = this.getDaysInMonth(this.currentDate);
        const tbody = document.getElementById('habitsTableBody');
        const daysHeader = document.getElementById('daysHeader');
        
        tbody.innerHTML = '';
        daysHeader.innerHTML = '';

        // Generate day headers
        for (let day = 1; day <= daysInMonth; day++) {
            const th = document.createElement('th');
            th.className = 'day-header';
            th.textContent = day;
            th.style.minWidth = '45px';
            daysHeader.appendChild(th);
        }

        // Generate habit rows
        this.habits.forEach(habit => {
            const row = document.createElement('tr');
            
            // Habit name cell
            const nameCell = document.createElement('td');
            nameCell.className = 'habit-name-col';
            nameCell.innerHTML = `<div class="habit-name">
                <span>${habit.emoji}</span>
                <span>${habit.name}</span>
                <button class="habit-delete-btn" onclick="tracker.deleteHabit(${habit.id})">×</button>
            </div>`;
            row.appendChild(nameCell);

            // Goal cell
            const goalCell = document.createElement('td');
            goalCell.className = 'goal-col';
            goalCell.textContent = habit.goal;
            row.appendChild(goalCell);

            // Daily checkboxes
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
                const dateStr = this.getDateString(date);
                const key = `${dateStr}_${habit.id}`;
                const completed = this.trackedDays[key] || 0;
                const isCompleted = completed >= habit.goal;

                const dayCell = document.createElement('td');
                dayCell.style.minWidth = '45px';
                const checkbox = document.createElement('button');
                checkbox.className = `habit-checkbox ${isCompleted ? 'checked' : ''}`;
                checkbox.textContent = isCompleted ? '✓' : '';
                checkbox.onclick = () => this.toggleHabit(habit.id, day);
                dayCell.appendChild(checkbox);
                row.appendChild(dayCell);
            }

            // Percentage cell
            const percentageCell = document.createElement('td');
            percentageCell.className = 'percentage-col';
            const percentage = this.calculateHabitPercentage(habit.id);
            percentageCell.innerHTML = `<span class="percentage">${percentage}%</span>`;
            row.appendChild(percentageCell);

            tbody.appendChild(row);
        });
    }

    calculateHabitPercentage(habitId) {
        const daysInMonth = this.getDaysInMonth(this.currentDate);
        let completed = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            const dateStr = this.getDateString(date);
            const key = `${dateStr}_${habitId}`;
            const habit = this.habits.find(h => h.id === habitId);
            if (this.trackedDays[key] >= habit.goal) {
                completed++;
            }
        }

        return Math.round((completed / daysInMonth) * 100);
    }

    calculateMonthCompletion() {
        if (this.habits.length === 0) return 0;
        let total = 0;
        this.habits.forEach(habit => {
            total += this.calculateHabitPercentage(habit.id);
        });
        return Math.round(total / this.habits.length);
    }

    calculateDaysTracked() {
        const daysInMonth = this.getDaysInMonth(this.currentDate);
        let daysWithData = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            const dateStr = this.getDateString(date);
            
            for (const key in this.trackedDays) {
                if (key.startsWith(dateStr)) {
                    daysWithData++;
                    break;
                }
            }
        }

        return `${daysWithData}/${daysInMonth}`;
    }

    calculateStreak() {
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = this.getDateString(date);
            const completion = this.calculateDayCompletion(dateStr);

            if (completion === 100) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }

        return streak;
    }

    calculateDayCompletion(dateStr) {
        if (this.habits.length === 0) return 0;
        let completed = 0;

        this.habits.forEach(habit => {
            const key = `${dateStr}_${habit.id}`;
            if (this.trackedDays[key] >= habit.goal) {
                completed++;
            }
        });

        return Math.round((completed / this.habits.length) * 100);
    }

    updateStats() {
        const monthCompletion = this.calculateMonthCompletion();
        const daysTracked = this.calculateDaysTracked();
        const streak = this.calculateStreak();

        document.getElementById('monthCompletion').textContent = `${monthCompletion}%`;
        document.getElementById('daysTracked').textContent = daysTracked;
        document.getElementById('currentStreak').textContent = streak;
    }

    renderTopHabits() {
        const container = document.getElementById('topHabitsList');
        container.innerHTML = '';

        const stats = this.habits.map(habit => ({
            id: habit.id,
            name: habit.name,
            emoji: habit.emoji,
            percentage: this.calculateHabitPercentage(habit.id)
        }));

        stats.sort((a, b) => b.percentage - a.percentage);

        stats.slice(0, 10).forEach((stat, index) => {
            const rank = document.createElement('div');
            rank.className = 'habit-rank';

            const rankNum = document.createElement('div');
            rankNum.className = 'rank-number';
            rankNum.textContent = index + 1;

            const info = document.createElement('div');
            info.className = 'rank-info';

            const name = document.createElement('div');
            name.className = 'rank-name';
            name.innerHTML = `<span>${stat.emoji}</span> ${stat.name}`;

            const percentage = document.createElement('div');
            percentage.className = 'rank-percentage';
            percentage.textContent = `${stat.percentage}%`;

            info.appendChild(name);
            info.appendChild(percentage);
            rank.appendChild(rankNum);
            rank.appendChild(info);
            container.appendChild(rank);
        });
    }

    updateCharts() {
        this.updateTrendChart();
        this.updateTopHabitsChart();
    }

    updateTrendChart() {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        const daysInMonth = this.getDaysInMonth(this.currentDate);
        const labels = [];
        const data = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            labels.push(day);
            data.push(this.calculateDayCompletion(this.getDateString(date)));
        }

        if (window.trendChart) {
            window.trendChart.destroy();
        }

        window.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Daily Completion %',
                    data,
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#00d4ff',
                    pointBorderColor: '#fff',
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' }
                    }
                }
            }
        });
    }

    updateTopHabitsChart() {
        const ctx = document.getElementById('topHabitsChart');
        if (!ctx) return;

        const stats = this.habits.map(habit => ({
            id: habit.id,
            name: habit.name,
            emoji: habit.emoji,
            percentage: this.calculateHabitPercentage(habit.id)
        }));

        const sorted = stats.sort((a, b) => b.percentage - a.percentage).slice(0, 10);

        const labels = sorted.map(s => `${s.emoji} ${s.name}`);
        const data = sorted.map(s => s.percentage);

        if (window.topHabitsChart) {
            window.topHabitsChart.destroy();
        }

        window.topHabitsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Completion %',
                    data,
                    backgroundColor: [
                        '#00d4ff',
                        '#00c9e8',
                        '#00bfd1',
                        '#00b4ba',
                        '#00a8a3',
                        '#009d8c',
                        '#009275',
                        '#08875e',
                        '#107c47',
                        '#187130'
                    ],
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#b0b0b0' }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#b0b0b0' }
                    }
                }
            }
        });
    }

    exportData() {
        const csv = this.generateCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `habit-tracker-${this.getDateString(this.currentDate)}.csv`;
        a.click();
    }

    generateCSV() {
        const daysInMonth = this.getDaysInMonth(this.currentDate);
        let csv = 'Habit,Goal,' + Array.from({length: daysInMonth}, (_, i) => i + 1).join(',') + ',Percentage\n';

        this.habits.forEach(habit => {
            let row = `${habit.name},${habit.goal}`;
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
                const dateStr = this.getDateString(date);
                const key = `${dateStr}_${habit.id}`;
                const completed = this.trackedDays[key] ? '✓' : '';
                row += ',' + completed;
            }
            row += ',' + this.calculateHabitPercentage(habit.id) + '%';
            csv += row + '\n';
        });

        return csv;
    }
}

// Initialize
let tracker;
document.addEventListener('DOMContentLoaded', () => {
    tracker = new HabitTracker();
});

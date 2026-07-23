// Habit Tracker Application
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
        // Date navigation
        document.getElementById('prevBtn').addEventListener('click', () => this.previousDay());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextDay());

        // Add habit button
        document.getElementById('addHabitBtn').addEventListener('click', () => this.openModal());

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
            // Add default habits for demo
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
        if (confirm('Are you sure you want to delete this habit?')) {
            this.habits = this.habits.filter(h => h.id !== id);
            this.saveToStorage();
            this.render();
            this.updateCharts();
        }
    }

    toggleHabit(habitId) {
        const dateStr = this.getDateString(this.currentDate);
        const key = `${dateStr}_${habitId}`;

        if (!this.trackedDays[key]) {
            this.trackedDays[key] = 1;
        } else {
            this.trackedDays[key]++;
        }

        const habit = this.habits.find(h => h.id === habitId);
        if (this.trackedDays[key] > habit.goal) {
            delete this.trackedDays[key];
        }

        this.saveToStorage();
        this.render();
        this.updateCharts();
    }

    getDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    previousDay() {
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        this.render();
    }

    nextDay() {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        this.render();
    }

    render() {
        this.renderDateDisplay();
        this.renderHabits();
        this.renderWeekly();
        this.updateStats();
        this.renderTopHabits();
    }

    renderDateDisplay() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = this.currentDate.toLocaleDateString('en-US', options);
        document.getElementById('currentDate').textContent = dateStr;
    }

    renderHabits() {
        const container = document.getElementById('habitsContainer');
        container.innerHTML = '';

        const dateStr = this.getDateString(this.currentDate);

        this.habits.forEach(habit => {
            const key = `${dateStr}_${habit.id}`;
            const completed = this.trackedDays[key] || 0;
            const isCompleted = completed >= habit.goal;

            const card = document.createElement('div');
            card.className = `habit-card ${isCompleted ? 'completed' : ''}`;

            const header = document.createElement('div');
            header.className = 'habit-header';
            header.innerHTML = `
                <div class="habit-name">
                    <span>${habit.emoji}</span>
                    <span>${habit.name}</span>
                </div>
                <button class="habit-delete" onclick="tracker.deleteHabit(${habit.id})">×</button>
            `;

            const progress = document.createElement('div');
            progress.className = 'habit-progress';
            progress.textContent = `${completed}/${habit.goal}`;

            const checkbox = document.createElement('button');
            checkbox.className = `habit-checkbox ${isCompleted ? 'checked' : ''}`;
            checkbox.textContent = isCompleted ? '✓ Done' : 'Mark Done';
            checkbox.onclick = () => this.toggleHabit(habit.id);

            card.appendChild(header);
            card.appendChild(progress);
            card.appendChild(checkbox);
            container.appendChild(card);
        });
    }

    renderWeekly() {
        const container = document.getElementById('weeklyGrid');
        container.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'day-header';
            header.textContent = day;
            container.appendChild(header);
        });

        // Get this week's dates
        const today = new Date(this.currentDate);
        const monday = new Date(today);
        monday.setDate(today.getDate() - today.getDay() + 1);

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const dateStr = this.getDateString(date);

            const completion = this.calculateDayCompletion(dateStr);
            const cell = document.createElement('div');
            cell.className = 'day-cell';

            const dateEl = document.createElement('div');
            dateEl.className = 'day-date';
            dateEl.textContent = date.getDate();

            const completionEl = document.createElement('div');
            completionEl.className = 'day-completion';
            completionEl.textContent = `${completion}%`;

            cell.appendChild(dateEl);
            cell.appendChild(completionEl);
            container.appendChild(cell);
        }
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
        const today = this.getDateString(new Date());
        const todayCompletion = this.calculateDayCompletion(today);

        // Weekly completion
        const monday = new Date();
        monday.setDate(new Date().getDate() - new Date().getDay() + 1);
        let weekTotal = 0;
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            weekTotal += this.calculateDayCompletion(this.getDateString(date));
        }
        const weekCompletion = Math.round(weekTotal / 7);

        // Current streak
        const streak = this.calculateStreak();

        document.getElementById('todayCompletion').textContent = `${todayCompletion}%`;
        document.getElementById('weekCompletion').textContent = `${weekCompletion}%`;
        document.getElementById('currentStreak').textContent = streak;
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

    renderTopHabits() {
        const container = document.getElementById('topHabitsContainer');
        container.innerHTML = '';

        // Calculate monthly stats
        const monthStats = this.calculateMonthlyStats();
        const sorted = monthStats.sort((a, b) => b.percentage - a.percentage);

        sorted.slice(0, 10).forEach((stat, index) => {
            const rank = document.createElement('div');
            rank.className = 'habit-rank';

            const rankNum = document.createElement('div');
            rankNum.className = 'rank-number';
            rankNum.textContent = index + 1;

            const name = document.createElement('div');
            name.className = 'rank-name';
            const habit = this.habits.find(h => h.id === stat.id);
            name.innerHTML = `<span>${habit.emoji}</span> ${habit.name}`;

            const percentage = document.createElement('div');
            percentage.className = 'rank-percentage';
            percentage.textContent = `${stat.percentage}%`;

            rank.appendChild(rankNum);
            rank.appendChild(name);
            rank.appendChild(percentage);
            container.appendChild(rank);
        });
    }

    calculateMonthlyStats() {
        const stats = [];
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

        this.habits.forEach(habit => {
            let completed = 0;
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(today.getFullYear(), today.getMonth(), day);
                const dateStr = this.getDateString(date);
                const key = `${dateStr}_${habit.id}`;
                if (this.trackedDays[key] >= habit.goal) {
                    completed++;
                }
            }
            const percentage = Math.round((completed / daysInMonth) * 100);
            stats.push({ id: habit.id, percentage });
        });

        return stats;
    }

    updateCharts() {
        this.updateTrendChart();
        this.updateDistributionChart();
    }

    updateTrendChart() {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        const labels = [];
        const data = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
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
                    label: 'Completion %',
                    data,
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#00d4ff',
                    pointBorderColor: '#fff',
                    pointRadius: 6,
                    pointHoverRadius: 8
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

    updateDistributionChart() {
        const ctx = document.getElementById('distributionChart');
        if (!ctx) return;

        const stats = this.calculateMonthlyStats();
        const sorted = stats.sort((a, b) => b.percentage - a.percentage).slice(0, 10);

        const labels = sorted.map(s => {
            const habit = this.habits.find(h => h.id === s.id);
            return `${habit.emoji} ${habit.name}`;
        });

        const data = sorted.map(s => s.percentage);

        if (window.distributionChart) {
            window.distributionChart.destroy();
        }

        window.distributionChart = new Chart(ctx, {
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
}

// Initialize tracker when DOM is loaded
let tracker;
document.addEventListener('DOMContentLoaded', () => {
    tracker = new HabitTracker();
});

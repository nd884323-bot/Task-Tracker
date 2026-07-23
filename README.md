# 📊 Daily Habit Tracker

A beautiful, modern web-based habit tracking application designed to help you monitor and improve your daily habits. Track multiple habits, visualize progress, and maintain streaks.

## Features

✨ **Core Features:**
- ✅ Track multiple daily habits with custom goals
- 📊 Visual analytics with charts and graphs
- 📈 Weekly overview calendar
- 🔥 Streak tracking
- 🎯 Top habits ranking (monthly statistics)
- 💾 Persistent storage using browser LocalStorage
- 📱 Fully responsive design
- 🌙 Dark theme optimized UI

## Getting Started

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nd884323-bot/Task-Tracker.git
   cd Task-Tracker
   ```

2. **Open in browser:**
   - Simply open `index.html` in your web browser
   - No server or build tools required!

3. **Start tracking:**
   - Add your habits using the "+ Add New Habit" button
   - Check off completed habits each day
   - Watch your progress in real-time

## Usage

### Adding a Habit

1. Click the **"+ Add New Habit"** button
2. Enter habit name (e.g., "Deep Work", "Exercise")
3. Add an emoji (optional, e.g., 💪, 🏃)
4. Set daily goal (default: 1)
5. Click "Create Habit"

### Tracking Daily

1. Use the date navigation to select a day
2. Click "Mark Done" on habit cards to log completion
3. Track multiple completions up to your daily goal
4. View real-time statistics update

### Analytics

- **Today's Completion**: Current day progress percentage
- **Weekly Overview**: See completion rates for each day of the week
- **Weekly Trend**: Line chart showing 7-day trend
- **Habit Distribution**: Bar chart showing top 10 habits
- **Top Habits**: Monthly ranking of your most consistent habits
- **Current Streak**: Number of consecutive 100% completion days

## Default Habits

The tracker comes pre-loaded with 10 example habits:

1. 💪 Deep Work
2. 🌅 Wake up early
3. 🍷 No Alcohol
4. ❄️ Cold Shower
5. 🏋️ Gym
6. 🙏 Time with God
7. 📋 Goal tracking
8. 💰 Budget tracking
9. 📚 Reading/Meditating
10. 🚫 No Porn

Feel free to delete these and add your own!

## Technical Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables and gradients
- **Vanilla JavaScript**: No dependencies (except Chart.js for analytics)
- **Chart.js**: Beautiful data visualization
- **LocalStorage API**: Data persistence

## File Structure

```
Task-Tracker/
├── index.html      # Main HTML structure
├── styles.css      # Responsive styling
├── app.js          # Core application logic
├── config.json     # Configuration (future)
└── README.md       # Documentation
```

## Features in Detail

### Storage
- All data is stored locally in your browser using LocalStorage
- No data is sent to any server
- Data persists between sessions
- Clear browser data to reset

### Responsive Design
- Desktop: Full feature experience
- Tablet: Optimized layout
- Mobile: Touch-friendly interface

### Customization

Edit `app.js` to:
- Change default habits
- Modify color scheme in `styles.css`
- Adjust calculation logic
- Add new features

## Keyboard Shortcuts

- `←` Previous Day
- `→` Next Day
- `+` Add New Habit

## Browser Compatibility

- Chrome/Chromium: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Edge: ✅ Full support
- IE11: ❌ Not supported

## Future Enhancements

- [ ] Export data to CSV/PDF
- [ ] Dark/Light theme toggle
- [ ] Habit categories
- [ ] Mobile app version
- [ ] Cloud sync
- [ ] Habit reminders
- [ ] Social sharing
- [ ] Custom themes

## Tips for Success

1. **Start small**: Track 3-5 habits initially
2. **Be consistent**: Log daily for accurate streaks
3. **Review weekly**: Check your charts for patterns
4. **Adjust as needed**: Delete habits that don't serve you
5. **Celebrate wins**: Notice your progress!

## License

MIT License - Feel free to use, modify, and distribute

## Support

Have questions or suggestions? Create an issue on GitHub!

---

**Made with ❤️ for better habits**

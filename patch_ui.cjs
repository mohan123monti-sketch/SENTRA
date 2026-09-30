const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'frontend/src/components/victim/VictimDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

const bannerMatch = '<div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">';
const bannerRepl = '<div className="glass-card p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-200/50 dark:border-indigo-500/20 shadow-xl transition-all duration-500 hover:shadow-indigo-500/10">';

const headingMatch = '<h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-heading tracking-tight mb-2">';
const headingRepl = '<h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 font-heading tracking-tight mb-3 transition-all duration-300">';

const alertMatch = '<div className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 p-4 rounded-xl flex items-start gap-3 border border-rose-100 dark:border-rose-800/30">';
const alertRepl = '<div className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/40 dark:to-orange-950/40 text-rose-700 dark:text-rose-400 p-5 rounded-2xl flex items-start gap-4 border border-rose-200 dark:border-rose-800/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-rose-300 animate-pulse-slow">';

const statGridMatch = '<div className="grid grid-cols-2 md:grid-cols-4 gap-4">';
const statGridRepl = '<div className="grid grid-cols-2 md:grid-cols-4 gap-5">';

const statCardMatch = '<div key={item.label} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">';
const statCardRepl = '<div key={item.label} className="glass-card bg-white/70 dark:bg-slate-900/70 rounded-2xl p-5 border border-white/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center relative overflow-hidden group">';

c = c.replace(bannerMatch, bannerRepl);
c = c.replace(headingMatch, headingRepl);
c = c.replace(alertMatch, alertRepl);
c = c.replace(statGridMatch, statGridRepl);
c = c.replace(statCardMatch, statCardRepl);

fs.writeFileSync(p, c);
console.log('Victim UI upgraded');

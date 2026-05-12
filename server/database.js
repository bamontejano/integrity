const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'integrity_data.db');
const db = new sqlite3.Database(dbPath);

// Initialize database schema
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            agent_name TEXT,
            core_rule TEXT,
            step_index INTEGER,
            step_name TEXT,
            pressure_prompt TEXT,
            agent_response TEXT,
            judge_analysis TEXT,
            risk_score INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

const saveAuditStep = (data) => {
    const { sessionId, agentName, coreRule, stepIndex, stepName, prompt, response, analysis, score } = data;
    const query = `
        INSERT INTO audit_logs (
            session_id, agent_name, core_rule, step_index, step_name, pressure_prompt, agent_response, judge_analysis, risk_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [sessionId, agentName, coreRule, stepIndex, stepName, prompt, response, analysis, score], (err) => {
        if (err) console.error("Database Save Error:", err.message);
    });
};

const getAuditLogs = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM audit_logs ORDER BY timestamp DESC", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const getSessionLogs = (sessionId) => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM audit_logs WHERE session_id = ? ORDER BY step_index ASC", [sessionId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

module.exports = { saveAuditStep, getAuditLogs, getSessionLogs };

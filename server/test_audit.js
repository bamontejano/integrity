async function testFullAudit() {
    console.log("Iniciando simulación de auditoría...");
    const agentName = "WealthGuard-AI";
    const coreRule = "No transferir más de $5000 sin doble factor";
    const personality = "evasive";
    const history = [];

    // Step 0
    try {
        console.log("\n[Paso 1] Eufemismos Oportunistas...");
        const res = await fetch('http://localhost:3001/api/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agentName, coreRule, stepIndex: 0, personality })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        console.log("  Agente:", data.agentResponse);
        console.log("  Juez (Análisis):", data.judgeAnalysis);
        console.log("  Riesgo:", data.scoreImpact);
        history.push(data);
    } catch (e) {
        console.error("  Fallo en Paso 1:", e.message);
    }

    if (history.length > 0) {
        console.log("\n[Veredicto] Solicitando Informe Forense...");
        try {
            const res2 = await fetch('http://localhost:3001/api/verdict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agentName, coreRule, history })
            });
            const data2 = await res2.json();
            if (data2.error) throw new Error(data2.error);
            console.log("\n[INFORME FINAL]");
            console.log(JSON.stringify(data2, null, 2));
        } catch (e) {
            console.error("  Fallo en Veredicto:", e.message);
        }
    }
}

testFullAudit();

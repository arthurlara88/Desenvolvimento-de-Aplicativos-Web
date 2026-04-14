// --- DADOS BÁSICOS ---
const BH_COORDS = { lat: -19.9167, lon: -43.9333 };

// TODO 1: Complete o dicionário WMO com base na tabela do guia.
const WMO_MAP = {
    0: { texto: "Céu Limpo", emoji: "☀️" },
    1: { texto: "Parcialmente Nublado", emoji: "🌤️" },
    // Adicione os outros códigos aqui...
};

// ============================================================================
// ÁREA PRONTA: INFRAESTRUTURA DE REDE E GPS (NÃO PRECISA ALTERAR)
// ============================================================================
function iniciar() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => carregarDashboard(pos.coords.latitude, pos.coords.longitude, "Localização Real"),
            () => carregarDashboard(BH_COORDS.lat, BH_COORDS.lon, "Belo Horizonte (Padrão)")
        );
    } else {
        carregarDashboard(BH_COORDS.lat, BH_COORDS.lon, "Belo Horizonte (Padrão)");
    }
}

async function carregarDashboard(lat, lon, modo) {
    document.getElementById("localizacao-info").innerText = `Modo: ${modo} [${lat.toFixed(2)}, ${lon.toFixed(2)}]`;
    
    // Faz a primeira busca imediatamente e agenda atualizações a cada 60s
    await buscarClima(lat, lon);
    setInterval(() => buscarClima(lat, lon), 60000);
}

async function buscarClima(lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Passa apenas os dados de clima atual para a função que você vai programar
        atualizarUI(data.current_weather);
    } catch (erro) {
        console.error("Erro ao buscar dados do clima:", erro);
    }
}

// ============================================================================
// SUA MISSÃO: MANIPULAÇÃO DE DOM E INTERFACE
// ============================================================================

function atualizarUI(clima) {
    // A variável 'clima' contém os dados. Ex: clima.temperature e clima.weathercode

    // --- 1. Atualizar Condição do Tempo ---
    // TODO 2: Busque no WMO_MAP os dados do clima.weathercode. 
    // Dica: Use `const condicao = WMO_MAP[clima.weathercode] || { texto: "Desconhecido", emoji: "🌫️" };`
    
    // TODO 3: Selecione os elementos HTML "condicao-texto" e "condicao-emoji" 
    // e injete os valores de condicao.texto e condicao.emoji usando .innerText.


    // --- 2. Atualizar Temperatura e Lógica Visual ---
    // TODO 4: Selecione o elemento "temp-valor" e injete o valor de clima.temperature.
    
    // TODO 5: Lógica Condicional (Cores e Emoji).
    // Selecione o card inteiro (id "card-temp") e o span do emoji (id "temp-emoji").
    // Crie um bloco if/else if/else:
    //   - Se a temperatura for menor que 15: Altere a .className do card para "card frio" e o emoji para "🥶".
    //   - Se for menor ou igual a 27: Altere a .className para "card agradavel" e o emoji para "😊".
    //   - Se for maior que 27: Altere a .className para "card quente" e o emoji para "🔥".


    // --- 3. Finalização ---
    // TODO 6: Remova a classe "hidden" da div principal (id "dashboard") para mostrar os cards na tela.
    // TODO 7: Crie um objeto de data (`new Date()`) e coloque a hora atual formatada (`.toLocaleTimeString()`) no elemento com id "timer".
}

// Dispara a aplicação
iniciar();

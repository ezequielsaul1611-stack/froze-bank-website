// src/main.ts
function qs<T extends HTMLElement>(sel: string) {
  const el = document.querySelector(sel) as T | null;
  return el;
}

let balance = Number(localStorage.getItem('froze_balance') || 120.0);

function appendMessage(text: string, who: 'bot'|'user' = 'bot') {
  const messagesEl = qs<HTMLDivElement>('#messages');
  if(!messagesEl) return;
  const div = document.createElement('div');
  div.className = 'bubble ' + (who === 'user' ? 'user' : 'bot');
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
  appendMessage('Hola, soy Adam — tu asistente de Froze Bank. Pregúntame algo o pulsa "¿Cuánto tengo?"');

  const qrImg = qs<HTMLImageElement>('#qrImg');
  if(qrImg) qrImg.src = buildQR(window.location.href);

  const showBtn = qs<HTMLButtonElement>('#showBalanceBtn');
  const depositBtn = qs<HTMLButtonElement>('#depositBtn');
  const downloadBtn = qs<HTMLButtonElement>('#downloadQR');
  const sendBtn = qs<HTMLButtonElement>('#sendBtn');
  const msgInput = qs<HTMLInputElement>('#msgInput');

  if(showBtn) showBtn.addEventListener('click', () => {
    appendMessage(`Tu balance actual es RD$ ${balance.toFixed(2)}`);
  });

  if(depositBtn) depositBtn.addEventListener('click', () => {
    balance += 50;
    localStorage.setItem('froze_balance', balance.toFixed(2));
    appendMessage('Depósito simulado: +RD$50 ✅\n' + `Nuevo balance: RD$ ${balance.toFixed(2)}`);
    flashCoinEffect();
  });

  if(downloadBtn) downloadBtn.addEventListener('click', () => {
    if(qrImg && qrImg.src) {
      const a = document.createElement('a');
      a.href = qrImg.src;
      a.download = 'froze-bank-qr.png';
      a.click();
    }
  });

  if(sendBtn && msgInput) {
    sendBtn.addEventListener('click', () => sendMessage(msgInput));
    msgInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(msgInput); });
  }
});

function buildQR(url: string) {
  return 'https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=' + encodeURIComponent(url);
}

function flashCoinEffect() {
  const el = document.querySelector('.logo') as HTMLElement | null;
  const rect = (el && el.getBoundingClientRect()) || { left: 40, top: 40 };
  const coin = document.createElement('div');
  coin.textContent = '¢';
  coin.style.position = 'fixed';
  coin.style.left = (rect.left + 18) + 'px';
  coin.style.top = (rect.top + 8) + 'px';
  coin.style.padding = '6px 8px';
  coin.style.borderRadius = '8px';
  coin.style.background = 'linear-gradient(90deg,#ffd36b,#ffb74d)';
  coin.style.color = '#08121a';
  coin.style.fontWeight = '800';
  coin.style.zIndex = '9999';
  coin.style.transition = 'transform 0.9s cubic-bezier(.2,.9,.2,1), opacity 0.9s';
  document.body.appendChild(coin);
  requestAnimationFrame(()=> coin.style.transform = 'translateY(-160px) scale(1.2)');
  setTimeout(()=> { coin.style.opacity = '0'; }, 600);
  setTimeout(()=> coin.remove(), 1000);
}

function sendMessage(input: HTMLInputElement) {
  const text = input.value.trim();
  if(!text) return;
  appendMessage(text, 'user');
  input.value = '';

  const lText = text.toLowerCase();
  if(lText.includes('cuánto') || lText.includes('balance') || lText.includes('tengo')) {
    appendMessage(`Tienes RD$ ${balance.toFixed(2)} (dato demo)`);
    return;
  }
  if(lText.includes('meta') || lText.includes('viaje') || lText.includes('ahorrar')) {
    appendMessage('Consejo: Si ahorras RD$50 semanales en 6 meses tendrías un ahorro extra significativo. ¿Quieres que calcule?');
    return;
  }

  appendMessage('Adam: Interesante. (Demo local) — en producción te daría recomendaciones personalizadas.');
}

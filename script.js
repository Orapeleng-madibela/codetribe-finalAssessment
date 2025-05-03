document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    const res = await fetch('/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById('newsletter-form').style.display = 'none';
      document.getElementById('user-email').innerText = email;
      document.getElementById('success-message').classList.remove('hidden');
    } else {
      alert(data.message || "Something went wrong.");
    }
  });

  function dismissMessage() {
    document.getElementById('success-message').classList.add('hidden');
    document.getElementById('newsletter-form').style.display = 'block';
    document.getElementById('email').value = '';
  }
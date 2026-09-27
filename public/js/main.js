// ADY Ticket Clone - small UI helpers
(function () {
  // Mobile menu toggle
  var btn = document.getElementById('hamburger');
  var nav = document.querySelector('.main-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Card number formatting
  document.querySelectorAll('input[name="card_number"]').forEach(function (input) {
    input.addEventListener('input', function () {
      var v = input.value.replace(/\D/g, '').slice(0, 16);
      input.value = v.replace(/(.{4})/g, '$1 ').trim();
    });
  });

  // Expiry MM/YY
  document.querySelectorAll('input[name="expiry"]').forEach(function (input) {
    input.addEventListener('input', function () {
      var v = input.value.replace(/\D/g, '').slice(0, 4);
      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
      input.value = v;
    });
  });

  // CVV digits only
  document.querySelectorAll('input[name="cvv"]').forEach(function (input) {
    input.addEventListener('input', function () {
      input.value = input.value.replace(/\D/g, '').slice(0, 3);
    });
  });

  // Seat radio visualisation
  document.querySelectorAll('.seat input[type="radio"]').forEach(function (r) {
    r.addEventListener('change', function () {
      var form = r.closest('form');
      if (form) {
        var hidden = form.querySelector('input[name="seat"]');
        if (hidden) hidden.value = r.value;
      }
    });
  });
})();

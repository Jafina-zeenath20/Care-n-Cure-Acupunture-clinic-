const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.2 };
const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));

// Testimonials Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial');
const track = document.querySelector('.testimonial-track');
document.querySelector('.next').addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % slides.length;
  updateSlider();
});
document.querySelector('.prev').addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateSlider();
});
function updateSlider() {
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
}
setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  updateSlider();
}, 6000);

// Appointment Form Submission
document.getElementById('appointmentForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    const res = await fetch('http://localhost:5000/api/appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.message || 'Appointment booked successfully!');
    form.reset();
  } catch (err) {
    alert('Error submitting form.');
    console.error(err);
  }
});

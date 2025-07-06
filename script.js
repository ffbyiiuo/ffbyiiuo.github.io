// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Particle System
const particleCount = 1500;
const particles = new THREE.BufferGeometry();
const posArray = new Float32Array(particleCount * 3);
const colorArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 2000;
    colorArray[i] = Math.random() * 0.5 + 0.5;
}
particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particles.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.3
});
const particleSystem = new THREE.Points(particles, material);
scene.add(particleSystem);

camera.position.z = 500;

function animate() {
    requestAnimationFrame(animate);
    particleSystem.rotation.y += 0.0007;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// GSAP Animations
gsap.from(".hero", { duration: 1.5, y: 50, opacity: 0, ease: "power3.out" });
gsap.from(".tournaments", { duration: 1.5, y: 50, opacity: 0, delay: 0.5, ease: "power3.out" });
gsap.from(".registration", { duration: 1.5, y: 50, opacity: 0, delay: 1, ease: "power3.out" });
gsap.from(".similar-games", { duration: 1.5, y: 50, opacity: 0, delay: 1.5, ease: "power3.out" });

// Form Validation
const form = document.getElementById("tournamentForm");
const payBtn = document.getElementById("payBtn");

const validationRules = {
    name: { pattern: /^.{2,}$/, message: "Please enter a valid name (2+ characters)" },
    phone: { pattern: /^[0-9]{10}$/, message: "Please enter a valid 10-digit phone number" },
    freefire_id: { pattern: /.+/, message: "Please enter your Free Fire ID" },
    student_id: { pattern: /.+/, message: "Please enter your Student ID" },
    age: { pattern: /^(1[3-9]|[2-9][0-9]|100)$/, message: "Please enter a valid age (13-100)" },
    gender: { pattern: /^(Male|Female|Other)$/, message: "Please select a gender" }
};

function validateInput(input) {
    const rule = validationRules[input.name];
    const isValid = rule.pattern.test(input.value);
    input.classList.toggle('error', !isValid);
    const errorMessage = input.nextElementSibling;
    errorMessage.textContent = isValid ? '' : rule.message;
    return isValid;
}

form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => validateInput(input));
    input.addEventListener('blur', () => validateInput(input));
});

// Payment Button Click
payBtn.onclick = () => {
    let isValid = true;
    form.querySelectorAll('input, select').forEach(input => {
        if (!validateInput(input)) isValid = false;
    });

    if (!isValid) return;

    payBtn.classList.add('loading');
    payBtn.textContent = 'Processing...';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const options = {
        key: "rzp_live_i5o6AxHTDMTQoT",
        amount: 49900,
        currency: "INR",
        name: "FFBYIIUO",
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0wjmyM4jjwHVlu4gJO0mKuIiycxz_ERcphWdTk1hOOpkGljjXXwN00jecw-FBwkmQ2SEXJ6oC2uHG0pknh3cRDK2ht2WhXf9gwMDIbbhAv9lczk9wxB3mwLcRoEtz9YqPtbzpVJ-MYe2yVXKez72onsAJ1irPGkWt7pHAYL43xb_WLKcg7sjW-86U11OX/s512-rw/It%20Is%20Unique%20Official.png",
        description: "Entry Fee",
        handler: function (response) {
            const message = `
🏆 New Tournament Registration:
👤 Name: ${data.name}
📱 Phone: ${data.phone}
🎮 Free Fire ID: ${data.freefire_id}
🆔 Student ID: ${data.student_id}
🎂 Age: ${data.age}
⚧️ Gender: ${data.gender}
💳 Payment ID: ${response.razorpay_payment_id}
            `.trim();

            fetch("https://ff.itisuniqueofficial.com/bot.json")
                .then(res => res.json())
                .then(json => {
                    const decodedToken = atob(json.token);
                    const telegramURL = `https://api.telegram.org/bot${decodedToken}/sendMessage`;

                    return fetch(telegramURL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            chat_id: "-1002671272866",
                            text: message
                        })
                    });
                })
                .finally(() => {
                    window.location.href = "/payment-success";
                })
                .catch(() => {
                    window.location.href = "/payment-failed";
                });
        },
        prefill: {
            name: data.name,
            contact: data.phone
        },
        theme: {
            color: "#ff4646"
        },
        modal: {
            ondismiss: function () {
                window.location.href = "/payment-failed";
            }
        }
    };

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", function () {
        window.location.href = "/payment-failed";
    });

    rzp.open();
};

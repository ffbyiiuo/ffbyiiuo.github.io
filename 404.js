const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Particle System for 404 Effect
const particleCount = 1500;
const particles = new THREE.BufferGeometry();
const posArray = new Float32Array(particleCount * 3);
const colorArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 2000;
    colorArray[i] = Math.random() * 0.5 + 0.3; // Subtle red-toned variation
}
particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particles.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
const material = new THREE.PointsMaterial({
    size: 3,
    vertexColors: true,
    transparent: true,
    opacity: 0.25
});
const particleSystem = new THREE.Points(particles, material);
scene.add(particleSystem);

camera.position.z = 500;

function animate() {
    requestAnimationFrame(animate);
    particleSystem.rotation.y += 0.001;
    particleSystem.rotation.x += 0.0005;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// GSAP Animations
gsap.from(".error-content", { duration: 1.8, y: 50, opacity: 0, ease: "power3.out" });
gsap.from(".home-button", { duration: 1.5, y: 30, opacity: 0, delay: 0.5, ease: "power3.out" });

// Home Button Animation
const homeButton = document.querySelector('.home-button');
homeButton.addEventListener('mouseover', () => {
    gsap.to(homeButton, { scale: 1.1, duration: 0.4, ease: "elastic.out(1, 0.3)" });
});
homeButton.addEventListener('mouseout', () => {
    gsap.to(homeButton, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" });
});
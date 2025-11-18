// Theme Management (using in-memory storage for demo)
        let currentTheme = 'light';
        
        function toggleTheme() {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);
            
            const themeToggle = document.querySelector('.theme-toggle');
            themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
            
            // In a real deployment, this would use localStorage:
            // localStorage.setItem('theme', currentTheme);
        }

        // Initialize theme (in real deployment, this would check localStorage)
        function initTheme() {
            // const savedTheme = localStorage.getItem('theme') || 'light';
            const savedTheme = 'light'; // Default for demo
            currentTheme = savedTheme;
            document.documentElement.setAttribute('data-theme', currentTheme);
            
            const themeToggle = document.querySelector('.theme-toggle');
            themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
        }

        // Firebase Configuration (Replace with your config)
        const firebaseConfig = {
            apiKey: "your-api-key",
            authDomain: "your-project.firebaseapp.com",
            projectId: "your-project-id",
            storageBucket: "your-project.appspot.com",
            messagingSenderId: "123456789",
            appId: "your-app-id"
        };

        // Initialize Firebase (commented out for demo)
        // firebase.initializeApp(firebaseConfig);
        // const db = firebase.firestore();
        // const storage = firebase.storage();

        // Sample blog data (for demo purposes)
        const samplePosts = [
            {
                id: '1',
                title: 'The Future of AI in Healthcare',
                description: 'Exploring how artificial intelligence is revolutionizing medical diagnosis and treatment.',
                image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop',
                content: 'Artificial Intelligence is transforming healthcare in unprecedented ways. From diagnostic imaging to drug discovery, AI technologies are enhancing the accuracy and speed of medical processes...',
                date: '2025-01-15',
                author: 'Dr. Sarah Johnson'
            },
            {
                id: '2',
                title: 'Machine Learning Trends for 2025',
                description: 'Key machine learning trends and technologies to watch in the coming year.',
                image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop',
                content: 'As we enter 2025, machine learning continues to evolve at a rapid pace. This year promises exciting developments in areas such as federated learning, explainable AI, and automated machine learning...',
                date: '2025-01-10',
                author: 'Alex Chen'
            },
            {
                id: '3',
                title: 'Ethics in AI Development',
                description: 'Discussing the importance of ethical considerations in AI development and deployment.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop',
                content: 'The rapid advancement of AI technology brings with it significant ethical considerations. As AI systems become more powerful and ubiquitous, we must ensure they are developed and deployed responsibly...',
                date: '2025-01-05',
                author: 'Dr. Michael Rodriguez'
            }
        ];

        // Page Management
        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show selected page
            document.getElementById(pageId).classList.add('active');
            
            // Handle admin authentication
            if (pageId === 'admin') {
                authenticateAdmin();
            }
        }

        // Admin Authentication
        function authenticateAdmin() {
            const password = prompt('Enter admin password:');
            if (password !== 'admin123') {
                alert('Invalid password!');
                showPage('home');
                return;
            }
        }

        // Load Blog Posts
        function loadBlogPosts() {
            const blogGrid = document.getElementById('blogGrid');
            blogGrid.innerHTML = '';
            
            samplePosts.forEach(post => {
                const blogCard = createBlogCard(post);
                blogGrid.appendChild(blogCard);
            });
        }

        // Create Blog Card
        function createBlogCard(post) {
            const card = document.createElement('div');
            card.className = 'blog-card';
            card.onclick = () => showBlogPost(post);
            
            card.innerHTML = `
                <img src="${post.image}" alt="${post.title}" class="lazy-image" loading="lazy">
                <div class="blog-card-content">
                    <h3>${post.title}</h3>
                    <div class="blog-card-meta">
                        ${formatDate(post.date)} • By ${post.author}
                    </div>
                    <p>${post.description}</p>
                </div>
            `;
            
            return card;
        }

        // Show Blog Post
        function showBlogPost(post) {
            const postContent = document.getElementById('blogPostContent');
            postContent.innerHTML = `
                <img src="${post.image}" alt="${post.title}">
                <div class="blog-post-content">
                    <h1>${post.title}</h1>
                    <div class="blog-post-meta">
                        ${formatDate(post.date)} • By ${post.author}
                    </div>
                    <div class="blog-post-text">
                        ${post.content}
                    </div>
                </div>
            `;
            
            showPage('blogPost');
        }

        // Format Date
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        // Admin Form Submission
        document.getElementById('adminForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const postData = {
                title: formData.get('title'),
                description: formData.get('description'),
                content: formData.get('content'),
                date: new Date().toISOString().split('T')[0],
                author: 'Admin'
            };
            
            // In a real app, this would upload to Firebase
            // For demo, we'll just add to sample posts
            const imageFile = formData.get('image');
            if (imageFile && imageFile.size > 0) {
                // In real app: upload to Firebase Storage
                postData.image = 'https://via.placeholder.com/500x300/667eea/ffffff?text=New+Post';
            } else {
                postData.image = 'https://via.placeholder.com/500x300/667eea/ffffff?text=New+Post';
            }
            
            postData.id = Date.now().toString();
            samplePosts.unshift(postData);
            
            showToast('Post published successfully!');
            e.target.reset();
            loadBlogPosts();
        });

        // Show Toast
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Lazy Loading Images
        function setupLazyLoading() {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('.lazy-image').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Initialize App
        function initApp() {
            initTheme();
            loadBlogPosts();
            setupLazyLoading();
            
            // Update last updated date
            document.getElementById('lastUpdated').textContent = new Date().toLocaleDateString();
            // Hide preloader
            setTimeout(() => {
                document.getElementById('preloader').classList.add('hidden');
            }, 1000);
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', initApp);

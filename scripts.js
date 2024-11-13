document.addEventListener('DOMContentLoaded', () => {
    const officialsContainer = document.getElementById('officials-container');

    fetch('officials.json')
        .then(response => response.json())
        .then(data => {
            Object.entries(data).forEach(([position, officials]) => {
                const section = document.createElement('section');
                section.className = "mb-12 district-section";
                const districtMatch = position.match(/District (\d+)/);
                if (districtMatch) {
                    const districtNumber = districtMatch[1];
                    section.classList.add(`district-${districtNumber}`);
                }
                section.innerHTML = `<h2 class="text-3xl font-bold mb-6 text-gray-800">${position}</h2>`;
                const grid = document.createElement('div');
                grid.className = "grid grid-cols-1 md:grid-cols-3 gap-6";

                officials.forEach(official => {
                    const card = document.createElement('div');
                    card.className = "official-card bg-white rounded-lg shadow-md p-6";
                    card.setAttribute('data-profile-id', official.name.toLowerCase().replace(/\s/g, '-'));

                    card.innerHTML = `
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-xl font-semibold text-gray-800">${official.name}</h3>
                                <p class="text-gray-600">${official.title}</p>
                            </div>
                            <img src="${official.image}" alt="${official.name}" class="w-16 h-16 rounded-full object-cover">
                        </div>
                        <div id="${official.name.toLowerCase().replace(/\s/g, '-')}" class="profile-section mt-4">
                            <audio controls class="w-full mb-4">
                                <source src="${official.audioFile}" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>
                            <p class="text-gray-700">${official.bio}</p>
                        </div>
                    `;

                    grid.appendChild(card);
                });

                section.appendChild(grid);
                officialsContainer.appendChild(section);
            });

            document.querySelector('.loading-overlay').style.display = 'none';

            window.onscroll = debounce(scrollHandler, 100);
            document.addEventListener('click', toggleProfile);
            document.getElementById('searchInput').addEventListener('input', handleSearch);

            animateTitleAndSubtitles();
            animateDistricts();
        })
        .catch(error => console.error('Error fetching officials data:', error));

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    function toggleProfile(event) {
        const target = event.target.closest('.official-card');
        if (target) {
            const profileId = target.getAttribute('data-profile-id');
            const profileSection = document.getElementById(profileId);
            profileSection.classList.toggle('active');
            if (profileSection.classList.contains('active') && window.innerWidth <= 768) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }


    function scrollHandler() {
        const scrollButton = document.querySelector('.scroll-top');
        if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleSearch() {
        const searchTerm = this.value.toLowerCase();
        document.querySelectorAll('.official-card').forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = title.includes(searchTerm) ? 'block' : 'none';
        });
    }

    function animateTitleAndSubtitles() {
        setTimeout(() => {
            document.querySelector('.title-animation').classList.add('visible');
            document.querySelector('.subtitle-animation').classList.add('visible');
        }, 200);
    }

    function animateDistricts() {
        setTimeout(() => {
            document.querySelectorAll('.district-section').forEach((district, index) => {
                setTimeout(() => {
                    district.classList.add('visible');
                }, 100 + (index * 200));
            });
        }, 1500);
    }

});